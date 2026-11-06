# Especificación de Requisitos del Software (ERS)
## The Iron Blade Barbershop — Tienda Online

**Documento:** Especificación de Requisitos del Software (propuesta actualizada)
**Versión:** 2.0 (reemplaza a la versión 1.0 de la Evaluación Parcial N°1)
**Estándar de referencia:** IEEE 830
**Asignatura:** DSY1104 — Desarrollo Fullstack II
**Evaluación:** Parcial N°2 — "Implementando frontend y pruebas unitarias a mi tienda online"
**Institución:** Duoc UC

**Equipo de trabajo:**
- Nelson Carrasco
- Mathias Von Jentschyk

**Fecha:** Noviembre 2026

---

## Historial de versiones

| Versión | Fecha | Cambios principales |
|---|---|---|
| 1.0 | Septiembre 2026 | Sitio en HTML5, CSS3, Bootstrap 5 y JavaScript puro. Persistencia en LocalStorage/SessionStorage. 7 páginas. |
| 2.0 | Noviembre 2026 | Migración completa a **React** (componentes reutilizables con props y estado), **React Router** para la navegación, **API REST simulada con json-server**, capa de datos con funciones CRUD, nuevas vistas de tienda (categorías, ofertas, checkout, compra exitosa/fallida, blog, nosotros, detalle de producto) y **panel de administración** completo (dashboard, órdenes/boletas, productos, productos críticos, categorías, usuarios con historial de compras, reportes y perfil). |

---

## Índice

1. Introducción
2. Descripción general
3. Requerimientos específicos
4. Arquitectura y herramientas
5. Mapa de navegación (rutas)
6. Propuestas del proyecto
7. Planilla de requisitos

---

## 1. Introducción

### 1.1 Propósito

Este documento especifica los requerimientos del software **The Iron Blade Barbershop** en su segunda versión. Describe las funcionalidades, restricciones, herramientas, arquitectura y propuestas de la aplicación frontend construida con React y conectada a una API REST simulada.

Está dirigido al equipo de desarrollo y al docente evaluador de la asignatura DSY1104.

### 1.2 Alcance

El software es una **aplicación web de página única (SPA)** que simula la operación de la tienda online de una barbería. Permite:

- Explorar servicios y productos por catálogo, categorías, ofertas y búsqueda con filtros.
- Ver el detalle de cada producto y productos relacionados.
- Gestionar un carrito de compras y realizar el pago mediante un checkout con despacho o retiro.
- Visualizar el resultado de la compra (exitosa o rechazada) y su boleta.
- Registrarse, iniciar sesión y revisar el historial de compras propio.
- Reservar una hora y enviar mensajes de contacto.
- Leer artículos del blog.
- Administrar (rol administrador) productos, categorías, usuarios y órdenes, y consultar reportes.

Los datos se sirven desde una **API REST local con json-server** (`server/db.json`), por lo que los cambios realizados por cualquier usuario quedan guardados en ese archivo mientras el servidor esté en ejecución.

Queda **fuera del alcance** de esta versión: pagos reales, envío real de correos, autenticación segura con tokens y despliegue de un backend productivo.

### 1.3 Definiciones, acrónimos y abreviaturas

| Término | Definición |
|---|---|
| SPA | Single Page Application: la página se carga una vez y React cambia las vistas sin recargar. |
| Componente | Pieza reutilizable de interfaz en React que recibe *props* y puede manejar su propio *state*. |
| Props | Datos que un componente padre entrega a un componente hijo. |
| State | Datos internos de un componente que, al cambiar, vuelven a renderizar la interfaz. |
| Context | Mecanismo de React para compartir estado global (sesión, carrito, notificaciones). |
| API REST | Interfaz HTTP que expone recursos (`/productos`, `/usuarios`, etc.) con los verbos GET, POST, PUT, PATCH y DELETE. |
| json-server | Herramienta que genera una API REST completa a partir de un archivo JSON. |
| CRUD | Crear, Leer, Actualizar y Eliminar. |
| Stock crítico | Nivel mínimo de unidades definido por producto; bajo o igual a ese valor el producto aparece como crítico. |

### 1.4 Referencias

