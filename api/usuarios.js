const { crearUsuario, listarUsuarios } = require('./db');
const jwt = require('jsonwebtoken');

function getUserFromAuthHeader(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), 'TU_SECRETO');
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  const user = getUserFromAuthHeader(req);
  if (!user || user.rol !== 'admin') {
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

  res.status(405).json({ error: 'Método no permitido' });
}; 