// your code goes here
// Canvas Animation - Hexagonal Bee Pattern & Calculus Symbols
const canvas = document.getElementById("canvas3d");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

// Hexagon Particle System
class Hexagon {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 25 + 10;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = Math.random() * 0.3 + 0.1;
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
      ? `rgba(251, 192, 45, ${this.opacity})`
      : `rgba(255, 235, 59, ${this.opacity})`;
    ctx.lineWidth = 2;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Draw hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
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

// Calculus Symbol Particles
class CalcSymbol {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.symbols = ["∫", "dx", "dy", "∑", "∂", "Δ"];
    this.symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
    this.size = Math.random() * 20 + 15;
    this.opacity = Math.random() * 0.3 + 0.1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.01;
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
      ? `rgba(239, 108, 0, ${this.opacity})`
      : `rgba(255, 152, 0, ${this.opacity})`;
    ctx.font = `${this.size}px Arial`;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
  }
}

// Floating Bee Particles
class BeeParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1.5;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    const isLightMode = document.body.classList.contains("light-mode");
    ctx.fillStyle = isLightMode
      ? "rgba(251, 192, 45, 0.5)"
      : "rgba(255, 215, 0, 0.6)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const hexagons = Array.from({ length: 12 }, () => new Hexagon());
const calcSymbols = Array.from({ length: 20 }, () => new CalcSymbol());
const beeParticles = Array.from({ length: 50 }, () => new BeeParticle());

function animate() {
  const isLightMode = document.body.classList.contains("light-mode");
  ctx.fillStyle = isLightMode
    ? "rgba(255, 253, 231, 0.1)"
    : "rgba(26, 26, 46, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw and update hexagons
  hexagons.forEach((hex) => {
    hex.update();
    hex.draw();
  });

  // Draw and update calculus symbols
  calcSymbols.forEach((symbol) => {
    symbol.update();
    symbol.draw();
  });

  // Draw and update bee particles
  beeParticles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  // Draw connecting lines between nearby bee particles
  beeParticles.forEach((p1, i) => {
    beeParticles.slice(i + 1).forEach((p2) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.strokeStyle = isLightMode
          ? `rgba(251, 192, 45, ${0.2 * (1 - dist / 120)})`
          : `rgba(255, 215, 0, ${0.3 * (1 - dist / 120)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
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
  hexagons.forEach((h) => h.reset());
  calcSymbols.forEach((s) => s.reset());
  beeParticles.forEach((p) => p.reset());
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

// Poster button notification
document.querySelectorAll(".poster-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    showNotification("🐝 Event poster will be released soon! Stay tuned!");
  });
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
document.querySelectorAll(".btn-hero, .poster-btn").forEach((button) => {
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
                .btn-hero, .poster-btn {
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

// Animate event cards on scroll
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
  {
    threshold: 0.2,
  },
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
  {
    threshold: 0.2,
  },
);

document.querySelectorAll(".info-card").forEach((card, index) => {
  card.style.opacity = "0";
  card.style.transform = "scale(0.9) rotate(-5deg)";
  card.style.transition = "all 0.8s ease";
  infoObserver.observe(card);
});

// Animate date cards
const dateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "scale(1)";
        }, index * 100);
      }
    });
  },
  {
    threshold: 0.2,
  },
);

document.querySelectorAll(".date-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "scale(0.8)";
  card.style.transition = "all 0.6s ease";
  dateObserver.observe(card);
});

// // Welcome message on first visit
// const welcomeShown = sessionStorage.getItem("intbeeWelcomeShown");
// if (!welcomeShown) {
//   setTimeout(() => {
//     showNotification(
//       "🐝 Welcome to Integration Bee 2026! Let's Get In-credible! 📐",
//     );
//     sessionStorage.setItem("intbeeWelcomeShown", "true");
//   }, 1000);
// }

// Add honeycomb pattern animation on hover for hexagons
canvas.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  hexagons.forEach((hex) => {
    const dx = mouseX - hex.x;
    const dy = mouseY - hex.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      hex.vx += dx * 0.0001;
      hex.vy += dy * 0.0001;
      hex.rotationSpeed = 0.05;
    } else {
      hex.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }
  });
});

// Easter egg: konami code for fun animation
let konamiCode = [];
const konamiPattern = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(",") === konamiPattern.join(",")) {
    triggerBeeSwarm();
    konamiCode = [];
  }
});

function triggerBeeSwarm() {
  showNotification("🐝🐝🐝 BEE SWARM ACTIVATED! 🐝🐝🐝");

  // Temporarily add more bees
  const extraBees = Array.from({ length: 100 }, () => new BeeParticle());
  beeParticles.push(...extraBees);

  setTimeout(() => {
    // Remove extra bees after 5 seconds
    beeParticles.splice(50, 100);
  }, 5000);
}

// Add floating animation to calculus symbols on scroll
let symbolAnimationFrame = 0;
function animateSymbols() {
  symbolAnimationFrame++;

  calcSymbols.forEach((symbol, i) => {
    symbol.y += Math.sin(symbolAnimationFrame * 0.01 + i) * 0.3;
  });

  requestAnimationFrame(animateSymbols);
}

animateSymbols();

// Create particle burst effect on button click
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
      p.vy += 0.1; // gravity
      p.life -= 0.02;

      if (p.life > 0) {
        ctx.fillStyle = `rgba(255, 235, 59, ${p.life})`;
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

// Add particle burst on registration button hover
const registerSection = document.querySelector("#register");
if (registerSection) {
  registerSection.addEventListener("mouseenter", () => {
    const rect = registerSection.getBoundingClientRect();
    createParticleBurst(rect.left + rect.width / 2, rect.top + 100);
  });
}
