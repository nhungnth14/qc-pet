// Static server cho preview web QC Pet (Story 0-6).
// Phục vụ thư mục dist/ (expo export) trên 0.0.0.0:8081 + SPA fallback.
// Node thuần, không phụ thuộc gói ngoài. Chạy qua pm2 (xem qc-pet-preview.bat).
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PREVIEW_PORT || 8081);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.normalize(path.join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden'); // chặn path traversal

    let stat = null;
    try { stat = fs.statSync(filePath); } catch { /* not found */ }
    if (stat && stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    }
    if (!stat || !stat.isFile()) {
      // SPA fallback: route không có đuôi file → trả index.html cho client-router
      if (!path.extname(urlPath)) {
        filePath = path.join(ROOT, 'index.html');
      } else {
        return send(res, 404, 'Not found');
      }
    }
    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    send(res, 200, fs.readFileSync(filePath), { 'Content-Type': type });
  } catch {
    send(res, 500, 'Server error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`QC Pet preview: serving ${ROOT} on http://0.0.0.0:${PORT}`);
});
