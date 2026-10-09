const CART_STORAGE_KEY = 'carritoTiendaJuegos'

export function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY))
    if (!Array.isArray(stored)) return []

    const quantities = new Map()
    for (const item of stored) {
      if (
        !Number.isSafeInteger(item?.productoId) || item.productoId <= 0 ||
        !Number.isSafeInteger(item?.cantidad) || item.cantidad <= 0
      ) continue

      const quantity = (quantities.get(item.productoId) ?? 0) + item.cantidad
      if (Number.isSafeInteger(quantity)) quantities.set(item.productoId, quantity)
    }

    return Array.from(quantities, ([productoId, cantidad]) => ({ productoId, cantidad }))
  } catch {
    // El carrito sigue disponible en memoria si el almacenamiento no es accesible.
    return []
  }
}

export function persistCart(items) {
  try {
    const serialized = JSON.stringify(items)
    const previous = localStorage.getItem(CART_STORAGE_KEY)
    if (previous === serialized || (previous === null && items.length === 0)) return
    localStorage.setItem(CART_STORAGE_KEY, serialized)
  } catch {
    // Un bloqueo o falta de espacio no debe impedir usar el carrito en memoria.
  }
}
