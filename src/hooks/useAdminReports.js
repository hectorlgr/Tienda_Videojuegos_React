import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import { getInventory } from '../services/inventoryService'
import { getOrders } from '../services/orderService'
import { getUsers } from '../services/userService'
import { countSoldOutProducts } from '../utils/adminMetrics'

// Calcula las estadísticas de Reportes a partir de los datos de JSON Server.
function calculateReport(products, inventory, orders, users) {
  // Suma el stock de todos los registros de inventario.
  const stockTotal = inventory.reduce((total, record) => total + record.stock, 0)

  // Suma el monto de todas las órdenes.
  const ordersTotal = orders.reduce((total, order) => total + order.montoTotal, 0)

  // Cuenta cuántas órdenes hay en cada estado y cuánto suman.
  // Resultado: { Pendiente: { cantidad: 2, monto: 1370000 }, ... }
  const ordersByStatus = {}
  for (const order of orders) {
    if (!ordersByStatus[order.estado]) {
      ordersByStatus[order.estado] = { cantidad: 0, monto: 0 }
    }
    ordersByStatus[order.estado].cantidad += 1
    ordersByStatus[order.estado].monto += order.montoTotal
  }

  return {
    totalProducts: products.length,
    totalUsers: users.length,
    totalOrders: orders.length,
    stockTotal,
    soldOut: countSoldOutProducts(products, inventory),
    ordersTotal,
    ordersByStatus,
  }
}

export function useAdminReports() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Evita actualizar el estado si el usuario sale de la página antes de terminar.
    let active = true

    async function loadReport() {
      try {
        // Pide las cuatro colecciones al mismo tiempo.
        const [products, inventory, orders, users] = await Promise.all([
          getProducts(),
          getInventory(),
          getOrders(),
          getUsers(),
        ])
        // Los usuarios solo se cuentan; sus datos (incluida la contraseña) no se guardan.
        if (active) setReport(calculateReport(products, inventory, orders, users))
      } catch {
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadReport()
    return () => { active = false }
  }, [])

  return { report, loading, error }
}
