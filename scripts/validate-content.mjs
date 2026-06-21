// Content quality gate (Story 0-3 + Story 1-1 + Story 1-2).
// Validate content/lessons/, content/real-bugs/, và content/authors/ theo JSON Schema.
// AI/GPT authored_by → CI block. authored_by cross-reference với authors folder.
// Chưa có file nào → exit 0. Chạy local: `node scripts/validate-content.mjs`.
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const ROOT = process.cwd();
const LESSONS_DIR = path.join(ROOT, 'content', 'lessons');
const REAL_BUGS_DIR = path.join(ROOT, 'content', 'real-bugs');
const AUTHORS_DIR = path.join(ROOT, 'content', 'authors');
const SCHEMAS_DIR = path.join(ROOT, 'content', 'schemas');

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

function loadSchema(name) {
  const schemaPath = path.join(SCHEMAS_DIR, name);
  try {
    return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  }
  catch (e) {
    console.error(`❌ Không đọc được schema ${name}: ${e.message}`);
    process.exit(1);
  }
}

function parseJson(file) {
  try {
    return { ok: true, data: JSON.parse(fs.readFileSync(file, 'utf8')) };
  }
  catch (e) {
    return { ok: false, error: `JSON không hợp lệ: ${e.message}` };
  }
}

function relName(file) {
  return path.relative(path.join(ROOT, 'content'), file).replace(/\\/g, '/');
}

// ─── Load schemas + compile validators ────────────────────────────────────────

const ajv = new Ajv({ allErrors: true });
const validateLesson = ajv.compile(loadSchema('lesson.schema.json'));
const validateRbotw = ajv.compile(loadSchema('rbotw.schema.json'));
const validateAuthor = ajv.compile(loadSchema('author.schema.json'));

// ─── Collect files ─────────────────────────────────────────────────────────────

// Chỉ nhận file khớp pattern "XX-N.json" (vd BD-1.json) — tránh fixture/notes lọt vào gate.
const LESSON_FILE_RE = /^[A-Z]{2}-\d+\.json$/;
const lessonFiles = walk(LESSONS_DIR).filter(f => LESSON_FILE_RE.test(path.basename(f)));
const rbotwFiles = walk(REAL_BUGS_DIR);
const authorFiles = walk(AUTHORS_DIR);

const totalFiles = lessonFiles.length + rbotwFiles.length + authorFiles.length;

if (totalFiles === 0) {
  console.log('✅ content quality gate: chưa có content JSON — bỏ qua.');
  process.exit(0);
}

const errors = [];

// ─── 1. Validate authors (cần trước RBOTW vì cross-reference) ─────────────────

const validAuthorIds = new Set();

for (const file of authorFiles) {
  const { ok, data, error } = parseJson(file);
  if (!ok) {
    errors.push(`authors/${path.basename(file)}: ${error}`);
    continue;
  }
  const valid = validateAuthor(data);
  if (!valid) {
    const msgs = validateAuthor.errors.map((err) => {
      const loc = err.instancePath ? `${err.instancePath}: ` : '';
      return `    - ${loc}${err.message}`;
    }).join('\n');
    errors.push(`${relName(file)}: schema fail\n${msgs}`);
  }
  else {
    // Check filename matches id
    const expectedFilename = `${data.id}.json`;
    if (path.basename(file) !== expectedFilename) {
      errors.push(`${relName(file)}: filename phải là "${expectedFilename}" (khớp với id "${data.id}")`);
    }
    else {
      validAuthorIds.add(data.id);
      console.log(`  ✓ ${relName(file)}: valid`);
    }
  }
}

// ─── 2. Validate lessons ────────────────────────────────────────────────────────

for (const file of lessonFiles) {
  const { ok, data, error } = parseJson(file);
  if (!ok) {
    errors.push(`${relName(file)}: ${error}`);
    continue;
  }
  const valid = validateLesson(data);
  if (!valid) {
    const msgs = validateLesson.errors.map((err) => {
      const loc = err.instancePath ? `${err.instancePath}: ` : '';
      return `    - ${loc}${err.message}`;
    }).join('\n');
    errors.push(`${relName(file)}: schema fail\n${msgs}`);
  }
  else {
    // Cross-field: correct_answer phải là 1 giá trị trong options[] (schema không thể enforce).
    const bad = (data.questions ?? []).filter(q => !q.options.includes(q.correct_answer));
    if (bad.length > 0) {
      const msgs = bad.map(q => `    - Q: "${q.question_text.slice(0, 60)}…" correct_answer không có trong options`).join('\n');
      errors.push(`${relName(file)}: correct_answer ∉ options\n${msgs}`);
    }
    else {
      console.log(`  ✓ ${relName(file)}: valid`);
    }
  }
}

// ─── 3. Validate RBOTW + AI check + cross-reference ─────────────────────────

const AI_PATTERNS = /\bai\b|gpt|claude|chatgpt|gemini|copilot/i;

for (const file of rbotwFiles) {
  const { ok, data, error } = parseJson(file);
  if (!ok) {
    errors.push(`${relName(file)}: ${error}`);
    continue;
  }

  // AI authored_by check (trước schema validation để message rõ hơn)
  if (data.authored_by && AI_PATTERNS.test(data.authored_by)) {
    errors.push(`${relName(file)}: authored_by "${data.authored_by}" không được là AI/GPT — RBOTW phải do người thật viết`);
  }

  const valid = validateRbotw(data);
  if (!valid) {
    const msgs = validateRbotw.errors.map((err) => {
      const loc = err.instancePath ? `${err.instancePath}: ` : '';
      return `    - ${loc}${err.message}`;
    }).join('\n');
    errors.push(`${relName(file)}: schema fail\n${msgs}`);
    continue;
  }

  // Cross-reference: authored_by phải có trong content/authors/
  if (authorFiles.length > 0 && !validAuthorIds.has(data.authored_by)) {
    errors.push(`${relName(file)}: authored_by "${data.authored_by}" không tìm thấy trong content/authors/ — tạo content/authors/${data.authored_by}.json trước`);
    continue;
  }

  console.log(`  ✓ ${relName(file)}: valid`);
}

// ─── Result ───────────────────────────────────────────────────────────────────

if (errors.length > 0) {
  console.error(`\n❌ content quality gate FAIL — ${errors.length} lỗi:\n`);
  for (const e of errors) console.error(e);
  process.exit(1);
}

console.log(`\n✅ content quality gate: ${totalFiles} file hợp lệ (${lessonFiles.length} lessons, ${rbotwFiles.length} RBOTW, ${authorFiles.length} authors).`);
process.exit(0);