- Enunciado DSY1104 Evaluación Parcial N°2 y Anexo 1 (instrucciones y template HTML entregados por el docente).
- Indicaciones del docente para la entrega: la aplicación debe ser funcional con json-server, poseer una API y enrutar componentes con react-router.
- Propuesta de pruebas con Jasmine del Anexo 1 (renderizado, props, estado y eventos).
- ERS The Iron Blade v1.0 (`docs/ERS_The_Iron_Blade_v1.md`).
- Documentación oficial de React, React Router, Bootstrap 5 y json-server.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

La versión 2.0 es la evolución del sitio estático de la Evaluación 1. Se reescribe como aplicación React, separando responsabilidades en **componentes**, **páginas**, **contextos**, **servicios** y una **capa de acceso a la API**. La persistencia pasa de LocalStorage a una API REST (json-server); LocalStorage/SessionStorage se mantienen solo para el carrito y la sesión activa.

### 2.2 Funciones del producto

**Tienda (pública):** Home, Productos, Detalle de producto, Categorías, Ofertas, Nosotros, Blog y detalle de blog, Contacto, Reservas, Registro, Inicio de sesión, Carrito, Checkout, Compra exitosa, Pago con error y Mis compras.

**Administrador (privado):** Dashboard, Órdenes/Boletas y detalle de boleta, Productos (listado, nuevo, mostrar, editar, eliminar), Listado de productos críticos, Reportes de productos, Categorías (listado, nueva, editar, eliminar), Usuarios (listado, nuevo, mostrar con historial de compras, editar, eliminar), Reportes de ventas y Perfil.

### 2.3 Características de los usuarios

| Tipo | Descripción | Acceso |
|---|---|---|
| Visitante | Navega sin cuenta. | Toda la tienda; puede comprar ingresando sus datos en el checkout. |
| Cliente (`usuario`) | Cuenta registrada. | Tienda + datos precargados en el checkout + "Mis compras". |
| Administrador (`admin`) | Personal de la barbería. | Tienda + panel `/admin`. |

### 2.4 Restricciones

- Frontend en **React 19** con **Vite** como herramienta de desarrollo y compilación.
- Navegación con **React Router** (`BrowserRouter`, `Routes`, rutas anidadas y rutas protegidas).
- Diseño responsivo con **Bootstrap 5**.
- API simulada con **json-server 0.17.4** en el puerto 3001.
- Requiere Node.js y npm instalados para ejecutar el proyecto.

### 2.5 Suposiciones y dependencias

- json-server debe estar en ejecución para que la aplicación muestre datos (si no lo está, cada vista muestra un mensaje de error con opción de reintentar).
- Las imágenes de productos se cargan desde URLs externas (Unsplash), por lo que requieren conexión a internet.
- Las contraseñas se guardan en texto plano en `db.json`; esto es aceptable solo por tratarse de una simulación académica.

---

## 3. Requerimientos específicos

### 3.1 Requerimientos funcionales

