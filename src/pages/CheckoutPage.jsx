import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ShippingDestination from '../components/store/ShippingDestination'
import { SHIPPING_REGIONS } from '../config/shippingRegions'
import { useCartDetails } from '../hooks/useCartDetails'
import { useAuth } from '../hooks/useAuth'
import { initialCheckoutDelivery, normalizeCheckoutDelivery, validateCheckout } from '../utils/checkoutValidation'
import { calculateCartTotal, calculateLineSubtotal, calculateProductsSubtotal, isValidPrice } from '../utils/cartCalculations'
import { formatCLP } from '../utils/currency'

const deliveryFields = [
  { name: 'nombre', label: 'Nombre' },
  { name: 'apellidos', label: 'Apellidos' },
  { name: 'correo', label: 'Correo', type: 'email' },
  { name: 'direccion', label: 'Dirección' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, loading, error } = useCartDetails()
  const { user } = useAuth()
  const [delivery, setDelivery] = useState(() => initialCheckoutDelivery(user))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const region = SHIPPING_REGIONS.find(option => option.id === delivery.regionId)
  const shippingCost = region?.costoEnvio ?? null
  const subtotal = !loading && !error ? calculateProductsSubtotal(lines) : null
  const total = calculateCartTotal(subtotal, shippingCost)

  function changeDelivery(next) {
    setDelivery(next)
    if (submitted) setErrors(validateCheckout(next))
  }

  function validatePayment(destination) {
    const normalized = normalizeCheckoutDelivery(delivery)
    setDelivery(normalized)
    setSubmitted(true)
    const nextErrors = validateCheckout(normalized)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) navigate(destination)
  }

  function changeRegion(regionId) {
    const nextRegion = SHIPPING_REGIONS.find(option => option.id === regionId)
    changeDelivery({
      ...delivery,
      regionId,
      comuna: nextRegion?.comunas.includes(delivery.comuna) ? delivery.comuna : '',
    })
  }

  return (
    <section className="section checkout-page" aria-labelledby="checkout-title">
      <title>Checkout — CheckPoint Store</title>
      <div className="container">
        <h1 id="checkout-title" className="mb-4">Checkout</h1>
        <div aria-busy={loading}>
          {loading ? (
            <p className="catalog-state" role="status">Cargando tu compra…</p>
          ) : error ? (
            <p className="catalog-state" role="alert">No pudimos cargar los productos de tu carrito. Inténtalo más tarde.</p>
          ) : lines.length === 0 ? (
            <p className="catalog-state" role="status">Tu carrito está vacío.</p>
          ) : (
            <div className="row g-4 align-items-start">
              <div className="col-12 col-lg-7">
                <section className="card shadow-sm p-3 p-md-4" aria-labelledby="delivery-title">
                  <h2 id="delivery-title" className="fs-4 mb-3">Datos de entrega</h2>
                  <div role="alert">
                    {submitted && Object.keys(errors).length > 0 && (
                      <p className="alert alert-danger">Revisa los campos indicados.</p>
                    )}
                  </div>
                  <div className="row g-3">
                    {deliveryFields.map(({ name, label, type = 'text' }) => (
                      <div className="col-12 col-md-6" key={name}>
                        <label className="form-label" htmlFor={`checkout-${name}`}>{label}</label>
                        <input
                          id={`checkout-${name}`}
                          name={name}
                          type={type}
                          className={`form-control${errors[name] ? ' is-invalid' : ''}`}
                          aria-invalid={errors[name] ? true : undefined}
                          aria-describedby={errors[name] ? `checkout-${name}-error` : undefined}
                          value={delivery[name]}
                          onChange={event => changeDelivery({ ...delivery, [name]: event.target.value })}
                        />
                        {errors[name] && <div id={`checkout-${name}-error`} className="invalid-feedback">{errors[name]}</div>}
                      </div>
                    ))}
                  </div>
                  <ShippingDestination
                    regionId={delivery.regionId}
                    comuna={delivery.comuna}
                    onRegionChange={changeRegion}
                    onComunaChange={comuna => changeDelivery({ ...delivery, comuna })}
                    errors={errors}
                  />
                </section>
              </div>
              <div className="col-12 col-lg-5">
                <section className="card shadow-sm p-3 p-md-4 text-break" aria-labelledby="summary-title">
                  <h2 id="summary-title" className="fs-4 mb-3">Resumen de compra</h2>
                  <ul className="list-unstyled mb-0" aria-label="Productos de la compra">
                    {lines.map(line => {
                      const lineSubtotal = calculateLineSubtotal(line)
                      return (
                        <li key={line.productoId} className="border-bottom pb-3 mb-3">
                          <h3 className="fs-6">{line.product?.nombre ?? 'Producto no disponible'}</h3>
                          <p className="mb-1">Cantidad: {line.cantidad}</p>
                          <p className="mb-1">Precio unitario: {isValidPrice(line.product?.precio) ? formatCLP(line.product.precio) : 'No disponible'}</p>
                          <p className="mb-0 fw-semibold">Subtotal: {lineSubtotal !== null ? formatCLP(lineSubtotal) : 'No disponible'}</p>
                        </li>
                      )
                    })}
                  </ul>
                  <dl className="mb-0" aria-live="polite">
                    <div className="d-flex flex-wrap justify-content-between gap-2">
                      <dt>Subtotal</dt>
                      <dd>{subtotal !== null ? formatCLP(subtotal) : 'No disponible'}</dd>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between gap-2">
                      <dt>Envío</dt>
                      <dd>{shippingCost !== null ? formatCLP(shippingCost) : 'Pendiente de seleccionar región'}</dd>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between gap-2 border-top pt-3 fw-bold">
                      <dt>Total</dt>
                      <dd>{total !== null ? formatCLP(total) : 'Pendiente'}</dd>
                    </div>
                  </dl>
                  <div className="d-grid gap-2 mt-3">
                    <button type="button" className="btn btn-success" onClick={() => validatePayment('/compra-exitosa')}>Simular pago válido</button>
                    <button type="button" className="btn btn-outline-danger" onClick={() => validatePayment('/compra-rechazada')}>Simular pago inválido</button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
        <Link className="btn btn-outline-dark mt-3" to="/carrito">Volver al carrito</Link>
      </div>
    </section>
  )
}
