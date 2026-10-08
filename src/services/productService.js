import { assertNumericId } from '../utils/ids.js'
import { getJson, HttpError } from './httpClient.js'

export function getProducts() {
  return getJson('productos')
}

export async function getProductById(id) {
  assertNumericId(id)

  try {
    return await getJson(`productos/${id}`)
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      throw new HttpError(`No existe el producto con ID ${id}.`, 404)
    }

    throw error
  }
}
