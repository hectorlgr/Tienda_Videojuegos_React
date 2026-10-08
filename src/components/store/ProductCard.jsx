import { Link } from 'react-router-dom'
import ImageWithFallback from '../common/ImageWithFallback'
import { publicAsset } from '../../utils/assets'
import { formatCLP } from '../../utils/currency'

const categoryLabels = {
  juego: 'Juego',
  consola: 'Consola',
  accesorio: 'Accesorio',
  figura: 'Figura',
}

export default function ProductCard({ product }) {
  const available = product.stock > 0
  const productUrl = `/productos/${product.id}`

  return (
    <article className="product catalog-product">
      <div className="product-img">
        <Link to={productUrl}>
          <ImageWithFallback
            src={product.imagen ? publicAsset(product.imagen) : undefined}
            alt={product.nombre}
          />
        </Link>
        {product.categoria === 'juego' && product.formato && (
          <div className="product-label">
            <span className="new">{product.formato === 'digital' ? 'Digital' : 'Físico'}</span>
          </div>
        )}
      </div>
      <div className="product-body">
        <p className="product-category">{categoryLabels[product.categoria] ?? product.categoria}</p>
        <h2 className="product-name"><Link to={productUrl}>{product.nombre}</Link></h2>
        <p className="product-price">{formatCLP(product.precio)}</p>
        <p className={`product-stock ${available ? 'is-available' : 'is-unavailable'}`}>
          {available ? 'Disponible' : 'Agotado'}
        </p>
      </div>
      <div className="add-to-cart">
        <button className="add-to-cart-btn" type="button" disabled title="Carrito no disponible todavía">
          <i className="fa fa-shopping-cart" aria-hidden="true" /> Añadir al carrito
        </button>
      </div>
    </article>
  )
}
