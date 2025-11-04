// Loading Screen
// setTimeout(() => {
//   document.getElementById("resultText").classList.add("show");
//   setTimeout(() => startCelebration(), 800);
// }, 2500);
//
// setTimeout(() => {
//   document.getElementById("loadingScreen").classList.add("hidden");
//   setTimeout(() => {
//     document.getElementById("celebrationContainer").style.display = "none";
//   }, 1000);
// }, 4500);

// Celebration Effects
function startCelebration() {
  const container = document.getElementById("celebrationContainer");

  for (let i = 0; i < 5; i++) {
    setTimeout(() => createEnergyWave(container), i * 200);
  }

  setTimeout(() => createParticleBurst(container), 300);

  for (let i = 0; i < 20; i++) {
    setTimeout(() => createLightRay(container), i * 80);
  }

  for (let i = 0; i < 15; i++) {
    setTimeout(() => createGlowOrb(container), i * 150);
  }
}

function createEnergyWave(container) {
  const wave = document.createElement("div");
  wave.className = "energy-wave";
  const colors = [
    "rgba(102, 126, 234, 0.6)",
    "rgba(118, 75, 162, 0.6)",
    "rgba(240, 147, 251, 0.6)",
  ];
  wave.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
  container.appendChild(wave);
  setTimeout(() => wave.remove(), 1500);
}

function createParticleBurst(container) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe"];

  for (let i = 0; i < 60; i++) {
    const particle = document.createElement("div");
    particle.className = "particle-burst";
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = centerX + "px";
    particle.style.top = centerY + "px";

    const angle = (Math.PI * 2 * i) / 60;
    const velocity = Math.random() * 200 + 150;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    particle.style.setProperty("--tx", tx + "px");
    particle.style.setProperty("--ty", ty + "px");
    particle.style.animation = "particleExpand 1.5s ease-out forwards";

    container.appendChild(particle);
    setTimeout(() => particle.remove(), 1500);
  }
}

function createLightRay(container) {
  const ray = document.createElement("div");
  ray.className = "light-ray";
  ray.style.left = Math.random() * 100 + "%";
  ray.style.top = "50%";
  ray.style.transform = "rotate(" + Math.random() * 360 + "deg)";
  const colors = [
    "linear-gradient(to bottom, rgba(102, 126, 234, 0.8), transparent)",
    "linear-gradient(to bottom, rgba(240, 147, 251, 0.8), transparent)",
    "linear-gradient(to bottom, rgba(79, 172, 254, 0.8), transparent)",
  ];
  ray.style.background = colors[Math.floor(Math.random() * colors.length)];
  container.appendChild(ray);
  setTimeout(() => ray.remove(), 2000);
}

function createGlowOrb(container) {
  const orb = document.createElement("div");
  orb.className = "glow-orb";
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight / 2;
  orb.style.left = startX + "px";
  orb.style.top = startY + "px";

  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 300 + 200;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;

  orb.style.setProperty("--tx", tx + "px");
  orb.style.setProperty("--ty", ty + "px");

  container.appendChild(orb);
  setTimeout(() => orb.remove(), 3000);
}

// Lorenz Attractor (Chaos Theory)
const chaosCanvas = document.getElementById("chaosCanvas");
const chaosCtx = chaosCanvas.getContext("2d");
chaosCanvas.width = window.innerWidth;
chaosCanvas.height = window.innerHeight;

class LorenzAttractor {
  constructor() {
    this.x = 0.1;
    this.y = 0;
    this.z = 0;
    this.a = 10;
    this.b = 28;
    this.c = 8.0 / 3.0;
    this.dt = 0.005;
    this.points = [];
    this.maxPoints = 2000;
    this.hue = Math.random() * 60 + 220;
  }

