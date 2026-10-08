import { Link } from 'react-router-dom'

export default function TopBar({ showAccount = false }) {
  return (
    <div id="top-header">
      <div className="container d-flex flex-wrap justify-content-between gap-2">
        <ul className="header-links">
          <li><a href="tel:+56912345678"><i className="fa fa-phone" aria-hidden="true" /> +56 9 1234 5678</a></li>
          <li><a href="mailto:contacto@checkpointstore.cl"><i className="fa fa-envelope-o" aria-hidden="true" /> contacto@CheckPointStore.cl</a></li>
        </ul>
        {showAccount && (
          <ul className="header-links">
            <li><Link to="/login"><i className="fa fa-user-o" aria-hidden="true" /> Mi cuenta</Link></li>
          </ul>
        )}
      </div>
    </div>
  )
}
