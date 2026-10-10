import { useAdminStock } from '../../hooks/useAdminStock'
import StockEditor from '../../components/admin/StockEditor'

function displayValue(value) {
  return value == null || value === '' ? '—' : value
}

export default function AdminStockPage() {
  const { rows, loading, error, updateRowStock } = useAdminStock()

  return (
    <section className="section admin-stock-page" aria-labelledby="stock-title">
      <title>Stock de productos — CheckPoint Store</title>
      <div className="container">
        <h1 id="stock-title" className="text-center mb-4">Stock de productos</h1>
        {loading ? (
          <p className="catalog-state" role="status">Cargando stock...</p>
        ) : error ? (
          <p className="alert alert-danger" role="alert">No fue posible cargar el stock de productos.</p>
        ) : rows.length === 0 ? (
          <p className="catalog-state" role="status">No hay productos disponibles.</p>
        ) : (
          <>
            <p id="stock-scroll-help" className="text-muted small">
              Si la tabla no cabe en pantalla, desplázala horizontalmente para ver todos los campos.
            </p>
            <div
              className="table-responsive admin-stock-table"
              role="region"
              aria-labelledby="stock-title"
              aria-describedby="stock-scroll-help"
              tabIndex={0}
            >
              <table className="table table-striped table-hover align-middle mb-0">
                <caption className="visually-hidden">Stock actual y stock crítico de los productos</caption>
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Categoría</th>
                    <th scope="col" className="text-end">Stock actual</th>
                    <th scope="col" className="text-end">Stock crítico</th>
                    <th scope="col">Disponibilidad</th>
                    <th scope="col">Actualizar stock</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ productoId, inventoryId, product, stock, stockCritico }) => (
                    <tr key={productoId}>
                      <td>{displayValue(product.codigo)}</td>
                      <th scope="row">
                        {displayValue(product.nombre)}
                        {inventoryId === null && (
                          <span className="d-block small fw-normal text-muted mt-1">Sin registro de inventario</span>
                        )}
                      </th>
                      <td>{displayValue(product.categoria)}</td>
                      <td className="text-end">{stock}</td>
                      <td className="text-end">{displayValue(stockCritico)}</td>
                      <td>
                        <span className={`badge ${stock > 0 ? 'text-bg-success' : 'text-bg-secondary'}`}>
                          {stock > 0 ? 'Disponible' : 'Agotado'}
                        </span>
                      </td>
                      <td>
                        {inventoryId === null ? '—' : (
                          <StockEditor
                            key={inventoryId}
                            inventoryId={inventoryId}
                            productName={displayValue(product.nombre)}
                            stock={stock}
                            onUpdated={updateRowStock}
                          />
                        )}
                      </td>
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
