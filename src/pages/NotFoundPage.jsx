import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder'

export default function NotFoundPage({ admin = false }) {
  return (
    <PagePlaceholder title="404 — Página no encontrada" description="La dirección que buscas no está disponible.">
      <Link className="primary-btn" to={admin ? '/admin/ordenes' : '/'}>
        {admin ? 'Volver al panel' : 'Volver al inicio'}
      </Link>
    </PagePlaceholder>
  )
}
