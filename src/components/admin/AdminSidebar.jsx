import { useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Los enlaces reflejan los mismos permisos que aplican los guards de AppRouter.
const sections = [
  {
    title: 'General',
    links: [{ to: '/admin', text: 'Dashboard', icon: 'fa-tachometer', end: true, roles: ['administrador'] }],
  },
  {
    title: 'Ventas',
    links: [{ to: '/admin/ordenes', text: 'Órdenes', icon: 'fa-list-alt', roles: ['vendedor', 'administrador'] }],
  },
  {
    title: 'Productos',
    links: [
      // end evita que el listado quede activo también en Nuevo producto.
      { to: '/admin/productos', text: 'Listado', icon: 'fa-th-list', end: true, roles: ['administrador'] },
      { to: '/admin/stock', text: 'Stock', icon: 'fa-cubes', roles: ['administrador'] },
      { to: '/admin/productos/nuevo', text: 'Nuevo producto', icon: 'fa-plus-square', roles: ['administrador'] },
    ],
  },
  {
    title: 'Usuarios',
    // Sin end: el enlace sigue activo en el detalle /admin/usuarios/:id.
    links: [{ to: '/admin/usuarios', text: 'Listado de usuarios', icon: 'fa-users', roles: ['administrador'] }],
  },
  {
    title: 'Reportes',
    links: [{ to: '/admin/reportes', text: 'Estadísticas', icon: 'fa-bar-chart', roles: ['administrador'] }],
  },
]

export default function AdminSidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const [openLocation, setOpenLocation] = useState(null)
  const isOpen = openLocation === location
  const toggleRef = useRef(null)
  const visibleSections = sections
    .map(section => ({ ...section, links: section.links.filter(({ roles }) => roles.includes(user?.rol)) }))
    .filter(section => section.links.length > 0)

  return (
    <aside className="admin-sidebar">
      <nav aria-label="Navegación administrativa">
        <button
          ref={toggleRef}
          className="admin-sidebar-toggle"
          type="button"
          aria-controls="admin-sidebar-menu"
          aria-expanded={isOpen}
          onClick={() => setOpenLocation(isOpen ? null : location)}
        >
          <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
          {isOpen ? 'Cerrar menú' : 'Menú del panel'}
        </button>
        <div
          id="admin-sidebar-menu"
          className={`admin-sidebar-menu${isOpen ? ' is-open' : ''}`}
          onKeyDown={(event) => {
            if (event.key !== 'Escape' || !isOpen) return
            // El foco no debe quedar en un enlace que se oculta.
            setOpenLocation(null)
            toggleRef.current?.focus()
          }}
        >
          {visibleSections.map(({ title, links }) => (
            <div className="admin-sidebar-section" key={title}>
              <p className="admin-sidebar-title" id={`admin-sidebar-${title}`}>{title}</p>
              <ul aria-labelledby={`admin-sidebar-${title}`}>
                {links.map(({ to, text, icon, end }) => (
                  <li key={to}>
                    <NavLink to={to} end={end} onClick={() => setOpenLocation(null)}>
                      <i className={`fa ${icon} fa-fw`} aria-hidden="true" /> {text}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  )
}
