export const ROLE_LABELS = {
  cliente: 'Cliente',
  vendedor: 'Vendedor',
  administrador: 'Administrador',
}

const ROLE_BADGES = {
  cliente: 'text-bg-light',
  vendedor: 'text-bg-info',
  administrador: 'text-bg-dark',
}

const PUBLIC_FIELDS = ['id', 'run', 'nombre', 'apellidos', 'correo', 'direccion', 'region', 'comuna', 'rol']

// /usuarios incluye password: se copia solo lo que el panel puede mostrar.
export function toPublicUser(user) {
  return Object.fromEntries(PUBLIC_FIELDS.map(field => [field, user[field] ?? null]))
}

export function fullName(user) {
  return [user.nombre, user.apellidos].filter(value => typeof value === 'string' && value.trim() !== '').join(' ')
}

export function roleLabel(rol) {
  return Object.hasOwn(ROLE_LABELS, rol) ? ROLE_LABELS[rol] : 'Rol desconocido'
}

export function roleBadgeClass(rol) {
  return Object.hasOwn(ROLE_BADGES, rol) ? ROLE_BADGES[rol] : 'text-bg-warning'
}

function normalizedText(value, lowercase = false) {
  if (typeof value !== 'string' || value.trim() === '') return null
  return lowercase ? value.trim().toLowerCase() : value.trim()
}

// Las órdenes no tienen usuarioId: solo se asocian si coincide el correo o el RUN.
export function findUserOrders(user, orders) {
  const email = normalizedText(user.correo, true)
  const run = normalizedText(user.run)
  if (email === null && run === null) return []

  return orders.filter(order => (
    (email !== null && normalizedText(order.correo, true) === email) ||
    (run !== null && normalizedText(order.run) === run)
  ))
}
