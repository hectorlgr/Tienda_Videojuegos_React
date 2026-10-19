import { Link } from 'react-router-dom'
import { STORE_ECOSYSTEMS } from '../config/storeEcosystems'
import { useCatalogProducts } from '../hooks/useCatalogProducts'

// Landing de categorías: una tarjeta por ecosistema con su cantidad de productos.
export default function CategoriesPage() {
  const { products, loading } = useCatalogProducts()

  return (
    <section className="section categories-page" aria-labelledby="categories-title">
      <title>Categorías — CheckPoint Store</title>
      <div className="container">
        <h1 id="categories-title" className="mb-2">Categorías</h1>
        <p className="text-muted mb-4">Elige tu plataforma favorita y descubre sus productos.</p>

        <ul className="row g-4 list-unstyled mb-0">
          {STORE_ECOSYSTEMS.map(ecosystem => {
            // Cuenta los productos de este ecosistema con los datos reales del catálogo.
            const count = products.filter(product => product.ecosistema === ecosystem.value).length

            return (
              <li className="col-12 col-sm-6 col-lg-3" key={ecosystem.value}>
                <Link className={`ecosystem-card ecosystem-${ecosystem.value}`} to={`/categorias/${ecosystem.value}`}>
                  <i className={`fa ${ecosystem.icon} ecosystem-icon`} aria-hidden="true" />
                  <span className="ecosystem-name">{ecosystem.label}</span>
                  <span className="ecosystem-description">{ecosystem.description}</span>
                  <span className="ecosystem-count">
                    {loading ? 'Cargando…' : `${count} ${count === 1 ? 'producto' : 'productos'}`}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
