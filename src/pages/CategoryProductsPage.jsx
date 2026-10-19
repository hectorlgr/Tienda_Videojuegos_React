import { Link, NavLink, useParams } from 'react-router-dom'
import ProductGrid from '../components/store/ProductGrid'
import { STORE_ECOSYSTEMS } from '../config/storeEcosystems'
import { useCatalogProducts } from '../hooks/useCatalogProducts'

// Productos de un ecosistema: /categorias/playstation, /categorias/xbox, etc.
export default function CategoryProductsPage() {
  const { ecosistema } = useParams()
  const { products, loading, error } = useCatalogProducts()
  const ecosystem = STORE_ECOSYSTEMS.find(item => item.value === ecosistema)

  // Si la URL trae un ecosistema que no existe, se muestra un aviso en vez de una lista vacía.
  if (!ecosystem) {
    return (
      <section className="section">
        <title>Categoría no encontrada — CheckPoint Store</title>
        <div className="container">
          <h1>Categoría no encontrada</h1>
          <p>La categoría que buscas no existe.</p>
          <Link className="primary-btn" to="/categorias">Ver categorías</Link>
        </div>
      </section>
    )
  }

  const ecosystemProducts = products.filter(product => product.ecosistema === ecosystem.value)

  return (
    <>
      <title>{`${ecosystem.label} — CheckPoint Store`}</title>
      <nav id="breadcrumb" className="section" aria-label="Ruta de navegación">
        <div className="container">
          <ol className="breadcrumb-tree">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/categorias">Categorías</Link></li>
            <li className="active" aria-current="page">{ecosystem.label}</li>
          </ol>
        </div>
      </nav>

      <section className="section category-products-page" aria-labelledby="category-title">
        <div className="container">
          <h1 id="category-title" className="mb-2">{ecosystem.label}</h1>
          <p className="text-muted">{ecosystem.description}</p>

          {/* Accesos rápidos para cambiar de ecosistema sin volver a la landing. */}
          <nav className="ecosystem-tabs mb-4" aria-label="Otros ecosistemas">
            {STORE_ECOSYSTEMS.map(item => (
              <NavLink key={item.value} to={`/categorias/${item.value}`}>{item.label}</NavLink>
            ))}
          </nav>

          <ProductGrid
            products={ecosystemProducts}
            loading={loading}
            error={error}
            emptyMessage={`Aún no hay productos de ${ecosystem.label}.`}
          />
        </div>
      </section>
    </>
  )
}
