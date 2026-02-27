const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, (req, res) => {
  const { usuario, contrasena, url, etiqueta } = req.body;

  db.run(
    `INSERT INTO vault (usuario, contrasena, url, etiqueta, user_id)
     VALUES (?, ?, ?, ?, ?)`,
    [usuario, contrasena, url, etiqueta, req.userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: "Entrada guardada", id: this.lastID });
    }
  );
});

router.get('/', auth, (req, res) => {
  db.all(
    `SELECT * FROM vault WHERE user_id = ?`,
    [req.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.delete('/:id', auth, (req, res) => {
  console.log("DELETE recibido:", req.params.id, "User:", req.userId);

  const { id } = req.params;

  db.run(
    `DELETE FROM vault WHERE id = ? AND user_id = ?`,
    [id, req.userId],
    function(err) {
      if (err) {
        console.error("Error SQL:", err.message);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json({ mensaje: "Registro eliminado correctamente" });
    }
  );
});

module.exports = router;