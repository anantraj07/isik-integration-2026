const canvas = document.getElementById("canvas3d");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.size = Math.random() * 3 + 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    const isLight = document.body.classList.contains("light-mode");
    ctx.fillStyle = isLight
      ? "rgba(251, 192, 45, 0.6)"
      : "rgba(255, 235, 59, 0.7)";
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

class FloatingImage {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 30 + 20;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = Math.random() * 0.2 + 0.1;
    this.symbols = ["📸", "🎬", "🖼️", "🎨", "✨"];
    this.symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    if (this.x < -50 || this.x > canvas.width + 50) this.vx *= -1;
    if (this.y < -50 || this.y > canvas.height + 50) this.vy *= -1;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.font = `${this.size}px Arial`;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillText(this.symbol, -this.size / 2, this.size / 2);
    ctx.restore();
  }
}

const particles = Array.from({ length: 60 }, () => new Particle());
const floatingImages = Array.from({ length: 15 }, () => new FloatingImage());

function animate() {
  const isLight = document.body.classList.contains("light-mode");
  ctx.fillStyle = isLight
    ? "rgba(255, 253, 231, 0.15)"
    : "rgba(26, 26, 46, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  floatingImages.forEach((img) => {
    img.update();
    img.draw();
  });

  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach((p2) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.strokeStyle = isLight
          ? `rgba(251, 192, 45, ${0.3 * (1 - dist / 150)})`
          : `rgba(255, 235, 59, ${0.4 * (1 - dist / 150)})`;
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

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  particles.forEach((p) => {
    const dx = mouseX - p.x;
    const dy = mouseY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 200) {
      p.vx += dx * 0.0005;
      p.vy += dy * 0.0005;
    }
  });
});

const tabButtons = document.querySelectorAll(".tab-btn");
const galleries = document.querySelectorAll(".gallery-container");

tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const targetTab = this.getAttribute("data-tab");

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    galleries.forEach((gallery) => gallery.classList.remove("active"));

    this.classList.add("active");
    document.getElementById(`${targetTab}-gallery`).classList.add("active");
  });
});

const viewButtons = document.querySelectorAll(".view-btn");
let currentView = "grid";
let carouselIndex = 0;
let slideshowIndex = 0;
let slideshowInterval;

viewButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const viewMode = this.getAttribute("data-view");
    currentView = viewMode;

    viewButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");

    galleries.forEach((gallery) => {
      const gridContainer = gallery.querySelector(".gallery-grid");
      const items = gallery.querySelectorAll(".gallery-item");

      gridContainer.classList.remove(
        "gallery-grid",
        "gallery-masonry",
        "gallery-carousel",
        "gallery-slideshow",
      );

      const oldCarousel = gallery.querySelector(".carousel-track");
      const oldSlideshow = gallery.querySelector(".slideshow-main");
      if (oldCarousel) oldCarousel.remove();
      if (oldSlideshow) oldSlideshow.remove();

      if (viewMode === "grid") {
        gridContainer.classList.add("gallery-grid");
        items.forEach((item) => {
          item.style.display = "";
          gridContainer.appendChild(item);
        });
      } else if (viewMode === "masonry") {
        gridContainer.classList.add("gallery-masonry");
        items.forEach((item) => {
          item.style.display = "";
          gridContainer.appendChild(item);
        });
      } else if (viewMode === "carousel") {
        buildCarousel(gallery, items);
      } else if (viewMode === "slideshow") {
        buildSlideshow(gallery, items);
      }
    });
  });
});