| ID | Nombre | Descripción |
|---|---|---|
| RF-01 | Navegación SPA | El sistema debe navegar entre vistas con React Router sin recargar la página, incluyendo rutas con parámetros (`/productos/:id`). |
| RF-02 | Inicio de sesión | El sistema debe autenticar con correo y contraseña consultando la API (`GET /usuarios?email=`). |
| RF-03 | Control de acceso por rol | Las rutas `/admin/*` deben estar protegidas para el rol administrador; `/mis-compras` requiere sesión. |
| RF-04 | Registro de usuarios | El sistema debe registrar usuarios (`POST /usuarios`) validando RUN con dígito verificador, nombre, correo único, contraseña, región y comuna. |
| RF-05 | Cierre de sesión | El sistema debe cerrar la sesión activa desde la tienda y desde el panel. |
| RF-06 | Catálogo de productos | El sistema debe listar productos con categoría, precio, precio de oferta y stock. |
| RF-07 | Búsqueda y filtros | El sistema debe filtrar por texto, categoría, precio máximo, solo ofertas y ordenar por precio o nombre. Los filtros quedan en la URL. |
| RF-08 | Detalle de producto | El sistema debe mostrar el detalle de un producto, permitir elegir cantidad y mostrar productos relacionados. |
| RF-09 | Categorías | El sistema debe mostrar los productos agrupados por categoría y la vista de una categoría específica. |
| RF-10 | Ofertas | El sistema debe mostrar todos los productos con precio rebajado, ordenados por porcentaje de descuento. |
| RF-11 | Carrito de compras | El sistema debe agregar, modificar cantidad (sin superar stock), eliminar y vaciar productos del carrito, mostrando el total en la navbar. |
| RF-12 | Checkout | El cliente debe ingresar sus datos, elegir despacho (con dirección, región y comuna) o retiro, y medio de pago. Si inició sesión, los datos se completan automáticamente. |
| RF-13 | Procesamiento de compra | Al pagar, el sistema debe verificar stock y precios vigentes en la API, registrar la orden (`POST /ordenes`) y descontar stock (`PATCH /productos/:id`) solo si el pago es aprobado. |
| RF-14 | Compra exitosa | El sistema debe mostrar el resumen de la compra con opción de imprimir la boleta. |
| RF-15 | Pago con error | El sistema debe mostrar el motivo del rechazo (stock insuficiente o pago rechazado) y permitir volver a realizar el pago conservando el carrito. |
| RF-16 | Mis compras | El cliente debe ver el historial de sus órdenes. |
| RF-17 | Blog | El sistema debe listar artículos y mostrar el detalle de cada uno. |
| RF-18 | Contacto y reservas | El sistema debe registrar mensajes (`POST /mensajes`) y reservas de hora (`POST /reservas`) con validaciones. |
| RF-19 | Dashboard administrador | El panel debe mostrar compras, ingresos, productos, inventario, usuarios y alerta de stock crítico. |
| RF-20 | CRUD de productos | El administrador debe crear, ver, editar y eliminar productos (incluye precio de oferta y stock crítico). |
| RF-21 | Productos críticos | El panel debe listar los productos con stock menor o igual a su stock crítico. |
| RF-22 | CRUD de categorías | El administrador debe crear, editar y eliminar categorías; no se puede eliminar una categoría con productos asociados. |
| RF-23 | CRUD de usuarios | El administrador debe crear, ver, editar y eliminar usuarios (no puede eliminar su propia cuenta). |
| RF-24 | Historial de compras por usuario | Desde "Mostrar usuario" se debe ver el historial de órdenes del cliente. |
| RF-25 | Órdenes y boletas | El administrador debe listar órdenes, filtrarlas por estado o texto e imprimir la boleta. |
| RF-26 | Reportes | El panel debe mostrar ingresos, tasa de aprobación, ticket promedio y ventas por mes, por categoría y por producto; e inventario por categoría. |
| RF-27 | Perfil | El administrador debe poder editar sus propios datos. |
| RF-28 | Validación de formularios | Todos los formularios deben validarse en React con mensajes de error personalizados por campo. |

### 3.2 Requerimientos no funcionales

| ID | Atributo | Descripción |
|---|---|---|
| RNF-01 | Usabilidad | Interfaz coherente, con estados de carga, mensajes de error y notificaciones (toasts). |
| RNF-02 | Responsividad | La aplicación debe adaptarse a móvil, tablet y escritorio usando el grid y componentes de Bootstrap 5 (navbar colapsable, menú lateral del panel colapsable, tablas con scroll horizontal). |
| RNF-03 | Mantenibilidad | Componentes con responsabilidad única, props para datos y funciones, y estado local solo cuando es necesario. Capa de API centralizada. |
| RNF-04 | Reutilización | Componentes compartidos (`Campo`, `ProductoCard`, `Precio`, `TablaItems`, `ModalConfirmacion`, etc.) usados en varias vistas. |
| RNF-05 | Compatibilidad | Navegadores modernos (Chrome, Edge, Firefox). |
| RNF-06 | Estética | Identidad visual de barbería clásica (paleta oscura con dorado) heredada de la v1. |
| RNF-07 | Accesibilidad | Etiquetas `label` asociadas, `aria-label`, `aria-invalid`, roles de alerta y textos alternativos. |
| RNF-08 | Calidad | Pruebas unitarias automatizadas con **Jasmine + Karma** ejecutables con `npm test`: 61 pruebas de renderizado, props, estado, eventos, mocks de la API, lógica de negocio y rutas protegidas (ver `docs/Cobertura_Testing.md`). |

---

## 4. Arquitectura y herramientas

