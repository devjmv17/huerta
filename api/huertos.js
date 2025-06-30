const pool = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM huertos ORDER BY id');
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { id, nombre, notas, ubicacion } = req.body;
    const idNum = Number(id);
    if (idNum > 0) {
      const { rows } = await pool.query(
        'UPDATE huertos SET nombre = $1, notas = $2, ubicacion = $3 WHERE id = $4 RETURNING *',
        [nombre, notas, ubicacion, idNum]
      );
      return res.status(200).json(rows[0]);
    } else {
      const { rows } = await pool.query(
        'INSERT INTO huertos (nombre, notas, ubicacion) VALUES ($1, $2, $3) RETURNING *',
        [nombre, notas, ubicacion]
      );
      return res.status(201).json(rows[0]);
    }
  }
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await pool.query('DELETE FROM huertos WHERE id = $1', [id]);
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Método no permitido' });
};

