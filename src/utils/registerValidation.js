import { SHIPPING_REGIONS } from '../config/shippingRegions.js'

// Regla del proyecto original, aplicada al correo completo y sin distinguir mayúsculas.
const EMAIL_PATTERN = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/

// Conserva la limpieza y el algoritmo Módulo 11 del Registro original.
export function isValidRun(value) {
  const clean = value.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length < 7 || clean.length > 9) return false

  const body = clean.slice(0, -1)
  const checkDigit = clean.slice(-1)
  let sum = 0
  let multiplier = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number.parseInt(body.charAt(i), 10) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const remainder = 11 - (sum % 11)
  const expected = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder)
  return checkDigit === expected
}

export function formatRun(value) {
  const clean = value.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length < 2) return clean

  let body = clean.slice(0, -1)
  let formatted = ''
  while (body.length > 3) {
    formatted = `.${body.slice(-3)}${formatted}`
    body = body.slice(0, -3)
  }
  return `${body}${formatted}-${clean.slice(-1)}`
}

export function validateRegistration(values) {
  const errors = {}

  if (!values.run.trim()) errors.run = 'El RUN es obligatorio.'
  else if (!isValidRun(values.run)) errors.run = 'El RUN o dígito verificador no es válido.'

  for (const [field, label, maxLength] of [
    ['nombre', 'El nombre es obligatorio.', 50],
    ['apellidos', 'Los apellidos son obligatorios.', 100],
    ['direccion', 'La dirección es obligatoria.', 300],
  ]) {
    const value = values[field].trim()
    if (!value) errors[field] = label
    else if (value.length > maxLength) errors[field] = `Máximo ${maxLength} caracteres permitidos.`
  }

  const email = values.correo.trim()
  if (!email) errors.correo = 'El correo es obligatorio.'
  else if (email.length > 100) errors.correo = 'Máximo 100 caracteres permitidos.'
  else if (!EMAIL_PATTERN.test(email)) errors.correo = 'Formato de correo no válido.'

  // Recupera la regla antigua sin alterar la contraseña almacenada en el formulario.
  const password = values.password.trim()
  if (!password) errors.password = 'La contraseña es obligatoria.'
  else if (password.length < 8) errors.password = 'Debe tener al menos 8 caracteres.'
  else if (!PASSWORD_PATTERN.test(password)) {
    errors.password = 'Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.'
  }

  if (!values.confirmPassword) errors.confirmPassword = 'Confirma la contraseña.'
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Las contraseñas no coinciden.'

  const region = SHIPPING_REGIONS.find(option => option.id === values.region)
  if (!region) errors.region = 'Selecciona una región.'
  if (!region?.comunas.includes(values.comuna)) errors.comuna = 'Selecciona una comuna de la región elegida.'

  return errors
}
