import { assertNumericId } from '../utils/ids.js'
import { getJson, postJson, HttpError } from './httpClient.js'

const PRODUCT_FIELDS = [
  'codigo', 'nombre', 'categoria', 'ecosistema', 'enOferta', 'precio', 'imagen', 'imagenes',
  'descripcionCorta', 'descripcionLarga', 'formato', 'plataforma',
  'compatibilidad', 'franquicia',
]

export class ProductNotFoundError extends HttpError {
  constructor(productId) {
    super(`No existe el producto con ID ${productId}.`, 404)
    this.name = 'ProductNotFoundError'
  }
}

export function getProducts() {
  return getJson('productos')
}

export async function findProductByCode(code) {
  if (typeof code !== 'string' || code.trim() === '') {
    throw new TypeError('El código debe ser un string no vacío.')
  }

  const normalizedCode = code.trim().toUpperCase()
  const products = await getJson('productos', { codigo: normalizedCode })

  return products[0] ?? null
}

export function createProduct(productData) {
  const payload = Object.fromEntries(
    PRODUCT_FIELDS.filter(field => Object.hasOwn(productData, field))
      .map(field => [field, productData[field]]),
  )

  return postJson('productos', payload)
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
