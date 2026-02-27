const jwt = require('jsonwebtoken');
const SECRET = "clave_secreta_super_segura";

module.exports = function(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: "Token requerido" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.userId = decoded.id;
    next();
  });
};

