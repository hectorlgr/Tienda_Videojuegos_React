# CheckPoint Store

Migración de una tienda de videojuegos a **React + Vite + JavaScript**, con React Router y Bootstrap. Utiliza **JSON Server 0.17.4** como backend temporal para fines académicos; posteriormente será sustituido por un backend real.

## Requisitos e instalación

Necesitas **Node.js y npm**. Después de clonar el repositorio, abre una terminal en la carpeta `tienda-react` (la que contiene `package.json`):

```powershell
npm install
Copy-Item .env.example .env
```

La copia de `.env.example` solo es necesaria la primera vez, si aún no existe `.env`.

### Configuración

`VITE_API_URL` indica la dirección de la API temporal. `.env.example` contiene la configuración de referencia:

```env
VITE_API_URL=http://127.0.0.1:3001
```

Esta variable es pública y no contiene secretos. Reinicia Vite si cambias `.env`.

## Ejecutar en desarrollo

Utiliza **dos terminales**, ambas en `tienda-react`:

**Terminal 1 — datos temporales con JSON Server:**

```powershell
npm run server
```

Expone `db.json` en `http://127.0.0.1:3001`.

**Terminal 2 — frontend con Vite:**

```powershell
npm run dev
```

Abre la URL que indique Vite en la terminal, normalmente `http://localhost:5173`.

## Funcionalidades actuales

- **Home (`/`):** categorías, destacados con datos reales, banners y contenido informativo.
- **Catálogo (`/productos`):** búsqueda global, filtros por categoría y navegación al detalle (`/productos/:id`).
- **Carrito (`/carrito`):** añadir productos, modificar cantidades, eliminar y vaciar; consulta disponibilidad de inventario y mantiene el contador compartido.
- **Login y Registro (`/login`, `/registro`):** validaciones, creación de cuentas de cliente, sesión, logout público/administrativo, roles y rutas protegidas mediante guards.
- **Contacto (`/contacto`):** formulario con validaciones locales.
- **Críticas (`/criticas`):** contenido editorial estático migrado del proyecto original.
- **Órdenes (`/admin/ordenes`):** listado administrativo de solo lectura.
- **Stock (`/admin/stock`):** consulta de productos e inventario y edición del stock actual por fila.
- **Nuevo producto (`/admin/productos/nuevo`):** validación local, comprobación de código comercial y creación secuencial de Producto + Inventario.

La navegación utiliza React Router y layouts compartidos. Las peticiones se centralizan en servicios sobre `httpClient` (GET, POST y PATCH).

## Persistencia

| Ubicación | Datos |
| --- | --- |
| JSON Server (`db.json`) | `productos`, `inventario`, `usuarios`, `ordenes` |
| LocalStorage | `carritoTiendaJuegos`: únicamente `{ productoId, cantidad }` por línea |
| SessionStorage | `usuarioActivo`: sesión del usuario, sin contraseña |

Los datos comerciales pertenecen a `productos`; `stock` y `stockCritico` pertenecen a `inventario`, relacionado mediante `productoId`. Las altas de usuarios/productos/inventario y los cambios de stock se guardan en `db.json` al usar JSON Server.

## Cuentas demostrativas

Credenciales incluidas en `db.json`, exclusivamente para probar este proyecto académico:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| administrador | admin@checkpointstore.cl | `Admin123!` |
| vendedor | vendedor@checkpointstore.cl | `Vendedor123!` |
| cliente | cliente@checkpointstore.cl | `Cliente123!` |

- **Administrador:** Órdenes, Stock y Nuevo producto.
- **Vendedor:** Órdenes.
- **Cliente:** área pública.

La autenticación es simulada; las contraseñas de demostración están en texto plano en JSON Server.

## Alcance académico deliberado

- **PAY** no ejecuta una compra y el carrito no genera órdenes.
- Las órdenes son demostrativas y de **solo lectura**; **Ver detalle** no tiene acción.
- Contacto valida los datos, pero no envía mensajes ni los guarda.
- Newsletter y referencias de redes sociales son visuales, sin suscripción ni integración externa.
- Stock permite editar la cantidad actual, no el stock crítico ni crear registros faltantes desde esa vista.
- Si se crea un producto pero falla su inventario, se informa la creación parcial; no hay rollback automático.
- JSON Server es temporal y será reemplazado por un backend real.

## Scripts disponibles

| Comando | Uso |
| --- | --- |
| `npm run dev` | Iniciar el frontend con Vite |
| `npm run server` | Iniciar JSON Server observando `db.json` |
| `npm run build` | Generar el frontend de producción en `dist` |
| `npm run lint` | Revisar el código con ESLint |
| `npm run preview` | Servir localmente el build generado; no inicia la API |
