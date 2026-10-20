import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar({ adminLinks = true }) {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <img src="/img/logo.jpg" alt="GYM FLOW" className="brand-logo" />
          <span>GYM FLOW</span>
        </div>

        <nav className="sidebar-nav">
          {adminLinks ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                Dashboard
              </NavLink>
              <NavLink to="/clases" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                Gestión de Clases
              </NavLink>
              <NavLink to="/reportes" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                Reportes
              </NavLink>
            </>
          ) : (
            <NavLink to="/reservas" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
              Reservar Clases
            </NavLink>
          )}
          <a href="#" className="nav-item logout" onClick={handleLogout}>
            Cerrar sesión
          </a>
        </nav>
      </div>

      <footer className="sidebar-footer">
        <small>Panel de Control — GYM FLOW</small>
      </footer>
    </aside>
  )
}

export default Sidebar
