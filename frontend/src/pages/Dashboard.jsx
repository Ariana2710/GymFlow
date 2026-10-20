import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

const API = 'http://localhost:3000'

function ModalAdmin({ onClose, onSaved }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  const handleGuardar = async () => {
    if (!nombre || !email || !password) {
      alert('Por favor, completá todos los campos')
      return
    }
    setLoading(true)
    try {
      const respuesta = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol: 'admin' })
      })
      const data = await respuesta.json()
      if (!respuesta.ok) {
        alert(data.msg || data.mensaje || 'Error al registrar el administrador')
        return
      }
      alert('¡Administrador creado con éxito!')
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
      alert('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <h3>Nuevo Administrador</h3>
        <p>Ingresá los datos del nuevo admin</p>
        <input type="text" placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <div className="modal-actions">
          <button className="btn small" onClick={handleGuardar} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button className="btn small ghost" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const [clases, setClases] = useState([])
  const [showModal, setShowModal] = useState(false)
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const navigate = useNavigate()

  const cargarClases = async () => {
    try {
      const res = await fetch(`${API}/api/clases`)
      const data = await res.json()
      setClases(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al traer las clases', err)
    }
  }

  useEffect(() => {
    cargarClases()
  }, [])

  const handleEditar = async (clase) => {
    const nuevoNombre = prompt('Modificar nombre:', clase.nombre)
    if (!nuevoNombre) return
    const nuevoDia = prompt('Modificar dia:', clase.dia)
    const nuevaHora = prompt('Modificar hora:', clase.hora)
    const nuevoInstructor = prompt('Modificar instructor:', clase.instructor)
    const nuevoCupo = prompt('Modificar cupo:', clase.cupoMaximo)

    try {
      const res = await fetch(`${API}/api/clases/${clase._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          nombre: nuevoNombre,
          dia: nuevoDia || clase.dia,
          hora: nuevaHora || clase.hora,
          instructor: nuevoInstructor || clase.instructor,
          cupoMaximo: Number(nuevoCupo) || clase.cupoMaximo
        })
      })
      if (res.ok) cargarClases()
      else alert('Error al editar')
    } catch (err) {
      console.error(err)
    }
  }

  const handleEliminar = async (clase) => {
    if (!confirm(`¿Deseas eliminar la clase ${clase.nombre}?`)) return
    try {
      const res = await fetch(`${API}/api/clases/${clase._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) cargarClases()
      else alert('Error al eliminar')
    } catch (err) {
      console.error(err)
    }
  }
  const totalClases = clases.length
  const cupoTotal = clases.reduce((acc, c) => acc + (Number(c.cupoMaximo) || 20), 0)
  const instructoresUnicos = Array.from(new Set(clases.map(c => c.instructor).filter(Boolean)))
  const totalStaff = instructoresUnicos.length || 1
  const proximaClase = clases[0] ? `${clases[0].nombre} ${clases[0].hora} hs` : 'Sin clases registradas'
  const reservasEstimadas = clases.reduce((acc, c) => acc + (Number(c.reservas) || 0), 0) || Math.round(cupoTotal * 0.65)

  return (
    <div className="dashboard-layout">
      <Sidebar adminLinks />

      <div className="main-content">
        <header className="topbar">
          <h2>Panel de Control — GYM FLOW</h2>
          <div className="top-actions">
            <span className="user-chip">
              {usuario.nombre ? `${usuario.nombre} (${usuario.rol || 'Admin'})` : 'Administrador'}
            </span>
          </div>
        </header>

        <div className="content-area">
          {/* Métricas */}
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Aforo actual</h3>
              <div className="metric-number">{reservasEstimadas} <span>de {cupoTotal || 100}</span></div>
              <p className="muted">Nivel: <strong>{cupoTotal > 30 ? 'Normal' : 'Bajo'}</strong></p>
            </div>
            <div className="metric-card">
              <h3>Clases activas</h3>
              <div className="metric-number">{totalClases} <span>en sistema</span></div>
              <p className="muted">Próxima: {proximaClase}</p>
            </div>
            <div className="metric-card">
              <h3>Cupos disponibles</h3>
              <div className="metric-number">{cupoTotal} <span>lugares</span></div>
              <p className="muted">Distribuidos en {totalClases} clases</p>
            </div>
            <div className="metric-card">
              <h3>Staff activo</h3>
              <div className="metric-number">{totalStaff} <span>profes</span></div>
              <p className="muted">{instructoresUnicos.slice(0, 2).join(', ') || 'Profesores GymFlow'}</p>
            </div>
          </div>
          {/* Tabla próximas clases */}
          <section className="panel">
            <div className="panel-header">
              <h3>Próximas Clases</h3>
              <Link to="/clases" className="link-btn">Ver todas</Link>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Clase</th>
                  <th>Instructor</th>
                  <th>Cupos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clases.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#777' }}>
                      No hay clases cargadas
                    </td>
                  </tr>
                ) : clases.map(clase => (
                  <tr key={clase._id}>
                    <td>{clase.hora || ''}</td>
                    <td>{clase.nombre || ''}</td>
                    <td>{clase.instructor || ''}</td>
                    <td>{(clase.reservas || 0)} / {clase.cupoMaximo || 20}</td>
                    <td>
                      <button className="btn small" onClick={() => handleEditar(clase)}>Editar</button>
                      {' '}
                      <button className="btn small ghost" onClick={() => handleEliminar(clase)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Panel 3 cols */}
          <section className="panel three-cols">
            <div className="panel-col">
              <h4>Clases más populares</h4>
              <ol className="muted">
                <li>Funcional — 320 inscripciones</li>
                <li>HIIT — 290 inscripciones</li>
                <li>Yoga — 180 inscripciones</li>
              </ol>
            </div>

            <div className="panel-col">
              <h4>Días con más asistencia</h4>
              <ol className="muted">
                <li>Martes — 420</li>
                <li>Jueves — 400</li>
                <li>Sábado — 350</li>
              </ol>
            </div>

            <div className="panel-col">
              <h4>Acciones rápidas</h4>
              <button className="btn btn-block" onClick={() => navigate('/clases')}>Crear horario</button>
              <button className="btn ghost btn-block" onClick={() => navigate('/reportes')}>Generar reporte</button>
              <button
                className="btn btn-block"
                style={{ backgroundColor: '#00bcd4', marginTop: '8px' }}
                onClick={() => setShowModal(true)}
              >
                Nuevo Administrador
              </button>
            </div>
          </section>
        </div>

        <footer className="site-footer">
          <small>GYM FLOW — Panel de Control • Proyecto académico.</small>
        </footer>
      </div>

      {showModal && (
        <ModalAdmin
          onClose={() => setShowModal(false)}
          onSaved={() => {}}
        />
      )}
    </div>
  )
}

export default Dashboard
