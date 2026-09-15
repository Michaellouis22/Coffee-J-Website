/* ===========================================================
   Coffee J — menu, cart, and WhatsApp checkout
   =========================================================== */

/* WhatsApp number in international format, digits only. */
const WA_NUMBER = '6281178886588';

/* ---------- Menu data ----------
   Prices are PLANNING ESTIMATES carried over from the previous
   site — replace `price` with the real counter price before
   this goes live. */

const CATEGORIES = [
  { id: 'all',    label: 'Semua' },
  { id: 'kopi',   label: 'Kopi & Minuman' },
  { id: 'roti',   label: 'Roti & Camilan' },
  { id: 'utama',  label: 'Menu Utama' },
];

const MENU = [
  {
    id: 'kopi-jadoel',
    cat: 'kopi',
    name: 'Kopi Jadoel',
    desc: 'Old-fashioned black coffee, Palembang style.',
    price: 12000,
    tag: 'Signature',
    icon: 'cup',
  },
  {
    id: 'kopi-janji-suci',
    cat: 'kopi',
    name: 'Kopi Janji Suci',
    desc: "Coffee J's signature house blend, served hot or iced.",
    price: 18000,
    tag: 'Bestseller',
    icon: 'cup',
  },
  {
    id: 'wedang-ronde',
    cat: 'kopi',
    name: 'Wedang Ronde',
    desc: 'Warm ginger drink with rice-flour dumplings.',
    price: 15000,
    icon: 'bowl',
  },
  {
    id: 'roti-bakar',
    cat: 'roti',
    name: 'Roti Bakar Coklat Keju',
    desc: 'Grilled bread with chocolate and cheese.',
    price: 20000,
    tag: 'Bestseller',
    icon: 'bread',
  },
  {
    id: 'nasi-goreng-jadul',
    cat: 'utama',
    name: 'Nasi Goreng Jadul',
    desc: 'Old-fashioned fried rice, the way the regulars order it.',
    price: 28000,
    icon: 'bowl',
  },
  {
    id: 'soto-sapi',
    cat: 'utama',
    name: 'Soto Sapi',
    desc: 'Beef soto, Palembang style, with rice on the side.',
    price: 30000,
    icon: 'bowl',
  },
  {
    id: 'soto-jakarta',
    cat: 'utama',
    name: 'Soto Jakarta',
    desc: 'Jakarta-style soto in a rich coconut broth.',
    price: 28000,
    icon: 'bowl',
  },
  {
    id: 'sate',
    cat: 'utama',
    name: 'Sate (10 tusuk)',
    desc: 'Grilled skewers with house sambal and lontong.',
    price: 32000,
    icon: 'skewer',
  },
];

/* ---------- Icons (stand-ins until real photography exists) ---------- */

const ICONS = {
  cup: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 18h22v12a10 10 0 0 1-10 10h-2A10 10 0 0 1 10 30V18Z"/><path d="M32 21h3a5 5 0 0 1 0 10h-3"/><path d="M16 12c0-2 2-2 2-4M23 12c0-2 2-2 2-4"/></svg>',
  bowl: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 22h34a17 17 0 0 1-17 17A17 17 0 0 1 7 22Z"/><path d="M15 16c0-2 2-2.5 2-4.5M24 15c0-2 2-2.5 2-4.5M33 16c0-2 2-2.5 2-4.5"/></svg>',
  bread: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="14" width="30" height="22" rx="6"/><path d="M9 22h30M24 14v22"/></svg>',
  skewer: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 38 38 10"/><rect x="17" y="17" width="8" height="8" rx="2" transform="rotate(45 21 21)"/><rect x="26" y="8" width="8" height="8" rx="2" transform="rotate(45 30 12)"/></svg>',
  koi: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 24c6-8 14-12 22-12 6 0 10 3 14 6-4 3-8 6-14 6-8 0-16-4-22-12Z" transform="translate(0 6)"/><circle cx="17" cy="27" r="1.4" fill="currentColor"/><path d="M42 24c-2 3-2 7 0 10"/></svg>',
  sofa: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 24v-6a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4v6"/><rect x="5" y="24" width="38" height="12" rx="4"/><path d="M14 36v3M34 36v3"/></svg>',
  people: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="19" cy="17" r="6"/><path d="M8 38c0-6 5-10 11-10s11 4 11 10"/><circle cx="34" cy="19" r="5"/><path d="M33 29c4 1 7 4 7 9"/></svg>',
  music: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 33V12l18-4v21"/><circle cx="15" cy="33" r="4.5"/><circle cx="33" cy="29" r="4.5"/></svg>',
  bag: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 16h26l-2.5 24h-21L11 16Z"/><path d="M18 16v-3a6 6 0 0 1 12 0v3"/></svg>',
};