function buildCarousel(gallery, items) {
  const gridContainer = gallery.querySelector(".gallery-grid");
  gridContainer.style.display = "none";

  const carouselDiv = document.createElement("div");
  carouselDiv.className = "gallery-carousel";
  carouselDiv.innerHTML = `
                <button class="carousel-btn carousel-prev">‹</button>
                <div class="carousel-track"></div>
                <button class="carousel-btn carousel-next">›</button>
                <div class="carousel-indicators"></div>
            `;

  const track = carouselDiv.querySelector(".carousel-track");
  const indicators = carouselDiv.querySelector(".carousel-indicators");

  items.forEach((item, index) => {
    const clone = item.cloneNode(true);
    clone.className = "gallery-item carousel-item";
    track.appendChild(clone);

    const indicator = document.createElement("div");
    indicator.className = `indicator ${index === 0 ? "active" : ""}`;
    indicator.addEventListener("click", () => goToSlide(index));
    indicators.appendChild(indicator);
  });

  gallery.appendChild(carouselDiv);

  carouselDiv.querySelector(".carousel-prev").addEventListener("click", () => {
    carouselIndex = (carouselIndex - 1 + items.length) % items.length;
    updateCarousel();
  });

  carouselDiv.querySelector(".carousel-next").addEventListener("click", () => {
    carouselIndex = (carouselIndex + 1) % items.length;
    updateCarousel();
  });

  function updateCarousel() {
    track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    document.querySelectorAll(".indicator").forEach((ind, i) => {
      ind.classList.toggle("active", i === carouselIndex);
    });
  }

  function goToSlide(index) {
    carouselIndex = index;
    updateCarousel();
  }
}

function buildSlideshow(gallery, items) {
  const gridContainer = gallery.querySelector(".gallery-grid");
  gridContainer.style.display = "none";

  const slideshowDiv = document.createElement("div");
  slideshowDiv.className = "gallery-slideshow";
  slideshowDiv.innerHTML = `
                <div class="slideshow-main"></div>
                <div class="slideshow-thumbnails"></div>
            `;

  const main = slideshowDiv.querySelector(".slideshow-main");
  const thumbnails = slideshowDiv.querySelector(".slideshow-thumbnails");

  items.forEach((item, index) => {
    const mainClone = item.cloneNode(true);
    mainClone.className = "gallery-item slideshow-item";
    if (index === 0) mainClone.classList.add("active");
    main.appendChild(mainClone);

    const thumb = document.createElement("div");
    thumb.className = `thumbnail ${index === 0 ? "active" : ""}`;
    thumb.innerHTML = `<img src="${item.querySelector("img").src}" alt="" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;">`;
    thumb.addEventListener("click", () => goToSlideshow(index));
    thumbnails.appendChild(thumb);
  });

  gallery.appendChild(slideshowDiv);

  function goToSlideshow(index) {
    clearInterval(slideshowInterval);
    slideshowIndex = index;
    updateSlideshow();
    startAutoPlay();
  }

  function updateSlideshow() {
    document.querySelectorAll(".slideshow-item").forEach((item, i) => {
      item.classList.toggle("active", i === slideshowIndex);
    });
    document.querySelectorAll(".thumbnail").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === slideshowIndex);
    });
  }

  function startAutoPlay() {
    slideshowInterval = setInterval(() => {
      slideshowIndex = (slideshowIndex + 1) % items.length;
      updateSlideshow();
    }, 3000);
  }

  startAutoPlay();
}

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxDate = document.getElementById("lightboxDate");
const lightboxCounter = document.getElementById("lightboxCounter");
const closeLightbox = document.getElementById("closeLightbox");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const resetZoomBtn = document.getElementById("resetZoom");

let currentIndex = 0;
let currentGalleryItems = [];
let zoomLevel = 1;

document.addEventListener("click", function (e) {
  if (e.target.closest(".gallery-item")) {
    const item = e.target.closest(".gallery-item");
    const activeGallery = document.querySelector(".gallery-container.active");
    currentGalleryItems = Array.from(
      activeGallery.querySelectorAll(".gallery-item"),
    );
    currentIndex = currentGalleryItems.indexOf(item);

    openLightbox(item);
  }
});

function openLightbox(item) {
  const img = item.querySelector("img");
  const caption = item.getAttribute("data-caption");
  const date = item.getAttribute("data-date");

  lightbox.classList.add("active");
  lightboxImg.src = img.src;
  lightboxCaption.textContent = caption;
  lightboxDate.textContent = date;
  updateCounter();
  document.body.style.overflow = "hidden";
}

