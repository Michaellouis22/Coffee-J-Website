/* ===========================================================
   Coffee J — cart and WhatsApp checkout
   Menu data lives in menu-data.js (window.CJ_MENU).
   =========================================================== */

/* WhatsApp number in international format, digits only. */
const WA_NUMBER = '6281178886588';

const MENU = window.CJ_MENU || [];
const CATEGORIES = window.CJ_CATEGORIES || [];
const FEATURED = window.CJ_FEATURED || [];

/* ---------- Helpers ---------- */

const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');
const byId = (id) => document.getElementById(id);
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
const photoSrc = (item) => `images/dishes/${item.photo}.jpg`;

/* Circular frames crop a square from the middle of the photo. When the dish
   sits off-centre, `focus` shifts that crop so the food stays in view. */
const focusStyle = (item) => (item.focus ? ` style="object-position:${item.focus}"` : '');

/* ---------- Cart state ---------- */

const STORAGE_KEY = 'coffeej.cart.v1';
let cart = {};
let activeCat = 'all';

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const clean = {};
    Object.keys(parsed || {}).forEach((id) => {
      const qty = parseInt(parsed[id], 10);
      if (MENU.some((m) => m.id === id) && qty > 0) clean[id] = Math.min(qty, 99);
    });
    return clean;
  } catch (e) {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) { /* storage unavailable — cart just won't persist */ }
}

const cartLines = () =>
  Object.keys(cart)
    .map((id) => ({ item: MENU.find((m) => m.id === id), qty: cart[id] }))
    .filter((l) => l.item);

const cartCount = () => cartLines().reduce((n, l) => n + l.qty, 0);
const cartTotal = () => cartLines().reduce((n, l) => n + l.qty * l.item.price, 0);

/* ---------- Rendering: featured photo cards ---------- */

function renderFeatured() {
  const items = FEATURED.map((id) => MENU.find((m) => m.id === id)).filter(Boolean);
  byId('featured-grid').innerHTML = items.map((m) => `
    <article class="card">
      ${m.tag ? `<span class="card__tag">${escapeHtml(m.tag)}</span>` : ''}
      <div class="card__frame">
        ${m.photo
          ? `<img src="${photoSrc(m)}" alt="${escapeHtml(m.name)}" loading="lazy"${focusStyle(m)}>`
          : ''}
      </div>
      <h3 class="card__name">${escapeHtml(m.name)}</h3>
      ${m.desc ? `<p class="card__desc">${escapeHtml(m.desc)}</p>` : ''}
      <div class="card__foot">
        <span class="card__price">${rupiah(m.price)}</span>
        <button class="btn btn--primary btn--sm" type="button" data-add="${m.id}">Tambah</button>
      </div>
    </article>
  `).join('');
}

/* ---------- Rendering: full menu ---------- */

function renderCatNav() {
  const all = [{ id: 'all', label: 'Semua' }].concat(CATEGORIES);
  byId('menu-filters').innerHTML = all.map((c) => `
    <button class="filter" type="button" data-cat="${c.id}" aria-pressed="${c.id === activeCat}">
      ${escapeHtml(c.label)}
    </button>
  `).join('');
}

function renderMenu() {
  const cats = activeCat === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.id === activeCat);

  byId('menu-list').innerHTML = cats.map((cat) => {
    const items = MENU.filter((m) => m.cat === cat.id);
    if (!items.length) return '';
    return `
      <section class="group" id="cat-${cat.id}">
        <header class="group__head">
          <h3>${escapeHtml(cat.label)}</h3>
          ${cat.note ? `<p>${escapeHtml(cat.note)}</p>` : ''}
          <span class="group__count">${items.length} item</span>
        </header>
        <ul class="rows">
          ${items.map((m) => `
            <li class="row">
              ${m.photo
                ? `<img class="row__img" src="${photoSrc(m)}" alt="${escapeHtml(m.name)}" loading="lazy"${focusStyle(m)}>`
                : '<span class="row__img row__img--none" aria-hidden="true"></span>'}
              <div class="row__text">
                <span class="row__name">${escapeHtml(m.name)}</span>
                ${m.desc ? `<span class="row__desc">${escapeHtml(m.desc)}</span>` : ''}
              </div>
              <span class="row__price">${rupiah(m.price)}</span>
              <button class="row__add" type="button" data-add="${m.id}"
                      aria-label="Tambah ${escapeHtml(m.name)}">+</button>
            </li>
          `).join('')}
        </ul>
      </section>`;
  }).join('');
}

/* ---------- Rendering: cart ---------- */

