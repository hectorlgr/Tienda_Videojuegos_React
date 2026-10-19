import ProductCard from './ProductCard'

// Grilla de productos con sus estados: cargando, error, vacío o listado.
export default function ProductGrid({ products, loading, error, emptyMessage }) {
  if (loading) {
    return <p className="catalog-state" role="status">Cargando productos…</p>
  }
  if (error) {
    return <p className="catalog-state" role="alert">No pudimos cargar los productos. Inténtalo más tarde.</p>
  }
  if (products.length === 0) {
    return <p className="catalog-state" role="status">{emptyMessage}</p>
  }

  return (
    <div className="row g-4">
      {products.map(product => (
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}
