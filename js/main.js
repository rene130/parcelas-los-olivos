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

/* ---------- Ilustraciones de paisaje (reemplazar por fotos/drone reales) ---------- */
function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
const PALETTES = [
  { sky: ['#f6d9a8', '#f3b783'], far: '#9aa7b8', hill: ['#8fa25a', '#6f8443', '#4f6236'] }, // atardecer
  { sky: ['#cfe3ef', '#f3ecd9'], far: '#8ea0b4', hill: ['#a3b36a', '#7b9150', '#566a3a'] }, // mañana
  { sky: ['#e9d8c0', '#d7b48c'], far: '#a59a9e', hill: ['#b6a76a', '#8c8a4c', '#5f6a37'] }, // verano seco
  { sky: ['#bcd4e6', '#e6eef0'], far: '#7d91a8', hill: ['#93ac63', '#6c8a45', '#46602f'] }, // primavera
];
function landscape(seed = 1, { trees = true, plot = false, label = '' } = {}) {
  const r = rng(seed), p = PALETTES[seed % PALETTES.length], id = 'g' + seed + Math.floor(r() * 1e6);
  const mt = () => { let d = 'M0 230 '; for (let x = 0; x <= 800; x += 40) d += `L${x} ${150 + r() * 50 - (x > 300 && x < 460 ? 40 : 0)} `; return d + 'L800 400 L0 400Z'; };
  const hill = (y, amp) => { const a = r() * 6; let d = `M0 ${y} `; for (let x = 0; x <= 800; x += 20) d += `L${x} ${y + Math.sin(x / 120 + a) * amp + Math.sin(x / 47 + a) * amp * .3} `; return d + 'L800 450 L0 450Z'; };
  let olives = '';
  if (trees) for (let row = 0; row < 4; row++) for (let i = 0; i < 14; i++) {
    const y = 330 + row * 28, x = (i * 62 + row * 24 + r() * 14) % 820, s = 7 + row * 3 + r() * 2;
    olives += `<ellipse cx="${x}" cy="${y + s}" rx="${s * 1.1}" ry="${s * .3}" fill="rgba(0,0,0,.15)"/><rect x="${x - 1}" y="${y}" width="2.4" height="${s}" fill="#4a3b2a"/><circle cx="${x}" cy="${y - s * .3}" r="${s}" fill="${row % 2 ? '#56693a' : '#647a43'}"/><circle cx="${x - s * .4}" cy="${y - s * .6}" r="${s * .55}" fill="#7a9152" opacity=".8"/>`;
  }
  const plotLines = plot ? `<g stroke="#fffdf8" stroke-width="2" stroke-dasharray="6 6" opacity=".85" fill="rgba(255,253,248,.12)"><path d="M210 330 L560 318 L640 420 L150 440Z"/></g><g fill="#c2643a"><circle cx="210" cy="330" r="5"/><circle cx="560" cy="318" r="5"/><circle cx="640" cy="420" r="5"/><circle cx="150" cy="440" r="5"/></g>` : '';
  const lab = label ? `<g><rect x="24" y="24" rx="14" width="${label.length * 11 + 36}" height="40" fill="rgba(29,38,20,.65)"/><text x="42" y="50" font-family="Manrope,sans-serif" font-weight="700" font-size="17" fill="#fff">${label}</text></g>` : '';
  return `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de parcela con olivos y cordillera en San Nicolás, Ñuble">
  <defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#${id}s)"/>
  <circle cx="${560 + r() * 160}" cy="${80 + r() * 40}" r="34" fill="#fff6dc" opacity=".85"/>
  <path d="${mt()}" fill="${p.far}" opacity=".75"/>
  <path d="M330 175 L380 110 L430 172Z" fill="#fff" opacity=".85"/>
  <path d="${hill(250, 14)}" fill="${p.hill[0]}"/>
  <path d="${hill(290, 18)}" fill="${p.hill[1]}"/>
  <path d="${hill(340, 10)}" fill="${p.hill[2]}"/>
  ${olives}${plotLines}${lab}
</svg>`;
}
document.querySelectorAll('[data-art]').forEach((el) => {
  el.insertAdjacentHTML('afterbegin', landscape(+el.dataset.art, { trees: el.dataset.trees !== 'no', plot: 'plot' in el.dataset, label: el.dataset.label || '' }));
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
