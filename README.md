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

La estructura inicial contiene exclusivamente cuatro colecciones vacías:

```json
{
  "productos": [],
  "inventario": [],
  "usuarios": [],
  "ordenes": []
}
```

Las peticiones GET a `/productos`, `/inventario`, `/usuarios` y `/ordenes` en `http://127.0.0.1:3001` deben responder con HTTP 200 y `[]`. No se migraron datos del proyecto antiguo ni se implementaron servicios, peticiones desde React, Context, autenticación o carrito.

## Estructura

```text
tienda-react/
├── index.html
├── db.json                          # Cuatro colecciones vacías de la API simulada
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
