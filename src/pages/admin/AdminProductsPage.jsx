import { Link } from 'react-router-dom'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import { CATALOG_CATEGORIES } from '../../config/catalogCategories'
import { STORE_ECOSYSTEMS } from '../../config/storeEcosystems'
import { useAdminStock } from '../../hooks/useAdminStock'
import { publicAsset } from '../../utils/assets'
import { isValidPrice } from '../../utils/cartCalculations'
import { formatCLP } from '../../utils/currency'

const categoryLabels = new Map(CATALOG_CATEGORIES.map(({ value, label }) => [value, label]))
const ecosystemLabels = new Map(STORE_ECOSYSTEMS.map(({ value, label }) => [value, label]))

function displayValue(value) {
  return value == null || value === '' ? '—' : value
}

// Vista de solo lectura: reutiliza la unión productos + inventario de Stock sin editarla.
export default function AdminProductsPage() {
  const { rows, loading, error } = useAdminStock()

  return (
    <section className="section admin-products-page" aria-labelledby="products-title">
      <title>Productos — CheckPoint Store</title>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h1 id="products-title" className="mb-1">Productos</h1>
            <p className="text-muted mb-0">Listado de productos del catálogo.</p>
          </div>
          <Link className="btn btn-dark" to="/admin/productos/nuevo">
            <i className="fa fa-plus" aria-hidden="true" /> Nuevo producto
          </Link>
        </div>

        {loading ? (
          <p className="catalog-state" role="status">Cargando productos...</p>
        ) : error ? (
          <p className="alert alert-danger" role="alert">No fue posible cargar los productos.</p>
        ) : rows.length === 0 ? (
          <p className="catalog-state" role="status">No hay productos registrados.</p>
        ) : (
          <>
            <p id="products-scroll-help" className="text-muted small">
              {rows.length} {rows.length === 1 ? 'producto' : 'productos'}. Si la tabla no cabe en pantalla, desplázala horizontalmente.
            </p>
            <div
              className="table-responsive admin-products-table"
              role="region"
              aria-labelledby="products-title"
              aria-describedby="products-scroll-help"
              tabIndex={0}
            >
              <table className="table table-striped table-hover align-middle mb-0">
                <caption className="visually-hidden">Productos del catálogo con precio y stock</caption>
                <thead className="table-dark">
                  <tr>
                    <th scope="col"><span className="visually-hidden">Imagen</span></th>
                    <th scope="col">Código</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Ecosistema</th>
                    <th scope="col" className="text-end">Precio</th>
                    <th scope="col">Oferta</th>
                    <th scope="col" className="text-end">Stock</th>
                    <th scope="col">Disponibilidad</th>
                    <th scope="col">Tienda</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ productoId, product, stock }) => (
                    <tr key={productoId}>
                      <td>
                        <ImageWithFallback
                          src={product.imagen ? publicAsset(product.imagen) : undefined}
                          alt=""
                          className="admin-product-thumb"
                          loading="lazy"
                        />
                      </td>
                      <td className="text-nowrap">{displayValue(product.codigo)}</td>
                      <th scope="row">{displayValue(product.nombre)}</th>
                      <td>{categoryLabels.get(product.categoria) ?? displayValue(product.categoria)}</td>
                      <td>{ecosystemLabels.get(product.ecosistema) ?? displayValue(product.ecosistema)}</td>
                      <td className="text-end text-nowrap">
                        {isValidPrice(product.precio) ? formatCLP(product.precio) : '—'}
                      </td>
                      <td>{product.enOferta === true ? <span className="badge text-bg-warning">Oferta</span> : '—'}</td>
                      <td className="text-end">{stock}</td>
                      <td>
                        <span className={`badge ${stock > 0 ? 'text-bg-success' : 'text-bg-secondary'}`}>
                          {stock > 0 ? 'Disponible' : 'Agotado'}
                        </span>
                      </td>
                      <td>
                        <Link
                          className="text-nowrap"
                          to={`/productos/${productoId}`}
                          aria-label={`Ver ${displayValue(product.nombre)} en la tienda`}
                        >
                          Ver en tienda
                        </Link>
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