function updateCounter() {
  lightboxCounter.textContent = `${currentIndex + 1} / ${currentGalleryItems.length}`;
}

closeLightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
  document.body.style.overflow = "auto";
  zoomLevel = 1;
  lightboxImg.style.transform = "scale(1)";
});

prevBtn.addEventListener("click", () => {
  currentIndex =
    (currentIndex - 1 + currentGalleryItems.length) %
    currentGalleryItems.length;
  updateLightboxImage();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentGalleryItems.length;
  updateLightboxImage();
});

function updateLightboxImage() {
  const item = currentGalleryItems[currentIndex];
  const img = item.querySelector("img");

  lightboxImg.src = img.src;
  lightboxCaption.textContent = item.getAttribute("data-caption");
  lightboxDate.textContent = item.getAttribute("data-date");
  updateCounter();
  zoomLevel = 1;
  lightboxImg.style.transform = "scale(1)";
}

zoomInBtn.addEventListener("click", () => {
  zoomLevel = Math.min(zoomLevel + 0.3, 3);
  lightboxImg.style.transform = `scale(${zoomLevel})`;
});

zoomOutBtn.addEventListener("click", () => {
  zoomLevel = Math.max(zoomLevel - 0.3, 0.5);
  lightboxImg.style.transform = `scale(${zoomLevel})`;
});

resetZoomBtn.addEventListener("click", () => {
  zoomLevel = 1;
  lightboxImg.style.transform = "scale(1)";
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") closeLightbox.click();
  else if (e.key === "ArrowLeft") prevBtn.click();
  else if (e.key === "ArrowRight") nextBtn.click();
});

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.padding = "15px 40px";
    navbar.style.boxShadow = "0 5px 30px var(--shadow-color)";
  } else {
    navbar.style.padding = "20px 40px";
  }
});

function createParticleBurst(x, y) {
  const burstCount = 20;
  for (let i = 0; i < burstCount; i++) {
    const angle = (Math.PI * 2 * i) / burstCount;
    const velocity = Math.random() * 5 + 3;
    const particle = {
      x: x,
      y: y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: 1,
      size: Math.random() * 4 + 2,
      color: `hsl(${Math.random() * 60 + 30}, 100%, 60%)`,
    };

    animateBurstParticle(particle);
  }
}

function animateBurstParticle(particle) {
  const animate = () => {
    if (particle.life <= 0) return;

    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.2;
    particle.life -= 0.02;

    ctx.save();
    ctx.globalAlpha = particle.life;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (particle.life > 0) {
      requestAnimationFrame(animate);
    }
  };
  animate();
}

document.addEventListener("click", function (e) {
  if (e.target.closest(".gallery-item")) {
    const rect = e.target.closest(".gallery-item").getBoundingClientRect();
    createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.querySelectorAll(".gallery-item").forEach((item, index) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(30px)";
  item.style.transition = `all 0.6s ease ${index * 0.05}s`;
  observer.observe(item);
});

document.querySelectorAll(".view-btn, .tab-btn").forEach((button) => {
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

    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

setTimeout(() => {
  // const notification = document.createElement("div");
  // notification.style.cssText = `
  //               position: fixed;
  //               top: 100px;
  //               left: 50%;
  //               transform: translateX(-50%);
  //               background: linear-gradient(135deg, #ffeb3b, #ff9800);
  //               color: #1a1a1a;
  //               padding: 20px 40px;
  //               border-radius: 12px;
  //               font-weight: 600;
  //               z-index: 2000;
  //               box-shadow: 0 10px 40px rgba(255, 235, 59, 0.5);
  //               animation: slideDown 0.5s ease;
  //               border: 2px solid rgba(255, 215, 0, 0.5);
  //               max-width: 90%;
  //               text-align: center;
  //           `;
  // notification.textContent =
  //   "📸 Welcome to the Gallery! Click any image to view in fullscreen";

  const slideStyle = document.createElement("style");
  slideStyle.textContent = `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -30px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                @keyframes slideUp {
                    from {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -30px);
                    }
                }
            `;
  document.head.appendChild(slideStyle);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideUp 0.5s ease";
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}, 1000);
