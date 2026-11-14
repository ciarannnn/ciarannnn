const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

const savedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  
  if (themeToggle) themeToggle.querySelector('.theme-label').textContent = isDark ? 'Light mode' : 'Dark mode';
}

setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', nextTheme);
    setTheme(nextTheme);
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    formNote.textContent = 'Sending your message...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        formNote.textContent = 'Thank you! Your message has been sent.';
        contactForm.reset();
      } else {
        formNote.textContent = 'Sorry, something went wrong. Please try again or email me directly.';
      }
    } catch (error) {
      formNote.textContent = 'Network error. Please check your connection and try again.';
    } finally {
      submitButton.disabled = false;
    }
  });
}

const carousel = document.querySelector('.project-carousel');

if (carousel) {
  const slides = [...carousel.querySelectorAll('.project-slide')];
  const counter = carousel.querySelector('.carousel-count');
  let current = 0;

  function showSlide(number) {
    current = (number + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    counter.textContent = `${current + 1} / ${slides.length}`;
  }

  carousel.querySelectorAll('.carousel-btn').forEach((button) => {
    button.addEventListener('click', () => showSlide(current + Number(button.dataset.dir)));
  });

  let startX = 0;
  carousel.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const distance = e.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 50) showSlide(current + (distance < 0 ? 1 : -1));
  });
}