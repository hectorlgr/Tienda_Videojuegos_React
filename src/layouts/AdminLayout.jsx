import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminFooter from '../components/admin/AdminFooter'

export default function AdminLayout() {
  return (
    <div className="app-shell admin-layout">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <AdminHeader />
      <div className="admin-body">
        <AdminSidebar />
        <main id="main-content" className="admin-main" tabIndex={-1}><Outlet /></main>
      </div>
      <AdminFooter />
    </div>
  )
}
