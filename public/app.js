const root = document.documentElement;
root.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* almacenamiento no disponible */ } },
};

let data, token = '', statusKey = '', statusType = '';
let lang = store.get('lang');
if (lang !== 'es' && lang !== 'en') lang = (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';

const tr = (v) => (v && typeof v === 'object' ? v[lang] : v);
const ui = (k) => data.ui[lang][k] ?? k;

/* ---------- tema ---------- */
function applyTheme(t) { root.setAttribute('data-theme', t); }
const savedTheme = store.get('theme');
if (savedTheme === 'light' || savedTheme === 'dark') applyTheme(savedTheme);
$('#theme-btn').addEventListener('click', () => {
  const dark = root.getAttribute('data-theme') ? root.getAttribute('data-theme') === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
  const next = dark ? 'light' : 'dark';
  applyTheme(next); store.set('theme', next);
});

/* ---------- render ---------- */
function renderStatic() {
  root.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = ui(n.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach((n) => { n.placeholder = ui(n.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-aria]').forEach((n) => { n.setAttribute('aria-label', ui(n.dataset.i18nAria)); });
  $('#lang-btn').textContent = ui('lang_btn');
  $('#role').textContent = tr(data.title);
  $('#summary').textContent = tr(data.summary);
  $('meta[name=description]').setAttribute('content', ui('meta_desc'));
  document.title = `${data.name} · ${tr(data.title)}`;
  if (statusKey) setStatus(statusKey, statusType);
}

function renderLists() {
  const tl = $('#timeline'); tl.replaceChildren();
  data.experience.forEach((x) => {
    const card = el('article', 't-item card');
    const head = el('div', 't-head');
    const left = el('div'); left.append(el('h3', '', tr(x.role)), el('span', 't-org', x.org));
    head.append(left, el('span', 't-period', tr(x.period)));
    const ul = el('ul'); x.bullets[lang].forEach((b) => ul.append(el('li', '', b)));
    card.append(head, ul); tl.append(card);
  });

  const sg = $('#skills-grid'); sg.replaceChildren();
  Object.entries(data.skills).forEach(([g, items]) => {
    const c = el('div', 'card'); const chips = el('div', 'chips');
    items.forEach((s) => chips.append(el('span', 'chip', s)));
    c.append(el('h3', '', ui('g_' + g)), chips); sg.append(c);
  });

  const st = $('#studies'); st.replaceChildren();
  data.education.forEach((e) => { const d = el('div'); d.append(el('strong', '', tr(e.title)), el('small', '', `${e.org} · ${e.period}`)); st.append(d); });

  const lg = $('#languages'); lg.replaceChildren();
  data.languages.forEach((l) => { const li = el('li'); li.append(el('strong', '', tr(l.name)), el('small', '', tr(l.level))); lg.append(li); });

  const ct = $('#certs'); ct.replaceChildren();
  data.certifications.forEach((c) => { const li = el('li'); li.append(el('strong', '', c.name), el('small', '', c.org)); ct.append(li); });
}

/* ---------- navegación ---------- */
const nav = $('#nav'), menuBtn = $('#menu-btn');
menuBtn.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); });
nav.addEventListener('click', (e) => { if (e.target.closest('a')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });

function observe() {
  const reveal = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((n) => reveal.observe(n));
  const links = [...nav.querySelectorAll('a')];
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
}

/* ---------- formulario ---------- */
const form = $('#contact-form'), statusEl = $('#form-status'), sendBtn = $('#send');
function setStatus(key, type = '') {
  statusKey = key; statusType = type;
  statusEl.textContent = key ? ui(key) : '';
  statusEl.className = type;
}
const ERRORS = { rate_limited: 'e_rate_limited', captcha_failed: 'e_captcha_failed', mail_failed: 'e_mail_failed', invalid: 'e_invalid', payload_too_large: 'e_invalid' };

function initTurnstile() {
  const key = $('meta[name=turnstile-sitekey]').content.trim();
  if (!key) return;
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  s.async = true;
  s.onload = () => window.turnstile.render('#turnstile', { sitekey: key, callback: (t) => { token = t; }, 'expired-callback': () => { token = ''; } });
  document.head.append(s);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  sendBtn.disabled = true; setStatus('s_sending');
  const fd = new FormData(form);
  const body = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message'), website: fd.get('website'), lang, turnstile_token: token };
  try {
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) { form.reset(); setStatus('s_ok', 'ok'); }
    else { const j = await r.json().catch(() => ({})); setStatus(ERRORS[j.code] || 'e_generic', 'err'); }
  } catch { setStatus('e_network', 'err'); }
  finally { sendBtn.disabled = false; token = ''; window.turnstile?.reset(); }
});

/* ---------- idioma ---------- */
$('#lang-btn').addEventListener('click', () => { lang = lang === 'es' ? 'en' : 'es'; store.set('lang', lang); renderStatic(); renderLists(); });

/* ---------- arranque ---------- */
try {
  data = await (await fetch('/content.json')).json();
  $('#linkedin').href = data.links.linkedin;
  $('#github').href = data.links.github;
  renderStatic(); renderLists(); observe(); initTurnstile();
} catch (err) {
  console.error('No se pudo cargar content.json', err);
  document.querySelectorAll('.reveal').forEach((n) => n.classList.add('in'));
}
