import { useState } from 'react'
import { CATALOG_CATEGORIES } from '../../config/catalogCategories'
import { normalizeProductCode, validateProductForm } from '../../utils/productValidation'

const initialValues = {
  product: {
    codigo: '', nombre: '', categoria: '', precio: '', imagen: '', imagenes: '',
    descripcionCorta: '', descripcionLarga: '', formato: '', plataforma: '',
    compatibilidad: '', franquicia: '',
  },
  inventory: { stock: '', stockCritico: '' },
}

const productFields = [
  { name: 'codigo', label: 'Código comercial', required: true, help: 'Mínimo 3 caracteres. Se normaliza a mayúsculas al salir del campo o validar.' },
  { name: 'nombre', label: 'Nombre', required: true, maxLength: 100 },
  { name: 'categoria', label: 'Categoría', required: true, options: CATALOG_CATEGORIES },
  { name: 'precio', label: 'Precio (CLP)', type: 'number', min: 1, required: true },
  { name: 'descripcionCorta', label: 'Descripción corta', multiline: true, maxLength: 120 },
  { name: 'descripcionLarga', label: 'Descripción larga', multiline: true, maxLength: 500 },
  { name: 'imagen', label: 'Ruta de imagen principal', help: 'Ruta relativa a public, por ejemplo img/cara_elden_ring.jpg. Puede quedar vacía; la tienda dispone de imagen de respaldo.' },
  { name: 'imagenes', label: 'Rutas de la galería', multiline: true, help: 'Una ruta relativa a public por línea. No se cargan ni se previsualizan archivos.' },
  { name: 'formato', label: 'Formato', options: [{ value: 'fisico', label: 'Físico' }, { value: 'digital', label: 'Digital' }] },
  { name: 'plataforma', label: 'Plataforma' },
  { name: 'compatibilidad', label: 'Compatibilidad' },
  { name: 'franquicia', label: 'Franquicia' },
]

const inventoryFields = [
  { name: 'stock', label: 'Stock inicial', type: 'number', min: 0, required: true },
  { name: 'stockCritico', label: 'Stock crítico', inputMode: 'numeric', help: 'Vacío representa un stock crítico sin definir (null).' },
]

export default function AdminProductCreatePage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function changeValue(group, name, value) {
    const next = { ...values, [group]: { ...values[group], [name]: value } }
    setValues(next)
    if (submitted) setErrors(validateProductForm(next))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const next = {
      ...values,
      product: { ...values.product, codigo: normalizeProductCode(values.product.codigo) },
    }
    setValues(next)
    setSubmitted(true)
    setErrors(validateProductForm(next))
  }

  function renderField(group, field) {
    const { name, label, required, maxLength, multiline, options, help, type = 'text', min, inputMode } = field
    const id = `new-product-${name}`
    const props = {
      id, name, required, maxLength,
      value: values[group][name],
      onChange: event => changeValue(group, name, event.target.value),
      className: `${options ? 'form-select' : 'form-control'}${errors[name] ? ' is-invalid' : ''}`,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': [help && `${id}-help`, errors[name] && `${id}-error`].filter(Boolean).join(' ') || undefined,
    }
    return (
      <div className="col-12 col-md-6" key={name}>
        <label htmlFor={id} className="form-label fw-semibold">
          {label}{!required && <span className="text-muted fw-normal"> (opcional)</span>}
        </label>
        {options ? (
          <select {...props}>
            <option value="">Selecciona una opción</option>
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        ) : multiline ? (
          <textarea {...props} rows={3} />
        ) : (
          <input
            {...props}
            type={type}
            inputMode={inputMode}
            min={min}
            step={type === 'number' ? 1 : undefined}
            max={type === 'number' ? Number.MAX_SAFE_INTEGER : undefined}
            onBlur={name === 'codigo' ? () => changeValue(group, name, normalizeProductCode(values[group][name])) : undefined}
          />
        )}
        {help && <p id={`${id}-help`} className="form-text mb-0">{help}</p>}
        {errors[name] && <div id={`${id}-error`} className="invalid-feedback">{errors[name]}</div>}
      </div>
    )
  }

  return (
    <section className="section admin-product-create-page" aria-labelledby="new-product-title">
      <title>Nuevo producto — CheckPoint Store</title>
      <div className="container">
        <div className="card shadow-sm">
          <div className="card-header bg-secondary text-white text-center py-3">
            <h1 id="new-product-title" className="mb-0 fs-4">Nuevo producto</h1>
          </div>
          <div className="card-body p-3 p-md-4">
            <p className="text-muted">En esta etapa solo se validan los datos localmente; no se guardan productos.</p>
            <form onSubmit={handleSubmit} noValidate>
              <div role="alert">
                {Object.keys(errors).length > 0 && (
                  <p className="alert alert-danger">Revisa los campos indicados: {Object.keys(errors).length} con errores.</p>
                )}
              </div>
              <fieldset className="mb-4">
                <legend className="fs-5 fw-semibold">Producto</legend>
                <div className="row g-3">{productFields.map(field => renderField('product', field))}</div>
              </fieldset>
              <fieldset className="mb-4">
                <legend className="fs-5 fw-semibold">Inventario</legend>
                <div className="row g-3">{inventoryFields.map(field => renderField('inventory', field))}</div>
              </fieldset>
              <button type="submit" className="btn btn-dark w-100 py-2">Crear producto</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
