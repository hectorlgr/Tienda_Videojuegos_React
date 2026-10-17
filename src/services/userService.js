import { getJson, postJson } from './httpClient.js'

// Incluye password (JSON Server académico): quien llame no debe mostrarla ni persistirla.
export function getUsers() {
  return getJson('usuarios')
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
