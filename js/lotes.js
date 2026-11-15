/* =========================================================
   Parcelas Los Olivos — datos de lotes, plano interactivo y listados
   ⚠ PRECIOS, ESTADOS Y SUPERFICIES SON DE EJEMPLO: reemplazar con datos reales.
   ========================================================= */
const LOTES = (() => {
  const vendidos = [2, 3, 7, 11, 14, 15, 20], reservados = [5, 18, 22];
  const extras = {
    1: ['Esquina', 'Acceso directo'], 6: ['Vista a la cordillera'], 9: ['Vista a la cordillera', 'Frente a área verde'],
    10: ['Vista a la cordillera', 'Frente a área verde'], 12: ['Esquina', 'Vista a la cordillera'], 13: ['Esquina', 'Acceso directo'],
    16: ['Frente a área verde'], 17: ['Frente a área verde'], 21: ['Vista a la cordillera'], 24: ['Esquina', 'Vista a la cordillera'],
  };
  return Array.from({ length: 24 }, (_, i) => {
    const n = i + 1, f = extras[n] || [];
    const m2 = 5000 + ((n * 37) % 5) * 80;
    const price = 13900000 + f.length * 1000000 + (m2 - 5000) * 2500;
    return { n, m2, frente: 50 + ((n * 13) % 4) * 2, price, features: f,
      status: vendidos.includes(n) ? 'vendido' : reservados.includes(n) ? 'reservado' : 'disponible' };
  });
})();
const STATUS_TXT = { disponible: 'Disponible', reservado: 'Reservado', vendido: 'Vendido' };
const fmtM2 = (n) => n.toLocaleString('es-CL') + ' m²';

