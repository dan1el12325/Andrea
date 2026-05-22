const spaceCanvas = document.getElementById('space');
const spaceCtx = spaceCanvas.getContext('2d');
const canvas = document.getElementById('main');
const ctx = canvas.getContext('2d');

const photoModal = document.getElementById('photoModal');
const modalPhoto = document.getElementById('modalPhoto');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');

let W, H, cx, cy;
let heartBeat = 0;
let orbitAngle = 0;
let stars = [];
let galaxyParticles = [];
let heartParticles = [];
let orbitTargets = [];

// Pon tus imagenes en una carpeta llamada "fotos" junto a estos archivos.
// Luego cambia o duplica estas lineas: { name: 'Mi foto', url: 'fotos/mi-foto.jpg' }
const PHOTOS = [
  { name: 'Una de las tantas veces que te acompañaba al mexi por primera vez', url: 'fotos/01.jpeg' },
  { name: 'Foto 02', url: 'fotos/02.jpeg' },
  { name: 'Foto 03', url: 'fotos/03.jpeg' },
  { name: 'Foto 04', url: 'fotos/04.jpeg' },
  { name: 'Foto 05', url: 'fotos/05.jpeg' },
  { name: 'Foto 06', url: 'fotos/06.jpeg' },
  { name: 'Foto 07', url: 'fotos/07.jpeg' },
  { name: 'Foto 08', url: 'fotos/08.jpeg' },
  { name: 'Foto 09', url: 'fotos/09.jpeg' },
  { name: 'Foto 10', url: 'fotos/10.jpeg' },
  { name: 'Foto 11', url: 'fotos/11.jpeg' },
  { name: 'Foto 12', url: 'fotos/12.jpeg' },
  { name: 'Foto 13', url: 'fotos/13.jpeg' },
  { name: 'Foto 14', url: 'fotos/14.jpeg' },
  { name: 'Foto 15', url: 'fotos/15.jpeg' },
  { name: 'Foto 16', url: 'fotos/16.jpeg' },
  { name: 'Foto 17', url: 'fotos/17.jpeg' },
  { name: 'Foto 18', url: 'fotos/18.jpeg' },
  { name: 'Foto 18', url: 'fotos/19.jpeg' },
  { name: 'Foto 18', url: 'fotos/20.jpeg' },
  { name: 'Foto 18', url: 'fotos/21.jpeg' },
];

let imagesLoaded = false;
let loadedCount = 0;

function createPlaceholder(label) {
  const placeholder = document.createElement('canvas');
  placeholder.width = 180;
  placeholder.height = 180;

  const pctx = placeholder.getContext('2d');
  const grad = pctx.createLinearGradient(0, 0, 180, 180);
  grad.addColorStop(0, '#ff6aa9');
  grad.addColorStop(0.48, '#7c3cff');
  grad.addColorStop(1, '#14142b');

  pctx.fillStyle = grad;
  pctx.fillRect(0, 0, 180, 180);
  pctx.fillStyle = 'rgba(255,255,255,0.16)';
  pctx.beginPath();
  pctx.arc(138, 34, 42, 0, Math.PI * 2);
  pctx.fill();

  pctx.fillStyle = '#fff';
  pctx.font = '700 44px Arial';
  pctx.textAlign = 'center';
  pctx.textBaseline = 'middle';
  pctx.fillText(label.slice(-2), 90, 86);

  pctx.font = '600 16px Arial';
  pctx.fillText('Agrega foto', 90, 130);

  return placeholder;
}

function loadImages() {
  if (PHOTOS.length === 0) {
    imagesLoaded = true;
    return;
  }

  PHOTOS.forEach((item) => {
    const img = new Image();
    img.onload = () => {
      item.img = img;
      item.displayUrl = item.url;
      markImageLoaded();
    };
    img.onerror = () => {
      const placeholder = createPlaceholder(item.name);
      item.img = placeholder;
      item.displayUrl = placeholder.toDataURL('image/png');
      markImageLoaded();
    };
    img.src = item.url;
  });
}

function markImageLoaded() {
  loadedCount++;
  imagesLoaded = loadedCount >= PHOTOS.length;
}

function resize() {
  W = canvas.width = spaceCanvas.width = window.innerWidth;
  H = canvas.height = spaceCanvas.height = window.innerHeight;
  cx = W / 2;

  const scale = Math.min(W, H) * 0.025;
  const rx = Math.min(W, H) * 0.38;
  const ry = rx * 0.28;
  const tipOffset = 17 * scale;
  const heartTop = 11.92 * scale;
  cy = H / 2 - (ry - tipOffset - heartTop) / 2;

  buildStars();
  buildGalaxy();
  buildHeart();
  drawStars();
}

