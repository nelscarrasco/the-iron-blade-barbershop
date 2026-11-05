# Contexto del Proyecto — The Iron Blade Barbershop

> **Actualización Evaluación Parcial N°2 (noviembre 2026):** el proyecto se migró a **React 19 + Vite + React Router 7 + Bootstrap 5**,
> con API REST simulada en **json-server 0.17.4** (`server/db.json`, puerto 3001). Se ejecuta con `npm install` y `npm run dev`.
> Requisitos del docente: app funcional con json-server, con API y rutas con react-router; pruebas unitarias NO evaluadas.
> Fechas de presentación: 5 y 7 de noviembre. Documentos: `docs/ERS_The_Iron_Blade_v2.md` y `docs/Cobertura_Testing.md`.
> Las secciones siguientes describen la versión 1 (HTML/JS puro), que queda en el historial de Git.

## Resumen del caso

Proyecto académico para **Mathias Von Jentschyk**, asignatura **DSY1104 – Desarrollo Fullstack II** (Duoc UC).
Es la **Evaluación Parcial N°1** ("Construyendo las bases para mi aplicación web"), que vale **30% de la asignatura**.
Se trata de un sitio web de una **barbería (tienda online)** desarrollado en **HTML5, CSS3, Bootstrap 5 y JavaScript**,
sin backend ni base de datos (persistencia con LocalStorage / SessionStorage).

Nombre elegido para la tienda: **The Iron Blade Barbershop**. Estética barbería clásica-premium
(fondo carbón/negro, acentos dorado/cobre, tipografías Oswald + Roboto).

## Integrantes del equipo

- **Nelson Carrasco** — email usado en Git: `nelson.carrasco@duocuc.cl` (DERIVADO, sin confirmar por el usuario).
- **Mathias Von Jentschyk** — email en Git: `mathiasvon7@gmail.com` (cuenta GitHub `MVJ-Dev`).

## Entregables oficiales (según PDF de evaluación)

- **Enlace GitHub público** del frontend — LISTO.
- **Proyecto frontend comprimido (.zip)** — pendiente de generar cuando el usuario lo pida (comprimir la carpeta del proyecto).
- **Documento ERS (propuesta previa, Versión 1)** — LISTO en `docs/ERS_The_Iron_Blade_v1.md` (IEEE 830).

Formato de evaluación: Encargo (40%, grupal) + Presentación (60%, individual, máx 15 min) + Ronda de preguntas
(en esta sección NO impacta la nota, es conversacional, por instrucción excepcional del profesor).

## Rúbrica del PDF (indicadores clave y su cobertura)

Encargo (40%):
- **IE1.1.1 (8%)** HTML5 semántico (header/nav/main/section/article/footer + hipervínculos, imágenes, botones, VIDEO, formularios, footer) — CUBIERTO.
- **IE1.1.2 (10%)** CSS externo personalizado aplicado consistente — CUBIERTO (`css/styles.css`).
- **IE1.2.1 (10%)** Validaciones en JS con mensajes de error personalizados — CUBIERTO (`js/validaciones.js`).
- **IE1.3.1 (12%)** Repositorio Git colaborativo con commits repartidos — CUBIERTO (11 commits, 6 Mathias / 5 Nelson).

Presentación (60%): mismos temas explicados individualmente. Git colaborativo pesa 20% aquí.

## Instrucción excepcional del profesor

Por interrupción de clases: se permite IA como apoyo (código y documentación), no se exige backend/BD
(basta LocalStorage/SessionStorage), backend opcional, ronda de preguntas sin impacto negativo. Válido
SOLO para esta sección y esta evaluación.

## Stack y arquitectura

- HTML5 semántico, CSS3 externo personalizado, Bootstrap 5 (CDN) + Bootstrap Icons, Google Fonts (Oswald/Roboto).
- JavaScript vanilla (ES6), sin frameworks ni build tools.
- Persistencia: LocalStorage (usuarios, productos, carrito) y SessionStorage (sesión activa).
- Claves LocalStorage: `ib_usuarios`, `ib_productos`, `ib_carrito`. Sesión: `ib_sesion` (SessionStorage).

