import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  return (
    <header className="header">
      <div className="logo">
        <img src="/img/logo.jpg" alt="Logo GYM FLOW" />
      </div>

      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Menú">
        <i className={`fas ${open ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <nav>
        <ul className={open ? 'open' : ''}>
          <li><a href="#inicio" onClick={() => setOpen(false)}>Inicio</a></li>
          <li><a href="#servicios" onClick={() => setOpen(false)}>Servicios</a></li>
          <li><a href="#galeria" onClick={() => setOpen(false)}>Galería</a></li>
          <li><a href="#testimonios" onClick={() => setOpen(false)}>Testimonios</a></li>
          <li><a href="#contacto" onClick={() => setOpen(false)}>Contacto</a></li>
        </ul>
      </nav>

      <div className="header-actions">
        <Link to="/registro" className="btn-login outline">Registrarse</Link>
        <Link to="/login" className="btn-login">Iniciar sesión</Link>
      </div>
    </header>
  )
}

export default Navbar