function buildStars() {
  stars = [];
  const count = Math.floor((W * H) / 900);
  const colors = ['#ffffff', '#fffbe6', '#fff3c4', '#ffdddd', '#ffd6e0', '#d6eaff', '#ffb347'];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.01 + Math.random() * 0.03
    });
  }
}

function drawStars() {
  spaceCtx.clearRect(0, 0, W, H);
  spaceCtx.fillStyle = '#000000';
  spaceCtx.fillRect(0, 0, W, H);

  stars.forEach((s) => {
    const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
    spaceCtx.beginPath();
    spaceCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    spaceCtx.fillStyle = s.color;
    spaceCtx.globalAlpha = alpha;
    spaceCtx.fill();
    s.twinkle += s.twinkleSpeed;
  });

  spaceCtx.globalAlpha = 1;
}

function buildGalaxy() {
  galaxyParticles = [];
  const count = 1800;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const d = Math.sqrt(Math.random());
    const speed = (0.0008 + (1 - d) * 0.0012) * (0.6 + Math.random() * 0.8);
    const size = 0.5 + (1 - d) * 2.8;
    const alpha = 0.3 + (1 - d) * 0.7;
    const hue = 320 + d * 30;
    const sat = 60 + d * 30;
    const lig = 40 + (1 - d) * 50;

    galaxyParticles.push({ angle, d, speed, size, alpha, hue, sat, lig });
  }
}

function drawGalaxy() {
  const rx = Math.min(W, H) * 0.38;
  const ry = rx * 0.28;

  galaxyParticles.forEach((p) => {
    p.angle += p.speed;
    const x = cx + Math.cos(p.angle) * rx * p.d;
    const y = cy + Math.sin(p.angle) * ry * p.d;

    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.lig}%, ${p.alpha})`;
    ctx.fill();
  });
}

const HEART_SAMPLES = 500;
const heartCurve = [];

function buildHeartCurve() {
  heartCurve.length = 0;

  for (let i = 0; i <= HEART_SAMPLES; i++) {
    const t = (2 * Math.PI * i) / HEART_SAMPLES;
    heartCurve.push({
      x: 16 * Math.pow(Math.sin(t), 3),
      y: 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    });
  }
}

function isInsideHeart(px, py) {
  let crossings = 0;

  for (let i = 0; i < HEART_SAMPLES; i++) {
    const x1 = heartCurve[i].x;
    const y1 = heartCurve[i].y;
    const x2 = heartCurve[i + 1].x;
    const y2 = heartCurve[i + 1].y;

    if ((y1 <= py && py < y2) || (y2 <= py && py < y1)) {
      const xCross = x1 + ((py - y1) * (x2 - x1)) / (y2 - y1);
      if (xCross > px) crossings++;
    }
  }

  return crossings % 2 === 1;
}

function buildHeart() {
  buildHeartCurve();
  heartParticles = [];

  const scale = Math.min(W, H) * 0.025;
  const step = 1.0;

  for (let rx = -16; rx <= 16; rx += step) {
    for (let ry = -17; ry <= 12; ry += step) {
      if (!isInsideHeart(rx, ry)) continue;

      const jx = rx + (Math.random() - 0.5) * step * 0.85;
      const jy = ry + (Math.random() - 0.5) * step * 0.85;
      const bx = jx * scale;
      const by = -jy * scale;
      const dist = Math.sqrt((jx / 16) * (jx / 16) + (jy / 12) * (jy / 12));
      const ratio = Math.min(dist, 1);
      const size = 0.3 + ratio * 3.0;
      const alpha = 0.35 + ratio * 0.65;
      const hue = 335 + (1 - ratio) * 15;
      const lig = 62 + ratio * 18;

      heartParticles.push({
        bx,
        by,
        size,
        alpha,
        hue,
        lig,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
}

function drawHeart(beat) {
  const scale = Math.min(W, H) * 0.025;
  const tipOffset = 17 * scale;
  const heartCY = cy - tipOffset;
  const pulse = 1 + Math.sin(beat) * 0.07 + Math.sin(beat * 2.1) * 0.03;

  heartParticles.forEach((p) => {
    const x = cx + p.bx * pulse;
    const y = heartCY + p.by * pulse;
    const pAlpha = p.alpha * (0.65 + 0.35 * Math.sin(beat + p.phase));

    ctx.beginPath();
    ctx.arc(x, y, p.size * (0.88 + 0.12 * pulse), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 82%, ${p.lig}%, ${pAlpha})`;
    ctx.fill();
  });
}

function roundedRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawImageCover(img, x, y, width, height) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(width / iw, height / ih);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;

  ctx.drawImage(img, sx, sy, sw, sh, x, y, width, height);
}

function drawPhotos(angleOffset) {
  orbitTargets = [];
  if (!imagesLoaded) return;

  const rx = Math.min(W, H) * 0.39;
  const ry = rx * 0.3;
  const count = PHOTOS.length;
  const baseSize = Math.max(38, Math.min(74, W * 0.06, H * 0.095));

  for (let i = 0; i < count; i++) {
    const baseAngle = (i / count) * Math.PI * 2;
    const a = baseAngle + angleOffset;
    const wx = cx + Math.cos(a) * rx;
    const wy = cy + Math.sin(a) * ry;
    const minY = cy - ry;
    const maxY = cy + ry;
    const yPercent = (wy - minY) / (maxY - minY);
    const depth = 0.68 + yPercent * 0.42;
    const width = baseSize * depth;
    const height = width;

    let opacity = Math.pow(yPercent, 1.35);
    opacity *= 1 - Math.abs(Math.cos(a)) * 0.28;
    opacity = Math.max(0.16, Math.min(1, opacity));

    orbitTargets.push({
      photo: PHOTOS[i],
      x: wx,
      y: wy,
      width,
      height,
      opacity,
      depth: yPercent
    });
  }

  orbitTargets
    .slice()
    .sort((a, b) => a.depth - b.depth)
    .forEach((target) => drawPhotoThumb(target));
}

function drawPhotoThumb(target) {
  const { photo, x, y, width, height, opacity, depth } = target;
  const left = x - width / 2;
  const top = y - height / 2;
  const radius = Math.max(7, width * 0.13);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.shadowBlur = 8 + depth * 16;
  ctx.shadowColor = `rgba(255, 96, 156, ${0.2 + depth * 0.45})`;

  roundedRect(left - 3, top - 3, width + 6, height + 6, radius + 2);
  ctx.fillStyle = 'rgba(255, 228, 238, 0.92)';
  ctx.fill();

  roundedRect(left, top, width, height, radius);
  ctx.clip();
  drawImageCover(photo.img, left, top, width, height);
  ctx.restore();
}

function drawGalaxyGlow() {
  const rx = Math.min(W, H) * 0.38;
  const ry = rx * 0.28;

  ctx.save();
  ctx.translate(cx, cy);

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 0.3);
  grad.addColorStop(0, 'rgba(255, 200, 230, 0.18)');
  grad.addColorStop(0.4, 'rgba(200, 100, 180, 0.08)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.scale(1, ry / rx);
  ctx.beginPath();
  ctx.arc(0, 0, rx * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

function getPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * W,
    y: ((event.clientY - rect.top) / rect.height) * H
  };
}

function findClickedPhoto(point) {
  return orbitTargets
    .slice()
    .sort((a, b) => b.depth - a.depth)
    .find((target) => {
      const dx = Math.abs(point.x - target.x);
      const dy = Math.abs(point.y - target.y);
      return dx <= target.width / 2 + 8 && dy <= target.height / 2 + 8;
    });
}

function openPhoto(photo) {
  modalPhoto.src = photo.displayUrl || photo.url;
  modalPhoto.alt = photo.name;
  modalCaption.textContent = photo.name;
  photoModal.classList.add('is-open');
  photoModal.setAttribute('aria-hidden', 'false');
}

function closePhoto() {
  photoModal.classList.remove('is-open');
  photoModal.setAttribute('aria-hidden', 'true');
}

function animate(ts) {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, W, H);

  if (ts - lastStar > 60) {
    drawStars();
    lastStar = ts;
  }

  heartBeat += 0.07;
  orbitAngle += 0.003;

  drawGalaxyGlow();
  drawGalaxy();
  drawHeart(heartBeat);
  drawPhotos(orbitAngle);
}

let lastStar = 0;

canvas.addEventListener('click', (event) => {
  const clicked = findClickedPhoto(getPointerPosition(event));
  if (clicked) openPhoto(clicked.photo);
});

canvas.addEventListener('mousemove', (event) => {
  const hovered = findClickedPhoto(getPointerPosition(event));
  canvas.style.cursor = hovered ? 'pointer' : 'default';
});

photoModal.addEventListener('click', (event) => {
  if (event.target === photoModal) closePhoto();
});

modalClose.addEventListener('click', closePhoto);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePhoto();
});

loadImages();
window.addEventListener('resize', resize);
resize();
requestAnimationFrame(animate);
