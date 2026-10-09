// Sesión académica: JSON Server no es un sistema de autenticación real.
const SESSION_STORAGE_KEY = 'usuarioActivo'
const VALID_ROLES = ['cliente', 'vendedor', 'administrador']
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const OPTIONAL_FIELDS = ['run', 'nombre', 'apellidos', 'direccion', 'region', 'comuna']

// Copia solo los campos permitidos; password (y cualquier otro campo) queda fuera.
export function sanitizeSessionUser(user) {
  if (user === null || typeof user !== 'object' || Array.isArray(user)) return null
  if (!Number.isSafeInteger(user.id) || user.id <= 0) return null
  if (!VALID_ROLES.includes(user.rol)) return null

  const correo = typeof user.correo === 'string' ? user.correo.trim().toLowerCase() : ''
  if (!EMAIL_PATTERN.test(correo)) return null

  const sessionUser = { id: user.id, correo, rol: user.rol }
  for (const field of OPTIONAL_FIELDS) {
    const value = user[field]
    sessionUser[field] = typeof value === 'string' && value.trim() !== '' ? value.trim() : null
  }
  return sessionUser
}

export function readSession() {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (stored === null) return null

    let parsed = null
    try {
      parsed = JSON.parse(stored)
    } catch {
      // JSON corrupto: se trata igual que una sesión inválida.
    }
    const sessionUser = sanitizeSessionUser(parsed)
    if (sessionUser === null) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }
    // Reescribe la sesión si contenía campos extra (por ejemplo, password).
    const serialized = JSON.stringify(sessionUser)
    if (serialized !== stored) sessionStorage.setItem(SESSION_STORAGE_KEY, serialized)
    return sessionUser
  } catch {
    // Sin acceso al almacenamiento no hay sesión que restaurar.
    return null
  }
}

export function persistSession(sessionUser) {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser))
  } catch {
    // La sesión se mantiene en memoria durante la ejecución actual.
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // Si el almacenamiento está bloqueado no quedó nada persistido que borrar.
  }
}
