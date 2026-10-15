import { Link } from 'react-router-dom'

export default function PurchaseFailurePage() {
  return (
    <section className="section" aria-labelledby="purchase-failure-title">
      <title>Compra rechazada — CheckPoint Store</title>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm p-3 p-md-5 text-center">
              <i className="fa fa-times-circle text-danger fs-1 mb-3" aria-hidden="true" />
              <h1 id="purchase-failure-title" className="fs-3">No se pudo realizar el pago</h1>
              <p className="mt-3">La simulación de pago no se completó. Puedes volver al carrito; tus productos siguen allí.</p>
              <div className="mt-3">
                <Link className="btn btn-outline-dark" to="/carrito">Volver al carrito</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
