/* ------------------------------------------------------------------
   DECOR visiting card renderer
   Draws the front (details) side of the card onto a 1600 x 914 canvas.
   All positions are in pixels of the original card design.
   Adjust LAYOUT below if you ever want to nudge sizes or spacing.
------------------------------------------------------------------- */

const CARD_W = 1600;
const CARD_H = 914;

const COLORS = {
  text: "#3E4955",   // dark slate used for name, degree, designation, phone
  email: "#666666",  // grey serif used for e-mail lines
};

const FONTS = {
  sans: '"Card Inter"',
  phone: '"Card Poppins"',
  serif: '"Card Pagella"',
};

const LAYOUT = {
  left: 793,          // x where the name / degree / designation start
  maxRight: 1455,     // text never goes past this x (keeps clear of the dots)

  name:        { y: 231, size: 36, weight: 600, tracking: 1.3 },
  education:   { y: 279, size: 30, weight: 400, tracking: 2.4, smallCaps: 0.78 },
  designation: { y: 333, size: 30, weight: 600, tracking: 3.0, smallCaps: 0.82, lineGap: 47 },
  companyMail: { gapAfterDesignation: 51, size: 34 },
  noEducationShift: 46, // move designation up by this much when degree is blank

  phone: { x: 886, y: 629, size: 33, tracking: 2.0, maxRight: 1560 },
  email: { x: 898, y: 696, size: 39, maxRight: 1560 },
};

/* ---------- helpers ---------- */

function setFont(ctx, weight, size, family) {
  ctx.font = `${weight} ${size}px ${family}`;
}

/** Measure / draw text letter by letter so tracking works in every browser. */
function trackedWidth(ctx, text, tracking) {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + tracking;
  return w - (text.length ? tracking : 0);
}

function drawTracked(ctx, text, x, y, tracking) {
  for (const ch of text) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + tracking;
  }
  return x;
}

/**
 * Small-caps: capital letters / digits / symbols stay full size,
 * lowercase letters are drawn as smaller capitals.
 * Returns the width; draws only when draw === true.
 */
function smallCaps(ctx, text, x, y, opt, scale, draw) {
  const big = opt.size * scale;
  const small = big * opt.smallCaps;
  const tr = opt.tracking * scale;
  let cx = x;
  for (const ch of text) {
    const isLower = ch !== ch.toUpperCase();
    setFont(ctx, opt.weight, isLower ? small : big, FONTS.sans);
    const glyph = ch.toUpperCase();
    if (draw) ctx.fillText(glyph, cx, y);
    cx += ctx.measureText(glyph).width + tr;
  }
  return cx - x - (text.length ? tr : 0);
}

/** Shrink factor (<= 1) so a line fits into maxWidth. */
function fitScale(width, maxWidth) {
  return width > maxWidth ? maxWidth / width : 1;
}

/* ---------- main renderer ---------- */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement} template  blank card background (assets/card-front-template.png)
 * @param {{name:string, education:string, designation:string, phone:string,
 *          email:string, companyEmail:string}} d
 */
function drawCard(canvas, template, d) {
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "alphabetic";
  ctx.clearRect(0, 0, CARD_W, CARD_H);
  ctx.drawImage(template, 0, 0, CARD_W, CARD_H);

  const L = LAYOUT;
  const maxW = L.maxRight - L.left;

  /* Name — always UPPERCASE, bold */
  const name = (d.name || "").trim().toUpperCase();
  if (name) {
    const o = L.name;
    setFont(ctx, o.weight, o.size, FONTS.sans);
    const s = fitScale(trackedWidth(ctx, name, o.tracking), maxW);
    setFont(ctx, o.weight, o.size * s, FONTS.sans);
    ctx.fillStyle = COLORS.text;
    drawTracked(ctx, name, L.left, o.y, o.tracking * s);
  }

  /* Education — small caps, regular */
  const edu = (d.education || "").trim();
  let shift = 0;
  if (edu) {
    const o = L.education;
    const s = fitScale(smallCaps(ctx, edu, 0, 0, o, 1, false), maxW);
    ctx.fillStyle = COLORS.text;
    smallCaps(ctx, edu, L.left, o.y, o, s, true);
  } else {
    shift = L.noEducationShift;
  }

  /* Designation — one entry per line, small caps, semibold */
  const lines = (d.designation || "")
    .split(/\r?\n/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);
  const o = L.designation;
  let y = o.y - shift;
  lines.forEach((line, i) => {
    y = o.y - shift + i * o.lineGap;
    const s = fitScale(smallCaps(ctx, line, 0, 0, o, 1, false), maxW);
    ctx.fillStyle = COLORS.text;
    smallCaps(ctx, line, L.left, y, o, s, true);
  });
  const lastLineY = lines.length ? y : o.y - shift - o.lineGap;

  /* Company e-mail (info@decor-bd.com) under the designation */
  const cmail = (d.companyEmail || "").trim();
  if (cmail) {
    const c = L.companyMail;
    setFont(ctx, 400, c.size, FONTS.serif);
    const s = fitScale(ctx.measureText(cmail).width, maxW);
    setFont(ctx, 400, c.size * s, FONTS.serif);
    ctx.fillStyle = COLORS.email;
    ctx.fillText(cmail, L.left + 2, lastLineY + c.gapAfterDesignation);
  }

  /* Phone (next to the phone icon) */
  const phone = (d.phone || "").trim();
  if (phone) {
    const p = L.phone;
    setFont(ctx, 400, p.size, FONTS.phone);
    const s = fitScale(trackedWidth(ctx, phone, p.tracking), p.maxRight - p.x);
    setFont(ctx, 400, p.size * s, FONTS.phone);
    ctx.fillStyle = COLORS.text;
    drawTracked(ctx, phone, p.x, p.y, p.tracking * s);
  }

  /* Personal e-mail (next to the envelope icon) */
  const email = (d.email || "").trim();
  if (email) {
    const e = L.email;
    setFont(ctx, 400, e.size, FONTS.serif);
    const s = fitScale(ctx.measureText(email).width, e.maxRight - e.x);
    setFont(ctx, 400, e.size * s, FONTS.serif);
    ctx.fillStyle = COLORS.email;
    ctx.fillText(email, e.x, e.y);
  }
}

/** Make sure the web fonts are ready before drawing on the canvas. */
async function loadCardFonts() {
  await Promise.all([
    document.fonts.load(`400 40px ${FONTS.sans}`),
    document.fonts.load(`600 40px ${FONTS.sans}`),
    document.fonts.load(`400 40px ${FONTS.phone}`),
    document.fonts.load(`400 40px ${FONTS.serif}`),
  ]);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
