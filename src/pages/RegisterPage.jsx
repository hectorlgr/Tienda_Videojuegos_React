import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SHIPPING_REGIONS } from '../config/shippingRegions'
import { formatRun, validateRegistration } from '../utils/registerValidation'

const initialValues = {
  run: '', nombre: '', apellidos: '', correo: '', password: '',
  confirmPassword: '', direccion: '', region: '', comuna: '',
}

const fields = [
  { name: 'run', label: 'RUN', maxLength: 12, placeholder: 'Ej.: 12.345.678-5', autoComplete: 'off' },
  { name: 'nombre', label: 'Nombre', maxLength: 50, autoComplete: 'given-name', half: true },
  { name: 'apellidos', label: 'Apellidos', maxLength: 100, autoComplete: 'family-name', half: true },
  { name: 'correo', label: 'Correo electrónico', type: 'email', maxLength: 100, autoComplete: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password', autoComplete: 'new-password', half: true },
  { name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', autoComplete: 'new-password', half: true },
  { name: 'direccion', label: 'Dirección', maxLength: 300, placeholder: 'Calle, número, departamento', autoComplete: 'street-address' },
]

export default function RegisterPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const region = SHIPPING_REGIONS.find(option => option.id === values.region)
  const errorCount = Object.keys(errors).length

  function handleChange(event) {
    const { name, value } = event.target
    const nextValues = {
      ...values,
      [name]: name === 'run' ? formatRun(value) : value,
      ...(name === 'region' ? { comuna: '' } : {}),
    }
    setValues(nextValues)
    if (submitted) setErrors(validateRegistration(nextValues))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setErrors(validateRegistration(values))
    // Esta fase termina en la validación local; todavía no se crea una cuenta.
  }

  function controlProps(name, className = 'form-control') {
    const descriptions = [
      name === 'password' && 'register-password-help',
      errors[name] && `register-${name}-error`,
    ].filter(Boolean).join(' ')

    return {
      id: `register-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      required: true,
      className: `${className}${errors[name] ? ' is-invalid' : ''}`,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': descriptions || undefined,
    }
  }

  function feedback(name) {
    return errors[name] && (
      <div id={`register-${name}-error`} className="invalid-feedback">{errors[name]}</div>
    )
  }

  return (
    <section className="section register-page" aria-labelledby="register-title">
      <title>Registro de usuario — CheckPoint Store</title>
      <div className="container">
        <div className="contenedor-formulario registro">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-secondary text-white text-center py-2">
              <h1 id="register-title" className="mb-0 fs-6 text-uppercase fw-semibold">Registro de usuario</h1>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div role="alert">
                  {errorCount > 0 && <p className="alert alert-danger py-2">Revisa los campos indicados: {errorCount} con errores.</p>}
                </div>
                <div className="row g-3">
                  {fields.map(({ name, label, half, ...inputProps }) => (
                    <div key={name} className={half ? 'col-12 col-md-6' : 'col-12'}>
                      <label htmlFor={`register-${name}`} className="form-label fw-semibold">{label}</label>
                      <input type="text" {...inputProps} {...controlProps(name)} />
                      {name === 'password' && (
                        <p id="register-password-help" className="form-text mb-0">
                          Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                        </p>
                      )}
                      {feedback(name)}
                    </div>
                  ))}
                  <div className="col-12 col-md-6">
                    <label htmlFor="register-region" className="form-label fw-semibold">Región</label>
                    <select {...controlProps('region', 'form-select')} autoComplete="address-level1">
                      <option value="">Selecciona una región</option>
                      {SHIPPING_REGIONS.map(option => <option key={option.id} value={option.id}>{option.nombre}</option>)}
                    </select>
                    {feedback('region')}
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="register-comuna" className="form-label fw-semibold">Comuna</label>
                    <select {...controlProps('comuna', 'form-select')} autoComplete="address-level2" disabled={!region}>
                      <option value="">Selecciona una comuna</option>
                      {region?.comunas.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    {feedback('comuna')}
                  </div>
                </div>
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-dark py-2">Registrarse</button>
                </div>
                <div className="text-center mt-3">
                  <span className="text-muted small">¿Ya tienes cuenta? </span>
                  <Link to="/login" className="small text-decoration-none">Iniciar sesión</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
