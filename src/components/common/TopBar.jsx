export default function TopBar({ children }) {
  return (
    <div id="top-header">
      <div className="container d-flex flex-wrap justify-content-between gap-2">
        <ul className="header-links">
          <li><a href="tel:+56912345678"><i className="fa fa-phone" aria-hidden="true" /> +56 9 1234 5678</a></li>
          <li><a href="mailto:contacto@checkpointstore.cl"><i className="fa fa-envelope-o" aria-hidden="true" /> contacto@CheckPointStore.cl</a></li>
        </ul>
        {children}
      </div>
    </div>
  )
}
