# Parcelas Los Olivos — Mockup de sitio web

Mockup del sitio web para **Parcelas Los Olivos**: parcelas de 5.000 m² en el sector Las Lajuelas, San Nicolás, Región de Ñuble.

Es un sitio estático (HTML + CSS + JS, sin frameworks): carga muy rápido, que es justo lo que Google premia.

## Páginas

| Página | Archivo | Búsqueda principal en Google |
|---|---|---|
| Inicio | `index.html` | parcelas en San Nicolás / parcelas en Ñuble |
| Listado de parcelas | `parcelas.html` | parcelas en venta San Nicolás |
| Ficha de lote | `parcela.html?lote=N` | parcela 5000 m2 San Nicolás |
| Blog | `blog/index.html` | — |
| Artículo | `blog/como-comprar-parcela-en-chile.html` | cómo comprar una parcela en Chile |
| Artículo | `blog/vivir-en-san-nicolas-nuble.html` | vivir en San Nicolás Ñuble |
| Artículo | `blog/agua-y-luz-en-parcelas.html` | agua y luz en parcelas |

**Qué trae la página:** plano interactivo de los 24 lotes, simulador de cuotas, botón de WhatsApp en todas las páginas (con mensajes que ya dicen qué lote interesa), filtros de parcelas, preguntas frecuentes, mapa de ubicación, formulario de contacto y blog con índice y barra de lectura.

**SEO técnico incluido:** títulos y descripciones pensados para cada búsqueda, datos estructurados para Google (negocio local, producto con precio, preguntas frecuentes, artículos, ruta de navegación, pasos de compra), etiquetas Open Graph para que se vea bien al compartir en WhatsApp y Facebook, `sitemap.xml`, `robots.txt`, HTML semántico, accesibilidad y ubicación geográfica.

## ⚠️ Datos que hay que reemplazar antes de publicar

Estos datos son de ejemplo y **hay que confirmarlos con tu hermano**:

- [ ] **Precios, estados (disponible, reservado, vendido) y superficies de los lotes**: `js/lotes.js`, arriba del archivo.
- [ ] **Cantidad de lotes (24)** y forma del plano.
- [ ] **Condiciones de financiamiento** (pie mínimo, número de cuotas, si hay interés).
- [ ] **Agua y luz**: qué tiene realmente cada lote (pozo, APR, factibilidad eléctrica).
- [ ] **Rol propio y subdivisión según DL 3.516**: confirmar que sea así.
- [ ] **Tiempos de viaje** de la sección Ubicación y la **coordenada GPS** real (en `index.html`, buscar `-36.4996`).
- [x] **Fotos reales.** Ya están las fotos profesionales del loteo (carpeta `img/`, sacadas del Drive "Nuevo Video y Fotos"). Para cambiar qué foto sale en cada parte, editar `ART_PHOTO` y `PHOTOS` al inicio de `js/main.js`. Pendiente: agregar el video oficial (`parcelas olivos - oficial.mp4`) subido a YouTube y fotos por lote cuando existan.
- [ ] **Dominio**: el sitio usa `parcelaslosolivos.cl` de ejemplo. Revisar si está disponible en [nic.cl](https://www.nic.cl).
- [ ] Links de Instagram, TikTok, YouTube y reseñas de Google en el footer.

## 🚀 Plan para aparecer primero en Google

### 1. Google Business Profile (lo más importante, y es gratis)
Para búsquedas locales como "parcelas San Nicolás", Google muestra primero el **mapa con 3 negocios**. Para salir ahí:
1. Crear la ficha en [business.google.com](https://business.google.com) con categoría **"Agencia inmobiliaria"** o **"Promotora inmobiliaria"**.
2. Usar el mismo nombre, teléfono y dirección que en la web (exactamente iguales).
3. Subir al menos 20 fotos y videos del terreno, y publicar una novedad cada semana.
4. **Pedir reseñas** a cada comprador y a cada visita. Es lo que más pesa para subir en el mapa.

### 2. Search Console y Analytics
- Registrar el dominio en [Google Search Console](https://search.google.com/search-console) y enviar el `sitemap.xml`.
- Instalar Google Analytics 4 (en `index.html` está marcado dónde pegarlo) y medir clics en WhatsApp como conversión.

### Pixel de Meta (para Facebook e Instagram Ads)
El pixel ya está instalado y solo falta el ID:
1. En [Meta Business Suite](https://business.facebook.com) → **Administrador de eventos** → **Conectar orígenes de datos** → **Web**, crear el pixel y copiar el número (por ejemplo `123456789012345`).
2. Pegarlo en `js/main.js`, en la línea `const META_PIXEL_ID = '';`. Desde ese momento funciona en todas las páginas.

Eventos que manda la web: **PageView** (cada visita), **Contact** (cada clic en un botón de WhatsApp), **Lead** (formulario de contacto) y **ViewContent** (ficha de un lote). En las campañas, optimizar por **Contact** o crear públicos de remarketing con quienes visitaron la web en los últimos 30 a 90 días.
Para probarlo, usar la extensión **Meta Pixel Helper** de Chrome o la pestaña "Probar eventos" del Administrador de eventos.

### 3. Portales inmobiliarios (enlaces hacia la web y más visibilidad)
Publicar cada lote en Portal Inmobiliario, Yapo, TocToc, Chilepropiedades y Marketplace de Facebook, **siempre con el link a la web**.

### 4. Blog: 2 artículos al mes
Ideas de próximos artículos según lo que la gente busca:
- ¿Conviene invertir en parcelas en 2026? Plusvalía en Ñuble
- Cuánto cuesta construir una casa en una parcela
- Parcelas en cuotas sin banco: cómo funciona
- Qué es el DL 3.516 y qué cambió para las parcelas
- Mejores comunas de Ñuble para vivir en el campo
- Cómo cercar y preparar tu parcela

### 5. Redes sociales
Cada reel debe terminar con "Más info en parcelaslosolivos.cl". Poner el link de la web en la bio de Facebook e Instagram.

### 6. Al pasar a producción
- Generar una página estática por cada lote (`/parcelas/lote-8`) en vez de usar `?lote=8`, para que Google indexe cada una.
- Sacar `.html` de las URLs (ya están así en los canonical y en el sitemap).
- Conectar el formulario a un correo o CRM (Formspree, HubSpot).
- Hosting recomendado: Netlify, Vercel o Cloudflare Pages (gratis y rápidos), con el dominio .cl.

## Ver el sitio localmente

Abrir `index.html` en el navegador, o:

```bash
python -m http.server 8000
```
