import ProductCard from '../components/store/ProductCard'
import { useCatalogProducts } from '../hooks/useCatalogProducts'

export default function ProductsPage() {
  const { products, loading, error } = useCatalogProducts()

  return (
    <section className="section catalog-section" aria-labelledby="catalog-title">
      <title>Productos — CheckPoint Store</title>
      <div className="container">
        <div className="row gy-4">
          <aside id="aside" className="col-lg-3" aria-labelledby="catalog-categories-title">
            <div className="aside">
              <h2 id="catalog-categories-title" className="aside-title">Categorías</h2>
              <ul className="catalog-categories">
                <li>Juegos (digital y físico)</li>
                <li>Consolas</li>
                <li>Accesorios</li>
                <li>Figuras</li>
              </ul>
            </div>
          </aside>
          <div id="store" className="col-lg-9">
            <div className="store-filter clearfix">
              <h1 id="catalog-title" className="catalog-title">Productos</h1>
              <span className="store-qty">Catálogo completo de la tienda</span>
            </div>
            <div aria-busy={loading}>
              {loading ? (
                <p className="catalog-state" role="status">Cargando productos…</p>
              ) : error ? (
                <p className="catalog-state" role="alert">No pudimos cargar el catálogo. Inténtalo más tarde.</p>
              ) : products.length === 0 ? (
                <p className="catalog-state" role="status">No hay productos disponibles en el catálogo.</p>
              ) : (
                <div className="row g-4" id="products-grid">
                  {products.map(product => (
                    <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
