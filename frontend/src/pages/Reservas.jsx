import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'

const API = 'http://localhost:3000'

function Reservas() {
  const [clases, setClases] = useState([])
  const token = localStorage.getItem('token')

  const cargarClases = async () => {
    try {
      const res = await fetch(`${API}/api/clases`)
      const data = await res.json()
      setClases(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar clases:', err)
    }
  }

  useEffect(() => {
    cargarClases()
  }, [])

  const handleReservar = (clase) => {
    alert(`¡Lugar reservado para ${clase.nombre}!`)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar adminLinks={false} />

      <div className="main-content">
        <header className="topbar">
          <h2>Reservas de clases</h2>
        </header>

        <div className="content-area">
          <section className="panel">
            <div className="panel-header">
              <h3>Calendario de clases disponibles</h3>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Hora</th>
                  <th>Clase</th>
                  <th>Instructor</th>
                  <th>Cupo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clases.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#777' }}>
                      No hay clases registradas.
                    </td>
                  </tr>
                ) : clases.map(c => (
                  <tr key={c._id}>
                    <td>{c.dia || ''}</td>
                    <td>{c.hora || ''}</td>
                    <td>{c.nombre || ''}</td>
                    <td>{c.instructor || ''}</td>
                    <td>{c.cupoMaximo || 20}</td>
                    <td>
                      <button className="btn small" onClick={() => handleReservar(c)}>
                        Reservar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          {/* SECCIÓN TESTIMONIOS para que funcione*/}
          <section className="panel" style={{ marginTop: '25px' }}>
            <div className="panel-header">
              <h3>Dejanos tu testimonio</h3>
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
              Contanos tu experiencia en GYM FLOW para compartirla con la comunidad.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault()
              const texto = e.target.testimonio.value.trim()
              if (texto) {
                let nombreUsuario = 'Alumno/a'
                const userGuardado = localStorage.getItem('user') || localStorage.getItem('usuario')
                if (userGuardado) {
                  try {
                    const parsed = JSON.parse(userGuardado)
                    nombreUsuario = parsed.nombre || parsed.name || parsed.username || 'Alumno/a'
                  } catch {
                    nombreUsuario = userGuardado
                  }
                }
                const guardados = JSON.parse(localStorage.getItem('testimonios_gymflow') || '[]')
                guardados.push({
                  id: Date.now(),
                  autor: nombreUsuario,
                  texto: texto
                })
                  localStorage.setItem('testimonios_gymflow', JSON.stringify(guardados))
                  alert('¡Gracias ' + nombreUsuario + '¡Tu testimonio fue publicado.')
                  e.target.reset()
                }
            }}>
              <textarea
                name="testimonio"
                placeholder="Escribe tu opinión sobre las clases, profes o instalaciones..."
                rows="4"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #dcdcdc',
                  fontSize: '14px',
                  resize: 'none',
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{ marginTop: '12px' }}>
                <button type="submit" className="btn small">
                  Enviar testimonio
                </button>
              </div>
            </form>
          </section>
        </div>

        <footer className="site-footer">
          <small>GYM FLOW — Reservas de Clases.</small>
        </footer>
      </div>
    </div>
  )
}

export default Reservas
