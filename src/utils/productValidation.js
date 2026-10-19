import { CATALOG_CATEGORIES } from '../config/catalogCategories'
import { STORE_ECOSYSTEMS } from '../config/storeEcosystems'

export function normalizeProductCode(code) {
  return code.trim().toUpperCase()
}

function validInteger(value, minimum) {
  const number = Number(value)
  return value.trim() !== '' && Number.isSafeInteger(number) && number >= minimum
}

export function validateProductForm({ product, inventory }) {
  const errors = {}
  const code = normalizeProductCode(product.codigo)
  if (!code) errors.codigo = 'El código es obligatorio.'
  else if (code.length < 3) errors.codigo = 'El código debe tener al menos 3 caracteres.'

  if (!product.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
  else if (product.nombre.trim().length > 100) errors.nombre = 'Máximo 100 caracteres.'

  if (!CATALOG_CATEGORIES.some(category => category.value === product.categoria)) {
    errors.categoria = 'Selecciona una categoría válida.'
  }
  if (!STORE_ECOSYSTEMS.some(ecosystem => ecosystem.value === product.ecosistema)) {
    errors.ecosistema = 'Selecciona un ecosistema válido.'
  }
  if (!validInteger(product.precio, 1)) {
    errors.precio = 'Ingresa un precio entero seguro mayor que 0.'
  }
  // Con "Producto en oferta" marcado, el precio de oferta es obligatorio y menor al normal.
  if (product.enOferta) {
    if (!validInteger(product.precioOferta, 1)) {
      errors.precioOferta = 'Ingresa un precio de oferta entero mayor que 0.'
    } else if (validInteger(product.precio, 1) && Number(product.precioOferta) >= Number(product.precio)) {
      errors.precioOferta = 'El precio de oferta debe ser menor que el precio normal.'
    }
  }
  // El formulario antiguo generaba la descripción corta con los primeros 120 caracteres.
  if (product.descripcionCorta.length > 120) errors.descripcionCorta = 'Máximo 120 caracteres.'
  if (product.descripcionLarga.length > 500) errors.descripcionLarga = 'Máximo 500 caracteres.'
  if (product.formato !== '' && !['fisico', 'digital'].includes(product.formato)) {
    errors.formato = 'Selecciona un formato válido o déjalo vacío.'
  }
  if (!validInteger(inventory.stock, 0)) {
    errors.stock = 'Ingresa un stock entero seguro mayor o igual a 0.'
  }
  if (inventory.stockCritico.trim() !== '' && !validInteger(inventory.stockCritico, 0)) {
    errors.stockCritico = 'Ingresa un stock crítico entero seguro mayor o igual a 0, o déjalo vacío.'
  }
  return errors
}
