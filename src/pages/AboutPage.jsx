import { Link } from 'react-router-dom'
import ImageWithFallback from '../components/common/ImageWithFallback'
import { publicAsset } from '../utils/assets'

// Contenido estático: para cambiar textos basta con editar estas listas.
const offerings = [
  { icon: 'fa-gamepad', title: 'Juegos', text: 'Lanzamientos y clásicos en formato físico y digital.' },
  { icon: 'fa-television', title: 'Consolas', text: 'PlayStation, Xbox, Nintendo y portátiles para PC.' },
  { icon: 'fa-headphones', title: 'Accesorios', text: 'Controles, periféricos y todo para mejorar tu experiencia.' },
  { icon: 'fa-star', title: 'Figuras', text: 'Coleccionables de tus personajes y sagas favoritas.' },
]

const values = [
  { icon: 'fa-check-circle', title: 'Productos originales', text: 'Trabajamos solo con productos oficiales y garantizados.' },
  { icon: 'fa-truck', title: 'Envíos a todo Chile', text: 'Despachamos a la región y comuna que elijas.' },
  { icon: 'fa-users', title: 'Hecho por gamers', text: 'Te recomendamos lo que nosotros mismos jugamos.' },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <title>Nosotros — CheckPoint Store</title>

      {/* Presentación de la tienda */}
      <section className="section" aria-labelledby="about-title">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-md-7">
              <p className="placeholder-eyebrow mb-2">Sobre nosotros</p>
              <h1 id="about-title">CheckPoint Store</h1>
              <p className="lead">
                Somos una tienda online chilena especializada en videojuegos. Nacimos para reunir en un solo
                lugar todo lo que un jugador necesita, sin importar su plataforma favorita.
              </p>
              <p>
                Desde el primer «Press Start» hasta el último jefe, en CheckPoint Store encuentras consolas,
                juegos, accesorios y figuras de PlayStation, Xbox, Nintendo y más.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <Link className="primary-btn" to="/categorias">Ver categorías</Link>
                <Link className="btn btn-outline-dark" to="/contacto">Contáctanos</Link>
              </div>
            </div>
            <div className="col-md-5 text-center">
              <ImageWithFallback className="about-logo" src={publicAsset('img/Logo_Checkpoint.png')} alt="Logo de CheckPoint Store" />
            </div>
          </div>
        </div>
      </section>

      {/* Qué vendemos */}
      <section className="section about-offerings" aria-labelledby="about-offerings-title">
        <div className="container">
          <h2 id="about-offerings-title" className="home-section-title">¿Qué vendemos?</h2>
          <div className="row g-3">
            {offerings.map(item => (
              <div className="col-12 col-sm-6 col-lg-3" key={item.title}>
                <div className="about-card h-100">
                  <i className={`fa ${item.icon}`} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="section" aria-labelledby="about-values-title">
        <div className="container">
          <h2 id="about-values-title" className="home-section-title">¿Por qué elegirnos?</h2>
          <div className="row g-3">
            {values.map(item => (
              <div className="col-12 col-md-4" key={item.title}>
                <div className="about-card h-100">
                  <i className={`fa ${item.icon}`} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted small mt-4 mb-0">
            CheckPoint Store es un proyecto académico desarrollado para la asignatura DSY1104 de Duoc UC.
          </p>
        </div>
      </section>
    </div>
  )
}
