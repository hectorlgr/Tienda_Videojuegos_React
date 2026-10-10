import { useEffect, useState } from 'react'
import { getOrders } from '../../services/orderService'
import { formatCLP } from '../../utils/currency'

function displayValue(value) {
  return value == null || value === '' ? '—' : value
}

function statusClass(status) {
  switch (status) {
    case 'Pendiente': return 'text-bg-warning'
    case 'Pagado': return 'text-bg-info'
    case 'Enviado': return 'text-bg-secondary'
    case 'Entregado': return 'text-bg-success'
    default: return 'text-bg-light'
  }
}

export default function AdminOrdersPage() {
  const [result, setResult] = useState({ orders: [], loading: true, error: false })

  useEffect(() => {
    let active = true

    async function loadOrders() {
      try {
        const orders = await getOrders()
        if (!Array.isArray(orders) || orders.some(order => (
          order === null || typeof order !== 'object' || Array.isArray(order)
        ))) {
          throw new TypeError('Respuesta de órdenes inválida.')
        }
        if (active) setResult({ orders, loading: false, error: false })
      } catch {
        if (active) setResult({ orders: [], loading: false, error: true })
      }
    }

    loadOrders()

    return () => {
      active = false
    }
  }, [])

  const { orders, loading, error } = result

  return (
    <section className="section admin-orders-page" aria-labelledby="orders-title">
      <title>Órdenes de usuarios — CheckPoint Store</title>
      <div className="container">
        <h1 id="orders-title" className="text-center mb-4">Órdenes de usuarios</h1>
        {loading ? (
          <p className="catalog-state" role="status">Cargando órdenes...</p>
        ) : error ? (
          <p className="alert alert-danger" role="alert">No fue posible cargar las órdenes.</p>
        ) : orders.length === 0 ? (
          <p className="catalog-state" role="status">No hay órdenes disponibles.</p>
        ) : (
          <>
            <p id="orders-scroll-help" className="text-muted small">
              Si la tabla no cabe en pantalla, desplázala horizontalmente para ver todos los campos.
            </p>
            <div
              className="table-responsive admin-orders-table"
              role="region"
              aria-labelledby="orders-title"
              aria-describedby="orders-scroll-help"
              tabIndex={0}
            >
              <table className="table table-striped table-hover align-middle mb-0">
                <caption className="visually-hidden">Listado de órdenes de usuarios</caption>
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Orden</th>
                    <th scope="col">RUN</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Región</th>
                    <th scope="col">Comuna</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">Monto total</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <th scope="row">{displayValue(order.id)}</th>
                      <td>{displayValue(order.run)}</td>
                      <td>{displayValue([order.nombre, order.apellido].filter(Boolean).join(' '))}</td>
                      <td>{displayValue(order.correo)}</td>
                      <td>{displayValue(order.region)}</td>
                      <td>{displayValue(order.comuna)}</td>
                      <td>{displayValue(order.direccion)}</td>
                      <td className="text-nowrap">
                        {order.montoTotal == null || order.montoTotal === '' ? '—' : formatCLP(order.montoTotal)}
                      </td>
                      <td><span className={`badge ${statusClass(order.estado)}`}>{displayValue(order.estado)}</span></td>
                      <td><button type="button" className="btn btn-sm btn-primary text-nowrap">Ver detalle</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
