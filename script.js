// script.js

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navigation = document.getElementById('navigation');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navigation.style.display = navigation.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.navigation a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 720) {
            navigation.style.display = 'none';
        }
    });
});

// Simple function to handle video clicks or animations
function openLightbox(videoID) {
    console.log("Opening video: " + videoID);
    // You can integrate a YouTube API or a simple modal pop-up here
    alert("This would launch your video player for: " + videoID);
}

// Scroll reveal effect for the gallery
window.addEventListener('scroll', () => {
    const items = document.querySelectorAll('.item, .reveal');
    items.forEach(item => {
        const speed = 0.5;
        const rect = item.getBoundingClientRect();
        if(rect.top < window.innerHeight) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightbox-close');

if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
        if (lightbox) lightbox.classList.remove('visible');
    });
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('visible');
        }
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});