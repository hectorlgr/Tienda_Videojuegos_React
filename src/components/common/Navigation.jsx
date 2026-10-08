import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export default function Navigation({ id, label, links }) {
  const location = useLocation()
  const [openLocation, setOpenLocation] = useState(null)
  const isOpen = openLocation === location

  return (
    <nav id="navigation" className="site-navigation" aria-label={label}>
      <div className="container">
        <button
          className="navigation-toggle"
          type="button"
          aria-controls={id}
          aria-expanded={isOpen}
          onClick={() => setOpenLocation(isOpen ? null : location)}
        >
          <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
          {isOpen ? 'Cerrar menú' : 'Menú'}
        </button>
        <ul
          id={id}
          className={`main-nav site-nav-list${isOpen ? ' is-open' : ''}`}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpenLocation(null)
          }}
        >
          {links.map(({ to, text, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} onClick={() => setOpenLocation(null)}>
                {text}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
