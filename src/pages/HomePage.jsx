import { Link } from 'react-router-dom'
import ProductCard from '../components/store/ProductCard'
import { CATALOG_CATEGORIES } from '../config/catalogCategories'
import { useCatalogProducts } from '../hooks/useCatalogProducts'

// Selección de la Home antigua; los datos comerciales proceden del catálogo real.
const FEATURED_PRODUCT_IDS = [1, 2, 3, 4, 5, 6, 7, 8]
const categoryIcons = {
  juego: 'fa-gamepad',
  consola: 'fa-television',
  accesorio: 'fa-headphones',
  figura: 'fa-star',
}

export default function HomePage() {
  const { products, loading, error } = useCatalogProducts()
  const featuredProducts = FEATURED_PRODUCT_IDS
    .map(id => products.find(product => product.id === id))
    .filter(Boolean)

  return (
    <div className="home-page">
      <title>Bienvenido a CheckPoint Store — CheckPoint Store</title>
      <section className="section" aria-labelledby="home-title">
        <div className="container">
          <h1 id="home-title">Bienvenido a CheckPoint Store</h1>
          <p>Consolas, juegos, accesorios y figuras. Todo lo que necesitas en un solo lugar.</p>
          <Link className="primary-btn" to="/productos">Ver productos</Link>
        </div>
      </section>

      <nav className="section home-categories" aria-labelledby="home-categories-title">
        <div className="container">
          <h2 id="home-categories-title" className="home-section-title">Explora las categorías</h2>
          <ul className="row g-3 list-unstyled mb-0">
            {CATALOG_CATEGORIES.map(({ value, label }) => (
              <li className="col-12 col-sm-6 col-lg-3" key={value}>
                <Link className="home-category" to={`/productos?categoria=${value}`}>
                  <i className={`fa ${categoryIcons[value]}`} aria-hidden="true" />
                  <span>{label}</span>
                  <i className="fa fa-arrow-circle-right" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="section home-featured" aria-labelledby="home-featured-title">
        <div className="container">
          <h2 id="home-featured-title" className="home-section-title">Productos destacados</h2>
          {loading ? (
            <p className="catalog-state" role="status">Cargando productos...</p>
          ) : error ? (
            <p className="catalog-state" role="alert">No fue posible cargar los productos destacados.</p>
          ) : featuredProducts.length === 0 ? (
            <p className="catalog-state" role="status">No hay productos destacados disponibles.</p>
          ) : (
            <div className="row g-4">
              {featuredProducts.map(product => (
                <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
