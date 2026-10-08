import { assertNumericId } from '../utils/ids.js'
import { getJson } from './httpClient.js'

export class InventoryNotFoundError extends Error {
  constructor(productId) {
    super(`No existe inventario para el producto con ID ${productId}.`)
    this.name = 'InventoryNotFoundError'
  }
}

export function getInventory() {
  return getJson('inventario')
}

export async function getInventoryByProductId(productId) {
  assertNumericId(productId)

  const records = await getJson('inventario', { productoId: productId })

  if (records.length === 0) {
    throw new InventoryNotFoundError(productId)
  }

  return records[0]
}
