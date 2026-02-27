const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SECRET = "clave_secreta_super_segura";

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hash],
    function(err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Ese usuario ya existe" });
        }
        return res.status(500).json({ error: "Error al registrar usuario" });
      }
      res.json({ mensaje: "Usuario registrado correctamente" });
    }
  );
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

      const valido = await bcrypt.compare(password, user.password);
      if (!valido) return res.status(400).json({ error: "Credenciales incorrectas" });
      
      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
      res.json({ token });
    }
  );
});

module.exports = router;