### 4.1 Herramientas y tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| React | 19 | Construcción de componentes y manejo de estado. |
| React Router (`react-router-dom`) | 7 | Enrutamiento de vistas, rutas anidadas, parámetros y rutas protegidas. |
| Vite | 6 | Servidor de desarrollo y compilación. |
| Bootstrap | 5.3 | Grid responsivo y componentes visuales. |
| Bootstrap Icons | 1.x | Iconografía. |
| json-server | 0.17.4 | API REST simulada a partir de `server/db.json`. |
| concurrently | 9 | Levantar API y frontend con un solo comando. |
| Jasmine | 4.6 | Framework de pruebas unitarias (`describe`, `it`, `expect`, espías). |
| Karma | 6.4 | Ejecutor de pruebas en navegador real (Chrome headless), con reporte de cobertura (`karma-coverage`). |
| React Testing Library + user-event | 16 / 14 | Renderizar componentes y simular acciones del usuario dentro de las pruebas. |
| Git / GitHub | — | Control de versiones colaborativo. |

### 4.2 Estructura del proyecto

```
src/
├── api/            cliente.js (fetch + manejo de errores) e index.js (recursos CRUD por entidad)
├── components/
│   ├── common/     Campo, Estados, ModalConfirmacion, RutaProtegida, BotonVolver, EstadoOrden
│   ├── layout/     NavbarTienda, FooterTienda, LayoutTienda, LayoutAdmin
│   ├── tienda/     ProductoCard, GrillaProductos, Precio, BotonAgregarCarrito, Carrusel, TablaItems, DatosEntrega
│   └── admin/      EncabezadoAdmin, TarjetaResumen, BarrasHorizontales
├── context/        AuthContext (sesión), CarritoContext (useReducer + LocalStorage), ToastContext
├── hooks/          useApi (carga de datos), useFormulario (estado y validación de formularios)
├── services/       compra.js (stock, totales, registro de orden), reportes.js (cálculos del panel)
├── utils/          validaciones.js, formato.js
├── data/           regiones.js (regiones y comunas)
├── pages/          tienda/* y admin/*
└── __tests__/      Pruebas unitarias Jasmine (*.spec.js) y utilidades compartidas
karma.conf.cjs      Configuración de Karma (navegador, compilación, cobertura)
server/db.json      Base de datos de la API (db.seed.json = datos iniciales)
```

### 4.3 Capa de datos (archivo JS con CRUD)

`src/api/cliente.js` define `crearRecurso(nombre)`, que entrega para cada entidad las funciones `listar`, `obtener`, `crear`, `actualizar` (PUT), `modificar` (PATCH) y `eliminar`. `src/api/index.js` crea los recursos `productosApi`, `categoriasApi`, `usuariosApi`, `ordenesApi`, `blogsApi`, `mensajesApi` y `reservasApi`. Los componentes nunca llaman a `fetch` directamente.

### 4.4 Endpoints de la API (json-server, puerto 3001)

| Recurso | Endpoints usados |
|---|---|
| `/productos` | GET (con `_expand=categoria`, filtro `categoriaId`), GET `/:id`, POST, PUT `/:id`, PATCH `/:id` (stock), DELETE `/:id` |
| `/categorias` | GET (filtro `tipo`), GET `/:id`, POST, PUT `/:id`, DELETE `/:id` |
| `/usuarios` | GET (filtro `email`), GET `/:id`, POST, PUT `/:id`, DELETE `/:id` |
| `/ordenes` | GET (filtro `usuarioId`, `_sort=fecha&_order=desc`), GET `/:id`, POST |
| `/blogs` | GET, GET `/:id` |
| `/mensajes`, `/reservas` | POST |

---

## 5. Mapa de navegación (rutas)

**Tienda:** `/`, `/productos`, `/productos/:id`, `/categorias`, `/categorias/:id`, `/ofertas`, `/nosotros`, `/blog`, `/blog/:id`, `/contacto`, `/reservas`, `/login`, `/registro`, `/carrito`, `/checkout`, `/compra/exitosa/:id`, `/compra/error/:id`, `/mis-compras` (requiere sesión), `*` (404).

**Administrador** (requiere rol admin, layout con menú lateral): `/admin`, `/admin/ordenes`, `/admin/ordenes/:id`, `/admin/productos`, `/admin/productos/nuevo`, `/admin/productos/:id`, `/admin/productos/:id/editar`, `/admin/productos/criticos`, `/admin/productos/reportes`, `/admin/categorias`, `/admin/categorias/nueva`, `/admin/categorias/:id/editar`, `/admin/usuarios`, `/admin/usuarios/nuevo`, `/admin/usuarios/:id` (incluye historial de compras), `/admin/usuarios/:id/editar`, `/admin/reportes`, `/admin/perfil`.

