const pool = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // Puedes expandir para JOIN y traer nombres de tarea/persona/huerto si lo deseas
    const { rows } = await pool.query('SELECT * FROM trabajos ORDER BY id DESC');
    return res.status(200).json(rows);
  }
  
  if (req.method === 'POST') {
    const { id, tareaid, personaid, huertoid, fecha, horas, notas } = req.body;
    const idNum = Number(id);
    if (idNum > 0) {
      console.log('Body recibido en UPDATE:', { id, tareaid, personaid, huertoid, fecha, horas, notas });
      try {
        const { rows } = await pool.query(
          'UPDATE trabajos SET tareaId = $1, personaId = $2, huertoId = $3, fecha = $4, horas = $5, notas = $6 WHERE id = $7 RETURNING *',
          [tareaid, personaid, huertoid, fecha, horas, notas, idNum]
        );
        return res.status(200).json(rows[0]);
      } catch (error) {
        console.error('Error en UPDATE trabajos:', error);
        return res.status(500).json({ error: error.message });
      }
    } else {
      const { rows } = await pool.query(
        'INSERT INTO trabajos (tareaid, personaid, huertoid, fecha, horas, notas) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [tareaid, personaid, huertoid, fecha, horas, notas]
      );
      return res.status(201).json(rows[0]);
    }
  }
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await pool.query('DELETE FROM trabajos WHERE id = $1', [id]);
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Método no permitido' });
};
