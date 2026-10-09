import { useEffect, useRef, useState } from 'react'
import { useCart } from '../../hooks/useCart'
import QuantitySelector from './QuantitySelector'

export default function CartQuantityControl({ productoId, cantidad, stock, productName }) {
  const { setItemQuantity } = useCart()
  const [status, setStatus] = useState('idle')
  const pending = useRef(false)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  async function updateQuantity(nextQuantity) {
    if (pending.current || stock <= 0 || nextQuantity === cantidad) return
    pending.current = true
    setStatus('pending')
    try {
      await setItemQuantity(productoId, nextQuantity)
      if (mounted.current) setStatus('idle')
    } catch {
      if (mounted.current) setStatus('error')
    } finally {
      pending.current = false
    }
  }

  return (
    <div className="cart-quantity-control" role="group" aria-label={`Cantidad de ${productName}`} aria-busy={status === 'pending'}>
      {/* Cambiar disabled resincroniza el borrador con cantidad, también tras un error. */}
      <QuantitySelector
        value={cantidad}
        min={1}
        max={stock}
        disabled={status === 'pending'}
        onChange={updateQuantity}
      />
      {status === 'error' && (
        <p className="cart-quantity-error" role="alert">
          No pudimos actualizar la cantidad. Inténtalo nuevamente.
        </p>
      )}
    </div>
  )
}
