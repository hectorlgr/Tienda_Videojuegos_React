import { createProduct } from './productService'
import { createInventory } from './inventoryService'

export class ProductInventoryCreationError extends Error {
  constructor(createdProduct, cause) {
    super('El producto fue creado, pero no fue posible crear su inventario inicial.', { cause })
    this.name = 'ProductInventoryCreationError'
    this.createdProduct = createdProduct
  }
}

export async function createProductWithInventory(productData, inventoryData) {
  const product = await createProduct(productData)

  try {
    const inventory = await createInventory({
      productoId: product.id,
      stock: inventoryData.stock,
      stockCritico: inventoryData.stockCritico,
    })

    return { product, inventory }
  } catch (cause) {
    // La creación parcial se comunica al llamador; el producto se conserva.
    throw new ProductInventoryCreationError(product, cause)
  }
}
