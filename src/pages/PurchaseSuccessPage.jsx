import { Link, useLocation } from 'react-router-dom'
import { isValidPrice } from '../utils/cartCalculations'
import { formatCLP } from '../utils/currency'

function isValidSummary(summary) {
  return summary != null &&
    Array.isArray(summary.products) && summary.products.length > 0 &&
    summary.products.every(product => (
      product != null &&
      typeof product.nombre === 'string' && product.nombre.trim() !== '' &&
      Number.isSafeInteger(product.cantidad) && product.cantidad > 0 &&
      isValidPrice(product.precioUnitario) && isValidPrice(product.subtotal)
    )) &&
    isValidPrice(summary.subtotal) && isValidPrice(summary.shippingCost) && isValidPrice(summary.total)
}

export default function PurchaseSuccessPage() {
  const { state } = useLocation()
  const summary = state?.purchaseSummary
  const hasSummary = isValidSummary(summary)
  return (
    <section className="section" aria-labelledby="purchase-success-title">
      <title>Compra exitosa — CheckPoint Store</title>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm p-3 p-md-5 text-center">
              {hasSummary ? (
                <>
                  <i className="fa fa-check-circle text-success fs-1 mb-3" aria-hidden="true" />
                  <h1 id="purchase-success-title" className="fs-3">Compra simulada realizada con éxito</h1>
                  <p className="mt-3">La simulación de pago se completó correctamente. Este es el resumen de tu compra.</p>
                  <section className="text-start text-break mt-3" aria-labelledby="purchase-summary-title">
                    <h2 id="purchase-summary-title" className="fs-4 mb-3">Resumen de productos</h2>
                    <ul className="list-unstyled mb-0">
                      {summary.products.map((product, index) => (
                        <li key={index} className="border-bottom pb-3 mb-3">
                          <h3 className="fs-6">{product.nombre}</h3>
                          <p className="mb-1">Precio unitario: {formatCLP(product.precioUnitario)}</p>
                          <p className="mb-1">Cantidad: {product.cantidad}</p>
                          <p className="mb-0 fw-semibold">Subtotal: {formatCLP(product.subtotal)}</p>
                        </li>
                      ))}
                    </ul>
                    <dl className="mb-0">
                      <div className="d-flex flex-wrap justify-content-between gap-2">
                        <dt>Subtotal</dt>
                        <dd>{formatCLP(summary.subtotal)}</dd>
                      </div>
                      <div className="d-flex flex-wrap justify-content-between gap-2">
                        <dt>Envío</dt>
                        <dd>{formatCLP(summary.shippingCost)}</dd>
                      </div>
                      <div className="d-flex flex-wrap justify-content-between gap-2 border-top pt-3 fw-bold fs-5">
                        <dt>Total pagado (simulado)</dt>
                        <dd>{formatCLP(summary.total)}</dd>
                      </div>
                    </dl>
                  </section>
                </>
              ) : (
                <>
                  <h1 id="purchase-success-title" className="fs-3">Resumen de compra no disponible</h1>
                  <p className="mt-3">No existe un resumen de compra disponible para mostrar.</p>
                  <div><Link className="btn btn-outline-dark" to="/carrito">Volver al carrito</Link></div>
                </>
              )}
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mt-3">
                <button type="button" className="btn btn-success">Enviar boleta por email</button>
                <button type="button" className="btn btn-outline-dark">Volver al inicio</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