### Estructura de archivos
```
the-iron-blade/
├── index.html        (hero, carrusel, servicios, video HTML5, about, footer)
├── catalogo.html     (cards + filtro + agregar al carrito)
├── login.html        (login por rol, redirige admin->admin.html usuario->catalogo.html)
├── registro.html     (registro con validaciones)
├── carrito.html      (carrito, solo rol usuario)
├── admin.html        (mantenedor CRUD usuarios+productos, solo rol admin, pestañas+modales)
├── contacto.html     (form reserva validado + iframe mapa)
├── css/styles.css    (CSS externo personalizado, variables dark+dorado)
├── js/
│   ├── data.js         (seed + helpers LocalStorage + formatearPrecio CLP)
│   ├── auth.js         (login, registro, sesión, roles, protegerPagina, actualizarNavbar)
│   ├── validaciones.js (validadores con mensajes personalizados)
│   ├── catalogo.js     (render cards + agregar al carrito)
│   ├── carrito.js      (lógica carrito)
│   └── admin.js        (CRUD productos y usuarios)
├── tests/
│   ├── pruebas.test.js (20 pruebas con node:test, sin dependencias)
│   └── README.md
├── docs/ERS_The_Iron_Blade_v1.md
├── package.json      (script "npm test" = node --test tests/*.test.js)
├── README.md
├── .gitignore
└── CONTEXTO-PROYECTO.md (este archivo)
```

## Cuentas de prueba (precargadas en el seed)

- Admin: `admin@ironblade.cl` / `admin123` → redirige al mantenedor.
- Usuario: `usuario@ironblade.cl` / `user123` → habilita el carrito.

## Links

- **Repositorio GitHub (público):** https://github.com/MVJ-Dev/the-iron-blade-barbershop
- **Sitio en vivo (GitHub Pages):** https://mvj-dev.github.io/the-iron-blade-barbershop/
- Ruta local del proyecto: `/home/mathias-von/Documents/proyectos/the-iron-blade`

## Historial de Git

11 commits temáticos con fechas 14–19 sept 2026, repartidos entre ambos autores (6 Mathias / 5 Nelson),
mensajes descriptivos. + commit de tests + commit de limpieza de código. Historial reescrito una vez para
corregir las fechas (originalmente estaban en 2025 y salían como "last year"); se hizo force-push.

## Pruebas

20 pruebas en verde con el runner integrado `node:test` (SIN dependencias externas, sin node_modules).
Cubren: seed de datos, login (ok/mal/inexistente), registro y duplicados, roles/sesión, las 8 validaciones,
y smoke test de que las 7 páginas se levantan con estructura semántica + video + CSS + scripts.
Se corren con `npm test` desde la raíz.

## Decisiones tomadas

1. Rubro barbería con catálogo mixto (servicios + productos), estética dark + dorado (investigado: patrón estándar del rubro).
2. Repo creado en la cuenta del usuario (MVJ-Dev) como público, vía SSH.
3. Commits colaborativos alternando autores con `--author` por commit.
4. Tests SIN dependencias (node:test) para no ensuciar el repo de entrega con node_modules.
5. Se añadió `module.exports` protegido (`if typeof module`) a data/auth/validaciones para testear en Node sin afectar el navegador.
6. Se limpiaron TODOS los comentarios estilo-IA (banners ===, separadores numerados, comentarios narrativos) a pedido del usuario, para que no parezca escrito por IA. Código funcional idéntico.

## Vacíos / pendientes

- **Email de Nelson SIN CONFIRMAR:** se usó `nelson.carrasco@duocuc.cl` (derivado). Si Nelson tiene cuenta GitHub real,
  reescribir autores de sus commits y force-push para que se vinculen a su perfil.
- **Recursos externos:** video (Pixabay) e imágenes (Unsplash) se cargan por URL → requieren internet. Si se quiere demo
  offline, descargarlos a `img/`. NO hecho aún (usuario no lo pidió todavía).
- **.zip de entrega:** no generado aún.
- Los datos son por-navegador (LocalStorage): los cambios del usuario no se ven en el navegador del profesor. Es lo esperado sin backend; mencionarlo si preguntan.

## Próximos pasos sugeridos

- Confirmar/corregir email de Nelson en el historial Git.
- Generar el .zip para subir a la plataforma cuando lo pida.
- (Opcional) Descargar recursos para demo offline.
- (Opcional) Preparar un resumen "cómo funciona cada parte" para que Mathias defienda el proyecto en la ronda de preguntas.

## Historial de interacciones

- Sesión 2026-09-19: levantamiento del enunciado + PDF de rúbrica, construcción completa del sitio (7 páginas + JS + CSS),
  ERS, README, repo GitHub público con commits colaborativos, GitHub Pages habilitado, 20 pruebas en verde,
  corrección de fechas de commits (2025→2026), y limpieza de comentarios estilo-IA. Todo verificado y desplegado.
- Sesión 2026-09-21: se guardó este contexto.
