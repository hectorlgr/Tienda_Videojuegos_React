// Clasificación comercial única por producto, independiente de categoria.
// value: se guarda en productos.ecosistema y se usa en la URL /categorias/:ecosistema.
export const STORE_ECOSYSTEMS = [
  {
    value: 'playstation',
    label: 'PlayStation',
    icon: 'fa-gamepad',
    description: 'Consolas, juegos y accesorios del ecosistema Sony PlayStation.',
  },
  {
    value: 'xbox',
    label: 'Xbox',
    icon: 'fa-dot-circle-o',
    description: 'Todo para Xbox Series X|S y la familia Microsoft.',
  },
  {
    value: 'nintendo',
    label: 'Nintendo',
    icon: 'fa-star',
    description: 'Nintendo Switch, sus juegos, controles y figuras amiibo.',
  },
  {
    value: 'otros',
    label: 'Otros',
    icon: 'fa-th-large',
    description: 'PC, multiplataforma y productos de otras marcas.',
  },
]
