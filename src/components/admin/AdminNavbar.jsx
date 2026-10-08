import Navigation from '../common/Navigation'

const links = [
  { to: '/admin/ordenes', text: 'Órdenes' },
  { to: '/admin/stock', text: 'Stock' },
  { to: '/admin/productos/nuevo', text: 'Nuevo producto' },
]

export default function AdminNavbar() {
  return <Navigation id="admin-navigation" label="Navegación administrativa" links={links} />
}
