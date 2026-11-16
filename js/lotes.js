/* =========================================================
   Parcelas Los Olivos — datos de lotes y listados (sin precios por lote)
   ⚠ ESTADOS Y SUPERFICIES SON DE EJEMPLO: reemplazar con datos reales. No se publican precios por lote.
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
    return { n, m2, frente: 50 + ((n * 13) % 4) * 2, features: f,
      status: vendidos.includes(n) ? 'vendido' : reservados.includes(n) ? 'reservado' : 'disponible' };
  });
})();
const STATUS_TXT = { disponible: 'Disponible', reservado: 'Reservado', vendido: 'Vendido' };
const fmtM2 = (n) => n.toLocaleString('es-CL') + ' m²';

/* ---------- Tarjetas de lotes ---------- */
const icoArea = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z M3 9h18 M9 3v18"/></svg>';
const icoPin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
function lotCard(l, base = '') {
  return `<a class="lot-card reveal" href="${base}parcela.html?lote=${l.n}">
    <div class="lot-card__img">${landscape(l.n + 3, { plot: true })}<span class="status status--${l.status}">${STATUS_TXT[l.status]}</span></div>
    <div class="lot-card__body"><h3>Parcela Lote ${l.n}</h3>
      <div class="lot-card__meta"><span>${icoArea}${fmtM2(l.m2)}</span><span>${icoPin}Las Lajuelas</span></div>
      ${l.features.length ? `<p style="font-size:.88rem;color:var(--olive-600);font-weight:600;margin:-6px 0 14px">✦ ${l.features.join(' · ')}</p>` : ''}
      <div class="lot-card__foot"><div class="lot-card__price"><small>${l.status === 'vendido' ? 'Estado' : 'Precio'}</small>${l.status === 'vendido' ? 'Vendido' : 'Consultar'}</div>
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
    arr = arr.sort((a, b) => sort === 'm2' ? b.m2 - a.m2 : a.n - b.n);
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
    el.textContent = { n: l.n, m2: fmtM2(l.m2), frente: l.frente + ' m',
      estado: STATUS_TXT[l.status], features: l.features.length ? l.features.join(' · ') : 'Lote interior tranquilo' }[k] ?? el.textContent;
  });
  ficha.querySelectorAll('[data-f-status]').forEach((el) => (el.className = `status status--${l.status}`));
  ficha.querySelectorAll('[data-f-wa]').forEach((a) => (a.href = waLink(`Hola! Me interesa la Parcela Lote ${l.n} (${fmtM2(l.m2)}) en Los Olivos, San Nicolás. ¿Puedo agendar una visita?`)));
  const rel = document.querySelector('#relacionados');
  if (rel) rel.innerHTML = LOTES.filter((x) => x.status === 'disponible' && x.n !== l.n).slice(0, 3).map((x) => lotCard(x)).join('');
  rel && rel.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}
featured && featured.querySelectorAll('.reveal').forEach((el) => (typeof io !== 'undefined' && io ? io.observe(el) : el.classList.add('is-visible')));
