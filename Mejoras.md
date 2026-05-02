# LUFEP — Roadmap de mejoras

Documento vivo con las mejoras técnicas y de contenido pendientes para el sitio
LUFEP (web que vende sitios web informativos a profesionales: contadores,
abogados, ingenieros, cafeterías, restaurantes, etc.).

> Stack actual: Astro 6 + Tailwind 4 + `@astrojs/sitemap`. Sitio 100% estático,
> sin React ni backend. 4 páginas: `index`, `portafolio`, `services`, `contact`.

Cada punto está pensado para abordarse de forma independiente. La sección final
("Prioridades") propone un orden sugerido por impacto/esfuerzo.

---

## 1. Mejoras técnicas

### 1.1 Arquitectura del código

- [x] Crear `src/components/` y extraer: `Header.astro`, `Footer.astro`,
      `Hero.astro`, `CTASection.astro`, `ServiceCard.astro`, `ProjectCard.astro`,
      `SectionHeading.astro`, `Button.astro`.
- [x] Mover el `<header>` y `<footer>` que hoy viven dentro de
      `src/layout/layout.astro` (líneas 62–119) a sus propios componentes.
- [x] Renombrar `src/layout/` → `src/layouts/` (convención de Astro).
- [x] Crear `src/content/` con **Content Collections** para:
  - `portfolio` (proyectos del portafolio, hoy hardcodeados en
    `portafolio.astro` líneas 29–95).
  - `services` (planes de servicio).
  - Esquema validado con Zod.
- [x] Generar rutas dinámicas `/portafolio/[slug]` por proyecto.
- [x] Implementar (o eliminar) los tabs de filtro por categoría del portafolio
      (`portafolio.astro` líneas 19–25). Hoy son enlaces muertos.

### 1.2 Imágenes

Hoy se usan URLs externas de Unsplash en todas las páginas. Eso degrada LCP,
genera CLS y crea dependencia externa.

- [ ] Descargar las imágenes a `src/assets/` e importarlas.
- [ ] Sustituir `<img src="https://images.unsplash.com/...">` por
      `<Image />` o `<Picture />` de `astro:assets`.
- [ ] Declarar `width` y `height` siempre (evita CLS).
- [ ] Marcar la imagen del hero con `loading="eager"` y
      `fetchpriority="high"`.
- [ ] Marcar el resto con `loading="lazy"`.
- [ ] Servir WebP/AVIF automáticamente vía `<Image />`.
- [ ] Mientras se siga dependiendo de Unsplash, añadir
      `<link rel="preconnect" href="https://images.unsplash.com">`.

### 1.3 SEO

Incoherencias actuales en `src/layout/layout.astro`:

- [x] `<html lang="es">` (línea 35) pero `og:locale` es `"en_US"` (línea 48) y el
  copy está en inglés.
- [x] `og:site_name` y `meta name="author"` dicen `"DevPortfolio"`, pero la marca
  real es **LUFEP** (línea 64). Los `title` de las páginas también dicen
  "DevPortfolio | …".
- `astro.config.mjs` tiene `site: 'https://devportfolio.tech'`.

Acciones:

- [x] Decidir y unificar marca: LUFEP en todos los `title`, `og:site_name`,
      `meta author`, dominio canónico.
- [x] Decidir idioma único o configurar **Astro i18n** (`/es/`, `/en/`).
      Sincronizar `lang`, `og:locale` y copy.
- [ ] Reemplazar `ogImage` por defecto (hoy `/favicon.svg`, línea 18) por una
      imagen Open Graph real (1200×630 PNG/JPG).
- [ ] Añadir JSON-LD por página:
  - `Organization` global (en el layout).
  - `Service` en `services.astro`.
  - `BreadcrumbList` en páginas internas.
  - `FAQPage` cuando se añada FAQ.
- [ ] Añadir `apple-touch-icon` y `manifest.json`.
- [ ] Verificar que `dist/sitemap-0.xml` incluye todas las rutas tras añadir
      nuevas páginas.

### 1.4 Formulario de contacto

`src/pages/contact.astro` tiene `method="post" action="#"` (línea 21). En un
sitio estático **no envía nada**.

