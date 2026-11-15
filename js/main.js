/* =========================================================
   Parcelas Los Olivos — interacciones del sitio
   ========================================================= */
document.documentElement.classList.remove('no-js');

const WA_NUMBER = '56942744145'; // +56 9 4274 4145 (Facebook de Los Olivos)
const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');

/* ---------- Pixel de Meta (Facebook / Instagram Ads) ----------
   Pega aquí el ID del pixel (Administrador de eventos de Meta → Orígenes de datos).
   Mientras esté vacío no se carga nada. */
const META_PIXEL_ID = '';
if (META_PIXEL_ID) {
  !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}
const track = (event, params = {}) => {
  if (window.fbq) fbq('track', event, params);
  if (window.gtag) gtag('event', event === 'Contact' ? 'contact_whatsapp' : event === 'Lead' ? 'generate_lead' : event.toLowerCase(), params);
};
// Cada clic en un botón de WhatsApp cuenta como "Contact" (sirve para optimizar campañas)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href*="wa.me/"]');
  if (a && !a.dataset.share) track('Contact', { content_name: (a.textContent || 'WhatsApp').trim().slice(0, 60) });
});
// Ficha de lote: "ViewContent" con el número de lote
if (document.querySelector('[data-ficha]')) {
  track('ViewContent', { content_type: 'product', content_ids: ['lote-' + (new URLSearchParams(location.search).get('lote') || '8')] });
}

/* ---------- Fotos reales del proyecto (img/) ---------- */
const IMG_BASE = (document.currentScript && document.currentScript.src.replace(/js\/main\.js.*$/, 'img/')) || 'img/';
const PHOTOS = {
  'vista-aerea-lotes-1': 'Vista aérea de las parcelas Los Olivos en San Nicolás, Ñuble',
  'vista-aerea-lotes-2': 'Vista aérea de los lotes y caminos interiores del loteo Los Olivos',
  'vista-aerea-lotes-3': 'Camino interior entre parcelas de 5.000 m² visto desde el aire',
  'vista-aerea-lotes-4': 'Parcelas con árboles y vista a los cerros en San Nicolás',
  'vista-aerea-lotes-5': 'Lotes de 5.000 m² en el sector Las Lajuelas, San Nicolás',
  'vista-aerea-lotes-6': 'Vista aérea de parcelas con bosque en la Región de Ñuble',
  'vista-aerea-lotes-7': 'Loteo Parcelas Los Olivos visto con dron',
  'vista-aerea-lotes-8': 'Parcelas rurales en San Nicolás con vista a la cordillera',
  'camino-acceso-loteo': 'Camino de acceso al loteo Parcelas Los Olivos',
  'camino-interior-parcelas': 'Camino interior de las parcelas con vista a la cordillera',
  'vista-nevados-de-chillan': 'Vista a los Nevados de Chillán desde las parcelas',
  'porton-acceso-los-olivos': 'Portón de acceso a Parcelas Los Olivos',
  'caballos-campo-nuble': 'Caballos en el campo de San Nicolás, Ñuble',
  'parcela-con-casa-san-nicolas': 'Parcela con casa de campo en San Nicolás',
  'entrada-parcelas-los-olivos': 'Entrada al loteo Parcelas Los Olivos',
  'acceso-parcelas-los-olivos': 'Acceso a Parcelas Los Olivos en el sector Las Lajuelas',
};
// Foto elegida para cada imagen del sitio (según su número data-art)
const ART_PHOTO = { 9: 'vista-aerea-lotes-7', 11: 'vista-aerea-lotes-2', 6: 'camino-acceso-loteo', 16: 'vista-nevados-de-chillan', 21: 'porton-acceso-los-olivos', 14: 'caballos-campo-nuble', 7: 'parcela-con-casa-san-nicolas', 18: 'vista-aerea-lotes-8' };
const ROTATION = ['vista-aerea-lotes-1', 'vista-aerea-lotes-2', 'vista-aerea-lotes-3', 'vista-aerea-lotes-4', 'vista-aerea-lotes-5', 'vista-aerea-lotes-6', 'vista-aerea-lotes-7', 'vista-aerea-lotes-8', 'camino-interior-parcelas', 'entrada-parcelas-los-olivos'];
function landscape(seed = 1, { label = '' } = {}) {
  const key = ART_PHOTO[seed] || ROTATION[seed % ROTATION.length];
  const lab = label ? `<span class="photo-label">${label}</span>` : '';
  return `<img src="${IMG_BASE}${key}.jpg" alt="${PHOTOS[key]}" loading="lazy" decoding="async" width="1280" height="853">${lab}`;
}
document.querySelectorAll('[data-art]').forEach((el) => {
  el.insertAdjacentHTML('afterbegin', landscape(+el.dataset.art, { label: el.dataset.label || '' }));
});

