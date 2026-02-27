const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.WEBSITE_INSTANCE_ID
  ? path.join(process.env.HOME || 'C:\\home\\site\\wwwroot', 'vault.db')
  : path.join(__dirname, 'vault.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS vault (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL,
    contrasena TEXT NOT NULL,
    url TEXT,
    etiqueta TEXT,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
