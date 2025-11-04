// Canvas Animation
const canvas = document.getElementById("canvas3d");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
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
      ? "rgba(138, 43, 226, 0.3)"
      : "rgba(138, 43, 226, 0.6)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = Array.from({ length: 80 }, () => new Particle());

function animate() {
  const isLightMode = document.body.classList.contains("light-mode");
  ctx.fillStyle = isLightMode
    ? "rgba(250, 248, 255, 0.1)"
    : "rgba(10, 0, 21, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();

// Window Resize Handler
window.addEventListener("resize", () => {
  resizeCanvas();
  particles.forEach((p) => p.reset());
});

// Scroll reveal animation for sections
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

// Apply to all page sections
document.querySelectorAll(".page-section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "all 0.8s ease";
  observer.observe(section);
});

// Coming Soon button interaction
document.querySelectorAll(".poster-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    showNotification(
      "✨ Posters will be released soon! Stay tuned for updates! ✨",
    );
  });
});

// Parallax effect for hero section
window.addEventListener(
  "scroll",
  () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const hero = document.querySelector(".hero-small");

    if (hero) {
      const heroHeight = hero.offsetHeight;
      if (scrollTop < heroHeight) {
        hero.style.transform = `translateY(${scrollTop * 0.5}px)`;
        hero.style.opacity = 1 - scrollTop / heroHeight;
      }
    }
  },
  { passive: true },
);

// Add hover effect to feature cards
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-15px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Add ripple effect to buttons
document.querySelectorAll(".btn").forEach((button) => {
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
                .btn {
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
// if (!sessionStorage.getItem("culturalWelcomeShown")) {
//   setTimeout(() => {
//     showNotification("🎭 Welcome to Integration Fest 2026 Cultural Events! 🎨");
//     sessionStorage.setItem("culturalWelcomeShown", "true");
//   }, 1000);
// }

// Animate mandala on scroll
const mandala = document.querySelector(".mandala");
if (mandala) {
  window.addEventListener(
    "scroll",
    () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const mandalaSection = document.querySelector(".cultural-design");

      if (mandalaSection) {
        const sectionTop = mandalaSection.offsetTop;
        const sectionHeight = mandalaSection.offsetHeight;
        const windowHeight = window.innerHeight;

        if (
          scrollTop + windowHeight > sectionTop &&
          scrollTop < sectionTop + sectionHeight
        ) {
          const scrollProgress =
            (scrollTop + windowHeight - sectionTop) /
            (sectionHeight + windowHeight);
          const rotation = scrollProgress * 360;
          mandala.style.transform = `rotate(${rotation}deg) scale(${1 + scrollProgress * 0.2})`;
        }
      }
    },
    { passive: true },
  );
}
