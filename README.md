# CheckPoint Store — Infraestructura React

Infraestructura de React, Vite, React Router y layouts basados en Electro, con JSON Server como API simulada independiente. Las páginas siguen siendo placeholders, sin lógica de negocio ni conexión a la API.

## Ejecutar

- `npm install`: instalar las dependencias del proyecto.
- `npm run dev`: iniciar Vite para desarrollo, normalmente en `http://localhost:5173` (consultar la URL mostrada en la terminal).
- `npm run server`: iniciar JSON Server en `http://127.0.0.1:3001`.
- `npm run build`: generar la aplicación en `dist`.
- `npm run preview`: revisar el build localmente.
- `npm run lint`: ejecutar ESLint.

Bootstrap se importa exclusivamente desde npm en `src/main.jsx`. No se carga JavaScript de Bootstrap porque esta fase no utiliza sus plugins; el menú adaptable funciona con estado React.

## JSON Server

Se utiliza JSON Server **0.17.4**, versión estable fijada como dependencia de desarrollo. Para ejecutar ambos procesos, abrir dos terminales en `tienda-react`: ejecutar `npm run dev` en una y `npm run server` en la otra. No se incorporan herramientas para iniciarlos simultáneamente. Detener cada proceso con `Ctrl+C`.

El script de JSON Server observa `db.json` en la raíz del proyecto y escucha únicamente en la interfaz local, puerto **3001**, independiente de Vite.

`db.json` contiene ocho productos base, ocho registros de inventario independientes, tres usuarios y siete órdenes de demostración. No se implementaron servicios, peticiones desde React, Context, autenticación, guards o carrito; las páginas siguen siendo placeholders.

## Datos iniciales de productos e inventario

La fuente del catálogo es exclusivamente el arreglo `PRODUCTOS` de `data-productos.js` del proyecto original, leído como referencia sin modificarlo. No se utilizaron los productos ni los precios escritos manualmente en Home, ni datos persistidos en el navegador.

Cada producto contiene `id`, `codigo`, `nombre`, `categoria`, `precio`, `imagen`, `imagenes`, `descripcionCorta` y `descripcionLarga`. Los campos específicos se omiten cuando no corresponden: los juegos incluyen `formato` y `plataforma`; los accesorios, `compatibilidad`; las figuras, `franquicia`. Las consolas no tienen campos específicos adicionales en la fuente original.

El ID técnico del producto es numérico y conserva los valores 1 a 8. El código comercial es una cadena independiente, con prefijo por categoría y una secuencia inicial de tres dígitos dentro de ella:

| ID de producto | Código comercial | Producto | Precio CLP | Stock inicial |
| --- | --- | --- | ---: | ---: |
| 1 | JUE-001 | Elden Ring | 45000 | 15 |
| 2 | JUE-002 | Super Mario Odyssey | 50000 | 999 |
| 3 | CON-001 | PlayStation 5 | 550000 | 6 |
| 4 | CON-002 | Nintendo Switch OLED | 350000 | 9 |
| 5 | ACC-001 | Control DualSense | 65000 | 30 |
| 6 | ACC-002 | Guitarra Guitar Hero | 40000 | 8 |
| 7 | FIG-001 | Amiibo Bowser | 25000 | 20 |
| 8 | FIG-002 | Funko Pop Kratos | 15000 | 25 |

Estos códigos son datos iniciales, no una regla automática para futuras altas. Posteriormente el administrador introducirá el código y deberá validarse su unicidad; esa funcionalidad no está implementada.

Cada registro de `/inventario` tiene esta estructura:

```json
{
  "id": 1,
  "productoId": 1,
  "stock": 15,
  "stockCritico": null
}
```

Los IDs de inventario también son numéricos, únicos dentro de su colección y van de 1 a 8. Aunque coinciden con los IDs de producto en estos datos iniciales, la relación se establece exclusivamente por `productoId`; `inventario.id` identifica al registro de inventario.

Hay exactamente un inventario por producto, sin referencias huérfanas. `/productos` no guarda `stock` ni `stockCritico`. Los ocho valores de `stockCritico` son `null`, porque la fuente no define un umbral. No se agregó lógica para ese campo. Esta separación prepara Catálogo e Inventario como recursos independientes para su futura separación en microservicios.

### Normalización de imágenes y campos

- Se conservaron nombres, categorías, precios, descripciones y atributos específicos del arreglo original.
- Las rutas históricas `assets/img/...` se normalizaron a `img/...`, que corresponde a los archivos existentes en `public/img` de React. Son rutas públicas de imágenes, no rutas de recursos del catálogo.
- Todos los productos tienen `imagenes` como arreglo. Kratos, que solo tenía `imagen`, ahora tiene una galería de un elemento. Se conserva el orden de las otras galerías, incluida la imagen repetida de la guitarra.
- La tercera imagen de Bowser, `assets/img/cara_mesa_amiibo.jpg`, no existe. Esa entrada se sustituyó por `img/image-placeholder.svg`, el placeholder ya disponible. No se crearon ni modificaron imágenes.

