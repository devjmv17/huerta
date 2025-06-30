const pool = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // Puedes expandir para JOIN y traer nombres de tarea/persona/huerto si lo deseas
    const { rows } = await pool.query('SELECT * FROM trabajos ORDER BY id DESC');
    return res.status(200).json(rows);
  }
  
  if (req.method === 'POST') {
    try {
      const { tareaid, personaid, huertoid, fecha, horas, notas } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO trabajos (tareaid, personaid, huertoid, fecha, horas, notas) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [tareaid, personaid, huertoid, fecha, horas, notas]
      );
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
  if (req.method === 'PUT') {
    const { id, tareaid, personaid, huertoid, fecha, horas, notas } = req.body;
    const { rows } = await pool.query(
      'UPDATE trabajos SET tareaid = $1, personaid = $2, huertoid = $3, fecha = $4, horas = $5, notas = $6 WHERE id = $7 RETURNING *',
      [tareaid, personaid, huertoid, fecha, horas, notas, id]
    );
    return res.status(200).json(rows[0]);
  }
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await pool.query('DELETE FROM trabajos WHERE id = $1', [id]);
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Método no permitido' });
};
