const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

module.exports = async (req, res) => {
  try {
    console.log('Login endpoint called');
    if (req.method !== 'POST') return res.status(405).end();
    const { nombre, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE nombre = $1', [nombre]);
    if (rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
    const user = rows[0];
    console.log('Intentando login:', nombre, password, user.password);
    const valid = await bcrypt.compare(password, user.password);
    console.log('¿Password válida?', valid);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
    const token = jwt.sign({ id: user.id, rol: user.rol }, 'TU_SECRETO', { expiresIn: '1d' });
    res.json({ token, rol: user.rol, id: user.id });
    console.log('Login endpoint finished');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};
