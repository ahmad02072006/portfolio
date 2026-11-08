const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const navIndicator = document.querySelector(".nav-indicator");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter((section) => section);
let scrollFrame = 0;

document.body.classList.add("js-ready");
document.querySelector("#current-year").textContent = new Date().getFullYear();

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  primaryNav.classList.remove("is-open");
}

function updateActiveLink() {
  scrollFrame = 0;
  const marker = window.innerHeight * 0.38;
  let activeSection = sections[0];

  for (const section of sections) {
    if (section.getBoundingClientRect().top <= marker) {
      activeSection = section;
    } else {
      break;
    }
  }

  const activeLink = navLinks.find((link) => link.hash === `#${activeSection.id}`);
  navLinks.forEach((link) => {
    if (link === activeLink) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (activeLink && window.matchMedia("(min-width: 760px)").matches) {
    navIndicator.style.width = `${activeLink.offsetWidth}px`;
    navIndicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
    navIndicator.classList.add("is-visible");
  } else {
    navIndicator.classList.remove("is-visible");
  }
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.addEventListener("scroll", () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateActiveLink);
}, { passive: true });
window.addEventListener("resize", updateActiveLink);
updateActiveLink();

const revealItems = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
