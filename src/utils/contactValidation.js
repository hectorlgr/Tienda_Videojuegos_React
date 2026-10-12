// Patrón de la referencia, anclado a toda la dirección y sin distinguir mayúsculas.
const EMAIL_PATTERN = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i

export function validateContact(values) {
  const errors = {}
  if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
  else if (values.nombre.length > 100) errors.nombre = 'El nombre no puede superar los 100 caracteres.'

  if (!values.correo.trim()) errors.correo = 'El correo es obligatorio.'
  else if (values.correo.length > 100) errors.correo = 'El correo no puede superar los 100 caracteres.'
  else if (!EMAIL_PATTERN.test(values.correo.trim())) errors.correo = 'Ingresa un formato de correo electrónico válido.'

  if (!values.comentario.trim()) errors.comentario = 'El comentario es obligatorio.'
  else if (values.comentario.length > 500) errors.comentario = 'El comentario no puede superar los 500 caracteres.'
  return errors
}
