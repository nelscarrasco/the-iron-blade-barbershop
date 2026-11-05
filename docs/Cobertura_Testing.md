# Documento de cobertura de testing
## The Iron Blade Barbershop — Evaluación Parcial N°2 (DSY1104)

**Equipo:** Nelson Carrasco · Mathias Von Jentschyk
**Fecha:** Noviembre 2026

> Nota: según la indicación del docente para esta entrega, las pruebas unitarias **no son evaluadas**. Igualmente se incluye una suite básica para respaldar la calidad del código y explicar el proceso de testeo en la presentación.

---

## 1. Herramientas y decisión de entorno

| Herramienta | Uso |
|---|---|
| **Vitest 3** | Runner de pruebas. Usa la misma sintaxis que Jasmine (`describe`, `it`, `expect`) y se integra directamente con Vite. |
| **jsdom** | Simula el DOM del navegador para renderizar componentes en Node. |
| **@testing-library/react** | Renderiza componentes y los consulta como lo haría un usuario (por rol, texto o etiqueta). |
| **@testing-library/user-event** | Simula eventos reales de usuario (escribir, hacer clic). |
| **@testing-library/jest-dom** | Matchers del DOM (`toBeInTheDocument`, `toBeDisabled`, `toHaveValue`...). |
| **@vitest/coverage-v8** | Reporte de cobertura de código. |

**Por qué Vitest y no Jasmine + Karma:** el enunciado propone Jasmine y Karma, pero el proyecto se construyó con Vite. Karma requiere un empaquetador adicional (Webpack + Babel) para entender JSX y ES Modules, y lanza un navegador real; Vitest reutiliza la configuración de Vite y ejecuta las pruebas en jsdom. La forma de escribir las pruebas (`describe` / `it` / `expect`, espías con `vi.fn()` / `vi.spyOn()` equivalentes a `jasmine.createSpy()` / `spyOn()`) es la misma, por lo que los conceptos del curso se aplican igual.

### Configuración

- `vite.config.js`, sección `test`: entorno `jsdom`, `globals: true` y archivo de inicialización `src/setupTests.js`.
- `src/setupTests.js`: carga los matchers de jest-dom y, después de cada prueba, desmonta los componentes y limpia LocalStorage/SessionStorage para que las pruebas no dependan unas de otras.
- Comandos:
  - `npm test` → ejecuta todas las pruebas.
  - `npm run test:cobertura` → ejecuta las pruebas y genera el reporte de cobertura en consola y en `coverage/index.html`.

---

## 2. Pruebas implementadas (18 en total, todas en verde)

| # | Archivo | Prueba | Tipo (según propuesta del docente) |
|---|---|---|---|
| 1 | `componentes.test.jsx` | `GrillaProductos` renderiza una card por cada producto y deshabilita el botón si no hay stock | Renderizado correcto (lista de datos) + renderizado condicional |
| 2 | `componentes.test.jsx` | `Campo` muestra el mensaje de error solo cuando existe | Renderizado condicional |
| 3 | `componentes.test.jsx` | `Precio` muestra precio anterior y % de descuento cuando hay oferta | Propiedades (props) |
| 4 | `componentes.test.jsx` | `ModalConfirmacion` ejecuta las funciones `alConfirmar` / `alCancelar` recibidas por props al hacer clic | Props + eventos (onClick) |
| 5 | `componentes.test.jsx` | `Login` actualiza su estado al escribir y muestra error con credenciales incorrectas, usando un **mock** de la API | Estado (state) + eventos + mocks |
| 6 | `validaciones.test.js` | Validación de RUN con dígito verificador | Lógica |
| 7 | `validaciones.test.js` | Formato de correo | Lógica |
| 8 | `validaciones.test.js` | Contraseña (largo, letras y números) y confirmación | Lógica |
| 9 | `validaciones.test.js` | Teléfono opcional | Lógica |
| 10 | `validaciones.test.js` | Números enteros, mínimos y mayores a cero | Lógica |
| 11 | `validaciones.test.js` | `validarFormulario` devuelve solo los campos con error | Lógica |
| 12 | `carrito.test.js` | Agregar producto usa el precio de oferta | Estado (reducer) |
| 13 | `carrito.test.js` | Sumar cantidades sin superar el stock | Estado (reducer) |
| 14 | `carrito.test.js` | Cantidad 0 elimina el producto | Estado (reducer) |
| 15 | `carrito.test.js` | Vaciar carrito | Estado (reducer) |
| 16 | `compra.test.js` | Detecta stock insuficiente y usa precios vigentes | Lógica de negocio |
| 17 | `compra.test.js` | Costo de despacho solo con entrega a domicilio | Lógica de negocio |
| 18 | `compra.test.js` | Filtros por texto, categoría, ofertas y orden | Lógica de negocio |

### Uso de mocks

En la prueba 5 se reemplaza `usuariosApi.buscarPorEmail` con `vi.spyOn(...).mockResolvedValue(...)`. Así el componente `Login` se prueba **sin** depender de que json-server esté encendido, y además se verifica que fue llamado con el correo escrito por el usuario (`toHaveBeenCalledWith`).

---

## 3. Resultado de cobertura (`npm run test:cobertura`)

| Módulo | % Líneas | Comentario |
|---|---|---|
| `src/utils/validaciones.js` | 78 % | Cubre las reglas usadas por todos los formularios. |
| `src/utils/formato.js` | 59 % | Precio, ofertas y descuentos cubiertos; formato de fechas no. |
| `src/context/CarritoContext.jsx` | 95 % | Reducer del carrito casi completo. |
| `src/hooks/useFormulario.js` | 93 % | Cubierto a través de la prueba de `Login`. |
| `src/components/tienda/` (Precio, ProductoCard, GrillaProductos) | 87–100 % | Componentes de catálogo. |
| `src/components/common/ModalConfirmacion.jsx` | 100 % | |
| `src/services/compra.js` | 34 % | Cubiertas las funciones puras; `procesarCompra` (llamadas a la API) no. |
| **Total del proyecto** | **16 %** | Las páginas completas (`pages/`) y layouts no tienen pruebas propias. |

### Análisis

- La suite se concentró en la **lógica crítica** (validaciones, carrito, stock y totales de compra) y en los **componentes reutilizables** del catálogo, que es donde un error afecta a más vistas.
- La cobertura total es baja porque las páginas (`pages/tienda`, `pages/admin`) y los layouts no se probaron unitariamente; su funcionamiento se verificó de forma manual y con un recorrido automatizado en navegador (login, carrito, checkout con pago rechazado y aprobado, registro, CRUD de productos y vistas del panel) sin errores en consola.
- **Siguientes pasos:** pruebas de `procesarCompra` con la API simulada, de `RutaProtegida` (redirección por rol) y de los formularios del panel (`ProductoForm`, `UsuarioForm`).
