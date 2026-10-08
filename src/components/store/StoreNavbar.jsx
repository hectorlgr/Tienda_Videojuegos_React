import Navigation from '../common/Navigation'

const links = [
  { to: '/', text: 'Inicio', end: true },
  { to: '/productos', text: 'Productos' },
  { to: '/criticas', text: 'Críticas' },
  { to: '/contacto', text: 'Contacto' },
]

export default function StoreNavbar() {
  return <Navigation id="store-navigation" label="Navegación principal" links={links} />
}
