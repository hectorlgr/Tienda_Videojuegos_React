import { Link } from 'react-router-dom'
import ImageWithFallback from '../components/common/ImageWithFallback'
import { useCartDetails } from '../hooks/useCartDetails'
import { publicAsset } from '../utils/assets'
import { formatCLP } from '../utils/currency'

function CartLine({ line }) {
  const { productoId, cantidad, product, stock } = line
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
          <dd>{product ? formatCLP(product.precio) : 'No disponible'}</dd>
        </div>
        <div>
          <dt>Cantidad</dt>
          <dd>{cantidad}</dd>
        </div>
        <div>
          <dt>Disponibilidad</dt>
          <dd className={stock > 0 ? 'cart-stock-available' : 'cart-stock-empty'}>
            {stock > 0 ? `Disponible · ${stock} unidades` : 'Agotado'}
          </dd>
        </div>
      </dl>
    </li>
  )
}

export default function CartPage() {
  const { lines, loading, error } = useCartDetails()

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
              <ul className="cart-lines" aria-label="Productos del carrito">
                {lines.map(line => <CartLine key={line.productoId} line={line} />)}
              </ul>
            )}
          </div>
          <Link className="btn btn-outline-dark mt-3" to="/productos">Ver productos</Link>
        </div>
      </section>
    </>
  )
}
