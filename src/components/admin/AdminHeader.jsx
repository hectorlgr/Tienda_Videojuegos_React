import { Link } from 'react-router-dom'
import BrandLogo from '../common/BrandLogo'
import TopBar from '../common/TopBar'

export default function AdminHeader() {
  return (
    <header>
      <TopBar />
      <div id="header">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
          <BrandLogo />
          <p className="admin-header-label mb-0">Panel administrativo</p>
          <Link className="admin-store-link" to="/"><i className="fa fa-arrow-left" aria-hidden="true" /> Volver a la tienda</Link>
        </div>
      </div>
    </header>
  )
}
