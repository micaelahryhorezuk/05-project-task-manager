import { useEffect, useState } from 'react'
import './App.css'

interface Task {
  id?: number
  nombre_proyecto: string
  tipo_actividad: string
  estado: string
  resumen: string
  descripcion: string
  prioridad: string
  informador: string
  persona_asignada: string
  precondicion: string
  fecha_creacion: string
  fecha_cierre: string | null
  sprint: string
}

const API_URL = 'http://localhost:3001'

const tareaInicial: Task = {
  nombre_proyecto: '',
  tipo_actividad: '',
  estado: 'PENDIENTE',
  resumen: '',
  descripcion: '',
  prioridad: 'MEDIA',
  informador: '',
  persona_asignada: '',
  precondicion: '',
  fecha_creacion: new Date().toISOString().split('T')[0],
  fecha_cierre: null,
  sprint: ''
}

function App() {
  const [tareas, setTareas] = useState<Task[]>([])
  const [formulario, setFormulario] = useState<Task>(tareaInicial)
  const [idEditando, setIdEditando] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    obtenerTareas()
  }, [])

  const obtenerTareas = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/tasks`)

      if (!respuesta.ok) {
        throw new Error('Error al obtener las tareas')
      }

      const datos = await respuesta.json()
      setTareas(datos)
    } catch (error) {
      console.error(error)
      setMensaje('No se pudieron cargar las tareas')
    }
  }

  const manejarCambio = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: value
    })
  }

  const guardarTarea = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = idEditando
        ? `${API_URL}/tasks/${idEditando}`
        : `${API_URL}/tasks`

      const metodo = idEditando ? 'PUT' : 'POST'

      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formulario,
          fecha_cierre: formulario.fecha_cierre || null
        })
      })

      if (!respuesta.ok) {
        throw new Error('Error al guardar la tarea')
      }

      setMensaje(
        idEditando
          ? 'Tarea editada correctamente'
          : 'Tarea creada correctamente'
      )

      cancelarEdicion()
      obtenerTareas()
    } catch (error) {
      console.error(error)
      setMensaje('Ocurrió un error al guardar la tarea')
    }
  }

  const editarTarea = (tarea: Task) => {
    setIdEditando(tarea.id!)

    setFormulario({
      ...tarea,
      fecha_creacion: tarea.fecha_creacion
        ? tarea.fecha_creacion.split('T')[0]
        : '',
      fecha_cierre: tarea.fecha_cierre
        ? tarea.fecha_cierre.split('T')[0]
        : null
    })

    setMensaje('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelarEdicion = () => {
    setIdEditando(null)
    setFormulario({
      ...tareaInicial,
      fecha_creacion: new Date().toISOString().split('T')[0]
    })
  }

  const finalizarTarea = async (id: number) => {
    try {
      const respuesta = await fetch(
        `${API_URL}/tasks/${id}/finalizar`,
        {
          method: 'PATCH'
        }
      )

      if (!respuesta.ok) {
        throw new Error('Error al finalizar la tarea')
      }

      setMensaje('Tarea finalizada correctamente')
      obtenerTareas()
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo finalizar la tarea')
    }
  }

  const eliminarTarea = async (id: number) => {
    const confirmar = window.confirm(
      '¿Estás segura de que querés eliminar esta tarea?'
    )

    if (!confirmar) return

    try {
      const respuesta = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      })

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la tarea')
      }

      setMensaje('Tarea eliminada correctamente')
      obtenerTareas()
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo eliminar la tarea')
    }
  }

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return '-'

    const fechaLimpia = fecha.split('T')[0]
    const [anio, mes, dia] = fechaLimpia.split('-')

    return `${dia}/${mes}/${anio}`
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Gestor de Tareas</h1>
          <p>Administración de tareas de proyectos de software</p>
        </div>
      </header>

      <main className="contenido">
        <section className="panel">
          <h2>{idEditando ? 'Editar tarea' : 'Nueva tarea'}</h2>

          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={guardarTarea} className="formulario">
            <div className="campo">
              <label>Nombre del Proyecto</label>
              <input
                type="text"
                name="nombre_proyecto"
                value={formulario.nombre_proyecto}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="campo">
              <label>Tipo de Actividad</label>
              <select
                name="tipo_actividad"
                value={formulario.tipo_actividad}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccionar</option>
                <option value="Desarrollo">Desarrollo</option>
                <option value="Testing">Testing</option>
                <option value="Análisis">Análisis</option>
                <option value="Diseño">Diseño</option>
                <option value="Documentación">Documentación</option>
              </select>
            </div>

            <div className="campo">
              <label>Estado</label>
              <select
                name="estado"
                value={formulario.estado}
                onChange={manejarCambio}
                required
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN PROGRESO">En progreso</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>

            <div className="campo">
              <label>Prioridad</label>
              <select
                name="prioridad"
                value={formulario.prioridad}
                onChange={manejarCambio}
                required
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <div className="campo campo-ancho">
              <label>Resumen</label>
              <input
                type="text"
                name="resumen"
                value={formulario.resumen}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="campo campo-ancho">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={manejarCambio}
                rows={4}
              />
            </div>

            <div className="campo">
              <label>Informador</label>
              <input
                type="text"
                name="informador"
                value={formulario.informador}
                onChange={manejarCambio}
              />
            </div>

            <div className="campo">
              <label>Persona asignada</label>
              <input
                type="text"
                name="persona_asignada"
                value={formulario.persona_asignada}
                onChange={manejarCambio}
              />
            </div>

            <div className="campo campo-ancho">
              <label>Precondición</label>
              <textarea
                name="precondicion"
                value={formulario.precondicion}
                onChange={manejarCambio}
                rows={3}
              />
            </div>

            <div className="campo">
              <label>Fecha de Creación</label>
              <input
                type="date"
                name="fecha_creacion"
                value={formulario.fecha_creacion}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="campo">
              <label>Fecha de Cierre</label>
              <input
                type="date"
                name="fecha_cierre"
                value={formulario.fecha_cierre || ''}
                onChange={manejarCambio}
              />
            </div>

            <div className="campo">
              <label>Sprint</label>
              <input
                type="text"
                name="sprint"
                placeholder="Ej: Sprint 1"
                value={formulario.sprint}
                onChange={manejarCambio}
              />
            </div>

            <div className="acciones-formulario">
              <button type="submit" className="btn btn-primario">
                {idEditando ? 'Guardar cambios' : 'Crear tarea'}
              </button>

              {idEditando && (
                <button
                  type="button"
                  className="btn btn-secundario"
                  onClick={cancelarEdicion}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="titulo-listado">
            <div>
              <h2>Listado de Tareas</h2>
              <p>{tareas.length} tarea(s) registrada(s)</p>
            </div>

            <button
              className="btn btn-secundario"
              onClick={obtenerTareas}
            >
              Actualizar
            </button>
          </div>

          {tareas.length === 0 ? (
            <p className="sin-tareas">No hay tareas registradas.</p>
          ) : (
            <div className="tabla-contenedor">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Proyecto</th>
                    <th>Resumen</th>
                    <th>Actividad</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Asignada</th>
                    <th>Sprint</th>
                    <th>Creación</th>
                    <th>Cierre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {tareas.map((tarea) => (
                    <tr key={tarea.id}>
                      <td>{tarea.id}</td>
                      <td>{tarea.nombre_proyecto}</td>
                      <td>{tarea.resumen}</td>
                      <td>{tarea.tipo_actividad}</td>

                      <td>
                        <span
                          className={`estado ${tarea.estado
                            .toLowerCase()
                            .replace(' ', '-')}`}
                        >
                          {tarea.estado}
                        </span>
                      </td>

                      <td>{tarea.prioridad}</td>
                      <td>{tarea.persona_asignada || '-'}</td>
                      <td>{tarea.sprint || '-'}</td>
                      <td>{formatearFecha(tarea.fecha_creacion)}</td>
                      <td>{formatearFecha(tarea.fecha_cierre)}</td>

                      <td>
                        <div className="acciones">
                          <button
                            className="btn btn-editar"
                            onClick={() => editarTarea(tarea)}
                          >
                            Editar
                          </button>

                          {tarea.estado !== 'FINALIZADA' && (
                            <button
                              className="btn btn-finalizar"
                              onClick={() =>
                                finalizarTarea(tarea.id!)
                              }
                            >
                              Finalizar
                            </button>
                          )}

                          <button
                            className="btn btn-eliminar"
                            onClick={() =>
                              eliminarTarea(tarea.id!)
                            }
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App