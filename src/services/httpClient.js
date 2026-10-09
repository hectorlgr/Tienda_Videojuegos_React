import { API_BASE_URL } from '../config/api.js'

export class HttpError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export function getJson(resource, query = {}) {
  return requestJson(resource, query)
}

export function postJson(resource, data) {
  return requestJson(resource, {}, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

async function requestJson(resource, query, options = {}) {
  const url = new URL(resource.replace(/^\/+/, ''), API_BASE_URL)

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value)
  }

  let response

  try {
    response = await fetch(url, {
      ...options,
      headers: { Accept: 'application/json', ...options.headers },
    })
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