  update() {
    const dx = this.a * (this.y - this.x) * this.dt;
    const dy = (this.x * (this.b - this.z) - this.y) * this.dt;
    const dz = (this.x * this.y - this.c * this.z) * this.dt;

    this.x += dx;
    this.y += dy;
    this.z += dz;

    this.points.push({ x: this.x, y: this.y, z: this.z });
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  draw() {
    const scale = 8;
    const centerX = chaosCanvas.width / 2;
    const centerY = chaosCanvas.height / 2;

    chaosCtx.beginPath();
    this.points.forEach((point, i) => {
      const screenX = centerX + point.x * scale;
      const screenY = centerY + point.y * scale;

      if (i === 0) {
        chaosCtx.moveTo(screenX, screenY);
      } else {
        chaosCtx.lineTo(screenX, screenY);
      }
    });

    const alpha = 0.5;
    chaosCtx.strokeStyle = "hsla(" + this.hue + ", 70%, 60%, " + alpha + ")";
    chaosCtx.lineWidth = 1;
    chaosCtx.stroke();
  }
}

const attractor1 = new LorenzAttractor();
const attractor2 = new LorenzAttractor();
attractor2.x = -0.1;
attractor2.hue = 260;
const attractors = [attractor1, attractor2];

function animateChaos() {
  chaosCtx.fillStyle = "rgba(0, 0, 0, 0.001)";
  chaosCtx.fillRect(0, 0, chaosCanvas.width, chaosCanvas.height);

  attractors.forEach((attractor) => {
    attractor.update();
    attractor.draw();
  });

  requestAnimationFrame(animateChaos);
}

animateChaos();

// Adaptive Particle Background
const canvas = document.getElementById("canvas3d");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = (Math.random() - 0.5) * 0.7;
    this.size = Math.random() * 2 + 1;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw(color) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

const particles = Array.from({ length: 70 }, () => new Particle());

function isLightMode() {
  return document.body.classList.contains("light-mode");
}

function animate() {
  const light = isLightMode();

  // Fade trail effect — use light or dark background tint
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = light
    ? "rgba(255, 255, 255, 0.2)" // subtle white fade
    : "rgba(0, 0, 0, 0.2)"; // subtle black fade
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Particle drawing
  ctx.globalCompositeOperation = light ? "source-over" : "lighter";
  const particleColor = light
    ? "rgba(60, 80, 200, 0.5)" // crisp bluish tone for light mode
    : "rgba(130, 160, 255, 0.4)"; // glowing tone for dark mode

  particles.forEach((p) => {
    p.move();
    p.draw(particleColor);
  });

  requestAnimationFrame(animate);
}

animate();

// Adaptive Animated Footer Graph
const graphCanvas = document.getElementById("graphCanvas");
const g = graphCanvas.getContext("2d");

function resizeGraphCanvas() {
  graphCanvas.width = graphCanvas.offsetWidth;
  graphCanvas.height = graphCanvas.offsetHeight;
}
resizeGraphCanvas();
window.addEventListener("resize", resizeGraphCanvas);

let t = 0;
const points = [];
const maxPoints = 200;

function isLightMode() {
  return document.body.classList.contains("light-mode");
}

function animateGraph() {
  const light = isLightMode();

  // Smooth background fade
  g.globalCompositeOperation = "source-over";
  g.fillStyle = light ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)";
  g.fillRect(0, 0, graphCanvas.width, graphCanvas.height);

  // Generate new waveform point
  const newY =
    graphCanvas.height / 2 +
    Math.sin(t * 0.05) * 60 +
    Math.cos(t * 0.03) * 40 +
    Math.sin(t * 0.02) * 30;

  points.push(newY);
  if (points.length > maxPoints) points.shift();

  // Grid lines
  g.lineWidth = 1;
  g.strokeStyle = light ? "rgba(0, 0, 0, 0.07)" : "rgba(102, 126, 234, 0.1)";
  for (let i = 0; i < 5; i++) {
    const y = (graphCanvas.height / 4) * i;
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(graphCanvas.width, y);
    g.stroke();
  }

  // Graph line
  const pointSpacing = graphCanvas.width / maxPoints;
  g.beginPath();
  points.forEach((y, i) => {
    const x = i * pointSpacing;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  });

  g.lineWidth = 2;
  g.strokeStyle = light ? "rgba(60, 80, 200, 0.8)" : "rgba(130, 160, 255, 0.8)";
  g.shadowBlur = light ? 0 : 10;
  g.shadowColor = light ? "transparent" : "rgba(102, 126, 234, 0.7)";
  g.stroke();
  g.shadowBlur = 0;

  // Gradient fill
  const grad = g.createLinearGradient(0, 0, 0, graphCanvas.height);
  if (light) {
    grad.addColorStop(0, "rgba(60, 80, 200, 0.15)");
    grad.addColorStop(1, "rgba(60, 80, 200, 0)");
  } else {
    grad.addColorStop(0, "rgba(102, 126, 234, 0.25)");
    grad.addColorStop(1, "rgba(102, 126, 234, 0)");
  }

  g.lineTo(graphCanvas.width, graphCanvas.height);
  g.lineTo(0, graphCanvas.height);
  g.closePath();
  g.fillStyle = grad;
  g.fill();

  // Floating dots
  const dotColor = light
    ? "rgba(60, 80, 200, 0.7)"
    : "rgba(240, 147, 251, 0.8)";
  const haloColor = light
    ? "rgba(60, 80, 200, 0.2)"
    : "rgba(240, 147, 251, 0.4)";

  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(points.length * (i / 3));
    if (idx < points.length) {
      const x = idx * pointSpacing;
      const y = points[idx];

      g.beginPath();
      g.arc(x, y, 3, 0, Math.PI * 2);
      g.fillStyle = dotColor;
      g.fill();

      g.beginPath();
      g.arc(x, y, 7, 0, Math.PI * 2);
      g.strokeStyle = haloColor;
      g.lineWidth = 2;
      g.stroke();
    }
  }

  t++;
  requestAnimationFrame(animateGraph);
}

animateGraph();

// Resize handler
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  chaosCanvas.width = window.innerWidth;
  chaosCanvas.height = window.innerHeight;
  graphCanvas.width = graphCanvas.offsetWidth;
  graphCanvas.height = graphCanvas.offsetHeight;
});

// Tab switching functionality for footer buttons
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-tab");

    // Remove active states
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    // Add active to selected
    button.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});
