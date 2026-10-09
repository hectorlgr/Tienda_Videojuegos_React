import { useEffect, useRef, useState } from 'react'
import { CartContext } from './CartContext'
import { assertNumericId } from '../utils/ids'
import { persistCart, readCart } from '../utils/cartStorage'
import { getInventory, getInventoryByProductId, InventoryNotFoundError } from '../services/inventoryService'
import { reconcileCart } from '../utils/reconcileCart'

function assertQuantity(quantity, allowRemoval = false) {
  if (!Number.isSafeInteger(quantity) || (!allowRemoval && quantity <= 0)) {
    throw new TypeError(allowRemoval
      ? 'La cantidad debe ser un número entero seguro.'
      : 'La cantidad debe ser un número entero positivo seguro.')
  }
}

export default function CartProvider({ children }) {
  const [restoredItems] = useState(readCart)
  const [items, setItems] = useState(restoredItems)
  const pendingOperations = useRef(new Map())

  useEffect(() => {
    const pending = pendingOperations.current
    return () => {
      pending.forEach(queue => { queue.active = false })
      pending.clear()
    }
  }, [])

  useEffect(() => {
    if (restoredItems.length === 0) return
    let active = true

    async function reconcileRestoredItems() {
      try {
        const inventory = await getInventory()
        if (!active) return
        const reconciled = reconcileCart(restoredItems, inventory)
        if (reconciled === restoredItems) return

        // Esta fase corrige solo la restauración, nunca operaciones posteriores.
        setItems(current => current === restoredItems ? reconciled : current)
      } catch {
        // Un fallo de inventario no significa que los productos estén agotados.
      }
    }

    reconcileRestoredItems()
    return () => { active = false }
  }, [restoredItems])

  useEffect(() => {
    persistCart(items)
  }, [items])

  // Cada producto mantiene el orden de sus operaciones; productos distintos no se bloquean.
  async function withCurrentStock(productId, updateItems) {
    const pending = pendingOperations.current
    let queue = pending.get(productId)
    if (!queue) {
      queue = { active: true, tail: Promise.resolve() }
      pending.set(productId, queue)
    }

    const operation = queue.tail.catch(() => {}).then(async () => {
      if (!queue.active) return
      let stock
      try {
        const inventory = await getInventoryByProductId(productId)
        stock = inventory.stock
        if (!Number.isSafeInteger(stock) || stock < 0) {
          throw new Error(`El inventario del producto ${productId} contiene un stock inválido.`)
        }
      } catch (error) {
        if (!(error instanceof InventoryNotFoundError)) throw error
        stock = 0
      }
      if (!queue.active) return
      setItems(current => queue.active ? updateItems(current, stock) : current)
    })
    queue.tail = operation
    try {
      await operation
    } finally {
      if (pending.get(productId) === queue && queue.tail === operation) pending.delete(productId)
    }
  }

  // Promise<void>: rechaza validaciones/errores reales; no devuelve una cantidad anticipada.
  async function addItem(productId, quantity) {
    assertNumericId(productId)
    assertQuantity(quantity)
    await withCurrentStock(productId, (current, stock) => {
      const existing = current.find((item) => item.productoId === productId)
      if (stock === 0) return existing ? current.filter(item => item.productoId !== productId) : current
      if (!existing) return [...current, { productoId: productId, cantidad: Math.min(quantity, stock) }]
      // Limitar antes de sumar también evita desbordar el rango de enteros seguros.
      const nextQuantity = existing.cantidad >= stock
        ? stock
        : existing.cantidad + Math.min(quantity, stock - existing.cantidad)
      if (existing.cantidad === nextQuantity) return current
      return current.map((item) => item.productoId === productId
        ? { ...item, cantidad: nextQuantity }
        : item)
    })
  }

  function removeItem(productId) {
    assertNumericId(productId)
    const queue = pendingOperations.current.get(productId)
    if (queue) queue.active = false
    pendingOperations.current.delete(productId)
    setItems((current) => current.some((item) => item.productoId === productId)
      ? current.filter((item) => item.productoId !== productId)
      : current)
  }

  // Promise<void>; cantidad <= 0 elimina de inmediato, sin consultar inventario.
  async function setItemQuantity(productId, quantity) {
    assertNumericId(productId)
    assertQuantity(quantity, true)
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    await withCurrentStock(productId, (current, stock) => {
      const existing = current.find((item) => item.productoId === productId)
      if (!existing) return current
      if (stock === 0) return current.filter(item => item.productoId !== productId)
      const nextQuantity = Math.min(quantity, stock)
      if (existing.cantidad === nextQuantity) return current
      return current.map((item) => item.productoId === productId
        ? { ...item, cantidad: nextQuantity }
        : item)
    })
  }

  function clearCart() {
    pendingOperations.current.forEach(queue => { queue.active = false })
    pendingOperations.current.clear()
    setItems((current) => current.length === 0 ? current : [])
  }

  const totalItems = items.reduce((total, item) => total + item.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, addItem, setItemQuantity, removeItem, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}
