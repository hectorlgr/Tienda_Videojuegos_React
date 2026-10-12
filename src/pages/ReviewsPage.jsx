import { Link } from 'react-router-dom'
import ImageWithFallback from '../components/common/ImageWithFallback'
import { publicAsset } from '../utils/assets'

// Contenido editorial de muestra conservado del proyecto original.
const secondaryNews = [
  {
    title: 'Grand Theft Auto VI',
    image: 'img/GTA-VI.jpg',
    alt: 'GTA 6',
    summary: 'Rockstar confirmó que el juego llega el 19 de noviembre de 2026 a PS5 y Xbox Series X/S. El debut será una experiencia solo para un jugador, y la copia física no incluirá disco, sino un código de descarga.',
  },
  {
    title: 'Resident Evil Veronica',
    image: 'img/RE-Veronica.jpg',
    alt: 'Resident Evil Veronica',
    summary: 'Capcom anunció el remake de Code: Veronica, con Claire Redfield como protagonista viajando a París para rescatar a su hermano Chris. Llega en 2027 a PS5, Xbox Series, PC y Switch 2.',
  },
  {
    title: 'Zelda: Ocarina of Time Remake',
    image: 'img/Remake-Zelda.jpg',
    alt: 'Zelda Ocarina of Time Remake',
    summary: 'El remake del clásico de N64 llega a Nintendo Switch 2 el 5 de noviembre de 2026, con gráficos renovados, un nuevo registro de misiones y la posibilidad de tocar la ocarina con los Joy-Con.',
  },
]

export default function ReviewsPage() {
  return (
    <div className="reviews-page">
      <title>Críticas y noticias — CheckPoint Store</title>
      <header className="section">
        <div className="container">
          <nav aria-label="Ruta de navegación">
            <ol className="breadcrumb-tree">
              <li><Link to="/">Inicio</Link></li>
              <li className="active" aria-current="page">Críticas y noticias</li>
            </ol>
          </nav>
          <h1 className="mt-3 mb-0">Críticas y noticias</h1>
        </div>
      </header>

      <section id="noticia-destacada" className="section" aria-labelledby="featured-news-heading">
        <div className="container">
          <h2 id="featured-news-heading" className="reviews-section-title">Noticia destacada</h2>
          <article className="row gy-4 align-items-center" aria-labelledby="featured-news-title">
            <div className="col-lg-6">
              <ImageWithFallback
                src={publicAsset('img/formato-fisico.jpeg')}
                alt="Sony elimina el formato físico"
                className="reviews-featured-image"
              />
            </div>
            <div className="col-lg-6">
              <div className="noticia-card">
                <p className="text-muted">Noticias · <time dateTime="2026-07-01">1 de julio de 2026</time></p>
                <h3 id="featured-news-title">Sony pone fecha al fin del formato físico en PlayStation</h3>
                <p>
                  El pasado 1 de julio, Sony confirmó que a partir de enero de 2028 dejará de fabricar juegos en formato físico para PlayStation. La medida solo afecta a los títulos que se lancen después de esa fecha: los juegos que ya están en el mercado, o que salgan antes de 2028 en disco, no se ven afectados. En el mismo comunicado, la compañía anunció además el cierre de las tiendas digitales de PS3 y PS Vita.
                </p>
                <p>
                  El anuncio generó un fuerte rechazo entre jugadores y asociaciones de consumidores, que lo calificaron como una decisión que prioriza la conveniencia de la empresa por sobre la libertad de elección del usuario. A fines de julio, la directora financiera de Sony, Lin Tao, señaló en una llamada con inversionistas que la compañía no dará marcha atrás, apuntando al avance imparable de la distribución digital como razón principal. Pese a los rumores que circularon en la Gamescom de agosto sobre un posible cambio de postura, ex trabajadores de PlayStation confirmaron que la estrategia se mantiene firme.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="portadas-noticias" className="section" aria-labelledby="more-news-heading">
        <div className="container">
          <h2 id="more-news-heading" className="reviews-section-title">Más noticias</h2>
          <div className="row g-4">
            {secondaryNews.map((news, index) => (
              <div className="col-12 col-md-4" key={news.title}>
                <article className="noticia-card" aria-labelledby={`secondary-news-${index}`}>
                  <ImageWithFallback src={publicAsset(news.image)} alt={news.alt} className="noticia-thumb" loading="lazy" />
                  <h3 id={`secondary-news-${index}`} className="mt-3">{news.title}</h3>
                  <p>{news.summary}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
