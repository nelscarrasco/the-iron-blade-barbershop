# Especificación de Requisitos del Software (ERS)
## The Iron Blade Barbershop — Tienda Online

**Documento:** Especificación de Requisitos del Software (propuesta previa)
**Versión:** 1.0
**Estándar de referencia:** IEEE 830
**Asignatura:** DSY1104 — Desarrollo Fullstack II
**Evaluación:** Parcial N°1 — "Construyendo las bases para mi aplicación web"
**Institución:** Duoc UC

**Equipo de trabajo:**
- Nelson Carrasco
- Mathias Von Jentschyk

**Fecha:** Septiembre 2025

---

## Índice

1. Introducción
2. Descripción general
3. Requerimientos específicos
4. Herramientas y tecnologías
5. Propuestas del proyecto
6. Planilla de requisitos

---

## 1. Introducción

### 1.1 Propósito

El presente documento tiene como propósito especificar los requerimientos del software para el sitio web **The Iron Blade Barbershop**, una tienda online de una barbería. Describe las funcionalidades, restricciones, herramientas y propuestas necesarias para el desarrollo del proyecto en su primera entrega (frontend).

Está dirigido al equipo de desarrollo y al docente evaluador de la asignatura DSY1104.

### 1.2 Alcance

El software es un **sitio web frontend** que simula la operación de una tienda online de barbería. Permite:

- La navegación pública por el sitio (inicio, catálogo, reservas).
- El inicio de sesión diferenciado por rol (administrador y usuario/cliente).
- La visualización de un catálogo de servicios y productos.
- La gestión (CRUD) de usuarios y productos por parte del administrador.
- La compra mediante un carrito para los usuarios clientes.

En esta primera entrega **no se contempla backend ni base de datos**: la información se almacena localmente en el navegador mediante LocalStorage y SessionStorage.

### 1.3 Definiciones, acrónimos y abreviaturas

| Término | Definición |
|---|---|
| ERS | Especificación de Requisitos del Software |
| CRUD | Crear, Leer, Actualizar y Eliminar (Create, Read, Update, Delete) |
| LocalStorage | Almacenamiento persistente del navegador |
| SessionStorage | Almacenamiento del navegador que dura mientras la pestaña está abierta |
| Rol | Perfil de acceso del usuario (administrador o usuario) |
| RF | Requerimiento Funcional |
| RNF | Requerimiento No Funcional |

### 1.4 Referencias

- Estándar IEEE 830-1998 (Recommended Practice for Software Requirements Specifications).
- Pauta de evaluación DSY1104 — Evaluación Parcial 1.
- Documentación oficial de HTML5, CSS3, Bootstrap 5 y JavaScript (MDN Web Docs).

---

## 2. Descripción general

### 2.1 Perspectiva del producto

The Iron Blade Barbershop es un producto autónomo (standalone) que se ejecuta completamente en el navegador del cliente. No depende de servicios externos salvo las bibliotecas cargadas por CDN (Bootstrap, Bootstrap Icons, Google Fonts).

### 2.2 Funciones del producto

- Navegación entre páginas mediante hipervínculos.
- Autenticación de usuarios y control de acceso por rol.
- Registro de nuevos usuarios.
- Visualización y filtrado del catálogo.
- Gestión de carrito de compras.
- Mantenedor de usuarios y productos (administrador).
- Formulario de reserva de horas con validaciones.

### 2.3 Características de los usuarios

| Tipo de usuario | Descripción | Permisos |
|---|---|---|
| Visitante | Usuario sin sesión | Navegar, ver catálogo, reservar |
| Usuario (cliente) | Usuario registrado con sesión | Todo lo anterior + carrito de compras |
| Administrador | Usuario con perfil admin | Todo lo anterior + mantenedor CRUD de usuarios y productos |

### 2.4 Restricciones

