import { Link, useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder'

export default function ProductDetailPage() {
  const { id } = useParams()

  return (
    <PagePlaceholder title="Detalle de producto">
      <p>Referencia: {id}</p>
      <Link className="btn btn-outline-dark" to="/productos">Volver al catálogo</Link>
    </PagePlaceholder>
  )
}
