import { assertNumericId } from '../utils/ids.js'
import { getJson, postJson, HttpError } from './httpClient.js'

export class UserNotFoundError extends HttpError {
  constructor(userId) {
    super(`No existe el usuario con ID ${userId}.`, 404)
    this.name = 'UserNotFoundError'
  }
}

// Incluye password (JSON Server académico): quien llame no debe mostrarla ni persistirla.
export function getUsers() {
  return getJson('usuarios')
}

// Igual que getUsers, la respuesta incluye password.
export async function getUserById(id) {
  assertNumericId(id)

  try {
    return await getJson(`usuarios/${id}`)
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      throw new UserNotFoundError(id)
    }

    throw error
  }
}

export function createUser(userData) {
  return postJson('usuarios', userData)
}

export async function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase()
  const users = await getJson('usuarios', { correo: normalizedEmail })

  return users[0] ?? null
}

export async function findUserByRun(run) {
  // Un RUN ausente no debe coincidir con los usuarios de demostración.
  if (typeof run !== 'string' || run.trim() === '') {
    return null
  }

  const normalizedRun = run.trim()
  const users = await getJson('usuarios', { run: normalizedRun })

  return users.find(user => typeof user.run === 'string' && user.run === normalizedRun) ?? null
}