### Comprobación HTTP

Con `npm run server` activo en `http://127.0.0.1:3001`:

| Petición | Respuesta esperada |
| --- | --- |
| `GET /productos` | HTTP 200, arreglo de 8 productos sin campos de stock |
| `GET /productos/1` | HTTP 200, Elden Ring, código JUE-001 y precio 45000 |
| `GET /inventario` | HTTP 200, arreglo de 8 registros |
| `GET /inventario?productoId=1` | HTTP 200, un registro con productoId 1, stock 15 y stockCritico null |
| `GET /usuarios` | HTTP 200, arreglo de 3 usuarios de demostración |
| `GET /usuarios/1` | HTTP 200, Administrador General, rol administrador |
| `GET /ordenes` | HTTP 200, arreglo de 7 órdenes de demostración |
| `GET /ordenes/1` | HTTP 200, orden de Luisa Gómez, montoTotal 650000, estado Pendiente |

## Datos iniciales de usuarios y órdenes

Los datos proceden de los arreglos `USUARIOS` y `ordenes` de los scripts originales `usuarios.js` y `admin_ordenes.js`, utilizados exclusivamente como referencia. Se conservaron todos sus valores sin corregir grafías, mayúsculas, acentos, RUN ni direcciones. Los productos y el inventario existentes no se modificaron.

### Usuarios

La estructura de cada usuario es: `id`, `run`, `nombre`, `apellidos`, `correo`, `password`, `direccion`, `region`, `comuna` y `rol`.

| ID técnico | Nombre conservado | Correo conservado | Rol |
| --- | --- | --- | --- |
| 1 | Administrador General | admin@checkpointstore.cl | administrador |
| 2 | Vendedor Tienda | vendedor@checkpointstore.cl | vendedor |
| 3 | Cliente Demo | cliente@checkpointstore.cl | cliente |

Los IDs son numéricos, estables y únicos dentro de la colección. `tipoUsuario` se normalizó a `rol`; sus únicos valores son `administrador`, `vendedor` y `cliente`.

En los tres usuarios se dejaron `run`, `apellidos`, `direccion`, `region` y `comuna` en `null`, porque no existen en la fuente. Los nombres se mantuvieron completos, sin dividirlos artificialmente.

Los correos y contraseñas se conservaron exactamente. Las contraseñas se mantienen en texto plano exclusivamente para la autenticación académica simulada con JSON Server; no se implementó hashing ni seguridad de backend. El futuro registro asignará rol `cliente`, pero esa funcionalidad aún no existe.

### Órdenes

La estructura de cada orden es: `id`, `run`, `nombre`, `apellido`, `correo`, `region`, `comuna`, `direccion`, `montoTotal` y `estado`.

| ID técnico | Nombre y apellido conservados | Monto total | Estado |
| --- | --- | ---: | --- |
| 1 | Luisa Gómez | 650000 | Pendiente |
| 2 | Carlos Sepulveda | 1200000 | Pagado |
| 3 | Ana Rojas | 800000 | Enviado |
| 4 | Pedro López | 950000 | Entregado |
| 5 | María Fernández | 720000 | Pendiente |
| 6 | José Ramírez | 1500000 | Pagado |
| 7 | Camila Torres | 890000 | Enviado |

Los IDs son numéricos, estables y únicos dentro de la colección. Se normalizaron únicamente los nombres de campos `rut` a `run` y `monto` a `montoTotal`; se conserva `apellido` singular en las órdenes y `apellidos` en los usuarios.

No se omitieron datos de los registros originales ni se agregaron productos, cantidades, fechas, métodos de pago, detalles o `usuarioId`. Las personas de las órdenes no están relacionadas con los usuarios de demostración. Las órdenes se destinan únicamente a consulta en esta entrega: no se implementaron CRUD, detalle ni lógica de estados.

La migración solo incorpora datos; no traslada las funciones de búsqueda, generación de tablas o colores de badges de los scripts antiguos.

## Estructura

