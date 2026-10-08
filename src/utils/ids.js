export function assertNumericId(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new TypeError('El ID debe ser un número entero positivo seguro.')
  }
}
