import Navigation from '../common/Navigation'

const links = [
  { to: '/', text: 'Inicio', end: true },
  { to: '/productos', text: 'Productos' },
  { to: '/categorias', text: 'Categorías' },
  { to: '/ofertas', text: 'Ofertas' },
  { to: '/nosotros', text: 'Nosotros' },
  { to: '/criticas', text: 'Críticas' },
  { to: '/contacto', text: 'Contacto' },
]

export default function StoreNavbar() {
  return <Navigation id="store-navigation" label="Navegación principal" links={links} />
}
