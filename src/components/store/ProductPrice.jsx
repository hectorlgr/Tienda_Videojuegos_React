import { formatCLP } from '../../utils/currency'
import { getEffectivePrice, hasValidOffer } from '../../utils/pricing'

// Muestra el precio a pagar; si hay oferta, también el precio normal tachado.
export default function ProductPrice({ product }) {
  if (!hasValidOffer(product)) {
    return <p className="product-price">{formatCLP(product.precio)}</p>
  }

  return (
    <p className="product-price">
      <span className="visually-hidden">Precio oferta: </span>
      {formatCLP(getEffectivePrice(product))}{' '}
      <del className="product-old-price">
        <span className="visually-hidden">Precio normal: </span>
        {formatCLP(product.precio)}
      </del>
    </p>
  )
}
