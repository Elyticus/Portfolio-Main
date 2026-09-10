/**
 * Captures screenshots of the live project sites for the Projects section,
 * plus an optimized profile photo and an Open Graph card.
 *
 * Usage: npm run capture
 * Requires the playwright devDependency (browser comes from the standard
 * Playwright install; in CI-like environments set PLAYWRIGHT_BROWSERS_PATH).
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SITES = [
  { slug: "coffee-cup", url: "https://creamy-cup.netlify.app/" },
  { slug: "password-generator", url: "https://password-generator-scrimba-m3.netlify.app/" },
  { slug: "quote-generator", url: "https://advice-generator-app-fendm.netlify.app/" },
  { slug: "kitz-chef", url: "https://kitzchef.netlify.app/" },
  { slug: "okta-widget", url: "https://catalin-pirvulescu-okta-signin-widget.netlify.app/" },
];

const browser = await chromium.launch(
  process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {},
);

/**
 * Re-encode an image buffer to WebP at the given width using Chromium's
 * canvas (no native image dependencies needed).
 */
async function encodeImage(context, buffer, mime, { width, height, type = "image/webp", quality = 0.82 }) {
  const page = await context.newPage();
  try {
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    const out = await page.evaluate(
      async ({ src, width, height, type, quality }) => {
        const img = new Image();
        await new Promise((ok, err) => {
          img.onload = ok;
          img.onerror = () => err(new Error("image decode failed"));
          img.src = src;
        });
        const h = height ?? Math.round((img.naturalHeight / img.naturalWidth) * width);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        // cover-fit: crop source to the target aspect ratio around the top
        const targetRatio = width / h;
        let sw = img.naturalWidth;
        let sh = sw / targetRatio;
        if (sh > img.naturalHeight) {
          sh = img.naturalHeight;
          sw = sh * targetRatio;
        }
        const sx = (img.naturalWidth - sw) / 2;
        ctx.drawImage(img, sx, 0, sw, sh, 0, 0, width, h);
        return canvas.toDataURL(type, quality);
      },
      { src: dataUrl, width, height, type, quality },
    );
    return Buffer.from(out.split(",")[1], "base64");
  } finally {
    await page.close();
  }
}

const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
});

// 1. Project screenshots → src/assets/projects/<slug>.webp (960x540)
mkdirSync(resolve(root, "src/assets/projects"), { recursive: true });
const failed = [];
for (const site of SITES) {
  try {
    const page = await ctx.newPage();
    await page.goto(site.url, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(1500); // let fonts/animations settle
    const png = await page.screenshot({ type: "png" });
    await page.close();
    const webp = await encodeImage(ctx, png, "image/png", { width: 960, height: 540 });
    writeFileSync(resolve(root, `src/assets/projects/${site.slug}.webp`), webp);
    console.log(`ok   ${site.slug} (${(webp.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    failed.push(site.slug);
    console.warn(`SKIP ${site.slug}: ${e.message.split("\n")[0]}`);
  }
}

// 2. Optimized profile photo → public/profile.webp (640x640)
const profileSrc = resolve(root, "public/profile.jpg");
if (existsSync(profileSrc)) {
  const webp = await encodeImage(ctx, readFileSync(profileSrc), "image/jpeg", {
    width: 640,
    height: 640,
    quality: 0.85,
  });
  writeFileSync(resolve(root, "public/profile.webp"), webp);
  console.log(`ok   profile.webp (${(webp.length / 1024).toFixed(0)} KB)`);
}

// 3. Open Graph card → public/og.jpg (1200x630, JPEG for scraper compatibility)
{
  const geist = readFileSync(
    resolve(root, "node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"),
  ).toString("base64");
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face {
      font-family: Geist;
      src: url(data:font/woff2;base64,${geist}) format("woff2");
      font-weight: 100 900;
    }
    * { margin: 0; box-sizing: border-box; }
    body {
      width: 1200px; height: 630px;
      display: flex; flex-direction: column; justify-content: center;
      padding: 0 96px; gap: 20px;
      font-family: Geist, sans-serif;
      background: oklch(0.14 0.02 260);
      color: oklch(0.96 0.005 250);
    }
    .badge {
      align-self: flex-start; padding: 8px 18px; border-radius: 999px;
      border: 1px solid oklch(0.78 0.14 168 / 0.35);
      color: oklch(0.78 0.14 168); font-size: 22px; font-weight: 500;
    }
    h1 { font-size: 84px; font-weight: 700; letter-spacing: -0.02em; }
    h1 span {
      background: linear-gradient(135deg, oklch(0.78 0.14 168), oklch(0.72 0.12 210));
      -webkit-background-clip: text; color: transparent;
    }
    p { font-size: 34px; color: oklch(0.72 0.01 250); }
  </style></head><body>
    <div class="badge">Available for work</div>
    <h1><span>Catalin Pirvulescu</span></h1>
    <p>Frontend Developer — React &middot; Modern CSS</p>
  </body></html>`);
  await page.waitForTimeout(300);
  const jpg = await page.screenshot({ type: "jpeg", quality: 88 });
  writeFileSync(resolve(root, "public/og.jpg"), jpg);
  await page.close();
  console.log(`ok   og.jpg (${(jpg.length / 1024).toFixed(0)} KB)`);
}

await browser.close();

if (failed.length) {
  console.warn(`\nFailed captures (kept previous images): ${failed.join(", ")}`);
  process.exitCode = 1;
}