```text
tienda-react/
├── index.html
├── db.json                          # 8 productos, 8 inventarios, 3 usuarios y 7 órdenes
├── public/
│   ├── fonts/                       # Font Awesome
│   └── img/                         # Imágenes existentes + image-placeholder.svg
└── src/
    ├── App.jsx                      # BrowserRouter
    ├── main.jsx                     # Montaje e imports de estilos ordenados
    ├── app/
    │   └── AppRouter.jsx            # Rutas anidadas y redirección /admin
    ├── layouts/
    │   ├── StoreLayout.jsx
    │   └── AdminLayout.jsx
    ├── components/
    │   ├── common/
    │   │   ├── BrandLogo.jsx
    │   │   ├── ImageWithFallback.jsx
    │   │   ├── Navigation.jsx
    │   │   ├── PagePlaceholder.jsx
    │   │   └── TopBar.jsx
    │   ├── store/
    │   │   ├── StoreHeader.jsx
    │   │   ├── StoreNavbar.jsx
    │   │   └── StoreFooter.jsx       # Único footer público, siempre extendido
    │   └── admin/
    │       ├── AdminHeader.jsx
    │       ├── AdminNavbar.jsx
    │       └── AdminFooter.jsx       # Footer reducido independiente
    ├── pages/
    │   ├── HomePage.jsx
    │   ├── ProductsPage.jsx
    │   ├── ProductDetailPage.jsx
    │   ├── CartPage.jsx
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── ContactPage.jsx
    │   ├── ReviewsPage.jsx
    │   ├── NotFoundPage.jsx
    │   └── admin/
    │       ├── AdminOrdersPage.jsx
    │       ├── AdminStockPage.jsx
    │       └── AdminProductCreatePage.jsx
    ├── styles/
    │   ├── font-awesome.min.css
    │   ├── electro.css
    │   ├── custom.css
    │   └── app.css                  # Adaptaciones de layouts y navegación
    └── utils/
        └── assets.js                # URLs públicas con BASE_URL de Vite
```

## Rutas

| Ruta | Página | Layout |
| --- | --- | --- |
| `/` | HomePage | StoreLayout |
| `/productos` | ProductsPage | StoreLayout |
| `/productos/:id` | ProductDetailPage | StoreLayout |
| `/carrito` | CartPage | StoreLayout |
| `/login` | LoginPage | StoreLayout |
| `/registro` | RegisterPage | StoreLayout |
| `/contacto` | ContactPage | StoreLayout |
| `/criticas` | ReviewsPage | StoreLayout |
| `/admin/ordenes` | AdminOrdersPage | AdminLayout |
| `/admin/stock` | AdminStockPage | AdminLayout |
| `/admin/productos/nuevo` | AdminProductCreatePage | AdminLayout |
| `/admin` | Redirección a `/admin/ordenes` | AdminLayout |
| `/admin/*` desconocida | NotFoundPage | AdminLayout |
| Cualquier otra ruta desconocida | NotFoundPage | StoreLayout |

La página de detalle solo muestra el parámetro recibido, sin consultar productos. Los enlaces de categorías conservan `?categoria=...`, pero todavía no filtran.

Las rutas administrativas están abiertas para revisar la infraestructura. No se implementan autenticación, roles ni un logout ficticio. La cabecera administrativa ofrece volver a la tienda.

## Recursos y límites

- Los estilos de Electro, personalizaciones y Font Awesome se trasladaron desde `public/css` a `src/styles`; Vite gestiona su orden junto con Bootstrap npm.
- Font Awesome referencia `/fonts` y el fondo del tema referencia `/img`; las imágenes de componentes utilizan `publicAsset`.
- `ImageWithFallback` utiliza `public/img/image-placeholder.svg` cuando falta la ruta o falla una imagen. Conserva el texto alternativo y evita reintentos infinitos del fallback.
- Se retiraron el Bootstrap local duplicado, CSS/fuentes de Slick, CSS de noUiSlider y reglas de plugins retirados del tema.
- Se retiraron los estilos y recursos iniciales de Vite. La fuente pública es Lato, coherente con Electro.
- Bootstrap y React Router ya estaban disponibles. JSON Server 0.17.4 se agregó como dependencia de desarrollo; `package.json` y el lockfile registran esta instalación.
- Se corrigió la indentación de `.gitignore`: impedía ignorar correctamente la carpeta generada `dist` y otros patrones.
- No hay jQuery, Slick, scripts antiguos, `public/js`, servicios HTTP, AuthContext ni CartContext. JSON Server y `db.json` están preparados, pero React todavía no los consume.
- La búsqueda está deshabilitada. Los textos del footer sin página existente se muestran sin enlaces ficticios. Las referencias visuales de medios de pago no ejecutan pagos.
- No se modificó el proyecto original `Tienda Videojuegos`.

## Verificación de la infraestructura React

- `npm run build` y `npm run lint`: correctos.
- Navegador sobre el build: las once rutas públicas/administrativas, detalle con parámetro, redirección de `/admin` y ambas rutas 404.
- Un solo footer por página, extendido en público y reducido en administración.
- Menús públicos y administrativos a 390 px: apertura, navegación y cierre al cambiar de ruta.
- Logo cargado, iconos Font Awesome y ausencia de enlaces a archivos HTML.
- Sin errores ni advertencias de consola durante las comprobaciones.

Para un alojamiento futuro con BrowserRouter, el servidor deberá devolver `index.html` cuando se solicite directamente una ruta de la aplicación. Vite ya permite esa comprobación local; esta fase no configura hosting.
