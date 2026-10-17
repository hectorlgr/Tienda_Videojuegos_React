export function orderStatusClass(status) {
  switch (status) {
    case 'Pendiente': return 'text-bg-warning'
    case 'Pagado': return 'text-bg-info'
    case 'Enviado': return 'text-bg-secondary'
    case 'Entregado': return 'text-bg-success'
    default: return 'text-bg-light'
  }
}
