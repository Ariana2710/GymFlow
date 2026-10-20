import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Clases from './pages/Clases.jsx'
import Reservas from './pages/Reservas.jsx'
import Reportes from './pages/Reportes.jsx'

function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  if (adminOnly) {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
    if (usuario.rol !== 'admin') return <Navigate to="/reservas" replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/dashboard" element={<PrivateRoute adminOnly><Dashboard /></PrivateRoute>} />
      <Route path="/clases" element={<PrivateRoute adminOnly><Clases /></PrivateRoute>} />
      <Route path="/reportes" element={<PrivateRoute adminOnly><Reportes /></PrivateRoute>} />
      <Route path="/reservas" element={<PrivateRoute><Reservas /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
