export function reconcileCart(items, inventory) {
  const stockByProduct = new Map(inventory.map(record => [record.productoId, record.stock]))
  let changed = false
  const reconciled = items.flatMap(item => {
    const stock = stockByProduct.get(item.productoId) ?? 0
    if (stock === 0) {
      changed = true
      return []
    }
    if (item.cantidad > stock && stock > 0) {
      changed = true
      return [{ ...item, cantidad: stock }]
    }
    return [item]
  })

  return changed ? reconciled : items
}
