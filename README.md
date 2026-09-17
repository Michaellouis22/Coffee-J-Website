# Coffee J Website

Website for **Coffee J**, a kedai kopi & resto in Palembang, South Sumatra.

Jl. Jaksa Agung R. Soeprapto, Simpang PHB, Bukit, Ilir Barat I,
Kota Palembang, Sumatera Selatan 30128 · open daily 06.30–23.00

## What's here

A static site — no build step, no dependencies, no framework.

| Path | Purpose |
|------|---------|
| `index.html` | The whole page |
| `styles.css` | Design system and layout |
| `menu-data.js` | The full menu — 304 items, prices, photo assignments |
| `app.js` | Rendering, cart, WhatsApp checkout |
| `server.js` | Tiny local preview server (Node built-ins only) |
| `images/logo.png` | Logo, dark ink on transparent — for light surfaces |
| `images/logo-light.png` | Logo, bone ink on transparent — for the espresso header |
| `images/dishes/` | 60 dish photographs, numbered |
| `images/characters/` | Staff characters for the Kunjungi section |
| `scripts/gen-character.js` | Regenerates the characters via the Gemini image API |

## Running it locally

```bash
node server.js
```

Then open http://localhost:5501. Override the port with `PORT=3000 node server.js`.

## Ordering

There is no payment gateway and no backend. The cart lives in the browser
(`localStorage`), and checkout composes the order into a WhatsApp message to the
shop. Nothing is sent until the customer presses send inside WhatsApp.

To change the destination number, edit `WA_NUMBER` at the top of `app.js`.

## The menu

All 304 items live in the `MENU` array in `menu-data.js`, transcribed from the
shop's own printed menu. **Prices are real**, not estimates. The printed menu
lists them in thousands — "KOPI JADOEL 10" means Rp 10.000 — and the data stores
the full rupiah value.

```js
{
  id: 'mie-celor',          // unique, used as the cart key
  cat: 'breakfast',         // must match an id in CATEGORIES
  name: 'Mie Celor',
  price: 28000,             // rupiah, plain number
  photo: '07',              // optional — images/dishes/07.jpg
  focus: '50% 68%',         // optional — see below
  tag: 'Khas Palembang',    // optional yellow sticker
  desc: '...',              // optional one-line description
}
```

Sixteen categories are defined in `CATEGORIES` above it. The six items listed in
`FEATURED` at the bottom of the file render as large photo cards above the menu;
each of them needs a `photo`, or its card shows an empty circle.

### Photo framing

Photos are cropped to circles, which takes a square from the centre of the
image. When a dish sits low or off to one side — common with tall photos — set
`focus` to shift the crop. It maps directly to CSS `object-position`, so
`'50% 68%'` pulls the crop downward. It applies to both the large card and the
small row thumbnail.

## Before this goes live

- [ ] **Verify the photo assignments.** The dish photos arrived unlabelled and
      were matched to menu items by eye. Several have already been corrected.
      Roughly half the photos are still unverified, and about 25 are unused.
- [ ] **Add photographs of the venue.** There are none — no koi pond, no VIP
      room, no interior, no storefront. The hero and story sections currently
      borrow dish photography.
- [ ] **Confirm two ambiguous prices.** The printed menu lists a duplicated
      "Coklat Susu" roti bakar topping at both 24 and 26 (24 was kept), and
      Chicken Katsu at both 30.000 and 35.000 (35.000 was kept).

## Design

The layout and shape language are adapted from the "Ghia" reference style,
re-toned to coffee: espresso `#3a2318`, walnut `#6f4b32`, terracotta `#b3572c`
and latte `#f0e3d2`, with Oswald all-caps display type over a Lora serif body,
pill shapes throughout, and flat colour — no shadows, no gradients.

Terracotta is the single action colour, taken from the coffee cup in the logo.
It sits at 4.6:1 against its bone text, which clears WCAG AA; a brighter, more
saturated orange would not.
