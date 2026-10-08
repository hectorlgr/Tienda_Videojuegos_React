import { Link, useParams } from 'react-router-dom'
import ImageWithFallback from '../components/common/ImageWithFallback'
import { useProductDetail } from '../hooks/useProductDetail'
import { ProductNotFoundError } from '../services/productService'
import { publicAsset } from '../utils/assets'
import { formatCLP } from '../utils/currency'

const optionalFields = [
  ['formato', 'Formato'],
  ['plataforma', 'Plataforma'],
  ['compatibilidad', 'Compatibilidad'],
  ['franquicia', 'Franquicia'],
]

function DetailStatus({ title, description, loading = false }) {
  return (
    <section className="section">
      <title>{`${title} — CheckPoint Store`}</title>
      <div className="container">
        <div className="detail-state" aria-busy={loading}>
          <div role={loading ? 'status' : 'alert'}>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <Link className="btn btn-outline-dark" to="/productos">Volver al catálogo</Link>
        </div>
      </div>
    </section>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const productId = Number(id)
  const validId = Number.isSafeInteger(productId) && productId > 0
  const { product, loading, error } = useProductDetail(productId)

  if (!validId) {
    return <DetailStatus title="ID de producto inválido" description="El enlace no contiene un identificador de producto válido." />
  }

  if (loading) {
    return <DetailStatus title="Detalle de producto" description="Cargando producto…" loading />
  }

  if (error instanceof ProductNotFoundError) {
    return <DetailStatus title="Producto no encontrado" description="No encontramos el producto que buscas." />
  }

  if (error || !product) {
    return <DetailStatus title="Error al cargar el producto" description="No pudimos cargar la información del producto. Inténtalo más tarde." />
  }

  const available = product.stock > 0
  const specifications = optionalFields.filter(([field]) => product[field])

  return (
    <>
      <title>{`${product.nombre} — CheckPoint Store`}</title>
      <nav id="breadcrumb" className="section" aria-label="Ruta de navegación">
        <div className="container">
          <ol className="breadcrumb-tree">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li className="active" aria-current="page">{product.nombre}</li>
          </ol>
        </div>
      </nav>
      <section className="section product-detail-page" aria-labelledby="detail-name">
        <div className="container">
          <div className="row gy-4">
            <div className="col-md-5">
              <div className="detail-main-image">
                <ImageWithFallback
                  src={product.imagen ? publicAsset(product.imagen) : undefined}
                  alt={product.nombre}
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="product-details">
                <p className="detail-category">{product.categoria}</p>
                <h1 className="product-name" id="detail-name">{product.nombre}</h1>
                <div className="detail-price-stock">
                  <p className="product-price">{formatCLP(product.precio)}</p>
                  <p className={`product-available ${available ? 'is-available' : 'is-unavailable'}`}>
                    {available ? `Disponible · ${product.stock} unidades` : 'Agotado'}
                  </p>
                </div>
                <p className="detail-short-description">{product.descripcionCorta}</p>
                <p className="detail-long-description">{product.descripcionLarga}</p>
                {specifications.length > 0 && (
                  <dl className="detail-specifications">
                    {specifications.map(([field, label]) => (
                      <div key={field}>
                        <dt>{label}</dt>
                        <dd>{field === 'formato' && product[field] === 'fisico' ? 'Físico' : product[field]}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <Link className="btn btn-outline-dark mt-3" to="/productos">Volver al catálogo</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
