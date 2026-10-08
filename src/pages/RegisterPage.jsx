import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder'

export default function RegisterPage() {
  return (
    <PagePlaceholder title="Registro de usuario">
      <Link to="/login">Ir a inicio de sesión</Link>
    </PagePlaceholder>
  )
}