/* ---------- Plano maestro interactivo ---------- */
function renderPlan(el, panel) {
  const W = 1000, H = 620, cols = 12, lw = 920 / cols, x0 = 40;
  let lots = '';
  LOTES.forEach((l, i) => {
    const top = i < cols, c = top ? i : i - cols;
    const x = x0 + c * lw, y = top ? 40 : 345, h = 235;
    lots += `<rect class="lot lot--${l.status}" data-n="${l.n}" x="${x}" y="${y}" width="${lw}" height="${h}" rx="4" tabindex="${l.status === 'vendido' ? -1 : 0}" role="button" aria-label="Lote ${l.n}, ${fmtM2(l.m2)}, ${STATUS_TXT[l.status]}"><title>Lote ${l.n} · ${STATUS_TXT[l.status]}</title></rect><text class="lot-label" x="${x + lw / 2}" y="${y + h / 2}">${l.n}</text>`;
  });
  let trees = '';
  for (let x = 30; x < 990; x += 34) trees += `<circle cx="${x}" cy="22" r="9" fill="#6b7f45"/><circle cx="${x + 14}" cy="600" r="9" fill="#6b7f45"/>`;
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Plano maestro del loteo Los Olivos, San Nicolás">
    <rect width="${W}" height="${H}" fill="#e3dcc3"/>
    ${trees}
    <rect x="0" y="285" width="${W}" height="50" fill="#cbbf9e"/>
    <line x1="0" y1="310" x2="${W}" y2="310" stroke="#fffdf8" stroke-width="3" stroke-dasharray="18 14"/>
    <text x="500" y="316" text-anchor="middle" font-family="Manrope" font-size="13" font-weight="700" fill="#6b6249" letter-spacing="3">CAMINO INTERIOR · 10 m</text>
    ${lots}
    <g transform="translate(0 285)"><rect width="34" height="50" fill="#c2643a"/><text x="17" y="30" text-anchor="middle" font-family="Manrope" font-size="11" font-weight="800" fill="#fff" transform="rotate(-90 17 25)">ACCESO</text></g>
    <g transform="translate(950 40)"><circle r="22" cx="22" cy="22" fill="#fffdf8" opacity=".9"/><path d="M22 6 L28 24 L22 20 L16 24Z" fill="#1d2614"/><text x="22" y="38" text-anchor="middle" font-size="10" font-weight="800" font-family="Manrope">N</text></g>
  </svg>`;
  const show = (n) => {
    const l = LOTES.find((x) => x.n === +n); if (!l) return;
    el.querySelectorAll('.lot').forEach((r) => r.classList.toggle('is-active', r.dataset.n === String(n)));
    const msg = `Hola! Me interesa el Lote ${l.n} (${fmtM2(l.m2)}) de Parcelas Los Olivos en San Nicolás. ¿Está disponible para visitarlo?`;
    panel.innerHTML = `<span class="status status--${l.status}">${STATUS_TXT[l.status]}</span>
      <h3>Lote ${l.n}</h3>
      <p class="price">${l.status === 'vendido' ? 'Vendido' : clp(l.price)}<small>${l.status === 'vendido' ? 'Pregunta por lotes similares' : 'Precio referencial · contado o en cuotas'}</small></p>
      <dl><div><dt>Superficie</dt><dd>${fmtM2(l.m2)}</dd></div><div><dt>Frente</dt><dd>${l.frente} m</dd></div>
      <div><dt>Rol</dt><dd>Propio</dd></div><div><dt>Cuota desde</dt><dd>${clp((l.price * .8) / 36)}</dd></div></dl>
      ${l.features.length ? `<p style="margin:-8px 0 20px;font-size:.92rem;color:var(--muted)">✦ ${l.features.join(' · ')}</p>` : ''}
      ${l.status !== 'vendido' ? `<a class="btn btn--wa btn--block" target="_blank" rel="noopener" href="${waLink(msg)}">Consultar por WhatsApp</a>
      <a class="btn btn--ghost btn--block" href="parcela.html?lote=${l.n}" style="color:var(--olive-800)">Ver ficha completa</a>` : `<a class="btn btn--olive btn--block" href="#lotes">Ver lotes disponibles</a>`}`;
  };
  el.addEventListener('click', (e) => { const r = e.target.closest('.lot'); if (r && !r.classList.contains('lot--vendido')) show(r.dataset.n); });
  el.addEventListener('keydown', (e) => { const r = e.target.closest('.lot'); if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); show(r.dataset.n); } });
}
const planEl = document.querySelector('#plano'), panelEl = document.querySelector('#lot-panel');
if (planEl && panelEl) renderPlan(planEl, panelEl);

/* ---------- Tarjetas de lotes ---------- */
const icoArea = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z M3 9h18 M9 3v18"/></svg>';
const icoPin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
function lotCard(l, base = '') {
  return `<a class="lot-card reveal" href="${base}parcela.html?lote=${l.n}">
    <div class="lot-card__img">${landscape(l.n + 3, { plot: true })}<span class="status status--${l.status}">${STATUS_TXT[l.status]}</span></div>
    <div class="lot-card__body"><h3>Parcela Lote ${l.n}</h3>
      <div class="lot-card__meta"><span>${icoArea}${fmtM2(l.m2)}</span><span>${icoPin}Las Lajuelas</span></div>
      ${l.features.length ? `<p style="font-size:.88rem;color:var(--olive-600);font-weight:600;margin:-6px 0 14px">✦ ${l.features.join(' · ')}</p>` : ''}
      <div class="lot-card__foot"><div class="lot-card__price"><small>${l.status === 'vendido' ? 'Estado' : 'Precio referencial'}</small>${l.status === 'vendido' ? 'Vendido' : clp(l.price)}</div>
      <span class="lot-card__cta">Ver ficha →</span></div></div></a>`;
}
const featured = document.querySelector('#lotes-destacados');
if (featured) {
  featured.innerHTML = LOTES.filter((l) => l.status === 'disponible').sort((a, b) => b.features.length - a.features.length).slice(0, 3).map((l) => lotCard(l)).join('');
}
const list = document.querySelector('#lotes-lista');
if (list) {
  let filter = 'todos', sort = 'n';
  const draw = () => {
    let arr = LOTES.filter((l) => filter === 'todos' || l.status === filter);
    arr = arr.sort((a, b) => sort === 'precio-asc' ? a.price - b.price : sort === 'precio-desc' ? b.price - a.price : sort === 'm2' ? b.m2 - a.m2 : a.n - b.n);
    list.innerHTML = arr.map((l) => lotCard(l)).join('');
    document.querySelector('#lotes-count').textContent = `${arr.length} parcela${arr.length === 1 ? '' : 's'} · ${LOTES.filter((l) => l.status === 'disponible').length} disponibles de ${LOTES.length}`;
    list.querySelectorAll('.reveal').forEach((el) => requestAnimationFrame(() => el.classList.add('is-visible')));
  };
  document.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.filter; document.querySelectorAll('[data-filter]').forEach((x) => x.classList.toggle('is-active', x === b)); draw();
  }));
  document.querySelector('#orden').addEventListener('change', (e) => { sort = e.target.value; draw(); });
  draw();
}

/* ---------- Ficha individual (parcela.html?lote=N) ---------- */
const ficha = document.querySelector('[data-ficha]');
if (ficha) {
  const n = +(new URLSearchParams(location.search).get('lote') || 8);
  const l = LOTES.find((x) => x.n === n) || LOTES[7];
  document.title = `Parcela Lote ${l.n} de ${fmtM2(l.m2)} en San Nicolás, Ñuble | Los Olivos`;
  ficha.querySelectorAll('[data-f]').forEach((el) => {
    const k = el.dataset.f;
    el.textContent = { n: l.n, m2: fmtM2(l.m2), frente: l.frente + ' m', precio: l.status === 'vendido' ? 'Vendido' : clp(l.price),
      estado: STATUS_TXT[l.status], cuota: clp((l.price * .8) / 36), features: l.features.length ? l.features.join(' · ') : 'Lote interior tranquilo' }[k] ?? el.textContent;
  });
  ficha.querySelectorAll('[data-f-status]').forEach((el) => (el.className = `status status--${l.status}`));
  ficha.querySelectorAll('[data-f-wa]').forEach((a) => (a.href = waLink(`Hola! Me interesa la Parcela Lote ${l.n} (${fmtM2(l.m2)}) en Los Olivos, San Nicolás. ¿Puedo agendar una visita?`)));
  const rel = document.querySelector('#relacionados');
  if (rel) rel.innerHTML = LOTES.filter((x) => x.status === 'disponible' && x.n !== l.n).slice(0, 3).map((x) => lotCard(x)).join('');
  rel && rel.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}
featured && featured.querySelectorAll('.reveal').forEach((el) => (typeof io !== 'undefined' && io ? io.observe(el) : el.classList.add('is-visible')));
