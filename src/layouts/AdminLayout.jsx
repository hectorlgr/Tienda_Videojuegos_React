import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminNavbar from '../components/admin/AdminNavbar'
import AdminFooter from '../components/admin/AdminFooter'

export default function AdminLayout() {
  return (
    <div className="app-shell admin-layout">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <AdminHeader />
      <AdminNavbar />
      <main id="main-content" tabIndex={-1}><Outlet /></main>
      <AdminFooter />
    </div>
  )
}
