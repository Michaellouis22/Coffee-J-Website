# Coffee J Website

Website for **Coffee J**, a kedai kopi & resto in Palembang, South Sumatra.

Jl. Jaksa Agung R. Soeprapto, Simpang PHB, Bukit, Ilir Barat I,
Kota Palembang, Sumatera Selatan 30128 · open daily 06.30–23.00

## What's here

A static site — no build step, no dependencies, no framework.

| File | Purpose |
|------|---------|
| `index.html` | The whole page |
| `styles.css` | Design system and layout |
| `app.js` | Menu data, cart, WhatsApp checkout |
| `server.js` | Tiny local preview server (Node built-ins only) |

## Running it locally

```bash
node server.js
```

Then open http://localhost:5501. Override the port with `PORT=3000 node server.js`.

Opening `index.html` directly as a `file://` path mostly works, but the local
server is preferable — it serves the right charset and behaves like real hosting.

## Ordering

There is no payment gateway and no backend. The cart lives in the browser
(`localStorage`), and checkout composes the order into a WhatsApp message to the
shop's number. Nothing is sent until the customer presses send inside WhatsApp.

To change the destination number, edit `WA_NUMBER` at the top of `app.js`.

## Editing the menu

All menu items live in the `MENU` array in `app.js`. Each entry:

```js
{
  id: 'kopi-jadoel',      // unique, used as the cart key
  cat: 'kopi',            // kopi | roti | utama
  name: 'Kopi Jadoel',
  desc: 'Old-fashioned black coffee, Palembang style.',
  price: 12000,           // rupiah, plain number
  tag: 'Signature',       // optional yellow sticker
  icon: 'cup',            // cup | bowl | bread | skewer
}
```

Categories are defined in the `CATEGORIES` array just above it.

## Before this goes live

- [ ] **Replace the prices.** The figures in `MENU` are planning estimates, not
      official counter prices. The page currently shows a note saying so — remove
      that note once real prices are in.
- [ ] **Add the real logo.** The header shows a placeholder "CJ" badge standing in
      for the actual circular logo.
- [ ] **Add photography.** Every image is a labelled placeholder frame. This design
      leans heavily on photos of the food and the venue.

## Design

The visual system is adapted from the "Ghia" reference style — a Mediterranean
aperitivo label translated to the web: burgundy `#651c32`, coral `#ef6079`, and
cream `#f2e2d5`, with Oswald all-caps display type over a Lora serif body, pill
shapes throughout, and flat color (no shadows, no gradients).

One deliberate deviation: secondary button borders use Dusty Rose `#dfcac8`
rather than the reference's Smoke Gray, which is invisible against the cream
canvas.
