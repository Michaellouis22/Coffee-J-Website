/* ===========================================================
   Coffee J — annotation overlay (development tool)

   Lets you draw on top of the page to point things out, then
   screenshot and share the result.

   DORMANT BY DEFAULT. It only switches on when the URL carries
   ?annotate=1 (or #annotate), so customers never see it and it
   costs them nothing but this file's few KB.

     http://localhost:5501/?annotate=1
     https://coffee-j-website.vercel.app/?annotate=1

   Usage: click PEN to draw, click it again to scroll. Undo
   removes the last stroke, Clear wipes them all, X closes.
   =========================================================== */

(function () {
  const on = /(^|[?&])annotate=1(&|$)/.test(location.search) || location.hash === '#annotate';
  if (!on) return;

  const COLORS = ['#e6332a', '#1668dc', '#f0b429', '#111111'];
  let color = COLORS[0];
  let drawing = false;      /* is the pen tool armed */
  let stroking = false;     /* is the pointer currently down */
  const strokes = [];       /* [{color, width, points:[[x,y],...]}] */

  /* ---------- canvas ---------- */

  const canvas = document.createElement('canvas');
  canvas.id = 'cj-annotate-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', zIndex: '2147483646',
    pointerEvents: 'none', touchAction: 'none',
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function sizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }

  function redraw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    strokes.forEach((s) => {
      if (s.points.length < 2) return;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      ctx.moveTo(s.points[0][0], s.points[0][1]);
      for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i][0], s.points[i][1]);
      ctx.stroke();
    });
  }

  window.addEventListener('resize', sizeCanvas);
  sizeCanvas();

  /* ---------- drawing ---------- */

  canvas.addEventListener('pointerdown', (e) => {
    if (!drawing) return;
    stroking = true;
    canvas.setPointerCapture(e.pointerId);
    strokes.push({ color, width: 4, points: [[e.clientX, e.clientY]] });
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drawing || !stroking) return;
    strokes[strokes.length - 1].points.push([e.clientX, e.clientY]);
    redraw();
  });

  const endStroke = () => { stroking = false; };
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointercancel', endStroke);

  /* ---------- toolbar ---------- */

  const bar = document.createElement('div');
  bar.id = 'cj-annotate-bar';
  Object.assign(bar.style, {
    position: 'fixed', right: '16px', bottom: '16px', zIndex: '2147483647',
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px', borderRadius: '9999px',
    background: '#3a2318', color: '#fdf8f1',
    font: '600 12px/1 system-ui, sans-serif',
    boxShadow: '0 6px 24px rgba(0,0,0,.28)',
    userSelect: 'none',
  });

  const mkBtn = (label, title, onClick) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.title = title;
    Object.assign(b.style, {
      border: '1px solid rgba(253,248,241,.35)', background: 'transparent',
      color: 'inherit', font: 'inherit', padding: '8px 12px',
      borderRadius: '9999px', cursor: 'pointer',
    });
    b.addEventListener('click', onClick);
    return b;
  };

  const penBtn = mkBtn('PEN', 'Toggle drawing (Esc to exit)', () => setDrawing(!drawing));

  function setDrawing(v) {
    drawing = v;
    canvas.style.pointerEvents = v ? 'auto' : 'none';
    canvas.style.cursor = v ? 'crosshair' : '';
    penBtn.style.background = v ? '#b3572c' : 'transparent';
    penBtn.style.borderColor = v ? '#b3572c' : 'rgba(253,248,241,.35)';
    penBtn.textContent = v ? 'DRAWING' : 'PEN';
  }

  bar.appendChild(penBtn);

  COLORS.forEach((c) => {
    const dot = document.createElement('button');
    dot.title = 'Colour ' + c;
    Object.assign(dot.style, {
      width: '20px', height: '20px', borderRadius: '9999px', cursor: 'pointer',
      background: c, border: c === color ? '2px solid #fdf8f1' : '2px solid transparent',
    });
    dot.addEventListener('click', () => {
      color = c;
      [...bar.querySelectorAll('button')].forEach((b) => {
        if (b.style.background && b.style.width === '20px') {
          b.style.border = b.style.background === c ? '2px solid #fdf8f1' : '2px solid transparent';
        }
      });
      dot.style.border = '2px solid #fdf8f1';
      if (!drawing) setDrawing(true);
    });
    bar.appendChild(dot);
  });

  bar.appendChild(mkBtn('Undo', 'Remove the last stroke', () => { strokes.pop(); redraw(); }));
  bar.appendChild(mkBtn('Clear', 'Remove every stroke', () => { strokes.length = 0; redraw(); }));
  bar.appendChild(mkBtn('✕', 'Close the annotation overlay', () => { bar.remove(); canvas.remove(); }));

  document.body.appendChild(bar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawing) setDrawing(false);
  });
})();
