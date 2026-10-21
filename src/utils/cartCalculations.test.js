import { describe, it, expect } from 'vitest'
import { getEffectivePrice, hasValidOffer } from './pricing.js'
import { calculateLineSubtotal, calculateProductsSubtotal, calculateCartTotal } from './cartCalculations.js'

describe('Cálculo de precios, subtotales y envío del carrito', () => {
  it('aplica el descuento activo y suma el envío en una compra válida', () => {
    const lines = [
      { product: { precio: 45000, precioOferta: 39990, enOferta: true }, cantidad: 2 },
      { product: { precio: 65000, enOferta: false }, cantidad: 1 },
    ]

    expect(getEffectivePrice(lines[0].product)).toBe(39990)
    const subtotal = calculateProductsSubtotal(lines)
    expect(subtotal).toBe(144980)
    expect(calculateCartTotal(subtotal, 3000)).toBe(147980)
  })

  it('conserva el precio normal cuando la oferta está desactivada', () => {
    const line = {
      product: { precio: 45000, precioOferta: 39990, enOferta: false },
      cantidad: 1,
    }

    expect(hasValidOffer(line.product)).toBe(false)
    expect(getEffectivePrice(line.product)).toBe(45000)
    const subtotal = calculateLineSubtotal(line)
    expect(subtotal).toBe(45000)
    expect(calculateCartTotal(subtotal, 7500)).toBe(52500)
  })

  it('devuelve null para cantidades no positivas o envío sin calcular', () => {
    const product = { precio: 45000, enOferta: false }

    expect(calculateLineSubtotal({ product, cantidad: 0 })).toBeNull()
    expect(calculateLineSubtotal({ product, cantidad: -1 })).toBeNull()
    expect(calculateCartTotal(45000, null)).toBeNull()
  })
})
