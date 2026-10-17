import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import { getInventory } from '../services/inventoryService'
import { getOrders } from '../services/orderService'
import { getUsers } from '../services/userService'
import { countSoldOutProducts, isRecordCollection } from '../utils/adminMetrics'

async function loadCollection(request) {
  const data = await request()
  if (!isRecordCollection(data)) throw new TypeError('Respuesta de colección inválida.')
  return data
}

// Cada métrica es null si su fuente falló; una colección caída no oculta las demás.
export function useAdminDashboard() {
  const [result, setResult] = useState({ metrics: null, loading: true, partialError: false })

  useEffect(() => {
    let active = true

    async function loadMetrics() {
      const [products, inventory, orders, users] = (await Promise.allSettled([
        loadCollection(getProducts),
        loadCollection(getInventory),
        loadCollection(getOrders),
        loadCollection(getUsers),
      ])).map(outcome => outcome.status === 'fulfilled' ? outcome.value : null)
      if (!active) return

      // Solo se conservan conteos: los usuarios (con password) no se guardan en estado.
      const metrics = {
        products: products?.length ?? null,
        users: users?.length ?? null,
        orders: orders?.length ?? null,
        soldOut: products && inventory ? countSoldOutProducts(products, inventory) : null,
      }
      setResult({
        metrics,
        loading: false,
        partialError: [products, inventory, orders, users].includes(null),
      })
    }

    loadMetrics()
    return () => { active = false }
  }, [])

  return result
}
