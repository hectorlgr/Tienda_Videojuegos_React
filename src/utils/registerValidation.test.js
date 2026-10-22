import { describe, it, expect } from 'vitest'
import { isValidRun, validateRegistration } from './registerValidation.js'

const validValues = {
  run: '12.345.678-5',
  nombre: 'Juan',
  apellidos: 'Pérez González',
  correo: 'juan.perez@duoc.cl',
  password: 'Clave123!',
  confirmPassword: 'Clave123!',
  direccion: 'Av. Siempre Viva 742',
  region: 'metropolitana',
  comuna: 'Santiago',
}

describe('Validación del formulario de registro', () => {
  it('acepta un registro con todos los datos correctos', () => {
    const errors = validateRegistration(validValues)

    expect(errors).toEqual({})
    expect(Object.keys(errors).length).toBe(0)
  })

  it('produce un error cuando un campo obligatorio está vacío', () => {
    const errors = validateRegistration({ ...validValues, nombre: '   ' })

    expect(errors.nombre).toBe('El nombre es obligatorio.')
    expect(Object.keys(errors)).toEqual(['nombre'])
  })

  it('rechaza un RUN con dígito verificador incorrecto', () => {
    const errors = validateRegistration({ ...validValues, run: '12.345.678-9' })

    expect(isValidRun('12.345.678-5')).toBe(true)
    expect(isValidRun('12.345.678-9')).toBe(false)
    expect(errors.run).toBe('El RUN o dígito verificador no es válido.')
  })
})
