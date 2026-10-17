export function isRecordCollection(value) {
  return Array.isArray(value) && value.every(record => (
    record !== null && typeof record === 'object' && !Array.isArray(record)
  ))
}

// Igual que en Stock: un producto sin registro de inventario cuenta como agotado.
export function countSoldOutProducts(products, inventory) {
  const stockByProductId = new Map(inventory.map(record => [record.productoId, record.stock]))
  return products.filter(product => (stockByProductId.get(product.id) ?? 0) <= 0).length
}
