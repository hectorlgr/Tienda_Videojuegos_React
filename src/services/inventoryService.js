import { assertNumericId } from '../utils/ids.js'
import { getJson } from './httpClient.js'

export function getInventory() {
  return getJson('inventario')
}

export async function getInventoryByProductId(productId) {
  assertNumericId(productId)

  const records = await getJson('inventario', { productoId: productId })

  if (records.length === 0) {
    throw new Error(`No existe inventario para el producto con ID ${productId}.`)
  }

  return records[0]
}
