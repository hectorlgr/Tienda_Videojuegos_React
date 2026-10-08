import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder'

export default function LoginPage() {
  return (
    <PagePlaceholder title="Inicio de sesión">
      <Link to="/registro">Ir a registro</Link>
    </PagePlaceholder>
  )
}
