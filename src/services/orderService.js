import { getJson } from './httpClient.js'

export function getOrders() {
  return getJson('ordenes')
}