- El desarrollo se limita a HTML5, CSS3, Bootstrap 5 y JavaScript.
- No se utiliza backend ni base de datos; la persistencia es local.
- El sitio debe ser responsivo (adaptable a dispositivos móviles).
- La hoja de estilos CSS debe ser externa y personalizada.

### 2.5 Suposiciones y dependencias

- El usuario dispone de un navegador moderno con soporte para HTML5, JavaScript y Web Storage.
- Se requiere conexión a internet para cargar las bibliotecas por CDN.
- Al no existir backend, los datos son locales a cada navegador y no se comparten entre dispositivos.

---

## 3. Requerimientos específicos

### 3.1 Requerimientos funcionales

| ID | Requerimiento | Descripción |
|---|---|---|
| RF-01 | Navegación | El sistema debe permitir navegar entre todas las páginas mediante una navbar con hipervínculos. |
| RF-02 | Inicio de sesión | El sistema debe permitir a un usuario autenticarse con correo y contraseña. |
| RF-03 | Control de acceso por rol | El sistema debe redirigir y restringir el acceso según el rol (admin o usuario). |
| RF-04 | Registro de usuarios | El sistema debe permitir registrar nuevos usuarios con validación de datos. |
| RF-05 | Cierre de sesión | El sistema debe permitir cerrar la sesión activa. |
| RF-06 | Visualización de catálogo | El sistema debe mostrar el catálogo de servicios y productos en formato de cards. |
| RF-07 | Filtro de catálogo | El sistema debe permitir filtrar el catálogo por categoría (servicio / producto). |
| RF-08 | Agregar al carrito | El sistema debe permitir a un usuario cliente agregar productos al carrito. |
| RF-09 | Gestión de carrito | El sistema debe permitir modificar cantidades, eliminar items y vaciar el carrito. |
| RF-10 | Finalizar compra | El sistema debe permitir finalizar la compra y mostrar el total. |
| RF-11 | Mantenedor de productos | El administrador debe poder crear, editar y eliminar productos. |
| RF-12 | Mantenedor de usuarios | El administrador debe poder crear, editar y eliminar usuarios. |
| RF-13 | Validación de formularios | El sistema debe validar todos los formularios en JavaScript con mensajes de error personalizados. |
| RF-14 | Reserva de hora | El sistema debe permitir enviar una reserva mediante un formulario validado. |
| RF-15 | Persistencia local | El sistema debe persistir usuarios, productos y carrito en LocalStorage. |

### 3.2 Requerimientos no funcionales

| ID | Requerimiento | Descripción |
|---|---|---|
| RNF-01 | Usabilidad | La interfaz debe ser intuitiva y coherente en todas las páginas. |
| RNF-02 | Responsividad | El sitio debe adaptarse a pantallas de escritorio, tablet y móvil. |
| RNF-03 | Mantenibilidad | El CSS debe ser externo y el código JS modular por responsabilidad. |
| RNF-04 | Rendimiento | Las páginas deben cargar rápidamente usando recursos por CDN. |
| RNF-05 | Compatibilidad | El sitio debe funcionar en navegadores modernos (Chrome, Firefox, Edge). |
| RNF-06 | Estética | El diseño debe reflejar la identidad de una barbería clásica (paleta oscura con acentos dorados). |
| RNF-07 | Accesibilidad | Uso de etiquetas semánticas, atributos `alt` en imágenes y `aria-label` donde corresponda. |

---

## 4. Herramientas y tecnologías

| Categoría | Herramienta |
|---|---|
| Lenguaje de marcado | HTML5 |
| Estilos | CSS3 (hoja externa personalizada) |
| Framework CSS | Bootstrap 5 |
| Iconografía | Bootstrap Icons |
| Tipografías | Google Fonts (Oswald, Roboto) |
| Lenguaje de programación | JavaScript (ES6) |
| Persistencia | LocalStorage y SessionStorage |
| Control de versiones | Git y GitHub (repositorio público colaborativo) |
| Editor de código | Visual Studio Code |

