export function isValidPrice(price) {
  return typeof price === 'number' && Number.isFinite(price) && price >= 0
}

// null distingue un importe no disponible de un subtotal válido de $0.
export function calculateLineSubtotal(line) {
  const price = line?.product?.precio
  const quantity = line?.cantidad
  if (!isValidPrice(price) || !Number.isSafeInteger(quantity) || quantity <= 0) return null

  const subtotal = price * quantity
  return Number.isFinite(subtotal) ? subtotal : null
}

export function calculateProductsSubtotal(lines = []) {
  const subtotal = lines.reduce((sum, line) => sum + (calculateLineSubtotal(line) ?? 0), 0)
  return Number.isFinite(subtotal) ? subtotal : null
}
