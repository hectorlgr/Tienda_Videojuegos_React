import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/store/ProductGrid'
import { useCatalogProducts } from '../hooks/useCatalogProducts'
import { getDiscountPercent, hasValidOffer } from '../utils/pricing'

export default function OffersPage() {
  const { products, loading, error } = useCatalogProducts()
  // El texto de búsqueda vive en la URL (?q=...), así funciona con Atrás/Adelante.
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const searchTerm = search.trim().toLowerCase()

  // 1) Solo productos con oferta válida, 2) filtrados por nombre, 3) mayor descuento primero.
  const offers = products
    .filter(hasValidOffer)
    .filter(product => product.nombre.toLowerCase().includes(searchTerm))
    .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))

  function handleSearch(event) {
    const value = event.target.value
    // replace evita llenar el historial con cada letra escrita.
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  return (
    <section className="section offers-page" aria-labelledby="offers-title">
      <title>Ofertas — CheckPoint Store</title>
      <div className="container">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
          <div>
            <h1 id="offers-title" className="mb-1">Ofertas</h1>
            <p className="text-muted mb-0">Productos con precio rebajado por tiempo limitado.</p>
          </div>
          <div className="offers-search">
            <label htmlFor="offers-search" className="form-label fw-semibold">Buscar en ofertas</label>
            <input
              id="offers-search"
              type="search"
              className="form-control"
              placeholder="Ej: control"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {!loading && !error && (
          <p className="text-muted small" role="status">
            {offers.length} {offers.length === 1 ? 'producto en oferta' : 'productos en oferta'}
          </p>
        )}

        <ProductGrid
          products={offers}
          loading={loading}
          error={error}
          emptyMessage={searchTerm ? 'No hay ofertas que coincidan con tu búsqueda.' : 'No hay ofertas disponibles en este momento.'}
        />
      </div>
    </section>
  )
}
