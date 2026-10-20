import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'

const API = 'http://localhost:3000'

function Reservas() {
  const [clases, setClases] = useState([])
  const token = localStorage.getItem('token')

  // Estado para el mes/año visible en el calendario (arranca en la fecha de hoy)
  const [fechaCalendario, setFechaCalendario] = useState(new Date())
  // Estado para el día exactamente seleccionado
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())

  // Días de la semana para mapear con la base de datos
  const diasSemanaNombres = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

  // Función para quitar tildes y comparar días sin errores (ej: "miércoles" == "miercoles")
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

  // Navegar entre meses (-1 mes anterior, +1 mes siguiente)
  const cambiarMes = (incremento) => {
    setFechaCalendario(new Date(
      fechaCalendario.getFullYear(),
      fechaCalendario.getMonth() + incremento,
      1
    ))
  }

  const handleReservar = (clase) => {
    const diaNombre = diasSemanaNombres[fechaSeleccionada.getDay()]
    alert(`¡Lugar reservado para ${clase.nombre} el día ${diaNombre} ${fechaSeleccionada.getDate()}!`)
  }

  // --- CÁLCULO DINÁMICO DE LA GRILLA DEL CALENDARIO ---
  const anio = fechaCalendario.getFullYear()
  const mes = fechaCalendario.getMonth()

  // Nombre del mes en español con la primera letra en mayúscula
  const nombreMes = fechaCalendario.toLocaleString('es-ES', { month: 'long' })
  const tituloMesAnio = `${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} ${anio}`

  // 1. Día de la semana en que arranca el mes (0=Dom, 1=Lun...) ajustado a Lunes=0
  const primerDiaSemana = new Date(anio, mes, 1).getDay()
  const indiceInicio = (primerDiaSemana + 6) % 7 // Lunes=0, Martes=1, ..., Domingo=6

  // 2. Días totales del mes actual y del mes anterior
  const totalDiasMes = new Date(anio, mes + 1, 0).getDate()
  const totalDiasMesAnterior = new Date(anio, mes, 0).getDate()

  // 3. Generar la lista de días
  const diasGrid = []

  // Días del mes anterior para rellenar
  for (let i = indiceInicio - 1; i >= 0; i--) {
    diasGrid.push({ nro: totalDiasMesAnterior - i, apagado: true })
  }

  // Días activos del mes en pantalla
  for (let d = 1; d <= totalDiasMes; d++) {
    diasGrid.push({ nro: d, apagado: false, fecha: new Date(anio, mes, d) })
  }

  // Días del mes posterior para completar múltiplos de 7
  const resto = diasGrid.length % 7
  if (resto !== 0) {
    for (let j = 1; j <= (7 - resto); j++) {
      diasGrid.push({ nro: j, apagado: true })
    }
  }

  // Filtrar las clases según el día de la semana seleccionado
  const diaNombreSeleccionado = diasSemanaNombres[fechaSeleccionada.getDay()]
  const clasesFiltradas = clases.filter(c => normalizar(c.dia) === normalizar(diaNombreSeleccionado))

  return (
    <div className="dashboard-layout">
      <Sidebar adminLinks={false} />

      <div className="main-content">
        <header className="topbar">
          <h2>Reservas de clases</h2>
        </header>

        <div className="content-area">
          <section className="panel" style={{ padding: '24px' }}>
            <div className="panel-header" style={{ marginBottom: '20px' }}>
              <h3>Calendario de clases disponibles</h3>
            </div>

            {/* CONTENEDOR FLEX: CALENDARIO INTERACTIVO Y CLASES */}
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              
              {/* CAJA DEL CALENDARIO MENSUAL */}
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
                {/* Cabecera con selector de mes y año */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#1a202c' }}>
                    {tituloMesAnio}
                  </span>
                  
                  {/* Botones interactivos para cambiar de mes */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => cambiarMes(-1)}
                      title="Mes anterior"
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        padding: '4px 10px',
                        fontWeight: 'bold',
                        color: '#475569'
                      }}
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => cambiarMes(1)}
                      title="Mes siguiente"
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        padding: '4px 10px',
                        fontWeight: 'bold',
                        color: '#475569'
                      }}
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Días de la semana */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '15px', color: '#64748b' }}>
                  <span>LU</span><span>MA</span><span>MI</span><span>JU</span><span>VI</span><span>SA</span><span>DO</span>
                </div>

                {/* Grilla numérica de los días */}
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
                        onClick={() => {
                          if (!dia.apagado) {
                            setFechaSeleccionada(new Date(anio, mes, dia.nro))
                          }
                        }}
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
                          fontSize: '0.9rem',
                          transition: 'all 0.15s ease'
                        }}
                        disabled={dia.apagado}
                      >
                        {dia.nro}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* LISTA DE CLASES DEL DÍA SELECCIONADO */}
              <div style={{ flex: '1', minWidth: '300px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#1a202c', textTransform: 'capitalize' }}>
                  Clases para el {diaNombreSeleccionado}, {fechaSeleccionada.getDate()} de {fechaSeleccionada.toLocaleString('es-ES', { month: 'long' })}
                </h4>

                {clasesFiltradas.length === 0 ? (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: '#fcfcfc',
                    border: '1px dashed #e2e8f0',
                    borderRadius: '12px',
                    color: '#718096'
                  }}>
                    No hay clases disponibles programadas para los días {diaNombreSeleccionado}.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1a202c' }}>{c.nombre}</h5>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#4a5568' }}>{c.hora} hs</span>
                          </div>
                          <p style={{ margin: '8px 0 4px 0', fontSize: '0.85rem', color: '#718096' }}>
                            👤 Instructor: <strong>{c.instructor || 'A designar'}</strong>
                          </p>
                          <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#718096' }}>
                            👥 Cupo: <strong>{c.cupoMaximo || 20} personas</strong>
                          </p>
                        </div>
                        <button
                          className="btn small"
                          onClick={() => handleReservar(c)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            backgroundColor: '#00bac6',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Reservar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* SECCIÓN TESTIMONIOS (TOTALMENTE INTACTA) */}
          <section className="panel" style={{ marginTop: '25px' }}>
            <div className="panel-header">
              <h3>Dejanos tu testimonio</h3>
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
              Contanos tu experiencia en GYM FLOW para compartirla con la comunidad.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault()
              const text = e.target.testimonio.value.trim()
              if (text) {
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
                  texto: text
                })
                localStorage.setItem('testimonios_gymflow', JSON.stringify(guardados))
                alert('¡Gracias ' + nombreUsuario + '! Tu testimonio fue publicado.')
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