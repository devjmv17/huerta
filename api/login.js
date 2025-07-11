const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { nombre, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE nombre = $1', [nombre]);
  if (rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
};
