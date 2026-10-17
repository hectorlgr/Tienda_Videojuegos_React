import { useAdminReports } from '../../hooks/useAdminReports'
import { formatCLP } from '../../utils/currency'

export default function AdminReportsPage() {
  const { report, loading, error } = useAdminReports()

  return (
    <section className="section admin-reports-page" aria-labelledby="reports-title">
      <title>Reportes — CheckPoint Store</title>
      <div className="container">
        <h1 id="reports-title" className="mb-1">Reportes</h1>
        <p className="text-muted mb-4">Estadísticas calculadas con los datos actuales de la tienda.</p>

        {loading && <p className="catalog-state" role="status">Cargando reportes...</p>}

        {error && <p className="alert alert-danger" role="alert">No fue posible cargar los reportes.</p>}

        {report && (
          <>
            {/* Tarjetas: para agregar una nueva, añade un objeto a esta lista. */}
            <div className="row g-3 mb-4">
              {[
                { label: 'Productos', value: report.totalProducts },
                { label: 'Usuarios', value: report.totalUsers },
                { label: 'Órdenes', value: report.totalOrders },
                { label: 'Stock total', value: report.stockTotal },
                { label: 'Productos agotados', value: report.soldOut },
                { label: 'Monto total de órdenes', value: formatCLP(report.ordersTotal) },
              ].map(card => (
                <div className="col-12 col-sm-6 col-lg-4" key={card.label}>
                  <div className="card h-100 shadow-sm admin-stat-card">
                    <div className="card-body">
                      <h2 className="admin-stat-label">{card.label}</h2>
                      <p className="admin-report-value">{card.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabla de órdenes agrupadas por estado. */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="fs-5 mb-3">Órdenes por estado</h2>
                <table className="table table-striped mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">Estado</th>
                      <th scope="col" className="text-end">Cantidad</th>
                      <th scope="col" className="text-end">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(report.ordersByStatus).map(([estado, datos]) => (
                      <tr key={estado}>
                        <th scope="row">{estado}</th>
                        <td className="text-end">{datos.cantidad}</td>
                        <td className="text-end">{formatCLP(datos.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
