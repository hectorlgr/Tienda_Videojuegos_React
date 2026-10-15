import { SHIPPING_REGIONS } from '../config/shippingRegions.js'

const EMAIL_PATTERN = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i

export function initialCheckoutDelivery(user) {
  const region = SHIPPING_REGIONS.find(option => option.id === user?.region)
  return {
    nombre: user?.nombre ?? '',
    apellidos: user?.apellidos ?? '',
    correo: user?.correo ?? '',
    direccion: user?.direccion ?? '',
    regionId: region?.id ?? '',
    comuna: region?.comunas.includes(user?.comuna) ? user.comuna : '',
  }
}

export function normalizeCheckoutDelivery(values) {
  return Object.fromEntries(Object.entries(values).map(([name, value]) => [name, value.trim()]))
}

export function validateCheckout(values) {
  const normalized = normalizeCheckoutDelivery(values)
  const errors = {}
  for (const [field, message, maxLength] of [
    ['nombre', 'El nombre es obligatorio.', 50],
    ['apellidos', 'Los apellidos son obligatorios.', 100],
    ['direccion', 'La dirección es obligatoria.', 300],
  ]) {
    if (!normalized[field]) errors[field] = message
    else if (normalized[field].length > maxLength) errors[field] = `Máximo ${maxLength} caracteres permitidos.`
  }

  if (!normalized.correo) errors.correo = 'El correo es obligatorio.'
  else if (normalized.correo.length > 100) errors.correo = 'Máximo 100 caracteres permitidos.'
  else if (!EMAIL_PATTERN.test(normalized.correo)) errors.correo = 'Formato de correo no válido.'

  const region = SHIPPING_REGIONS.find(option => option.id === normalized.regionId)
  if (!region) errors.regionId = 'Selecciona una región válida.'
  if (!region?.comunas.includes(normalized.comuna)) errors.comuna = 'Selecciona una comuna de la región elegida.'
  return errors
}
