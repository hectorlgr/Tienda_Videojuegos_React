import { Link } from 'react-router-dom'

const categories = [
  ['accesorio', 'Accesorios'],
  ['consola', 'Consolas'],
  ['juego', 'Juegos'],
  ['figura', 'Figuras'],
]

const paymentIcons = [
  ['fa-cc-visa', 'Visa'],
  ['fa-credit-card', 'Tarjetas'],
  ['fa-cc-paypal', 'PayPal'],
  ['fa-cc-mastercard', 'Mastercard'],
  ['fa-cc-discover', 'Discover'],
  ['fa-cc-amex', 'American Express'],
]

export default function StoreFooter() {
  return (
    <footer id="footer" className="store-footer">
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-lg-3">
              <div className="footer">
                <h2 className="footer-title">Sobre nosotros</h2>
                <p>CheckPoint Store es tu tienda especializada en consolas, juegos, accesorios y figuras. Todo lo que necesitas en un solo lugar.</p>
                <ul className="footer-links">
                  <li><a href="tel:+56912345678"><i className="fa fa-phone" aria-hidden="true" />+56 9 1234 5678</a></li>
                  <li><a href="mailto:CheckPointStore@gmail.com"><i className="fa fa-envelope-o" aria-hidden="true" />CheckPointStore@gmail.com</a></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="footer">
                <h2 className="footer-title">Categorías</h2>
                <ul className="footer-links">
                  <li><span>Ofertas</span></li>
                  {categories.map(([value, text]) => <li key={value}><Link to={`/productos?categoria=${value}`}>{text}</Link></li>)}
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="footer">
                <h2 className="footer-title">Información</h2>
                <ul className="footer-links">
                  <li><span>Sobre nosotros</span></li>
                  <li><Link to="/contacto">Contacta con nosotros</Link></li>
                  <li><span>Política de privacidad</span></li>
                  <li><span>Pedidos y devoluciones</span></li>
                  <li><span>Términos y condiciones</span></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="footer">
                <h2 className="footer-title">Servicio</h2>
                <ul className="footer-links">
                  <li><Link to="/login">Mi cuenta</Link></li>
                  <li><Link to="/registro">Registrarse</Link></li>
                  <li><Link to="/carrito">Ver carrito</Link></li>
                  <li><span>Rastrear mi pedido</span></li>
                  <li><span>Ayuda</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="bottom-footer" className="section">
        <div className="container text-center">
          <ul className="footer-payments" aria-label="Referencias visuales de medios de pago">
            {paymentIcons.map(([icon, label]) => <li key={icon}><i className={`fa ${icon}`} aria-hidden="true" /><span className="visually-hidden">{label}</span></li>)}
          </ul>
          <small className="copyright">Copyright © {new Date().getFullYear()} CheckPoint Store — Proyecto DuocUC</small>
        </div>
      </div>
    </footer>
  )
}
