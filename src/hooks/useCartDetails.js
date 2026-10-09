import { useEffect, useState } from 'react'
import { useCart } from './useCart'
import { getProducts } from '../services/productService'
import { getInventory } from '../services/inventoryService'

function initialData(hasItems) {
  return { hasItems, products: new Map(), inventory: new Map(), loading: hasItems, error: null }
}

export function useCartDetails() {
  const { items } = useCart()
  const hasItems = items.length > 0
  const [data, setData] = useState(() => initialData(hasItems))

  useEffect(() => {
    if (!hasItems) return
    let active = true

    async function loadData() {
      try {
        const [products, inventory] = await Promise.all([getProducts(), getInventory()])
        if (!active) return
        setData({
          hasItems: true,
          products: new Map(products.map(product => [product.id, product])),
          inventory: new Map(inventory.map(record => [record.productoId, record])),
          loading: false,
          error: null,
        })
      } catch (error) {
        if (!active) return
        setData({ ...initialData(true), loading: false, error })
      }
    }

    loadData()
    return () => { active = false }
  }, [hasItems])

  // Vaciar y volver a llenar inicia una carga nueva, sin conservar datos o errores anteriores.
  if (data.hasItems !== hasItems) {
    setData(initialData(hasItems))
    return { lines: [], loading: hasItems, error: null }
  }

  if (!hasItems || data.loading || data.error) {
    return { lines: [], loading: data.loading, error: data.error }
  }

  // Las cantidades y el orden siempre proceden del Context, nunca de una copia remota.
  const lines = items.map(({ productoId, cantidad }) => {
    const product = data.products.get(productoId) ?? null
    const inventory = product ? data.inventory.get(productoId) : null
    return {
      productoId,
      cantidad,
      product,
      stock: inventory?.stock ?? 0,
      stockCritico: inventory?.stockCritico ?? null,
    }
  })

  return { lines, loading: false, error: null }
}