/* ---------- Header ---------- */
const header = document.querySelector('.header');
const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }));
}

/* ---------- Animaciones al hacer scroll ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' }) : null;
document.querySelectorAll('.reveal').forEach((el) => io ? io.observe(el) : el.classList.add('is-visible'));

/* ---------- Contadores ---------- */
document.querySelectorAll('[data-count]').forEach((el) => {
  const end = +el.dataset.count, suffix = el.dataset.suffix || '';
  const run = () => { const t0 = performance.now(); const step = (t) => { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString('es-CL') + suffix; if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  if (!io) return run();
  const o = new IntersectionObserver((en) => { if (en[0].isIntersecting) { run(); o.disconnect(); } }); o.observe(el);
});

/* ---------- Enlaces de WhatsApp ---------- */
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = waLink(a.dataset.wa || 'Hola! Vi la página web de Parcelas Los Olivos y quiero más información.');
  a.target = '_blank'; a.rel = 'noopener';
});
const waFloat = document.querySelector('.wa-float');
if (waFloat) setTimeout(() => { waFloat.classList.add('show-bubble'); setTimeout(() => waFloat.classList.remove('show-bubble'), 7000); }, 4000);

/* ---------- Simulador de financiamiento ---------- */
const sim = document.querySelector('#simulador-form');
if (sim) {
  const price = sim.querySelector('#precio'), pie = sim.querySelector('#pie'), cuotas = sim.querySelector('#cuotas');
  const paint = (inp) => inp.style.setProperty('--p', ((inp.value - inp.min) / (inp.max - inp.min)) * 100 + '%');
  const calc = () => {
    const P = +price.value, piePct = +pie.value / 100, n = +cuotas.value;
    const pieMonto = P * piePct, saldo = P - pieMonto, cuota = saldo / n;
    sim.querySelector('[for=precio] output').textContent = clp(P);
    sim.querySelector('[for=pie] output').textContent = pie.value + '%';
    sim.querySelector('[for=cuotas] output').textContent = n + ' meses';
    document.querySelector('#sim-cuota').textContent = clp(cuota);
    document.querySelector('#sim-pie').textContent = clp(pieMonto);
    document.querySelector('#sim-saldo').textContent = clp(saldo);
    document.querySelector('#sim-n').textContent = n;
    document.querySelector('#sim-wa').href = waLink(`Hola! Simulé en la web una parcela de ${clp(P)} con pie de ${pie.value}% (${clp(pieMonto)}) y ${n} cuotas de ${clp(cuota)}. ¿Me pueden confirmar disponibilidad?`);
    [price, pie, cuotas].forEach(paint);
  };
  sim.addEventListener('input', calc); calc();
}

/* ---------- Formulario de contacto (mockup: envía por WhatsApp) ---------- */
document.querySelectorAll('form[data-lead]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const msg = `Hola! Soy ${d.nombre || ''}. ${d.interes ? 'Me interesa: ' + d.interes + '. ' : ''}${d.mensaje || ''} Mi teléfono: ${d.telefono || ''}`;
    // En producción: enviar a CRM / correo (Formspree, HubSpot, etc.) + evento de conversión GA4 "generate_lead"
    track('Lead', { content_name: d.interes || 'formulario_web' });
    form.closest('.form').classList.add('is-sent');
    setTimeout(() => window.open(waLink(msg), '_blank', 'noopener'), 600);
  });
});

/* ---------- Artículos: barra de progreso + índice activo ---------- */
const bar = document.querySelector('.progress');
const article = document.querySelector('.article');
if (bar && article) {
  window.addEventListener('scroll', () => {
    const r = article.getBoundingClientRect();
    bar.style.width = Math.min(100, Math.max(0, (-r.top / (r.height - innerHeight)) * 100)) + '%';
  }, { passive: true });
  const links = [...document.querySelectorAll('.toc nav a[href^="#"]')];
  const heads = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if (io && heads.length) {
    const ho = new IntersectionObserver((en) => en.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-20% 0px -70% 0px' });
    heads.forEach((h) => ho.observe(h));
  }
}

/* ---------- Compartir ---------- */
document.querySelectorAll('[data-share]').forEach((a) => {
  const u = encodeURIComponent(location.href), t = encodeURIComponent(document.title);
  const map = { wa: `https://wa.me/?text=${t}%20${u}`, fb: `https://www.facebook.com/sharer/sharer.php?u=${u}`, x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, in: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` };
  a.href = map[a.dataset.share]; a.target = '_blank'; a.rel = 'noopener';
});

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
