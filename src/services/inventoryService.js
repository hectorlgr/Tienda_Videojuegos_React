import { assertNumericId } from '../utils/ids.js'
import { getJson, postJson, patchJson, HttpError } from './httpClient.js'

export class InventoryNotFoundError extends Error {
  constructor(id, { by = 'product' } = {}) {
    super(by === 'inventory'
      ? `No existe el registro de inventario con ID ${id}.`
      : `No existe inventario para el producto con ID ${id}.`)
    this.name = 'InventoryNotFoundError'
  }
}

export function getInventory() {
  return getJson('inventario')
}

export async function createInventory(inventoryData) {
  const { productoId, stock, stockCritico } = inventoryData
  assertNumericId(productoId)
  if (!Number.isSafeInteger(stock) || stock < 0) {
    throw new TypeError('El stock debe ser un número entero seguro mayor o igual a 0.')
  }
  if (stockCritico !== null && (!Number.isSafeInteger(stockCritico) || stockCritico < 0)) {
    throw new TypeError('El stock crítico debe ser null o un número entero seguro mayor o igual a 0.')
  }

  return postJson('inventario', { productoId, stock, stockCritico })
}

export async function getInventoryByProductId(productId) {
  assertNumericId(productId)

  const records = await getJson('inventario', { productoId: productId })

  if (records.length === 0) {
    throw new InventoryNotFoundError(productId)
  }

  return records[0]
}

export async function updateInventoryStock(inventoryId, stock) {
  assertNumericId(inventoryId)
  if (!Number.isSafeInteger(stock) || stock < 0) {
    throw new TypeError('El stock debe ser un número entero seguro mayor o igual a 0.')
  }

  try {
    return await patchJson(`inventario/${inventoryId}`, { stock })
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      throw new InventoryNotFoundError(inventoryId, { by: 'inventory' })
    }
    throw error
  }
}
