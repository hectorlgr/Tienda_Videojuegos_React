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
  const searchValue = searchParams.get('q') ?? ''
  const searchTerm = searchValue.trim().toLowerCase()
  const categoryProducts = selectedCategories.length === 0
    ? products
    : products.filter(product => selectedCategories.includes(product.categoria))
  const filteredProducts = searchTerm
    ? categoryProducts.filter(product => product.nombre.toLowerCase().includes(searchTerm))
    : categoryProducts
  const noResultsMessage = searchTerm
    ? selectedCategories.length
      ? 'No se encontraron productos para las categorías y la búsqueda indicadas.'
      : 'No se encontraron productos para la búsqueda indicada.'
    : 'No hay productos para las categorías seleccionadas.'

  function changeSearch(value) {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      if (value === '') next.delete('q')
      else next.set('q', value)
      return next
    }, { replace: true })
  }

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
              <p className="catalog-filter-help">Sin categorías marcadas se incluyen todas las categorías.</p>
            </div>
          </aside>
          <div id="store" className="col-lg-9">
            <div className="store-filter clearfix">
              <h1 id="catalog-title" className="catalog-title">Productos</h1>
              <span className="store-qty">
                {searchTerm ? 'Resultados de búsqueda en el catálogo' : selectedCategories.length ? 'Productos de las categorías seleccionadas' : 'Catálogo completo de la tienda'}
              </span>
            </div>
            <div className="mb-4" role="search" aria-label="Búsqueda en el catálogo">
              <label className="form-label" htmlFor="catalog-search">Buscar por nombre</label>
              <input
                id="catalog-search"
                className="input"
                type="search"
                placeholder="Ej.: Elden Ring"
                value={searchValue}
                onChange={event => changeSearch(event.target.value)}
              />
            </div>
            <div aria-busy={loading}>
              {loading ? (
                <p className="catalog-state" role="status">Cargando productos…</p>
              ) : error ? (
                <p className="catalog-state" role="alert">No pudimos cargar el catálogo. Inténtalo más tarde.</p>
              ) : products.length === 0 ? (
                <p className="catalog-state" role="status">No hay productos disponibles en el catálogo.</p>
              ) : filteredProducts.length === 0 ? (
                <p className="catalog-state" role="status">{noResultsMessage}</p>
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
