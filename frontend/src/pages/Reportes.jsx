import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'

const API = 'http://localhost:3000'

function Reportes() {
  const [clases, setClases] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    const cargarReportes = async () => {
      try {
        const res = await fetch(`${API}/api/clases`)
        const data = await res.json()
        setClases(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error al cargar reportes:', err)
      }
    }
    cargarReportes()
  }, [])

  const totalClases = clases.length
  const totalCupos = clases.reduce((acc, c) => acc + (Number(c.cupoMaximo) || 0), 0)
  const topClases = [...clases]
    .sort((a, b) => (b.cupoMaximo || 0) - (a.cupoMaximo || 0))
    .slice(0, 5)

  const diasConteo = {}
  clases.forEach(c => {
    const d = c.dia ? c.dia.trim() : 'Sin definir'
    diasConteo[d] = (diasConteo[d] || 0) + 1
  })

  return (
    <div className="dashboard-layout">
      <Sidebar adminLinks />

      <div className="main-content">
        <header className="topbar">
          <h2>Reportes</h2>
        </header>

        <div className="content-area">
          <section className="panel">
            <div className="panel-header">
              <h3>Resumen Mensual</h3>
              <a className="link-btn" href="#" onClick={e => { e.preventDefault(); window.print() }}>
                Exportar PDF
              </a>
            </div>

            <div className="report-grid">
              <div className="report-card">
                <h4>Top 5 Clases</h4>
                {clases.length === 0 ? (
                  <p className="muted">No hay clases cargadas</p>
                ) : (
                  <ol>
                    {topClases.map(c => (
                      <li key={c._id}>
                        {c.nombre} ({c.instructor || 'Staff'}) — {c.cupoMaximo || 0} cupos
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div className="report-card">
                <h4>Asistencia por día</h4>
                {Object.keys(diasConteo).length === 0 ? (
                  <p className="muted">Sin datos</p>
                ) : (
                  <ul>
                    {Object.entries(diasConteo).map(([dia, cant]) => (
                      <li key={dia}>{dia}: {cant} clase{cant !== 1 ? 's' : ''}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="report-card">
                <h4>Ocupación promedio</h4>
                <p className="muted">
                  Total clases: <strong>{totalClases}</strong>
                </p>
                <p className="muted">
                  Cupos totales: <strong>{totalCupos}</strong>
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="site-footer">
          <small>GYM FLOW — Reportes.</small>
        </footer>
      </div>
    </div>
  )
}

export default Reportes
