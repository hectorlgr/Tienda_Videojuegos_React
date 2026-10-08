import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder'

export default function HomePage() {
  return (
    <PagePlaceholder title="Bienvenido a CheckPoint Store" description="Consolas, juegos, accesorios y figuras. Nuestra tienda está en preparación.">
      <Link className="primary-btn" to="/productos">Ver productos</Link>
    </PagePlaceholder>
  )
}
