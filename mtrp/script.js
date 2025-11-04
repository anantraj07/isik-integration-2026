// Canvas Animation - Mathematical Formulas & Geometric Shapes
const canvas = document.getElementById("canvas3d");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

// Mathematical Formula Particles
class FormulaParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.formulas = [
      "π",
      "e",
      "φ",
      "∞",
      "√",
      "±",
      "≈",
      "≠",
      "≤",
      "≥",
      "∈",
      "∀",
      "∃",
      "⊂",
      "⊆",
      "∪",
      "∩",
    ];
    this.formula =
      this.formulas[Math.floor(Math.random() * this.formulas.length)];
    this.size = Math.random() * 18 + 12;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.015;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    const isLightMode = document.body.classList.contains("light-mode");
    ctx.fillStyle = isLightMode
      ? `rgba(94, 53, 177, ${this.opacity})`
      : `rgba(124, 77, 255, ${this.opacity})`;
    ctx.font = `${this.size}px Arial`;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillText(this.formula, 0, 0);
    ctx.restore();
  }
}

// Geometric Shape Particles
class GeometricShape {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 30 + 15;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = Math.random() * 0.3 + 0.1;
    this.sides = Math.floor(Math.random() * 3) + 3; // 3-5 sides
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    if (this.x < -50 || this.x > canvas.width + 50) this.vx *= -1;
    if (this.y < -50 || this.y > canvas.height + 50) this.vy *= -1;
  }

  draw() {
    const isLightMode = document.body.classList.contains("light-mode");
    ctx.strokeStyle = isLightMode
      ? `rgba(94, 53, 177, ${this.opacity})`
      : `rgba(124, 77, 255, ${this.opacity})`;
    ctx.lineWidth = 2;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Draw polygon
    ctx.beginPath();
    for (let i = 0; i < this.sides; i++) {
      const angle = ((Math.PI * 2) / this.sides) * i;
      const hx = this.size * Math.cos(angle);
      const hy = this.size * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}

// Glowing Dots
class GlowDot {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 1;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    const isLightMode = document.body.classList.contains("light-mode");
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 3,
    );
    gradient.addColorStop(
      0,
      isLightMode ? "rgba(94, 53, 177, 0.6)" : "rgba(124, 77, 255, 0.8)",
    );
    gradient.addColorStop(1, "rgba(124, 77, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

const formulas = Array.from({ length: 25 }, () => new FormulaParticle());
const shapes = Array.from({ length: 10 }, () => new GeometricShape());
const dots = Array.from({ length: 60 }, () => new GlowDot());

function animate() {
  const isLightMode = document.body.classList.contains("light-mode");
  ctx.fillStyle = isLightMode
    ? "rgba(245, 247, 250, 0.1)"
    : "rgba(10, 14, 39, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw and update shapes
  shapes.forEach((shape) => {
    shape.update();
    shape.draw();
  });

  // Draw and update formulas
  formulas.forEach((formula) => {
    formula.update();
    formula.draw();
  });

  // Draw and update dots
  dots.forEach((dot) => {
    dot.update();
    dot.draw();
  });

  // Draw connecting lines
  dots.forEach((d1, i) => {
    dots.slice(i + 1).forEach((d2) => {
      const dx = d1.x - d2.x;
      const dy = d1.y - d2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        ctx.strokeStyle = isLightMode
          ? `rgba(94, 53, 177, ${0.15 * (1 - dist / 100)})`
          : `rgba(124, 77, 255, ${0.2 * (1 - dist / 100)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d1.x, d1.y);
        ctx.lineTo(d2.x, d2.y);
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animate);
}

animate();

// Window Resize Handler
window.addEventListener("resize", () => {
  resizeCanvas();
  formulas.forEach((f) => f.reset());
  shapes.forEach((s) => s.reset());
  dots.forEach((d) => d.reset());
});

// Scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.querySelectorAll(".page-section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "all 0.8s ease";
  observer.observe(section);
});

// Timeline animation
document.querySelectorAll(".timeline-item").forEach((item, index) => {
  item.style.setProperty("--item-index", index + 1);
});

// Animate syllabus cards
const syllabusObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0) scale(1)";
        }, index * 100);
      }
    });
  },
  { threshold: 0.2 },
);

document.querySelectorAll(".syllabus-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px) scale(0.95)";
  card.style.transition = "all 0.6s ease";
  syllabusObserver.observe(card);
});

// Animate event cards
const eventObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }, index * 200);
      }
    });
  },
  { threshold: 0.2 },
);

document.querySelectorAll(".event-card").forEach((card, index) => {
  card.style.opacity = "0";
  card.style.transform =
    index % 2 === 0 ? "translateX(-50px)" : "translateX(50px)";
  card.style.transition = "all 0.8s ease";
  eventObserver.observe(card);
});

// Animate info cards
const infoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "scale(1) rotate(0deg)";
        }, index * 150);
      }
    });
  },
  { threshold: 0.2 },
);

document.querySelectorAll(".info-card").forEach((card, index) => {
  card.style.opacity = "0";
  card.style.transform = "scale(0.9) rotate(-3deg)";
  card.style.transition = "all 0.8s ease";
  infoObserver.observe(card);
});

// Parallax effect for hero section
window.addEventListener(
  "scroll",
  () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const hero = document.querySelector(".hero");

    if (hero) {
      const heroHeight = hero.offsetHeight;
      if (scrollTop < heroHeight) {
        hero.style.transform = `translateY(${scrollTop * 0.4}px)`;
        hero.style.opacity = 1 - (scrollTop / heroHeight) * 0.5;
      }
    }
  },
  { passive: true },
);

// Add ripple effect to buttons
document.querySelectorAll(".btn-hero").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

    if (!document.getElementById("ripple-styles")) {
      const style = document.createElement("style");
      style.id = "ripple-styles";
      style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                .btn-hero {
                    position: relative;
                    overflow: hidden;
                }
            `;
      document.head.appendChild(style);
    }

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// // Welcome message on first visit
// const welcomeShown = sessionStorage.getItem("mtrpWelcomeShown");
// if (!welcomeShown) {
//   setTimeout(() => {
//     showNotification(
//       "📐 Welcome to MTRP 2026! Challenge Your Mathematical Prowess!",
//     );
//     sessionStorage.setItem("mtrpWelcomeShown", "true");
//   }, 1000);
// }

// Mouse interaction with shapes
canvas.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  shapes.forEach((shape) => {
    const dx = mouseX - shape.x;
    const dy = mouseY - shape.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      shape.vx += dx * 0.0002;
      shape.vy += dy * 0.0002;
      shape.rotationSpeed = 0.06;
    } else {
      shape.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }
  });
});

// Create particle burst effect
function createParticleBurst(x, y) {
  const burstParticles = [];
  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 * i) / 20;
    const speed = Math.random() * 3 + 2;
    burstParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: Math.random() * 5 + 2,
    });
  }

  const animateBurst = () => {
    ctx.save();
    burstParticles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= 0.02;

      if (p.life > 0) {
        ctx.fillStyle = `rgba(124, 77, 255, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        burstParticles.splice(index, 1);
      }
    });
    ctx.restore();

    if (burstParticles.length > 0) {
      requestAnimationFrame(animateBurst);
    }
  };

  animateBurst();
}

// Add particle burst on registration section hover
const registerSection = document.querySelector("#register");
if (registerSection) {
  registerSection.addEventListener("mouseenter", () => {
    const rect = registerSection.getBoundingClientRect();
    createParticleBurst(rect.left + rect.width / 2, rect.top + 100);
  });
}
