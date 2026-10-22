import { Link } from 'react-router-dom'
import ProductCard from '../components/store/ProductCard'
import ProductCarousel from '../components/store/ProductCarousel'
import ImageWithFallback from '../components/common/ImageWithFallback'
import { CATALOG_CATEGORIES } from '../config/catalogCategories'
import { useCatalogProducts } from '../hooks/useCatalogProducts'
import { publicAsset } from '../utils/assets'

// Selección de la Home antigua; los datos comerciales proceden del catálogo real.
const FEATURED_PRODUCT_IDS = [1, 2, 3, 4, 5, 6, 7, 8]
const categoryIcons = {
  juego: 'fa-gamepad',
  consola: 'fa-television',
  accesorio: 'fa-headphones',
  figura: 'fa-star',
}

const socialReferences = [
  ['fa-facebook', 'Facebook'],
  ['fa-twitter', 'Twitter'],
  ['fa-instagram', 'Instagram'],
  ['fa-pinterest', 'Pinterest'],
]

export default function HomePage() {
  const { products, loading, error } = useCatalogProducts()
  const featuredProducts = FEATURED_PRODUCT_IDS
    .map(id => products.find(product => product.id === id))
    .filter(Boolean)
  // El carrusel muestra solo lo que se puede comprar ahora (con stock).
  const availableProducts = products.filter(product => product.stock > 0)

  return (
    <div className="home-page">
      <title>Bienvenido a CheckPoint Store — CheckPoint Store</title>
      <section className="section home-welcome" aria-labelledby="home-title">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-md-6">
              <h1 id="home-title">Bienvenido a CheckPoint Store</h1>
              <p>Consolas, juegos, accesorios y figuras. Todo lo que necesitas en un solo lugar.</p>
              <Link className="primary-btn" to="/productos">Ver productos</Link>
            </div>
            <div className="col-md-6">
              <ImageWithFallback
                className="home-welcome-image"
                src={publicAsset('img/cara_ps5.jpg')}
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section home-carousel" aria-labelledby="home-carousel-title">
        <div className="container">
          <h2 id="home-carousel-title" className="home-section-title">Productos en venta</h2>
          {loading ? (
            <p className="catalog-state" role="status">Cargando productos...</p>
          ) : error ? (
            <p className="catalog-state" role="alert">No fue posible cargar los productos.</p>
          ) : availableProducts.length === 0 ? (
            <p className="catalog-state" role="status">No hay productos disponibles en este momento.</p>
          ) : (
            <ProductCarousel products={availableProducts} />
          )}
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

      <section className="section home-editorial" aria-labelledby="home-editorial-title">
        <div className="container">
          <div className="home-editorial-banner">
            <ImageWithFallback src={publicAsset('img/hotdeal.jpg')} alt="" loading="lazy" />
            <div className="home-editorial-content">
              <h2 id="home-editorial-title">Noticias del mundo gamer</h2>
              <p>Un espacio para las novedades de la industria de los videojuegos.</p>
              <Link className="primary-btn" to="/criticas">Críticas y noticias</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-newsletter" aria-labelledby="home-newsletter-title">
        <div className="container">
          <div className="home-newsletter-content">
            <i className="fa fa-envelope-o home-newsletter-icon" aria-hidden="true" />
            <h2 id="home-newsletter-title">Nuestro newsletter</h2>
            <p id="home-newsletter-help">Suscripción no disponible por ahora.</p>
            <div className="home-newsletter-controls">
              <label className="visually-hidden" htmlFor="home-newsletter-email">Correo electrónico</label>
              <input
                id="home-newsletter-email"
                className="form-control"
                type="email"
                placeholder="Ingresa tu correo"
                aria-describedby="home-newsletter-help"
                disabled
              />
              <button className="btn btn-dark" type="button" disabled>Suscribirse</button>
            </div>
            <ul className="home-social-references" aria-label="Referencias visuales de redes sociales">
              {socialReferences.map(([icon, label]) => (
                <li key={icon}>
                  <span><i className={`fa ${icon}`} aria-hidden="true" /><span className="visually-hidden">{label}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
