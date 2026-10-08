import { API_BASE_URL } from '../config/api.js'

export class HttpError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export async function getJson(resource, query = {}) {
  const url = new URL(resource.replace(/^\/+/, ''), API_BASE_URL)

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value)
  }

  let response

  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch (cause) {
    throw new Error(
      `No se pudo conectar con la API en ${url.origin}. Comprueba que JSON Server esté disponible.`,
      { cause },
    )
  }

  if (!response.ok) {
    throw new HttpError(
      `Error HTTP ${response.status} al consultar ${url.pathname}.`,
      response.status,
    )
  }

  try {
    return await response.json()
  } catch (cause) {
    throw new Error(`No se pudo leer la respuesta JSON de ${url.pathname}.`, { cause })
  }
}
