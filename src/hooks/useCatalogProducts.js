import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService.js'
import { getInventory } from '../services/inventoryService.js'

export function useCatalogProducts() {
  const [catalog, setCatalog] = useState({
    products: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let active = true

    async function loadCatalog() {
      try {
        const [products, inventory] = await Promise.all([
          getProducts(),
          getInventory(),
        ])

        if (!active) return

        const inventoryByProductId = new Map(
          inventory.map(record => [record.productoId, record]),
        )
        const catalogProducts = products.map(product => {
          const record = inventoryByProductId.get(product.id)

          return {
            ...product,
            stock: record?.stock ?? 0,
            stockCritico: record?.stockCritico ?? null,
          }
        })

        setCatalog({ products: catalogProducts, loading: false, error: null })
      } catch (error) {
        if (!active) return

        setCatalog({ products: [], loading: false, error })
      }
    }

    loadCatalog()

    return () => {
      active = false
    }
  }, [])

  return catalog
}
