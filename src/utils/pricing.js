// Precio válido: número finito mayor o igual a 0 (mismo criterio que el carrito).
function isValidPrice(price) {
  return typeof price === 'number' && Number.isFinite(price) && price >= 0
}

// Un producto tiene oferta válida si está marcado como enOferta
// y su precioOferta es un precio válido menor que el precio normal.
export function hasValidOffer(product) {
  return product?.enOferta === true &&
    isValidPrice(product.precioOferta) &&
    isValidPrice(product.precio) &&
    product.precioOferta < product.precio
}

// Precio que paga el cliente: el de oferta si existe, si no el normal.
// Lo usan la tarjeta, el detalle, el carrito y el checkout para que coincidan.
export function getEffectivePrice(product) {
  return hasValidOffer(product) ? product.precioOferta : product?.precio
}

// Porcentaje de descuento redondeado, por ejemplo 20 para mostrar "-20%".
export function getDiscountPercent(product) {
  if (!hasValidOffer(product)) return 0
  return Math.round((1 - product.precioOferta / product.precio) * 100)
}
