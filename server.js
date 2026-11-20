const express = require('express');
const mysql = require('mysql2');

const app = express();

// LIBERA O APLICATIVO (ELECTRON) E O NAVEGADOR PARA CONVERSAREM COM O SERVIDOR
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Duda2004',
  database: 'meu_banco'
});

db.connect((err) => {
  if (err) return console.error('Erro no MySQL:', err);
  console.log('Conectado ao MySQL com sucesso!');

  db.query(`
    CREATE TABLE IF NOT EXISTS dados_app (
      chave VARCHAR(50) PRIMARY KEY,
      conteudo LONGTEXT
    )
  `);
});

// Rota genérica para CARREGAR dados (personagens ou usuarios)
app.get('/api/dados/:chave', (req, res) => {
  db.query('SELECT conteudo FROM dados_app WHERE chave = ?', [req.params.chave], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (rows.length > 0 && rows[0].conteudo) {
      res.json(JSON.parse(rows[0].conteudo));
    } else {
      res.json(null);
    }
  });
});

// Rota genérica para SALVAR dados (personagens ou usuarios)
app.post('/api/dados/:chave', (req, res) => {
  const jsonStr = JSON.stringify(req.body);
  const sql = 'INSERT INTO dados_app (chave, conteudo) VALUES (?, ?) ON DUPLICATE KEY UPDATE conteudo = ?';
  db.query(sql, [req.params.chave, jsonStr, jsonStr], (err) => {
    if (err) return res.status(500).json({ erro: err.message });
    console.log(`Salvo no MySQL (${req.params.chave}):`, Array.isArray(req.body) ? req.body.length + ' itens' : 'ok');
    res.json({ ok: true });
  });
});

app.listen(3000, () => {
  console.log('Site rodando em http://localhost:3000');
});