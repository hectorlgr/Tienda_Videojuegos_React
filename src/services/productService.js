import { assertNumericId } from '../utils/ids.js'
import { getJson, HttpError } from './httpClient.js'

export class ProductNotFoundError extends HttpError {
  constructor(productId) {
    super(`No existe el producto con ID ${productId}.`, 404)
    this.name = 'ProductNotFoundError'
  }
}

export function getProducts() {
  return getJson('productos')
}

export async function getProductById(id) {
  assertNumericId(id)

  try {
    return await getJson(`productos/${id}`)
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      throw new ProductNotFoundError(id)
    }

    throw error
  }
}
