import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import { getInventory } from '../services/inventoryService'

function isRecordCollection(value) {
  return Array.isArray(value) && value.every(record => (
    record !== null && typeof record === 'object' && !Array.isArray(record)
  ))
}

export function useAdminStock() {
  const [result, setResult] = useState({ rows: [], loading: true, error: null })

  useEffect(() => {
    let active = true

    async function loadStock() {
      try {
        const [products, inventory] = await Promise.all([getProducts(), getInventory()])
        if (!active) return

        if (!isRecordCollection(products) || !isRecordCollection(inventory)) {
          throw new TypeError('Respuesta de stock inválida.')
        }

        const inventoryByProductId = new Map(
          inventory.map(record => [record.productoId, record]),
        )
        const rows = products.map(product => {
          const record = inventoryByProductId.get(product.id)

          // El ID del registro de inventario no es el ID del producto relacionado.
          return {
            productoId: product.id,
            inventoryId: record?.id ?? null,
            product,
            stock: record?.stock ?? 0,
            stockCritico: record?.stockCritico ?? null,
          }
        })

        setResult({ rows, loading: false, error: null })
      } catch (error) {
        if (active) setResult({ rows: [], loading: false, error })
      }
    }

    loadStock()
    return () => { active = false }
  }, [])

  function updateRowStock(inventoryId, updatedInventory) {
    setResult(current => ({
      ...current,
      rows: current.rows.map(row => row.inventoryId === inventoryId
        ? { ...row, stock: updatedInventory.stock }
        : row),
    }))
  }

  return { ...result, updateRowStock }
}