---

## 5. Propuestas del proyecto

### 5.1 Enfoque

Se propone desarrollar un sitio web de barbería con enfoque en la experiencia del cliente, dividiendo la aplicación en páginas interconectadas con roles diferenciados. La estrategia consiste en:

1. Construir una capa de datos (seed) que simule una base de datos usando LocalStorage.
2. Implementar una capa de autenticación y control de roles con SessionStorage.
3. Separar las validaciones en un módulo JavaScript reutilizable con mensajes personalizados.
4. Aplicar una hoja de estilos externa consistente en todas las páginas.

### 5.2 Cómo se cumplen los requerimientos

- **Estructura semántica:** cada página usa `header`, `nav`, `main`, `section`, `article` y `footer`.
- **CSS externo:** un único archivo `styles.css` con variables de diseño aplicado a todas las páginas.
- **Validaciones JS:** módulo `validaciones.js` con validadores individuales y mensajes de error personalizados.
- **Trabajo colaborativo:** repositorio Git público con commits descriptivos repartidos entre los integrantes.

### 5.3 Evolución futura (siguientes entregas)

- Incorporación de un backend y base de datos real.
- Autenticación segura (hash de contraseñas, tokens).
- Pasarela de pago y confirmación de reservas por correo.

---

## 6. Planilla de requisitos

| ID | Requisito | Tipo | Prioridad | Estado | Responsable |
|---|---|---|---|---|---|
| RF-01 | Navegación entre páginas | Funcional | Alta | Implementado | Nelson Carrasco |
| RF-02 | Inicio de sesión | Funcional | Alta | Implementado | Mathias Von Jentschyk |
| RF-03 | Control de acceso por rol | Funcional | Alta | Implementado | Mathias Von Jentschyk |
| RF-04 | Registro de usuarios | Funcional | Alta | Implementado | Nelson Carrasco |
| RF-05 | Cierre de sesión | Funcional | Media | Implementado | Mathias Von Jentschyk |
| RF-06 | Visualización de catálogo | Funcional | Alta | Implementado | Nelson Carrasco |
| RF-07 | Filtro de catálogo | Funcional | Media | Implementado | Nelson Carrasco |
| RF-08 | Agregar al carrito | Funcional | Alta | Implementado | Mathias Von Jentschyk |
| RF-09 | Gestión de carrito | Funcional | Alta | Implementado | Mathias Von Jentschyk |
| RF-10 | Finalizar compra | Funcional | Media | Implementado | Mathias Von Jentschyk |
| RF-11 | Mantenedor de productos | Funcional | Alta | Implementado | Nelson Carrasco |
| RF-12 | Mantenedor de usuarios | Funcional | Alta | Implementado | Nelson Carrasco |
| RF-13 | Validación de formularios | Funcional | Alta | Implementado | Mathias Von Jentschyk |
| RF-14 | Reserva de hora | Funcional | Media | Implementado | Nelson Carrasco |
| RF-15 | Persistencia local | Funcional | Alta | Implementado | Mathias Von Jentschyk |
| RNF-01 | Usabilidad | No funcional | Alta | Cumplido | Equipo |
| RNF-02 | Responsividad | No funcional | Alta | Cumplido | Equipo |
| RNF-03 | Mantenibilidad | No funcional | Media | Cumplido | Equipo |
| RNF-04 | Rendimiento | No funcional | Media | Cumplido | Equipo |
| RNF-05 | Compatibilidad | No funcional | Media | Cumplido | Equipo |
| RNF-06 | Estética barbería | No funcional | Alta | Cumplido | Equipo |
| RNF-07 | Accesibilidad | No funcional | Media | Cumplido | Equipo |

---

*Documento ERS versión 1.0 — Propuesta previa. Sujeto a actualización en las siguientes evaluaciones parciales conforme avance el proyecto.*