/* ---------- Helpers ---------- */

const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');
const byId = (id) => document.getElementById(id);
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/* ---------- Cart state ---------- */

const STORAGE_KEY = 'coffeej.cart.v1';
let cart = {};       /* { itemId: qty } */
let activeFilter = 'all';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
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
  } catch (e) {
    /* private mode or storage disabled — cart just won't persist */
  }
}

const cartLines = () =>
  Object.keys(cart)
    .map((id) => ({ item: MENU.find((m) => m.id === id), qty: cart[id] }))
    .filter((l) => l.item);

const cartCount = () => cartLines().reduce((n, l) => n + l.qty, 0);
const cartTotal = () => cartLines().reduce((n, l) => n + l.qty * l.item.price, 0);

/* ---------- Rendering: menu ---------- */

function renderFilters() {
  byId('menu-filters').innerHTML = CATEGORIES.map((c) => `
    <button class="filter" type="button" data-cat="${c.id}" aria-pressed="${c.id === activeFilter}">
      ${escapeHtml(c.label)}
    </button>
  `).join('');
}

function renderMenu() {
  const items = activeFilter === 'all' ? MENU : MENU.filter((m) => m.cat === activeFilter);
  byId('menu-grid').innerHTML = items.map((m) => `
    <article class="card">
      ${m.tag ? `<span class="card__tag">${escapeHtml(m.tag)}</span>` : ''}
      <div class="photo card__frame" role="img" aria-label="Photo of ${escapeHtml(m.name)} — placeholder">
        <div>${ICONS[m.icon] || ICONS.cup}</div>
      </div>
      <h3 class="card__name">${escapeHtml(m.name)}</h3>
      <p class="card__desc">${escapeHtml(m.desc)}</p>
      <div class="card__foot">
        <span class="card__price">${rupiah(m.price)}</span>
        <button class="btn btn--primary btn--sm" type="button" data-add="${m.id}">
          Tambah
        </button>
      </div>
    </article>
  `).join('');
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
        ${ICONS.bag}
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

  const lines = [];
  lines.push('Halo Coffee J, saya mau pesan:');
  lines.push('');
  cartLines().forEach((l) => {
    lines.push(`• ${l.item.name} x${l.qty} — ${rupiah(l.qty * l.item.price)}`);
  });
  lines.push('');
  lines.push(`Total: ${rupiah(cartTotal())}`);
  lines.push('');
  lines.push(`Nama: ${name}`);
  lines.push(`Tipe pesanan: ${mode}`);
  if (where) lines.push(`${mode === 'Delivery' ? 'Alamat' : 'Nomor meja'}: ${where}`);
  if (notes) lines.push(`Catatan: ${notes}`);
  lines.push('');
  lines.push('(Dikirim lewat website Coffee J)');

  return lines.join('\n');
}

function submitOrder(e) {
  e.preventDefault();
  if (!cartCount()) return;

  const text = buildOrderMessage(e.target);
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
  showToast('Membuka WhatsApp…');
}

/* ---------- Wiring ---------- */

function init() {
  cart = loadCart();
  renderFilters();
  renderMenu();
  renderCart();

  byId('menu-filters').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    activeFilter = btn.dataset.cat;
    renderFilters();
    renderMenu();
  });

  byId('menu-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (btn) addToCart(btn.dataset.add);
  });

  byId('cart-lines').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    if (inc) bumpQty(inc.dataset.inc, 1);
    if (dec) bumpQty(dec.dataset.dec, -1);
  });

  byId('cart-open').addEventListener('click', openDrawer);
  byId('drawer-close').addEventListener('click', closeDrawer);
  byId('scrim').addEventListener('click', closeDrawer);
  byId('to-checkout').addEventListener('click', () => showPanel('checkout'));
  byId('back-to-cart').addEventListener('click', () => showPanel('cart'));
  byId('checkout-form').addEventListener('submit', submitOrder);

  /* Order-type toggle decides what the location field asks for */
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
    const nav = byId('nav');
    const open = nav.classList.toggle('is-open');
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
