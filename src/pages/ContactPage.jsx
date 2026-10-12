import { useState } from 'react'
import { validateContact } from '../utils/contactValidation'

const fields = [
  { name: 'nombre', label: 'Nombre completo', type: 'text', maxLength: 100, autoComplete: 'name', placeholder: 'Escribe tu nombre...' },
  { name: 'correo', label: 'Correo electrónico', type: 'email', maxLength: 100, autoComplete: 'email', placeholder: 'Escribe tu email...' },
  { name: 'comentario', label: 'Comentario', maxLength: 500, placeholder: 'Escribe tu mensaje...' },
]

export default function ContactPage() {
  const [values, setValues] = useState({ nombre: '', correo: '', comentario: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    const nextErrors = validateContact(next)
    setErrors(current => submitted ? nextErrors : { ...current, [name]: nextErrors[name] })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setErrors(validateContact(values))
  }

  return (
    <section className="section contact-page" aria-labelledby="contact-title">
      <title>Contacto — CheckPoint Store</title>
      <div className="container">
        <div className="card shadow-sm border-0 contact-card">
          <div className="card-header bg-secondary text-white text-center py-3">
            <h1 id="contact-title" className="mb-0 fs-5 text-white">Ponte en contacto con nosotros</h1>
          </div>
          <div className="card-body p-3 p-md-4">
            <p className="text-muted">Por ahora este formulario solo valida tus datos; el envío no está disponible.</p>
            <form onSubmit={handleSubmit} noValidate>
              <div role="alert">
                {submitted && Object.values(errors).some(Boolean) && (
                  <p className="alert alert-danger">Revisa los campos indicados.</p>
                )}
              </div>
              {fields.map(({ name, label, ...attributes }) => {
                const id = `contact-${name}`
                const props = {
                  ...attributes,
                  id,
                  name,
                  required: true,
                  value: values[name],
                  onChange: handleChange,
                  className: `form-control${errors[name] ? ' is-invalid' : ''}`,
                  'aria-invalid': errors[name] ? true : undefined,
                  'aria-describedby': [name === 'comentario' && 'contact-count', errors[name] && `${id}-error`].filter(Boolean).join(' ') || undefined,
                }
                return (
                  <div key={name} className="mb-3">
                    <label htmlFor={id} className="form-label fw-semibold">{label}</label>
                    {name === 'comentario' ? <textarea {...props} rows={4} /> : <input {...props} />}
                    {errors[name] && <div id={`${id}-error`} className="invalid-feedback">{errors[name]}</div>}
                    {name === 'comentario' && (
                      <p id="contact-count" className="form-text text-end mb-0">{values.comentario.length}/500 caracteres</p>
                    )}
                  </div>
                )
              })}
              <button type="submit" className="btn btn-dark w-100 py-2">Enviar mensaje</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
