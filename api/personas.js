const pool = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM personas ORDER BY id');
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { nombre, telefono, email, notas } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO personas (nombre, telefono, email, notas) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, telefono, email, notas]
    );
    return res.status(201).json(rows[0]);
  }
 if (req.method === 'PUT') {
    const { id, nombre, telefono, email, notas } = req.body;
    const { rows } = await pool.query(
      'UPDATE personas SET nombre = $1, telefono = $2, email = $3, notas = $4 WHERE id = $5 RETURNING *',
      [nombre, telefono, email, notas, id]
    );
    return res.status(200).json(rows[0]);
  }
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await pool.query('DELETE FROM personas WHERE id = $1', [id]);
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Método no permitido' });
};