- [ ] Elegir backend: Formspree / Web3Forms / Formsubmit / Netlify Forms /
      Cloudflare Pages Forms / Astro Actions con SSR / EmailJS.
- [ ] Añadir honeypot y/o **Cloudflare Turnstile** (gratis y discreto).
- [ ] Añadir checkbox de consentimiento de tratamiento de datos (legal en
      LATAM/UE).
- [ ] Crear página `/gracias` (o estado inline) post-envío.
- [ ] Validación accesible (mensajes de error con `aria-live`, no solo
      `required` nativo).
- [ ] Campos extra para calificar lead: presupuesto, plazo deseado, profesión,
      sitio web actual.

### 1.5 Accesibilidad y UX

- [x] Subir tamaño tipográfico base. Hoy abundan `text-[10px]` y `text-[11px]`
      en botones y nav. Mínimo 14–16 px para el público objetivo (contadores,
      abogados).
- [ ] Añadir **skip-to-content** link al inicio del `<body>`.
- [x] El menú móvil usa `<details>` (`layout.astro` líneas 78–99). Cerrarlo al
      navegar y al hacer click fuera (script `is:inline` mínimo).
- [x] Reflejar `aria-expanded` en el botón hamburguesa cuando se abre/cierra.
- [ ] Sustituir `<a href="#">Privacy</a>` (footer, línea 115) por una página
      real.
- [x] Implementar o eliminar los tabs de filtro del portafolio (líneas 19–25),
      hoy son `href="#"`.
- [x] Asegurar `:focus-visible` consistente en todos los enlaces y botones.

### 1.6 Performance / build

- [ ] Auto-hospedar una fuente (Inter, Manrope, etc.) con `font-display: swap`
      y `<link rel="preload" as="font">`. Hoy se hereda la fuente del sistema.
- [x] Verificar `compressHTML` activo en Astro.
- [ ] Añadir script `astro check` y correrlo en pre-commit / CI.
- [x] Marcar Lighthouse / PageSpeed objetivo: 95+ en todas las categorías.
- [ ] Confirmar que el hosting aplica caché y compresión (Cloudflare Pages,
      Netlify, Vercel lo hacen por defecto).

### 1.7 Páginas que faltan

- [ ] `src/pages/404.astro` personalizada.
- [ ] **Política de privacidad**.
- [ ] **Términos y condiciones**.
- [ ] **Política de cookies** (si se añade analítica con cookies).
- [ ] **Aviso legal** con razón social, NIT/RUT/CIF y datos de contacto
      (LSSI en España; Habeas Data en Colombia; LFPDPPP en México).

### 1.8 Analítica y medición

- [ ] Integrar analítica privacy-first: **Plausible**, **Umami**,
      **Cloudflare Web Analytics** o **Vercel Analytics**.
- [ ] Eventos en CTAs principales: "Get a Quote", "Start Your Project",
      "View Demo". Para medir conversión real.

### 1.9 Tooling del repo

- [ ] Añadir **Prettier** + `prettier-plugin-astro`.
- [ ] Añadir **ESLint** + `eslint-plugin-astro`.
- [ ] Añadir **README.md** general (uso, build, deploy) además de este
      roadmap.
- [ ] `.nvmrc` (ya hay `engines` en `package.json`, mantenerlo sincronizado).
- [ ] GitHub Action mínima: `astro check` + `astro build` en cada PR.

---

## 2. Mejoras de contenido / información

> Esto NO es sobre el copy actual (que es relleno), sino sobre **qué secciones
> y páginas** faltan para que el sitio venda.

### 2.1 Información que tranquiliza al cliente

- [ ] Precio o rango de precio por plan ("desde X").
- [ ] Qué incluye exactamente cada plan (páginas, dominio, hosting el primer
      año, correo profesional, fotografía, copywriting, nº de revisiones,
      formulario, integración WhatsApp, Google Business Profile,
      mantenimiento, soporte).
- [ ] Qué NO incluye cada plan.
- [ ] Tiempo de entrega estimado por plan.
- [ ] **Proceso paso a paso**: Briefing → Diseño → Desarrollo → Revisión →
      Publicación → Soporte.
- [ ] Garantías: nº de revisiones, política de devolución, soporte
      post-entrega.
