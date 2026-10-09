import Navigation from '../common/Navigation'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/admin/ordenes', text: 'Órdenes', roles: ['vendedor', 'administrador'] },
  { to: '/admin/stock', text: 'Stock', roles: ['administrador'] },
  { to: '/admin/productos/nuevo', text: 'Nuevo producto', roles: ['administrador'] },
]

export default function AdminNavbar() {
  const { user } = useAuth()
  const visibleLinks = links.filter(({ roles }) => roles.includes(user?.rol))

  return <Navigation id="admin-navigation" label="Navegación administrativa" links={visibleLinks} />
}
