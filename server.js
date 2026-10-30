// Servidor local ligero para TKD Judge Web (sin dependencias externas)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Forzar HTTPS en entornos detrás de proxy (reverse proxy / producción)
  const forwardedProto = req.headers['x-forwarded-proto'];
  if (forwardedProto && forwardedProto === 'http') {
    res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
    res.end();
    return;
  }

  // Preflight OPTIONS handling
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // API endpoint para recibir solicitudes de contacto directamente en el servidor
  if (req.method === 'POST' && reqPath === '/api/contacto') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const lead = JSON.parse(body);
        lead.recibido_en = new Date().toISOString();
        const leadsFile = path.join(BASE_DIR, 'leads.json');
        let leads = [];
        if (fs.existsSync(leadsFile)) {
          try {
            leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
          } catch(e) {
            leads = [];
          }
        }
        leads.push(lead);
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), 'utf8');

        console.log(`\n===============================================`);
        console.log(`📥 NUEVA SOLICITUD DE CONTACTO REGISTRADA:`);
        console.log(`   Nombre:       ${lead.nombre}`);
        console.log(`   Organización: ${lead.organizacion}`);
        console.log(`   Teléfono:     ${lead.telefono}`);
        console.log(`   Email:        ${lead.email}`);
        console.log(`   Modalidad:    ${lead.modalidad}`);
        if (lead.detalles) {
          console.log(`   Detalles:     ${lead.detalles}`);
        }
        console.log(`   Guardado en:  leads.json`);
        console.log(`===============================================\n`);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'Solicitud registrada correctamente en leads.json' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Formato JSON inválido' }));
      }
    });
    return;
  }

  const filePath = path.normalize(path.join(BASE_DIR, reqPath));

  // Security: prevent path traversal outside BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Prohibido');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Servir página de error 404 personalizada con código 404
      const notFoundPath = path.join(BASE_DIR, '404.html');
      fs.readFile(notFoundPath, (err404, data404) => {
        if (err404) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 No Encontrado - TKD Judge Systems');
        } else {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data404);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Error Interno');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` 🥋 TKD Judge Systems Web iniciado con éxito`);
  console.log(` URL local:        http://localhost:${PORT}`);
  console.log(` Dominio oficial:  https://tkdjudgesystems.com`);
  console.log(` Presione Ctrl+C para detener el servidor`);
  console.log(`===============================================`);
});
