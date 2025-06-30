const pool = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM tareas ORDER BY id');
    return res.status(200).json(rows);
  }
  if (req.method === 'POST') {
    const { id, nombre, notas } = req.body;
    const idNum = Number(id);
    if (idNum > 0) {
      const { rows } = await pool.query(
        'UPDATE tareas SET nombre = $1, notas = $2 WHERE id = $3 RETURNING *',
        [nombre, notas, idNum]
      );
      return res.status(200).json(rows[0]);
    } else {
      const { rows } = await pool.query(
        'INSERT INTO tareas (nombre, notas) VALUES ($1, $2) RETURNING *',
        [nombre, notas]
      );
      return res.status(201).json(rows[0]);
    }
  }
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await pool.query('DELETE FROM tareas WHERE id = $1', [id]);
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Método no permitido' });
};
