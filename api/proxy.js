const https = require('http');

const VPS = 'http://46.225.12.120:8888';

module.exports = async (req, res) => {
  const path = req.query.path || '/api/overview';
  const url = VPS + path;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    const data = await new Promise((resolve, reject) => {
      const r = https.get(url, { timeout: 10000 }, (resp) => {
        let body = '';
        resp.on('data', c => body += c);
        resp.on('end', () => resolve(body));
      });
      r.on('error', reject);
      r.on('timeout', () => { r.destroy(); reject(new Error('timeout')); });
    });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  } catch (e) {
    res.status(502).json({ error: 'VPS unreachable', detail: e.message });
  }
};