Este mapa cubre todas las vistas del diagrama de flujo de navegación del Anexo 1 (Figuras 2, 3 y 10). Se agregaron además Reservas (heredada de la v1) y Mis compras.

---

## 6. Propuestas del proyecto

### 6.1 Enfoque

- **Migración por componentes:** cada página HTML de la v1 se dividió en componentes con una única responsabilidad (por ejemplo, la card de producto, el precio con oferta y el botón de agregar al carrito son tres componentes distintos).
- **Estado global mínimo:** solo la sesión, el carrito y las notificaciones viven en Context; el resto del estado es local de cada vista.
- **Datos reales desde la API:** todas las vistas leen y escriben en json-server, de modo que una compra descuenta stock y aparece en el dashboard, en reportes y en el historial del usuario.
- **Simulación de pago:** el checkout incluye la opción "Modo demo: simular que el pago es rechazado" para mostrar la vista de pago con error sin depender de una pasarela real. El pago también se rechaza si otro cliente compró el stock antes.

### 6.2 Personalización respecto del template

- Rubro barbería con catálogo mixto (servicios y productos) en 5 categorías.
- Precio de oferta por producto y porcentaje de descuento calculado.
- Opción de entrega: despacho a domicilio (con costo) o retiro en local (gratis).
- Validación de RUN chileno con dígito verificador y regiones/comunas de Chile.
- Reportes calculados en el cliente a partir de las órdenes reales.

### 6.3 Evolución futura

- Reemplazar json-server por un backend real (por ejemplo, Spring Boot o Node/Express) con autenticación por tokens y contraseñas cifradas.
- Integrar una pasarela de pago y envío real de boletas por correo.
- Ampliar las pruebas unitarias a las páginas completas (formularios del panel y checkout).

---

## 7. Planilla de requisitos

| ID | Requisito | Tipo | Prioridad | Estado |
|---|---|---|---|---|
| RF-01 | Navegación SPA | Funcional | Alta | Implementado |
| RF-02 | Inicio de sesión | Funcional | Alta | Implementado |
| RF-03 | Control de acceso por rol | Funcional | Alta | Implementado |
| RF-04 | Registro de usuarios | Funcional | Alta | Implementado |
| RF-05 | Cierre de sesión | Funcional | Media | Implementado |
| RF-06 | Catálogo de productos | Funcional | Alta | Implementado |
| RF-07 | Búsqueda y filtros | Funcional | Media | Implementado |
| RF-08 | Detalle de producto | Funcional | Alta | Implementado |
| RF-09 | Categorías | Funcional | Alta | Implementado |
| RF-10 | Ofertas | Funcional | Media | Implementado |
| RF-11 | Carrito de compras | Funcional | Alta | Implementado |
| RF-12 | Checkout | Funcional | Alta | Implementado |
| RF-13 | Procesamiento de compra | Funcional | Alta | Implementado |
| RF-14 | Compra exitosa | Funcional | Alta | Implementado |
| RF-15 | Pago con error | Funcional | Alta | Implementado |
| RF-16 | Mis compras | Funcional | Media | Implementado |
| RF-17 | Blog | Funcional | Baja | Implementado |
| RF-18 | Contacto y reservas | Funcional | Media | Implementado |
| RF-19 | Dashboard administrador | Funcional | Alta | Implementado |
| RF-20 | CRUD de productos | Funcional | Alta | Implementado |
| RF-21 | Productos críticos | Funcional | Media | Implementado |
| RF-22 | CRUD de categorías | Funcional | Alta | Implementado |
| RF-23 | CRUD de usuarios | Funcional | Alta | Implementado |
| RF-24 | Historial de compras por usuario | Funcional | Media | Implementado |
| RF-25 | Órdenes y boletas | Funcional | Alta | Implementado |
| RF-26 | Reportes | Funcional | Media | Implementado |
| RF-27 | Perfil | Funcional | Baja | Implementado |
| RF-28 | Validación de formularios | Funcional | Alta | Implementado |
| RNF-01 a RNF-08 | Requerimientos no funcionales | No funcional | Alta | Cumplidos |
