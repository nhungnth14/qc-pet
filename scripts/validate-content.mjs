// Content quality gate (Story 0-3, NFR-3).
// Đọc mọi content/lessons/**/*.json → mỗi lesson PHẢI có `source_tag` hợp lệ:
//   "ISTQB-x[.y...]" (vd "ISTQB-2.3") HOẶC literal "INDUSTRY_PRACTICE".
// Thiếu/sai → exit 1 (CI block PR). Chưa có file nào → exit 0 (không chặn).
// Node thuần, không phụ thuộc gói ngoài. Chạy local: `node scripts/validate-content.mjs`.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'content', 'lessons');
const SOURCE_TAG_RE = /^ISTQB-\d+(?:\.\d+)*$/;

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  }
  catch (e) {
    if (e && e.code === 'ENOENT')
      return out; // thư mục chưa tồn tại → bỏ qua
    throw e; // lỗi thật (permission/IO) → KHÔNG nuốt, để CI fail rõ ràng
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

function isValidSourceTag(v) {
  return v === 'INDUSTRY_PRACTICE' || (typeof v === 'string' && SOURCE_TAG_RE.test(v));
}

const files = walk(ROOT);

if (files.length === 0) {
  console.log('✅ content quality gate: chưa có lesson JSON trong content/lessons/ — bỏ qua.');
  process.exit(0);
}

const errors = [];
for (const file of files) {
  let json;
  try {
    json = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  catch (e) {
    errors.push(`${file}: JSON không hợp lệ (${e.message})`);
    continue;
  }
  const lessons = Array.isArray(json) ? json : [json];
  lessons.forEach((lesson, i) => {
    const where = Array.isArray(json) ? `${file}[${i}]` : file;
    if (lesson == null || typeof lesson !== 'object') {
      errors.push(`${where}: không phải object lesson`);
    }
    else if (!('source_tag' in lesson)) {
      errors.push(`${where}: THIẾU field "source_tag"`);
    }
    else if (!isValidSourceTag(lesson.source_tag)) {
      errors.push(`${where}: source_tag không hợp lệ "${lesson.source_tag}" (cần "ISTQB-x.y" hoặc "INDUSTRY_PRACTICE")`);
    }
  });
}

if (errors.length > 0) {
  console.error(`❌ content quality gate FAIL — ${errors.length} lỗi:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✅ content quality gate: ${files.length} file lesson hợp lệ (source_tag OK).`);
process.exit(0);
