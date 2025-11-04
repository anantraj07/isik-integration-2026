// Run on load and resize
// window.addEventListener("DOMContentLoaded", setNavMenuTop);
// window.addEventListener("resize", setNavMenuTop);

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const toggleIcon = themeToggle.querySelector(".toggle-icon");

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem("theme") || "light";
if (currentTheme === "light") {
  document.body.classList.add("light-mode");
  toggleIcon.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    toggleIcon.textContent = "☀️";
    showNotification("Light mode activated! ☀️");
  } else {
    toggleIcon.textContent = "🌙";
    showNotification("Dark mode activated! 🌙");
  }
});

// Navigation with improved dropdown handling
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const dropdowns = document.querySelectorAll(".dropdown");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

// Dropdown Toggle for Mobile
dropdowns.forEach((dropdown) => {
  const dropdownToggle = dropdown.querySelector(".dropdown-toggle");

  if (dropdownToggle) {
    dropdownToggle.addEventListener("click", function (e) {
      if (window.innerWidth <= 1000) {
        e.preventDefault();
        e.stopPropagation();

        const isThisActive = dropdown.classList.contains("active");

        // Close all dropdowns
        dropdowns.forEach((d) => d.classList.remove("active"));

        // Toggle this dropdown
        if (!isThisActive) {
          dropdown.classList.add("active");
        }
      }
    });
  }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (href === "#") return;

    if (
      this.classList.contains("dropdown-toggle") &&
      window.innerWidth <= 1000
    ) {
      return;
    }

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (navMenu) navMenu.classList.remove("active");
      if (navToggle) navToggle.classList.remove("active");
      dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    }
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (navMenu && navToggle) {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
      dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    }
  }
});

// Handle dropdown on window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 1000) {
    if (navMenu) navMenu.classList.remove("active");
    if (navToggle) navToggle.classList.remove("active");
    dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
  }
});

// Smooth scroll with navbar offset for same-page anchor links
document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    try {
      // Resolve absolute URL of the link relative to current location
      const linkUrl = new URL(this.href, location.href);

      // Normalize pathnames to ignore trailing slash differences
      const normalize = (p) => (p || "/").replace(/\/$/, "");

      // Only intercept if the link targets the same page (path + search)
      const samePath =
        normalize(linkUrl.pathname) === normalize(location.pathname);
      const sameSearch = linkUrl.search === location.search;
      const hasHash = !!linkUrl.hash;

      if (!hasHash || !samePath || !sameSearch) {
        // Let the browser handle navigation to other pages or links without hash
        return;
      }

      // At this point we are linking to an id on the same page
      const hash = linkUrl.hash; // includes the leading '#'
      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      // Compute offset (navbar height + 20px buffer)
      const navbar = document.querySelector(".navbar");
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const offset = navHeight + 30;

      // Calculate final scroll position and perform smooth scroll
      const elementPosition =
        target.getBoundingClientRect().top + window.scrollY;
      const scrollTo = Math.max(0, elementPosition - offset);

      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });
    } catch (err) {
      // If URL parsing fails, let the browser handle it normally
      return;
    }
  });
});

// Notification Function
function showNotification(message) {
  // Remove existing notification if any
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff5722, #ff9800);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 2000;
        box-shadow: 0 10px 40px rgba(255, 87, 34, 0.5);
        animation: slideDown 0.5s ease;
        max-width: 90%;
        text-align: center;
        font-size: 1rem;
    `;

  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
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
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideUp 0.5s ease";
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}
