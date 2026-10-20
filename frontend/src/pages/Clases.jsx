import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'

const API = 'http://localhost:3000'

function Clases() {
  const [clases, setClases] = useState([])
  const [form, setForm] = useState({ dia: '', hora: '', nombre: '', instructor: '', cupoMaximo: '' })
  const [editId, setEditId] = useState(null)

  // Estados para el calendario interactivo
  const [fechaCalendario, setFechaCalendario] = useState(new Date())
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())

  const diasSemanaNombres = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

  const normalizar = (texto) => 
    (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await fetch(`${API}/api/clases/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        setEditId(null)
      } else {
        await fetch(`${API}/api/clases`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
      }
      setForm({ dia: '', hora: '', nombre: '', instructor: '', cupoMaximo: '' })
      cargarClases()
    } catch (err) {
      console.error('Error al guardar clase:', err)
    }
  }

  const handleEditar = (clase) => {
    setEditId(clase._id)
    setForm({
      dia: clase.dia || '',
      hora: clase.hora || '',
      nombre: clase.nombre || '',
      instructor: clase.instructor || '',
      cupoMaximo: clase.cupoMaximo || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta clase?')) return
    try {
      await fetch(`${API}/api/clases/${id}`, { method: 'DELETE' })
      cargarClases()
    } catch (err) {
      console.error('Error al eliminar clase:', err)
    }
  }

  // --- NAVEGACIÓN Y CÁLCULO DEL CALENDARIO ---
  const cambiarMes = (inc) => {
    setFechaCalendario(new Date(fechaCalendario.getFullYear(), fechaCalendario.getMonth() + inc, 1))
  }

  const anio = fechaCalendario.getFullYear()
  const mes = fechaCalendario.getMonth()
  const nombreMes = fechaCalendario.toLocaleString('es-ES', { month: 'long' })
  const tituloMesAnio = `${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} ${anio}`

  const primerDiaSemana = new Date(anio, mes, 1).getDay()
  const indiceInicio = (primerDiaSemana + 6) % 7
  const totalDiasMes = new Date(anio, mes + 1, 0).getDate()
  const totalDiasMesAnterior = new Date(anio, mes, 0).getDate()

  const diasGrid = []
  for (let i = indiceInicio - 1; i >= 0; i--) {
    diasGrid.push({ nro: totalDiasMesAnterior - i, apagado: true })
  }
  for (let d = 1; d <= totalDiasMes; d++) {
    diasGrid.push({ nro: d, apagado: false })
  }
  const resto = diasGrid.length % 7
  if (resto !== 0) {
    for (let j = 1; j <= (7 - resto); j++) {
      diasGrid.push({ nro: j, apagado: true })
    }
  }

  const diaNombreSeleccionado = diasSemanaNombres[fechaSeleccionada.getDay()]
  const clasesFiltradas = clases.filter(c => normalizar(c.dia) === normalizar(diaNombreSeleccionado))

  return (
    <div className="dashboard-layout">
      <Sidebar adminLinks={true} />

      <div className="main-content">
        <header className="topbar">
          <h2>Gestión de Clases</h2>
        </header>

        <div className="content-area">
          {/* FORMULARIO DE NUEVA / EDITAR CLASE */}
          <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <div className="panel-header" style={{ marginBottom: '15px' }}>
              <h3>{editId ? 'Editar Clase' : 'Nueva Clase'}</h3>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Día</label>
                <input
                  type="text"
                  placeholder="Ej: Lunes"
                  value={form.dia}
                  onChange={(e) => setForm({ ...form, dia: e.target.value })}
                  required
                  style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Hora</label>
                <input
                  type="text"
                  placeholder="Ej: 19:30"
                  value={form.hora}
                  onChange={(e) => setForm({ ...form, hora: e.target.value })}
                  required
                  style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Clase</label>
                <input
                  type="text"
                  placeholder="Ej: Spinning"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                  style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Instructor</label>
                <input
                  type="text"
                  placeholder="Ej: Laura G."
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  required
                  style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Cupo Máximo</label>
                <input
                  type="number"
                  placeholder="Ej: 25"
                  value={form.cupoMaximo}
                  onChange={(e) => setForm({ ...form, cupoMaximo: e.target.value })}
                  required
                  style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', width: '100px' }}
                />
              </div>

              <button type="submit" className="btn" style={{ padding: '9px 18px' }}>
                {editId ? 'Guardar Cambios' : 'Guardar Clase'}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setEditId(null)
                    setForm({ dia: '', hora: '', nombre: '', instructor: '', cupoMaximo: '' })
                  }}
                  style={{ padding: '9px 18px' }}
                >
                  Cancelar
                </button>
              )}
            </form>
          </section>

          {/* CALENDARIO DE CLASES INTERACTIVO */}
          <section className="panel" style={{ padding: '24px' }}>
            <div className="panel-header" style={{ marginBottom: '20px' }}>
              <h3>Calendario de clases</h3>
            </div>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              {/* Calendario visual */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                width: '100%',
                maxWidth: '350px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1a202c' }}>
                    {tituloMesAnio}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => cambiarMes(-1)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: '4px 10px' }}>◀</button>
                    <button type="button" onClick={() => cambiarMes(1)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: '4px 10px' }}>▶</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '15px', color: '#64748b' }}>
                  <span>LU</span><span>MA</span><span>MI</span><span>JU</span><span>VI</span><span>SA</span><span>DO</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                  {diasGrid.map((dia, idx) => {
                    const esSeleccionado = !dia.apagado && 
                      fechaSeleccionada.getFullYear() === anio &&
                      fechaSeleccionada.getMonth() === mes &&
                      fechaSeleccionada.getDate() === dia.nro

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => !dia.apagado && setFechaSeleccionada(new Date(anio, mes, dia.nro))}
                        style={{
                          background: esSeleccionado ? '#00bac6' : 'transparent',
                          color: dia.apagado ? '#cbd5e1' : (esSeleccionado ? '#ffffff' : '#2d3748'),
                          border: 'none',
                          borderRadius: '50%',
                          width: '34px',
                          height: '34px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: dia.apagado ? 'default' : 'pointer',
                          fontWeight: esSeleccionado ? 'bold' : 'normal',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                        disabled={dia.apagado}
                      >
                        {dia.nro}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tarjetas de clases del día con botones Editar y Eliminar */}
              <div style={{ flex: '1', minWidth: '300px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#1a202c', textTransform: 'capitalize' }}>
                  Clases para el {diaNombreSeleccionado}, {fechaSeleccionada.getDate()} de {fechaSeleccionada.toLocaleString('es-ES', { month: 'long' })}
                </h4>

                {clasesFiltradas.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', background: '#fcfcfc', border: '1px dashed #e2e8f0', borderRadius: '12px', color: '#718096' }}>
                    No hay clases registradas para este día.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                    {clasesFiltradas.map(c => (
                      <div key={c._id} style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderLeft: '5px solid #00bac6',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{c.nombre}</h5>
                            <span style={{ fontWeight: 'bold', color: '#4a5568' }}>{c.hora} hs</span>
                          </div>
                          <p style={{ margin: '6px 0 2px 0', fontSize: '0.85rem', color: '#718096' }}>👤 Instructor: <strong>{c.instructor}</strong></p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#718096' }}>👥 Cupo: <strong>{c.cupoMaximo || 20} personas</strong></p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn small"
                            onClick={() => handleEditar(c)}
                            style={{ flex: 1, padding: '6px' }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn small ghost"
                            onClick={() => handleEliminar(c._id)}
                            style={{ flex: 1, padding: '6px', color: '#e53e3e', borderColor: '#e53e3e' }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>
        </div>

        <footer className="site-footer">
          <small>Panel de Control — GYM FLOW</small>
        </footer>
      </div>
    </div>
  )
}

export default Clases