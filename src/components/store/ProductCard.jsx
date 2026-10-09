import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
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
  const { addItem } = useCart()
  const [status, setStatus] = useState('idle')
  const pending = useRef(false)
  const mounted = useRef(false)
  const available = product.stock > 0
  const productUrl = `/productos/${product.id}`

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  async function handleAdd() {
    if (!available || pending.current) return
    pending.current = true
    setStatus('adding')
    try {
      await addItem(product.id, 1)
      if (mounted.current) setStatus('idle')
    } catch {
      if (mounted.current) setStatus('error')
    } finally {
      pending.current = false
    }
  }

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
        <button
          className="add-to-cart-btn"
          type="button"
          disabled={!available || status === 'adding'}
          aria-label={`Agregar ${product.nombre} al carrito`}
          aria-busy={status === 'adding'}
          onClick={handleAdd}
        >
          <i className="fa fa-shopping-cart" aria-hidden="true" />{' '}
          {status === 'adding' ? 'Agregando…' : 'Añadir al carrito'}
        </button>
        {status === 'error' && (
          <p className="catalog-cart-error" role="alert">
            No fue posible agregar {product.nombre}. Inténtalo nuevamente.
          </p>
        )}
      </div>
    </article>
  )
}