- [ ] Aclarar explícitamente: **¿la web es propiedad del cliente?**
- [ ] Aclarar quién paga el hosting y el dominio, y cuánto cuestan.
- [ ] Aclarar si el cliente puede editar la web por su cuenta. Si sí, evaluar
      añadir un CMS ligero (Decap, TinaCMS, Sanity).

### 2.2 Páginas nuevas para SEO y conversión

- [ ] Páginas verticales por profesión:
  - [ ] "Webs para abogados"
  - [ ] "Webs para contadores"
  - [ ] "Webs para ingenieros"
  - [ ] "Webs para restaurantes"
  - [ ] "Webs para cafeterías"
  - [ ] (otras profesiones objetivo)
- [ ] Casos de estudio individuales con problema → solución → resultado +
      capturas antes/después + link a la web en producción.
- [ ] Blog / Recursos. Ejemplos de artículos:
  - "¿Qué información debe tener la web de un contador?"
  - "Web vs. perfil de Instagram para abogados"
  - "Cómo aparece tu negocio en Google Maps"
- [ ] Sección de **FAQ** en home y en `services.astro`. Marcar como
      `FAQPage` JSON-LD.
- [ ] Página **Sobre nosotros / Quién está detrás** con foto y bio.
- [ ] Sección de **testimonios** con nombre, profesión, ciudad y, si se
      puede, foto + link al sitio entregado.

### 2.3 Datos de contacto reales

Hoy en `contact.astro` solo hay un email genérico. Añadir:

- [ ] Botón flotante / link de **WhatsApp** (`wa.me/...`).
- [ ] Teléfono clickable (`tel:`).
- [ ] País y ciudad de operación.
- [ ] Horario de atención.
- [ ] Redes sociales (mínimo LinkedIn e Instagram).
- [ ] Métodos de pago aceptados (transferencia, PayPal, Stripe, Wompi, Bold,
      etc.).
- [ ] Mapa real si hay oficina (sustituir la imagen decorativa de Unsplash
      en `contact.astro` líneas 67–75).

### 2.4 Prueba social y confianza

- [ ] Logos de clientes reales.
- [ ] Métricas verificables: nº de proyectos entregados, tiempo de respuesta
      promedio, satisfacción.
- [ ] Reseñas de Google (embebidas o capturadas).
- [ ] Sellos / partners técnicos (Cloudflare, Vercel, Netlify…).

### 2.5 Demos navegables del portafolio

Hoy las cards del portafolio tienen `View Demo` con `href="#"`.

- [ ] Subir cada plantilla a un subdominio real (`abogado.lufep.com`,
      `restaurante.lufep.com`, `contador.lufep.com`, etc.).
- [ ] Linkear "View Demo" al subdominio correspondiente.
- [ ] Añadir captura + link "ver en vivo" en cada caso del portafolio.

---

## 3. Prioridades sugeridas

### Alta prioridad

1. Unificar marca e idioma (LUFEP vs DevPortfolio, español vs inglés).
2. Imágenes locales con `astro:assets` + `<Image />`.
3. Hacer que el formulario funcione de verdad + página de gracias +
   consentimiento.
4. Páginas legales (privacidad, términos, cookies) + página 404.
5. Extraer componentes (`Header`, `Footer`, cards) y mover datos a Content
   Collections.
6. JSON-LD `Organization` + `Service` y OG image real.
7. Botón de WhatsApp y datos de contacto reales.

### Media prioridad

8. Páginas verticales por profesión (gran ganancia SEO de cola larga).
9. Demos reales del portafolio en subdominios.
10. Testimonios y casos de estudio.
11. Analítica privacy-first y eventos en CTAs.
12. Subir tipografías a tamaños legibles + fuente auto-hospedada.

### Baja prioridad / pulido

13. Blog / recursos.
14. CMS ligero (Decap / Tina / Sanity) si los clientes van a editar.
15. i18n si se decide vender en dos idiomas.
16. Prettier / ESLint / CI con `astro build`.

---

## 4. Convenciones para ir tachando

- Marca cada item como `- [x]` cuando lo completes.
- Si una mejora se implementa en un PR/commit concreto, déjalo enlazado al
  lado del item.
- Si una mejora se descarta, no la borres: márcala con `~~tachado~~` y una
  nota breve explicando por qué.