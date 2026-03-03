const canvas = document.getElementById('nebula-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const logo = document.getElementById('fsaLogo');
const tagline = document.getElementById('tagline');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const stars = Array.from({ length: 70 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.7 + 0.4,
  o: Math.random() * 0.6 + 0.2,
  v: Math.random() * 0.0007 + 0.0002,
  twinklePhase: Math.random() * Math.PI * 2,
  twinkleSpeed: Math.random() * 0.03 + 0.012,
}));

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawStars() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    star.y += star.v;
    if (star.y > 1.02) star.y = -0.02;
    star.twinklePhase += star.twinkleSpeed;

    const twinkleWave = (Math.sin(star.twinklePhase) + 1) / 2;
    const alpha = Math.min(1, star.o * (0.45 + twinkleWave * 1.7));
    const radius = star.r * (0.8 + twinkleWave * 0.95);

    ctx.beginPath();
    ctx.arc(star.x * canvas.width, star.y * canvas.height, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(183, 222, 255, ${alpha.toFixed(3)})`;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

function animateLogoLoop() {
  if (!logo || prefersReducedMotion) return;

  let lastTimestamp = 0;
  let rotation = 0;

  const tick = (timestamp) => {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }

    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    rotation = (rotation + delta * 0.025) % 360;

    const bob = Math.sin(timestamp * 0.0022) * 9;
    const pulse = 1 + Math.sin(timestamp * 0.0015) * 0.05;
    const glow = 0.22 + (Math.sin(timestamp * 0.0018) + 1) * 0.16;

    logo.style.transform = `translate3d(0, ${bob}px, 0) rotate(${rotation}deg) scale(${pulse})`;
    logo.style.filter = `drop-shadow(0 16px 34px rgba(115, 194, 255, ${glow.toFixed(3)}))`;

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function startTaglineLoop() {
  if (!tagline) return;

  const text = 'Powering the Right Creators.';
  const typeDelay = 65;
  const eraseDelay = 36;
  const holdFullMs = 1700;
  const holdEmptyMs = 260;

  if (prefersReducedMotion) {
    tagline.textContent = text;
    return;
  }

  let index = 0;
  let deleting = false;

  const step = () => {
    if (!deleting) {
      index += 1;
      tagline.textContent = text.slice(0, index);

      if (index >= text.length) {
        deleting = true;
        window.setTimeout(step, holdFullMs);
        return;
      }

      window.setTimeout(step, typeDelay);
      return;
    }

    index -= 1;
    tagline.textContent = text.slice(0, Math.max(index, 0));

    if (index <= 0) {
      deleting = false;
      window.setTimeout(step, holdEmptyMs);
      return;
    }

    window.setTimeout(step, eraseDelay);
  };

  step();
}

if (canvas && ctx) {
  resizeCanvas();
  drawStars();
  window.addEventListener('resize', resizeCanvas);
}

animateLogoLoop();
startTaglineLoop();
