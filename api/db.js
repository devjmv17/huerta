const { Pool } = require('pg');
const bcrypt = require('bcryptjs'); // Usa bcryptjs aquí también

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_HGoawThvDx40@ep-morning-shape-a2n39w6l-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require',
});

// Funciones para usuarios
async function crearUsuario(nombre, password, rol) {
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nombre, password, rol) VALUES ($1, $2, $3) RETURNING *',
    [nombre, hash, rol]
  );
  return rows[0];
}

async function getUsuarioPorNombre(nombre) {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE nombre = $1', [nombre]);
  return rows[0];
}

async function listarUsuarios() {
  const { rows } = await pool.query('SELECT id, nombre, rol FROM usuarios');
  return rows;
}

module.exports = {
  pool,
  crearUsuario,
  getUsuarioPorNombre,
  listarUsuarios,
};
