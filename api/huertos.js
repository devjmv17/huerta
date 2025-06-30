const pool = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM huertos ORDER BY id');
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { nombre, notas } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO huertos (nombre, notas) VALUES ($1, $2) RETURNING *',
      [nombre, notas]
    );
    return res.status(201).json(rows[0]);
  }
  if (req.method === 'PUT') {
    const { id, nombre, notas } = req.body;
    const { rows } = await pool.query(
      'UPDATE huertos SET nombre = $1, notas = $2 WHERE id = $3 RETURNING *',
      [nombre, notas, id]
    );
    return res.status(200).json(rows[0]);
  }
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await pool.query('DELETE FROM huertos WHERE id = $1', [id]);
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Método no permitido' });
};

