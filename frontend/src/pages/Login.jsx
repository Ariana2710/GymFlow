import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000'

function Login() {
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
      const respuesta = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await respuesta.json()

      if (!respuesta.ok) {
        setError(data.msg || 'Credenciales incorrectas')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))

      if (data.usuario && data.usuario.rol === 'admin') {
        navigate('/dashboard')
      } else {
        navigate('/reservas')
      }
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
        <h2>Iniciar sesión</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
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
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <Link to="/" className="back-link">Volver al inicio</Link>
        <Link to="/registro" className="back-link">¿No tenés cuenta? Registrate acá</Link>
      </div>
    </div>
  )
}

export default Login
