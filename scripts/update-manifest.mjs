// Rebuild content/manifest.json từ tất cả content files (Story 1-2).
// Node thuần — không cần dependencies. Tự động patch-bump content_version.
// Dùng bởi: GitHub Action (content-manifest-update.yml) + local dev.
// Chạy local: `node scripts/update-manifest.mjs`
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'content', 'manifest.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  }
  catch (e) {
    if (e && e.code === 'ENOENT')
      return out;
    throw e;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory())
      out.push(...walk(full));
    else if (e.isFile() && e.name.endsWith('.json'))
      out.push(full);
  }
  return out;
}

function patchBump(version) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN))
    return '0.0.1';
  parts[2] += 1;
  return parts.join('.');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// ─── Read existing manifest for current version ────────────────────────────────

let currentVersion = '0.0.0';
try {
  const existing = readJson(MANIFEST_PATH);
  currentVersion = existing.content_version ?? '0.0.0';
}
catch {
  // manifest chưa tồn tại — first run tạo 0.0.1
  currentVersion = '0.0.0';
}

const nextVersion = patchBump(currentVersion);
const today = new Date().toISOString().slice(0, 10);

// ─── Collect lessons ──────────────────────────────────────────────────────────

const lessonFiles = walk(path.join(ROOT, 'content', 'lessons'));
const lessons = [];

for (const file of lessonFiles) {
  let data;
  try {
    data = readJson(file);
  }
  catch (e) {
    console.error(`⚠️  Skip ${path.basename(file)}: JSON parse error (${e.message})`);
    continue;
  }
  lessons.push({
    id: data.id,
    version: data.version,
    category: data.category,
    bloom_level: data.bloom_level,
    title: data.title,
    last_updated: today,
    is_published: data.is_published ?? false,
  });
}

// Sort lessons: by category (catOrder), then id; unknown categories sort last
lessons.sort((a, b) => {
  const catOrder = ['BD', 'TA', 'MP', 'TM', 'AT'];
  const effA = catOrder.indexOf(a.category);
  const effB = catOrder.indexOf(b.category);
  const orderA = effA === -1 ? Infinity : effA;
  const orderB = effB === -1 ? Infinity : effB;
  if (orderA !== orderB)
    return orderA - orderB;
  return a.id.localeCompare(b.id);
});

// ─── Collect RBOTW ────────────────────────────────────────────────────────────

const RBOTW_FILE_RE = /^RBOTW-\d+\.json$/;
const rbotwFiles = walk(path.join(ROOT, 'content', 'real-bugs')).filter(f => RBOTW_FILE_RE.test(path.basename(f)));
const realBugs = [];

for (const file of rbotwFiles) {
  let data;
  try {
    data = readJson(file);
  }
  catch (e) {
    console.error(`⚠️  Skip ${path.basename(file)}: JSON parse error (${e.message})`);
    continue;
  }
  realBugs.push({
    id: data.id,
    version: data.version,
    authored_by: data.authored_by,
    context: data.context,
    last_updated: today,
    is_published: data.is_published ?? false,
  });
}

// Sort by id
realBugs.sort((a, b) => a.id.localeCompare(b.id));

// ─── Write manifest ───────────────────────────────────────────────────────────

const manifest = {
  content_version: nextVersion,
  last_updated: today,
  lessons,
  real_bugs: realBugs,
};

fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`✅ manifest.json updated: ${currentVersion} → ${nextVersion}`);
console.log(`   ${lessons.length} lessons, ${realBugs.length} RBOTW entries`);
