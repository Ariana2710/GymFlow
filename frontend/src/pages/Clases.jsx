import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'

const API = 'http://localhost:3000'

function Clases() {
  const [clases, setClases] = useState([])
  const [dia, setDia] = useState('')
  const [hora, setHora] = useState('')
  const [nombre, setNombre] = useState('')
  const [instructor, setInstructor] = useState('')
  const [cupo, setCupo] = useState('')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nuevaClase = {
      dia,
      hora,
      nombre,
      instructor,
      cupoMaximo: Number(cupo)
    }
    try {
      const res = await fetch(`${API}/api/clases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevaClase)
      })
      if (res.ok) {
        setDia(''); setHora(''); setNombre(''); setInstructor(''); setCupo('')
        cargarClases()
      } else {
        alert('Error al guardar la clase')
      }
    } catch (err) {
      console.error('Error al crear la clase:', err)
    }
  }

  const handleEditar = async (c) => {
    const nuevoNombre = prompt('Modificar nombre de la clase:', c.nombre)
    if (!nuevoNombre) return
    const nuevoDia = prompt('Modificar día:', c.dia)
    const nuevaHora = prompt('Modificar hora:', c.hora)
    const nuevoInstructor = prompt('Modificar instructor:', c.instructor)
    const nuevoCupo = prompt('Modificar cupo máximo:', c.cupoMaximo)

    try {
      const res = await fetch(`${API}/api/clases/${c._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nuevoNombre,
          dia: nuevoDia || c.dia,
          hora: nuevaHora || c.hora,
          instructor: nuevoInstructor || c.instructor,
          cupoMaximo: Number(nuevoCupo) || c.cupoMaximo
        })
      })
      if (res.ok) cargarClases()
      else alert('Error al actualizar la clase')
    } catch (err) {
      console.error('Error al editar clase:', err)
    }
  }

  const handleEliminar = async (c) => {
    if (!confirm(`¿Estás segura/o de eliminar la clase ${c.nombre}?`)) return
    try {
      const res = await fetch(`${API}/api/clases/${c._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) cargarClases()
      else alert('Error al intentar eliminar la clase')
    } catch (err) {
      console.error('Error al borrar clase:', err)
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar adminLinks />

      <div className="main-content">
        <header className="topbar">
          <h2>Gestión de Clases</h2>
        </header>

        <div className="content-area">
          {/* Formulario nueva clase */}
          <section className="panel">
            <div className="panel-header">
              <h3>Nueva Clase</h3>
            </div>
            <form onSubmit={handleSubmit} className="clase-form">
              <div className="form-field">
                <label>Día</label>
                <input type="text" placeholder="Ej: Lunes" value={dia} onChange={e => setDia(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Hora</label>
                <input type="text" placeholder="Ej: 19:30" value={hora} onChange={e => setHora(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Clase</label>
                <input type="text" placeholder="Ej: Spinning" value={nombre} onChange={e => setNombre(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Instructor</label>
                <input type="text" placeholder="Ej: Laura G." value={instructor} onChange={e => setInstructor(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Cupo Máximo</label>
                <input type="number" placeholder="Ej: 25" value={cupo} onChange={e => setCupo(e.target.value)} required style={{ width: '100px' }} />
              </div>
              <button type="submit" className="btn">Guardar Clase</button>
            </form>
          </section>

          {/* Tabla de clases */}
          <section className="panel">
            <div className="panel-header">
              <h3>Calendario de clases</h3>
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
                      <button className="btn small" onClick={() => handleEditar(c)}>Editar</button>
                      {' '}
                      <button className="btn small ghost" onClick={() => handleEliminar(c)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <footer className="site-footer">
          <small>GYM FLOW — Gestión de Clases.</small>
        </footer>
      </div>
    </div>
  )
}

export default Clases
