import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import BrandLogo from '../common/BrandLogo'
import TopBar from '../common/TopBar'

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const identity = user?.nombre?.trim() || user?.correo || 'Usuario'

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header>
      <TopBar />
      <div id="header">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
          <BrandLogo />
          <p className="admin-header-label mb-0">Panel administrativo</p>
          <div className="admin-user d-flex flex-wrap align-items-center gap-3">
            <span className="admin-user-name">{identity}</span>
            <button type="button" className="btn btn-outline-light" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
          <Link className="admin-store-link" to="/"><i className="fa fa-arrow-left" aria-hidden="true" /> Volver a la tienda</Link>
        </div>
      </div>
    </header>
  )
}
