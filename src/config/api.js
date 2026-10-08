const configuredUrl = import.meta.env.VITE_API_URL?.trim()

if (!configuredUrl) {
  throw new Error('Falta VITE_API_URL. Copia .env.example a .env y reinicia Vite.')
}

const baseUrl = new URL(configuredUrl)

if (!['http:', 'https:'].includes(baseUrl.protocol)) {
  throw new Error('VITE_API_URL debe ser una URL HTTP o HTTPS.')
}

export const API_BASE_URL = `${baseUrl.href.replace(/\/+$/, '')}/`
