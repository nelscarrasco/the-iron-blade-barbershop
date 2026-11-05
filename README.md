# The Iron Blade Barbershop

Tienda online de una barbería desarrollada para **DSY1104 - Desarrollo Fullstack II** (Duoc UC).

**Versión 2 (Evaluación Parcial N°2):** aplicación **React** con navegación por **React Router**, diseño responsivo con **Bootstrap 5** y una **API REST simulada con json-server**. La versión 1 (HTML + JavaScript puro) queda en el historial de Git.

## Integrantes

- Nelson Carrasco
- Mathias Von Jentschyk

## Requisitos

- Node.js 18 o superior (probado con Node 22) y npm.

## Cómo ejecutar

```bash
npm install        # solo la primera vez
npm run dev        # levanta la API (puerto 3001) y la app (puerto 5173) a la vez
```

Luego abre **http://localhost:5173**.

También se pueden levantar por separado, en dos terminales:

```bash
npm run api        # json-server --watch server/db.json --port 3001
npm run web        # vite (http://localhost:5173)
```

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run reset-db` | Restaura `server/db.json` con los datos iniciales (`server/db.seed.json`). Útil antes de presentar. |
| `npm test` | Ejecuta las pruebas unitarias (Vitest). |
| `npm run test:cobertura` | Pruebas + reporte de cobertura. |
| `npm run build` | Compila la app para producción en `dist/`. |

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@ironblade.cl` | `admin123` |
| Cliente | `usuario@ironblade.cl` | `user123` |

## API (json-server)

Base: `http://localhost:3001`. Recursos: `/productos`, `/categorias`, `/usuarios`, `/ordenes`, `/blogs`, `/mensajes`, `/reservas`.
Ejemplos: `GET /productos?_expand=categoria`, `GET /ordenes?usuarioId=2&_sort=fecha&_order=desc`, `PATCH /productos/3`.

Toda la comunicación pasa por `src/api/` (funciones `listar`, `obtener`, `crear`, `actualizar`, `modificar`, `eliminar`). La URL base se puede cambiar con la variable `VITE_API_URL` (ver `.env.example`).

## Vistas

**Tienda:** Home · Productos (búsqueda y filtros) · Detalle de producto · Categorías · Ofertas · Nosotros · Blog y detalle · Contacto · Reservas · Registro · Iniciar sesión · Carrito · Checkout · Compra exitosa · Pago con error · Mis compras.

**Administrador (`/admin`):** Dashboard · Órdenes/Boletas · Productos (nuevo, mostrar, editar, eliminar) · Productos críticos · Reportes de productos · Categorías · Usuarios (con historial de compras) · Reportes · Perfil.

Para probar la vista de **pago con error**, marca en el checkout la casilla *"Modo demo: simular que el pago es rechazado"*.

## Estructura

```
src/
├── api/          Cliente HTTP y recursos CRUD por entidad
├── components/   common · layout · tienda · admin
├── context/      Sesión (AuthContext), carrito (CarritoContext), notificaciones (ToastContext)
├── hooks/        useApi, useFormulario
├── services/     Lógica de compra y reportes
├── utils/        Validaciones y formatos
├── data/         Regiones y comunas
├── pages/        tienda/* y admin/*
└── __tests__/    Pruebas unitarias
server/           db.json (API) y db.seed.json (datos iniciales)
docs/             ERS v1, ERS v2 y documento de cobertura de testing
```

## Documentación

- `docs/ERS_The_Iron_Blade_v2.md` — Especificación de Requisitos del Software, versión 2.
- `docs/Cobertura_Testing.md` — Propuesta y análisis de las pruebas.
- `docs/ERS_The_Iron_Blade_v1.md` — ERS de la Evaluación 1 (referencia).

---

Proyecto académico — Duoc UC, DSY1104 Desarrollo Fullstack II, 2026.
