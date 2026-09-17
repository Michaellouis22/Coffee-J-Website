#!/usr/bin/env node
/* ===========================================================
   Coffee J — character art generator

   Calls the Gemini image API over plain HTTPS. No Python, no
   SDK, no dependencies beyond Node itself.

   The API key is read from the environment or from a .env file;
   it is never printed.

   Usage:
     node scripts/gen-character.js barista
     node scripts/gen-character.js server --pro
     node scripts/gen-character.js all
   =========================================================== */

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');

/* ---------- API key ---------- */

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  const candidates = [
    path.join(os.homedir(), '.claude', '.env'),
    path.join(os.homedir(), '.claude', 'skills', '.env'),
    path.join(__dirname, '..', '.env'),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, '').trim();
    }
  }
  return null;
}

/* ---------- Prompts ---------- */

const APRON = `wearing a dark espresso-brown canvas barista apron with a small
terracotta-orange coffee cup emblem on the chest and the words "Coffee J" in a
flowing script above it`;

const COMMON = `Full body character illustration of a friendly young Indonesian
adult, ${APRON}. Modern 3D animated feature-film style: soft rounded forms,
smooth subsurface-scattered skin shading, gentle studio key light, warm
inviting expression, slightly stylised proportions with a large expressive
head. Warm brown eyes, black hair, Southeast Asian features. Standing full
figure, head to feet, no cropping. Isolated on a pure flat white background
with no shadow on the floor, no props other than those described, no text or
logos other than on the apron. Original character design.`;

const CHARACTERS = {
  barista: {
    file: 'barista.png',
    prompt: `${COMMON} This character is a barista: short tidy black hair, a
      warm open smile, holding a white ceramic cup of black coffee on a saucer
      in one hand, the other hand relaxed at their side. Casual rolled-sleeve
      shirt under the apron.`,
  },
  server: {
    file: 'server.png',
    prompt: `${COMMON} This character is a server: hair tied back, cheerful
      confident posture, carrying a round wooden tray at shoulder height with a
      plate of Indonesian food and a glass of iced tea on it. Simple t-shirt
      under the apron.`,
  },
};

/* ---------- Gemini call ---------- */

function generate(key, prompt, model) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt.replace(/\s+/g, ' ').trim() }] }],
    generationConfig: { responseModalities: ['IMAGE'] },
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${model}:generateContent`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'x-goog-api-key': key,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          return reject(new Error(`HTTP ${res.statusCode}: unparseable response`));
        }
        if (parsed.error) {
          return reject(new Error(`HTTP ${res.statusCode}: ${parsed.error.message}`));
        }
        const parts = parsed?.candidates?.[0]?.content?.parts || [];
        const img = parts.find((p) => p.inlineData || p.inline_data);
        if (!img) {
          const text = parts.map((p) => p.text).filter(Boolean).join(' ');
          return reject(new Error(`No image returned. ${text || JSON.stringify(parsed).slice(0, 300)}`));
        }
        resolve(Buffer.from((img.inlineData || img.inline_data).data, 'base64'));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/* ---------- Main ---------- */

(async () => {
  const key = loadKey();
  if (!key) {
    console.error('No GEMINI_API_KEY found.');
    console.error('Put it in C:\\Users\\<you>\\.claude\\.env as:  GEMINI_API_KEY=your-key-here');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const pro = args.includes('--pro');
  const model = pro ? 'gemini-3-pro-image' : 'gemini-2.5-flash-image';
  const which = args.filter((a) => !a.startsWith('--'));
  const names = which.length === 0 || which[0] === 'all' ? Object.keys(CHARACTERS) : which;

  const outDir = path.join(__dirname, '..', 'images', 'characters');
  fs.mkdirSync(outDir, { recursive: true });

  for (const name of names) {
    const spec = CHARACTERS[name];
    if (!spec) {
      console.error(`Unknown character "${name}". Known: ${Object.keys(CHARACTERS).join(', ')}`);
      continue;
    }
    process.stdout.write(`Generating ${name} (${model})... `);
    try {
      const png = await generate(key, spec.prompt, model);
      const out = path.join(outDir, spec.file);
      fs.writeFileSync(out, png);
      console.log(`saved ${spec.file} (${(png.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.log('FAILED');
      console.error(`  ${e.message}`);
    }
  }
})();
