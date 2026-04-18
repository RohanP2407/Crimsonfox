// script.js

// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");
const topbar = document.querySelector(".topbar");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("active");
    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    }

    // Prevent scrolling when menu is open
    document.body.style.overflow = navigation.classList.contains("active")
      ? "hidden"
      : "auto";

    // Ensure topbar stays visible when menu is open on mobile
    if (navigation.classList.contains("active")) {
      topbar.classList.add("scrolled"); // Force visible state
    } else {
      handleHeader(); // Re-eval based on scroll
    }
  });

  // Close menu when a link is clicked
  const navLinks = navigation.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("active");
      document.body.style.overflow = "auto";
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      }
      handleHeader(); // Re-eval based on scroll
    });
  });
}

// Global reveal logic
function handleReveal() {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // Trigger reveal slightly before it comes fully into view
    if (rect.top <= windowHeight - 60) {
      el.classList.add("visible");
    }
  });
}

// Phantom Header logic
function handleHeader() {
  if (!topbar) return;

  // Don't hide header if mobile menu is actively open
  if (navigation && navigation.classList.contains("active")) {
    return;
  }

  if (window.scrollY > 20) {
    topbar.classList.add("scrolled");
  } else {
    topbar.classList.remove("scrolled");
  }
}

// Lightbox Logic
const lightbox = document.getElementById("lightbox");
const lightboxVideo = document.getElementById("lightbox-video");
if (lightbox && lightboxVideo) {
  const closeLightbox = document.getElementById("lightbox-close");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDescription = document.getElementById("lightbox-description");

  // Make Video Cards interactable
  document.querySelectorAll(".video-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      // grab the video from inside the card
      const srcVideo = card.querySelector("video");
      if (!srcVideo) return;

      lightboxVideo.src = srcVideo.src;
      lightboxTitle.innerText = "Crimson Fox Showreel";
      lightboxDescription.innerText = "Experience the cinematic difference.";
      lightbox.classList.add("visible");
      lightboxVideo.play().catch((e) => console.error("Playback failed", e));
    });
  });

  // Close Logic
  const closeFunc = () => {
    lightbox.classList.remove("visible");
    lightboxVideo.pause();
    lightboxVideo.src = "";
  };

  if (closeLightbox) closeLightbox.addEventListener("click", closeFunc);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeFunc();
  });
}

// Initial state and event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initial checks
  handleHeader();
  handleReveal();

  // Archive project loading
  const projectsContainer = document.getElementById("projects-container");
  if (projectsContainer) {
    fetch("projects.json")
      .then((res) => res.json())
      .then((data) => renderProjects(data))
      .catch((err) => {
        console.error("Archive load failed:", err);
        projectsContainer.innerHTML =
          '<p style="text-align:center;color:var(--muted);">Failed to load archive. Please try again later.</p>';
      });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        // Only prevent default and scroll if we are on the same page as the target
        // If we are on projects.html and click href="#about", let it act normally (though it usually goes to index.html#about)
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });
});

window.addEventListener("scroll", () => {
  handleHeader();
  handleReveal();
});

// Dynamic Project Renderer
function renderProjects(data) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  container.innerHTML = ""; // Clear loading state

  data.forEach((domain) => {
    const domainSection = document.createElement("article");
    domainSection.className = "project-domain reveal";

    const isMobile = window.innerWidth <= 980;
    const hasCarousel = domain.projects.length > 1;
    const projectsGridClass =
      isMobile && hasCarousel
        ? "projects-grid-dynamic has-carousel"
        : "projects-grid-dynamic";

    domainSection.innerHTML = `
            <div class="domain-header">
                <h3>${domain.category}</h3>
                <p style="color: var(--muted);">${domain.description}</p>
            </div>
            <div class="${projectsGridClass}">
                ${domain.projects
                  .map(
                    (proj) => `
                    <div class="ig-card">
                        <blockquote class="instagram-media" data-instgrm-permalink="${proj.url}" data-instgrm-version="15"></blockquote>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `;

    container.appendChild(domainSection);
  });

  // Re-process Instagram embeds if script is already present
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
  }

  // Trigger reveal for new content after a short delay to allow DOM insertion
  setTimeout(handleReveal, 150);
}

// Re-check layout on resize
window.addEventListener("resize", () => {
  handleReveal();
});
