const { crearUsuario, listarUsuarios, pool } = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function getUserFromAuthHeader(req) {
  const auth = req.headers.authorization;
  console.log('=== BACKEND TOKEN VERIFICATION ===');
  console.log('Authorization header:', auth);
  if (!auth || !auth.startsWith('Bearer ')) {
    console.log('No valid auth header');
    return null;
  }
  try {
    const token = auth.slice(7);
    console.log('Token to verify:', token);
    console.log('Token length:', token.length);
    const decoded = jwt.verify(token, 'TU_SECRETO');
    console.log('Decoded token:', decoded);
    console.log('Decoded token type:', typeof decoded);
    console.log('Decoded token rol:', decoded.rol);
    console.log('Decoded token rol type:', typeof decoded.rol);
    console.log('=== END TOKEN VERIFICATION ===');
    return decoded;
  } catch (error) {
    console.log('Token verification error:', error.message);
    console.log('=== END TOKEN VERIFICATION (ERROR) ===');
    return null;
  }
}

module.exports = async (req, res) => {
  const user = getUserFromAuthHeader(req);
  console.log('=== ROLE VERIFICATION ===');
  console.log('Usuario decodificado:', user);
  console.log('User exists:', !!user);
  console.log('User rol:', user?.rol);
  console.log('User rol type:', typeof user?.rol);
  console.log('Is admin check:', user?.rol === 'admin');
  console.log('Strict equality check:', user?.rol === 'admin');
  console.log('Loose equality check:', user?.rol == 'admin');
  console.log('=== END ROLE VERIFICATION ===');
  
  if (!user || user.rol !== 'admin') {
    console.log('Access denied - user:', user, 'rol:', user?.rol);
    return res.status(403).json({ error: 'Solo administradores pueden realizar esta acción' });
  }

  if (req.method === 'POST') {
    const { nombre, password, rol } = req.body;
    if (!nombre || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    try {
      const usuario = await crearUsuario(nombre, password, rol);
      delete usuario.password;
      res.status(201).json(usuario);
    } catch (error) {
      if (error.code === '23505') {
        res.status(409).json({ error: 'El usuario ya existe' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
    return;
  }

  if (req.method === 'GET') {
    try {
      const usuarios = await listarUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const { nombre, password, rol } = req.body;
    if (!id || !nombre || !rol) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    try {
      let query = 'UPDATE usuarios SET nombre = $1, rol = $2';
      let params = [nombre, rol, id];
      if (password) {
        const hash = await bcrypt.hash(password, 10);
        query = 'UPDATE usuarios SET nombre = $1, rol = $2, password = $3 WHERE id = $4 RETURNING id, nombre, rol';
        params = [nombre, rol, hash, id];
      } else {
        query = 'UPDATE usuarios SET nombre = $1, rol = $2 WHERE id = $3 RETURNING id, nombre, rol';
        params = [nombre, rol, id];
      }
      const { rows } = await pool.query(query, params);
      if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.status(200).json(rows[0]);
    } catch (error) {
      if (error.code === '23505') {
        res.status(409).json({ error: 'El usuario ya existe' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
    return;
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Falta el id' });
    if (String(user.id) === String(id)) {
      return res.status(403).json({ error: 'No puedes eliminar tu propio usuario' });
    }
    try {
      const { rowCount } = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
      if (rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  res.status(405).json({ error: 'Método no permitido' });
}; 