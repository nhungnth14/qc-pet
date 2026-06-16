'use strict';

// Pre-transforms react-native src/ files that use private class fields (#field syntax).
// hermesc (Hermes ahead-of-time bytecode compiler) cannot parse #field even though
// the Hermes runtime supports it. This script patches the files on disk so they're
// hermesc-safe before Metro bundles them.
//
// Root cause: @babel/plugin-transform-class-properties inserts helper function
// declarations BEFORE import statements, creating an invalid ES module. The fix is
// a custom Babel plugin (moveImportsToTop) that runs last and ensures import
// declarations always appear before any other statements.

const fs = require('node:fs');
const path = require('node:path');
const { transformSync } = require('@babel/core');

const projectRoot = path.resolve(__dirname, '..');

// Babel plugin: reorder all ImportDeclarations to the top of the program body.
// Runs on Program.exit so it sees the fully-transformed AST.
function moveImportsToTopPlugin() {
  return {
    visitor: {
      Program: {
        exit(programPath) {
          const imports = [];
          const others = [];
          for (const node of programPath.node.body) {
            if (node.type === 'ImportDeclaration') {
              imports.push(node);
            }
            else {
              others.push(node);
            }
          }
          programPath.node.body = [...imports, ...others];
        },
      },
    },
  };
}

function findRnSrcDirs() {
  const dirs = [];

  // Direct install (npm/yarn)
  const directPath = path.join(projectRoot, 'node_modules', 'react-native', 'src');
  if (fs.existsSync(directPath))
    dirs.push(directPath);

  // pnpm virtual store — react-native lives under .pnpm/react-native@<ver>/node_modules/
  const pnpmStore = path.join(projectRoot, 'node_modules', '.pnpm');
  if (fs.existsSync(pnpmStore)) {
    try {
      for (const entry of fs.readdirSync(pnpmStore)) {
        if (entry.startsWith('react-native@')) {
          const candidate = path.join(
            pnpmStore,
            entry,
            'node_modules',
            'react-native',
            'src',
          );
          if (fs.existsSync(candidate))
            dirs.push(candidate);
        }
      }
    }
    catch {}
  }

  return dirs;
}

function walkJs(dir, callback) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory())
      walkJs(full, callback);
    else if (e.isFile() && e.name.endsWith('.js'))
      callback(full);
  }
}

// Matches private class field names like #x #width (lowercase/letter first char).
// Does NOT match #__PURE__ (starts with underscore) or # in comments/strings.
const PRIVATE_FIELD_RE = /#[a-z]/;

// Detects a previously-patched file where helper functions ended up BEFORE import
// declarations, which is an invalid ES module structure from earlier script versions.
const BAD_TRANSFORM_RE = /^function _classPrivate/;

let patched = 0;

for (const srcDir of findRnSrcDirs()) {
  walkJs(srcDir, (filePath) => {
    let code;
    try { code = fs.readFileSync(filePath, 'utf8'); }
    catch { return; }
    // Process if: (a) has private class fields, or (b) was badly transformed before
    if (!PRIVATE_FIELD_RE.test(code) && !BAD_TRANSFORM_RE.test(code))
      return;

    try {
      const result = transformSync(code, {
        filename: filePath,
        configFile: false,
        babelrc: false,
        // Parse with Flow support — react-native uses @flow strict annotations on private
        // field declarations like `#x: number`. Without the flow parser plugin this
        // causes a parse error.
        parserOpts: { plugins: ['flow', 'jsx'] },
        plugins: [
          // Transform private class fields (#field) to WeakMap-based equivalents.
          // These three plugins MUST run together in this order.
          '@babel/plugin-transform-class-properties',
          '@babel/plugin-transform-private-methods',
          '@babel/plugin-transform-private-property-in-object',
          // Run last: reorder ImportDeclarations to the top of the module.
          // Without this, Babel's helper function declarations end up BEFORE the
          // original import statements, making the file an invalid ES module.
          moveImportsToTopPlugin,
        ],
        sourceType: 'module',
      });

      if (result?.code && result.code !== code) {
        fs.writeFileSync(filePath, result.code, 'utf8');
        patched++;
      }
    }
    catch {
      // Skip files that fail to parse — Metro's Babel will try to handle them
    }
  });
}

if (patched > 0) {
  console.log(`[fix-private-fields] Patched ${patched} file(s) in react-native/src/`);
}
