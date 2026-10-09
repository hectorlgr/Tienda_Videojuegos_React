import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { findUserByEmail } from '../services/userService'

// Vendedor y administrador comienzan en Órdenes; los permisos se separan con guards.
const HOME_BY_ROLE = {
  cliente: '/',
  vendedor: '/admin/ordenes',
  administrador: '/admin/ordenes',
}

const INVALID_CREDENTIALS = 'Correo o contraseña incorrectos.'
const LOGIN_FAILED = 'No fue posible iniciar sesión. Inténtalo nuevamente.'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  // El estado se actualiza tras el render; la referencia bloquea envíos simultáneos.
  const submittingRef = useRef(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (submittingRef.current) return

    if (email.trim() === '' || password === '') {
      setError('Ingresa tu correo electrónico y tu contraseña.')
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    setError('')

    let user
    try {
      user = await findUserByEmail(email)
    } catch {
      // Servidor apagado, error HTTP o JSON inválido: no son credenciales incorrectas.
      setError(LOGIN_FAILED)
      submittingRef.current = false
      setSubmitting(false)
      return
    }

    // Proyecto académico: JSON Server guarda la contraseña en texto plano.
    if (user === null || user.password !== password) {
      setError(INVALID_CREDENTIALS)
      submittingRef.current = false
      setSubmitting(false)
      return
    }

    const home = Object.hasOwn(HOME_BY_ROLE, user.rol) ? HOME_BY_ROLE[user.rol] : null
    try {
      if (home === null) throw new TypeError('Rol de usuario inesperado.')
      // login() sanitiza el usuario y excluye password antes de guardar la sesión.
      login(user)
    } catch {
      setError(LOGIN_FAILED)
      submittingRef.current = false
      setSubmitting(false)
      return
    }

    navigate(home, { replace: true })
  }

  return (
    <section className="section login-page" aria-labelledby="login-title">
      <title>Inicio de sesión — CheckPoint Store</title>
      <div className="container">
        <div className="contenedor-formulario">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-secondary text-white text-center py-2">
              <h1 id="login-title" className="mb-0 fs-6 text-uppercase fw-semibold">Inicio de sesión</h1>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label fw-semibold">Correo electrónico</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    className="form-control"
                    autoComplete="email"
                    maxLength={100}
                    placeholder="nombre@ejemplo.com"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={error !== '' || undefined}
                    aria-describedby={error ? 'login-error' : undefined}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="login-password" className="form-label fw-semibold">Contraseña</label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    className="form-control"
                    autoComplete="current-password"
                    placeholder="Ingresa tu contraseña"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={error !== '' || undefined}
                    aria-describedby={error ? 'login-error' : undefined}
                  />
                </div>

                <div id="login-error" className="login-error" role="alert">
                  {error && <p className="alert alert-danger py-2 mb-3">{error}</p>}
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-dark py-2 login-submit" disabled={submitting}>
                    {submitting ? 'Ingresando...' : 'Iniciar sesión'}
                  </button>
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted small">¿No tienes cuenta? </span>
                  <Link to="/registro" className="small text-decoration-none">Regístrate aquí</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
