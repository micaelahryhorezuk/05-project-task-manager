const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Prueba de la API
app.get('/', (req, res) => {
  res.json({
    message: 'API del manejador de tareas funcionando'
  });
});

// Prueba de PostgreSQL
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      message: 'Conexión con PostgreSQL exitosa',
      fecha: result.rows[0].now
    });
  } catch (error) {
    console.error('Error PostgreSQL:', error);

    res.status(500).json({
      error: 'Error al conectar con PostgreSQL'
    });
  }
});
// Crear una nueva tarea
app.post('/tasks', async (req, res) => {
  try {
    const {
      nombre_proyecto,
      tipo_actividad,
      estado,
      resumen,
      descripcion,
      prioridad,
      informador,
      persona_asignada,
      precondicion,
      fecha_creacion,
      fecha_cierre,
      sprint
    } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (
        nombre_proyecto,
        tipo_actividad,
        estado,
        resumen,
        descripcion,
        prioridad,
        informador,
        persona_asignada,
        precondicion,
        fecha_creacion,
        fecha_cierre,
        sprint
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        nombre_proyecto,
        tipo_actividad,
        estado,
        resumen,
        descripcion,
        prioridad,
        informador,
        persona_asignada,
        precondicion,
        fecha_creacion,
        fecha_cierre || null,
        sprint
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error al crear tarea:', error);

    res.status(500).json({
      error: 'Error al crear la tarea'
    });
  }
});
// Obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY id ASC'
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Error al obtener tareas:', error);

    res.status(500).json({
      error: 'Error al obtener las tareas'
    });
  }
});
// Editar una tarea
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre_proyecto,
      tipo_actividad,
      estado,
      resumen,
      descripcion,
      prioridad,
      informador,
      persona_asignada,
      precondicion,
      fecha_creacion,
      fecha_cierre,
      sprint
    } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET nombre_proyecto = $1,
           tipo_actividad = $2,
           estado = $3,
           resumen = $4,
           descripcion = $5,
           prioridad = $6,
           informador = $7,
           persona_asignada = $8,
           precondicion = $9,
           fecha_creacion = $10,
           fecha_cierre = $11,
           sprint = $12
       WHERE id = $13
       RETURNING *`,
      [
        nombre_proyecto,
        tipo_actividad,
        estado,
        resumen,
        descripcion,
        prioridad,
        informador,
        persona_asignada,
        precondicion,
        fecha_creacion,
        fecha_cierre || null,
        sprint,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error al editar tarea:', error);

    res.status(500).json({
      error: 'Error al editar la tarea'
    });
  }
});
// Finalizar una tarea
app.patch('/tasks/:id/finalizar', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE tasks
       SET estado = 'FINALIZADA',
           fecha_cierre = CURRENT_DATE
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error al finalizar tarea:', error);

    res.status(500).json({
      error: 'Error al finalizar la tarea'
    });
  }
});
// Eliminar una tarea
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    res.json({
      message: 'Tarea eliminada correctamente',
      tarea: result.rows[0]
    });

  } catch (error) {
    console.error('Error al eliminar tarea:', error);

    res.status(500).json({
      error: 'Error al eliminar la tarea'
    });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});