import { useState } from 'react'
import { Link } from 'react-router-dom'
import ShippingDestination from '../components/store/ShippingDestination'
import { SHIPPING_REGIONS } from '../config/shippingRegions'
import { useCartDetails } from '../hooks/useCartDetails'
import { calculateCartTotal, calculateLineSubtotal, calculateProductsSubtotal, isValidPrice } from '../utils/cartCalculations'
import { formatCLP } from '../utils/currency'

const deliveryFields = [
  { name: 'nombre', label: 'Nombre' },
  { name: 'apellidos', label: 'Apellidos' },
  { name: 'correo', label: 'Correo', type: 'email' },
  { name: 'direccion', label: 'Dirección' },
]

export default function CheckoutPage() {
  const { lines, loading, error } = useCartDetails()
  const [delivery, setDelivery] = useState({
    nombre: '', apellidos: '', correo: '', direccion: '', regionId: '', comuna: '',
  })
  const region = SHIPPING_REGIONS.find(option => option.id === delivery.regionId)
  const shippingCost = region?.costoEnvio ?? null
  const subtotal = !loading && !error ? calculateProductsSubtotal(lines) : null
  const total = calculateCartTotal(subtotal, shippingCost)

  function changeRegion(regionId) {
    const nextRegion = SHIPPING_REGIONS.find(option => option.id === regionId)
    setDelivery(current => ({
      ...current,
      regionId,
      comuna: nextRegion?.comunas.includes(current.comuna) ? current.comuna : '',
    }))
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
                  <div className="row g-3">
                    {deliveryFields.map(({ name, label, type = 'text' }) => (
                      <div className="col-12 col-md-6" key={name}>
                        <label className="form-label" htmlFor={`checkout-${name}`}>{label}</label>
                        <input
                          id={`checkout-${name}`}
                          name={name}
                          type={type}
                          className="form-control"
                          value={delivery[name]}
                          onChange={event => setDelivery(current => ({ ...current, [name]: event.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                  <ShippingDestination
                    regionId={delivery.regionId}
                    comuna={delivery.comuna}
                    onRegionChange={changeRegion}
                    onComunaChange={comuna => setDelivery(current => ({ ...current, comuna }))}
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
