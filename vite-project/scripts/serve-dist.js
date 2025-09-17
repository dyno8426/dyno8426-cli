#!/usr/bin/env node
// Minimal static server to serve the `dist` folder over HTTP with proper CORS.
// Usage: node scripts/serve-dist.js [port]

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = Number(process.argv[2] || process.env.PORT || 5173);
const distDir = path.join(__dirname, '..', 'dist');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  try {
    // Set CORS headers so the site can be opened from other local origins if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');

    const parsed = url.parse(req.url);
    let pathname = decodeURIComponent(parsed.pathname);
    if (pathname === '/') pathname = '/index.html';

    const file = path.join(distDir, pathname);

    if (!file.startsWith(distDir)) {
      res.statusCode = 403;
      return res.end('Forbidden');
    }

    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      const ext = path.extname(file).toLowerCase();
      res.statusCode = 200;
      res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
      fs.createReadStream(file).pipe(res);
    } else {
      // fallback to index.html for SPAs
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(indexFile).pipe(res);
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
    }
  } catch (err) {
    res.statusCode = 500;
    res.end('Server error');
  }
});

server.listen(port, () => {
  console.log(`Serving ${distDir} at http://localhost:${port}`);
});
