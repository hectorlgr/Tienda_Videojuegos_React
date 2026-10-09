import { useEffect, useState } from 'react'
import { CartContext } from './CartContext'
import { assertNumericId } from '../utils/ids'
import { persistCart, readCart } from '../utils/cartStorage'

function assertQuantity(quantity, allowRemoval = false) {
  if (!Number.isSafeInteger(quantity) || (!allowRemoval && quantity <= 0)) {
    throw new TypeError(allowRemoval
      ? 'La cantidad debe ser un número entero seguro.'
      : 'La cantidad debe ser un número entero positivo seguro.')
  }
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)

  useEffect(() => {
    persistCart(items)
  }, [items])

  function addItem(productId, quantity) {
    assertNumericId(productId)
    assertQuantity(quantity)
    setItems((current) => {
      const existing = current.find((item) => item.productoId === productId)
      if (!existing) return [...current, { productoId: productId, cantidad: quantity }]
      const nextQuantity = existing.cantidad + quantity
      // No almacenar cantidades que JavaScript no pueda representar con precisión.
      if (!Number.isSafeInteger(nextQuantity)) return current
      return current.map((item) => item.productoId === productId
        ? { ...item, cantidad: nextQuantity }
        : item)
    })
  }

  function removeItem(productId) {
    assertNumericId(productId)
    setItems((current) => current.some((item) => item.productoId === productId)
      ? current.filter((item) => item.productoId !== productId)
      : current)
  }

  function setItemQuantity(productId, quantity) {
    assertNumericId(productId)
    assertQuantity(quantity, true)
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((current) => {
      const existing = current.find((item) => item.productoId === productId)
      if (!existing || existing.cantidad === quantity) return current
      return current.map((item) => item.productoId === productId
        ? { ...item, cantidad: quantity }
        : item)
    })
  }

  function clearCart() {
    setItems((current) => current.length === 0 ? current : [])
  }

  const totalItems = items.reduce((total, item) => total + item.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, addItem, setItemQuantity, removeItem, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}
