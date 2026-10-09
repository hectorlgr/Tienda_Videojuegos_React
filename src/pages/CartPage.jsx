import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SHIPPING_REGIONS } from '../config/shippingRegions'
import ImageWithFallback from '../components/common/ImageWithFallback'
import CartQuantityControl from '../components/store/CartQuantityControl'
import ShippingDestination from '../components/store/ShippingDestination'
import { useCartDetails } from '../hooks/useCartDetails'
import { useCart } from '../hooks/useCart'
import { publicAsset } from '../utils/assets'
import { formatCLP } from '../utils/currency'
import { calculateLineSubtotal, calculateProductsSubtotal, isValidPrice } from '../utils/cartCalculations'

function CartLine({ line }) {
  const { removeItem } = useCart()
  const { productoId, cantidad, product, stock } = line
  const subtotal = calculateLineSubtotal(line)
  const image = (
    <ImageWithFallback
      src={product?.imagen ? publicAsset(product.imagen) : undefined}
      alt={product ? product.nombre : 'Imagen no disponible'}
      className="cart-line-image"
    />
  )

  return (
    <li className="cart-line card shadow-sm">
      {product ? <Link to={`/productos/${productoId}`}>{image}</Link> : image}
      <h2 className="cart-line-name">
        {product ? <Link to={`/productos/${productoId}`}>{product.nombre}</Link> : 'Producto no disponible'}
      </h2>
      <dl className="cart-line-facts">
        <div>
          <dt>Precio unitario</dt>
          <dd>{isValidPrice(product?.precio) ? formatCLP(product.precio) : 'No disponible'}</dd>
        </div>
        <div className="cart-line-quantity">
          <dt className={product && stock > 0 ? 'visually-hidden' : undefined}>Cantidad</dt>
          <dd>
            {product && stock > 0 ? (
              <CartQuantityControl
                productoId={productoId}
                cantidad={cantidad}
                stock={stock}
                productName={product.nombre}
              />
            ) : cantidad}
          </dd>
        </div>
        <div>
          <dt>Disponibilidad</dt>
          <dd className={stock > 0 ? 'cart-stock-available' : 'cart-stock-empty'}>
            {stock > 0 ? `Disponible · ${stock} unidades` : 'Agotado'}
          </dd>
        </div>
        <div>
          <dt>Subtotal</dt>
          <dd>{subtotal !== null ? formatCLP(subtotal) : 'No disponible'}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="btn btn-outline-danger cart-line-remove"
        aria-label={`Eliminar ${product ? product.nombre : 'producto no disponible'} del carrito`}
        onClick={() => removeItem(productoId)}
      >
        <i className="fa fa-trash" aria-hidden="true" /> Eliminar
      </button>
    </li>
  )
}

export default function CartPage() {
  const { clearCart, items } = useCart()
  const { lines, loading, error } = useCartDetails()
  const [destination, setDestination] = useState({ regionId: '', comuna: '' })
  const selectedRegion = SHIPPING_REGIONS.find(region => region.id === destination.regionId)
  const shippingCost = selectedRegion?.costoEnvio ?? null
  const productsSubtotal = !loading && !error ? calculateProductsSubtotal(lines) : null

  // El destino es solo de interfaz y se reinicia al quedar vacío el carrito.
  if (items.length === 0 && (destination.regionId || destination.comuna)) {
    setDestination({ regionId: '', comuna: '' })
  }

  return (
    <>
      <title>Mi carrito de compras — CheckPoint Store</title>
      <nav id="breadcrumb" className="section" aria-label="Ruta de navegación">
        <div className="container">
          <ol className="breadcrumb-tree">
            <li><Link to="/">Inicio</Link></li>
            <li className="active" aria-current="page">Carrito</li>
          </ol>
        </div>
      </nav>
      <section className="section cart-page" aria-labelledby="cart-title">
        <div className="container">
          <h1 id="cart-title" className="mb-4">Mi carrito de compras</h1>
          <div aria-busy={loading}>
            {loading ? (
              <p className="catalog-state" role="status">Cargando tu carrito…</p>
            ) : error ? (
              <p className="catalog-state" role="alert">
                No pudimos cargar los productos de tu carrito. Inténtalo más tarde.
              </p>
            ) : lines.length === 0 ? (
              <p className="catalog-state" role="status">Tu carrito está vacío.</p>
            ) : (
              <>
                <ul className="cart-lines" aria-label="Productos del carrito">
                  {lines.map(line => <CartLine key={line.productoId} line={line} />)}
                </ul>
                <dl className="cart-products-subtotal">
                  <div>
                    <dt>Subtotal productos</dt>
                    <dd>{productsSubtotal !== null ? formatCLP(productsSubtotal) : 'No disponible'}</dd>
                  </div>
                  <div className="cart-shipping-cost">
                    <dt>Envío</dt>
                    <dd>{shippingCost !== null ? formatCLP(shippingCost) : 'Selecciona una región'}</dd>
                  </div>
                </dl>
                <ShippingDestination
                  regionId={destination.regionId}
                  comuna={destination.comuna}
                  onRegionChange={regionId => setDestination({ regionId, comuna: '' })}
                  onComunaChange={comuna => setDestination(current => ({ ...current, comuna }))}
                />
                <button type="button" className="btn btn-outline-danger cart-clear mt-3" onClick={clearCart}>
                  Vaciar carrito
                </button>
              </>
            )}
          </div>
          <Link className="btn btn-outline-dark mt-3" to="/productos">Ver productos</Link>
        </div>
      </section>
    </>
  )
}