function renderCart() {
  const lines = cartLines();
  const count = cartCount();

  byId('cart-count').textContent = count;
  byId('cart-count').hidden = count === 0;

  const body = byId('cart-lines');
  const foot = byId('cart-foot');

  if (!lines.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 16h26l-2.5 24h-21L11 16Z"/><path d="M18 16v-3a6 6 0 0 1 12 0v3"/>
        </svg>
        <p>Keranjang masih kosong.<br>Pilih menu dulu, ya.</p>
      </div>`;
    foot.hidden = true;
    return;
  }

  foot.hidden = false;
  body.innerHTML = lines.map((l) => `
    <div class="line">
      <div>
        <div class="line__name">${escapeHtml(l.item.name)}</div>
        <div class="line__unit">${rupiah(l.item.price)} each</div>
        <div class="stepper">
          <button type="button" data-dec="${l.item.id}" aria-label="Kurangi ${escapeHtml(l.item.name)}">&minus;</button>
          <span>${l.qty}</span>
          <button type="button" data-inc="${l.item.id}" aria-label="Tambah ${escapeHtml(l.item.name)}">+</button>
        </div>
      </div>
      <div class="line__sum">${rupiah(l.qty * l.item.price)}</div>
    </div>
  `).join('');

  byId('cart-total').textContent = rupiah(cartTotal());
}

/* ---------- Cart actions ---------- */

function addToCart(id) {
  const item = MENU.find((m) => m.id === id);
  if (!item) return;
  cart[id] = Math.min((cart[id] || 0) + 1, 99);
  saveCart();
  renderCart();
  showToast(`${item.name} ditambahkan`);
}

function bumpQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] < 1) delete cart[id];
  saveCart();
  renderCart();
  if (!cartCount()) showPanel('cart');
}

/* ---------- Drawer + panels ---------- */

function openDrawer() {
  byId('drawer').classList.add('is-open');
  byId('scrim').classList.add('is-open');
  byId('drawer').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  byId('drawer-close').focus();
}

function closeDrawer() {
  byId('drawer').classList.remove('is-open');
  byId('scrim').classList.remove('is-open');
  byId('drawer').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  showPanel('cart');
}

function showPanel(which) {
  const isCart = which === 'cart';
  byId('panel-cart').hidden = !isCart;
  byId('panel-checkout').hidden = isCart;
  byId('drawer-title').textContent = isCart ? 'Keranjang' : 'Checkout';
}

let toastTimer;
function showToast(msg) {
  const el = byId('toast');
  el.textContent = msg;
  el.classList.add('is-open');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-open'), 2200);
}

/* ---------- Checkout → WhatsApp ---------- */

function buildOrderMessage(form) {
  const data = new FormData(form);
  const mode = data.get('mode') || 'Dine-in';
  const name = (data.get('name') || '').toString().trim();
  const where = (data.get('where') || '').toString().trim();
  const notes = (data.get('notes') || '').toString().trim();

  const lines = ['Halo Coffee J, saya mau pesan:', ''];
  cartLines().forEach((l) => {
    lines.push(`• ${l.item.name} x${l.qty} — ${rupiah(l.qty * l.item.price)}`);
  });
  lines.push('', `Total: ${rupiah(cartTotal())}`, '');
  lines.push(`Nama: ${name}`);
  lines.push(`Tipe pesanan: ${mode}`);
  if (where) lines.push(`${mode === 'Delivery' ? 'Alamat' : 'Nomor meja'}: ${where}`);
  if (notes) lines.push(`Catatan: ${notes}`);
  lines.push('', '(Dikirim lewat website Coffee J)');

  return lines.join('\n');
}

function submitOrder(e) {
  e.preventDefault();
  if (!cartCount()) return;
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildOrderMessage(e.target))}`;
  window.open(url, '_blank', 'noopener');
  showToast('Membuka WhatsApp…');
}

/* ---------- Wiring ---------- */

function init() {
  cart = loadCart();
  renderFeatured();
  renderCatNav();
  renderMenu();
  renderCart();

  byId('menu-filters').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    activeCat = btn.dataset.cat;
    renderCatNav();
    renderMenu();
  });

  /* One delegated handler covers featured cards and every menu row. */
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) { addToCart(add.dataset.add); return; }
    const inc = e.target.closest('[data-inc]');
    if (inc) { bumpQty(inc.dataset.inc, 1); return; }
    const dec = e.target.closest('[data-dec]');
    if (dec) { bumpQty(dec.dataset.dec, -1); }
  });

  byId('cart-open').addEventListener('click', openDrawer);
  byId('drawer-close').addEventListener('click', closeDrawer);
  byId('scrim').addEventListener('click', closeDrawer);
  byId('to-checkout').addEventListener('click', () => showPanel('checkout'));
  byId('back-to-cart').addEventListener('click', () => showPanel('cart'));
  byId('checkout-form').addEventListener('submit', submitOrder);

  document.querySelectorAll('input[name="mode"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const delivery = radio.value === 'Delivery' && radio.checked;
      byId('where-label').textContent = delivery ? 'Alamat pengantaran' : 'Nomor meja (opsional)';
      byId('where').placeholder = delivery ? 'Jl. ... , Palembang' : 'mis. Meja 4';
      byId('where').required = delivery;
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && byId('drawer').classList.contains('is-open')) closeDrawer();
  });

  const toggle = byId('nav-toggle');
  toggle.addEventListener('click', () => {
    const open = byId('nav').classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  byId('nav').addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      byId('nav').classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
