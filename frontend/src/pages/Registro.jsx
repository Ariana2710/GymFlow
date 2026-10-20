import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000'

function Registro() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const respuesta = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol: 'cliente' })
      })
      const data = await respuesta.json()

      if (!respuesta.ok) {
        setError(data.msg || data.mensaje || 'Error al registrar usuario')
        return
      }

      alert('¡Cuenta creada con éxito! Ahora podés iniciar sesión.')
      navigate('/login')
    } catch (err) {
      console.error(err)
      setError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <img src="/img/logo.jpg" alt="GYM FLOW" />
        <h2>Crear Cuenta</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <Link to="/login" className="back-link">¿Ya tenés cuenta? Iniciar sesión</Link>
        <Link to="/" className="back-link">Volver al inicio</Link>
      </div>
    </div>
  )
}

export default Registro
