import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/store/ProductCard'
import { CATALOG_CATEGORIES } from '../config/catalogCategories'
import { useCatalogProducts } from '../hooks/useCatalogProducts'

export default function ProductsPage() {
  const { products, loading, error } = useCatalogProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  // La selección vive en el estado de React Router, también al navegar atrás/adelante.
  const requestedCategories = searchParams.getAll('categoria')
  const selectedCategories = CATALOG_CATEGORIES
    .filter(category => requestedCategories.includes(category.value))
    .map(category => category.value)
  const filteredProducts = selectedCategories.length === 0
    ? products
    : products.filter(product => selectedCategories.includes(product.categoria))

  function toggleCategory(value, checked) {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      const selection = new Set(previous.getAll('categoria'))
      if (checked) selection.add(value)
      else selection.delete(value)

      next.delete('categoria')
      CATALOG_CATEGORIES.forEach(category => {
        if (selection.has(category.value)) next.append('categoria', category.value)
      })
      return next
    })
  }

  return (
    <section className="section catalog-section" aria-labelledby="catalog-title">
      <title>Productos — CheckPoint Store</title>
      <div className="container">
        <div className="row gy-4">
          <aside id="aside" className="col-lg-3" aria-labelledby="catalog-categories-title">
            <div className="aside">
              <h2 id="catalog-categories-title" className="aside-title">Categorías</h2>
              <div className="checkbox-filter catalog-categories" role="group" aria-labelledby="catalog-categories-title">
                {CATALOG_CATEGORIES.map(({ value, label }) => (
                  <div className="input-checkbox" key={value}>
                    <input
                      type="checkbox"
                      id={`category-${value}`}
                      checked={selectedCategories.includes(value)}
                      onChange={event => toggleCategory(value, event.target.checked)}
                    />
                    <label htmlFor={`category-${value}`}><span aria-hidden="true" />{label}</label>
                  </div>
                ))}
              </div>
              <p className="catalog-filter-help">Sin filtros marcados se muestran todos los productos.</p>
            </div>
          </aside>
          <div id="store" className="col-lg-9">
            <div className="store-filter clearfix">
              <h1 id="catalog-title" className="catalog-title">Productos</h1>
              <span className="store-qty">
                {selectedCategories.length ? 'Productos de las categorías seleccionadas' : 'Catálogo completo de la tienda'}
              </span>
            </div>
            <div aria-busy={loading}>
              {loading ? (
                <p className="catalog-state" role="status">Cargando productos…</p>
              ) : error ? (
                <p className="catalog-state" role="alert">No pudimos cargar el catálogo. Inténtalo más tarde.</p>
              ) : products.length === 0 ? (
                <p className="catalog-state" role="status">No hay productos disponibles en el catálogo.</p>
              ) : filteredProducts.length === 0 ? (
                <p className="catalog-state" role="status">No hay productos para las categorías seleccionadas.</p>
              ) : (
                <div className="row g-4" id="products-grid">
                  {filteredProducts.map(product => (
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
