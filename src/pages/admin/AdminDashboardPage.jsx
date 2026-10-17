import { Link } from 'react-router-dom'
import DashboardStatCard from '../../components/admin/DashboardStatCard'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'

export default function AdminDashboardPage() {
  const { metrics, loading, partialError } = useAdminDashboard()

  const cards = metrics && [
    { label: 'Productos', value: metrics.products, icon: 'fa-gamepad', description: 'Productos registrados en el catálogo.', to: '/admin/productos', linkText: 'Ver productos' },
    { label: 'Usuarios', value: metrics.users, icon: 'fa-users', description: 'Cuentas registradas en la tienda.', to: '/admin/usuarios', linkText: 'Ver usuarios' },
    { label: 'Órdenes', value: metrics.orders, icon: 'fa-list-alt', description: 'Órdenes registradas.', to: '/admin/ordenes', linkText: 'Ver órdenes' },
    { label: 'Productos agotados', value: metrics.soldOut, icon: 'fa-exclamation-triangle', description: 'Productos con stock 0.', to: '/admin/stock', linkText: 'Revisar stock' },
  ]

  return (
    <section className="section admin-dashboard-page" aria-labelledby="dashboard-title">
      <title>Dashboard — CheckPoint Store</title>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h1 id="dashboard-title" className="mb-1">Dashboard</h1>
            <p className="text-muted mb-0">Resumen general de la tienda.</p>
          </div>
          <Link className="btn btn-dark" to="/admin/productos/nuevo">
            <i className="fa fa-plus" aria-hidden="true" /> Nuevo producto
          </Link>
        </div>

        {loading ? (
          <p className="catalog-state" role="status">Cargando resumen...</p>
        ) : (
          <>
            {partialError && (
              <p className="alert alert-warning" role="alert">
                No fue posible cargar todos los datos. Algunas métricas no están disponibles.
              </p>
            )}
            <div className="row g-3">
              {cards.map(card => (
                <div className="col-12 col-sm-6 col-xl-3" key={card.label}>
                  <DashboardStatCard {...card} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
