(() => {
  // DOM short helpers
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // Mobile nav toggle (aria-friendly)
  const navToggle = $ && $('#nav-toggle');
  const nav = $ && $('#site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Active nav link by filename (works with index.html or '/')
  const setActiveNav = () => {
    const links = $$('.nav-link');
    const path = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.endsWith(path)) a.classList.add('active');
      else a.classList.remove('active');
    });
  };
  setActiveNav();

  // Simple scroll animation using IntersectionObserver — efficient and production-ready
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        observer.unobserve(e.target); // animate once
      }
    });
  }, { threshold: 0.12 });

  $$('.animate-on-scroll').forEach(el => observer.observe(el));

  // Fill copyright years
  const years = [$('#year'), $('#year2'), $('#year3'), $('#year4')].filter(Boolean);
  years.forEach(el => el.textContent = new Date().getFullYear());

  // Contact form validation and UX
  const form = $('#contact-form');
  const formErrors = $('#form-errors');
  const success = $('#form-success');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      formErrors.textContent = '';
      // Honeypot check
      if (form.website && form.website.value.trim() !== '') {
        // silent fail for bots
        return;
      }
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const errors = [];
      if (!name) errors.push('Please enter your name.');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email.');
      if (!message || message.length < 10) errors.push('Message should be at least 10 characters.');
      if (errors.length) {
        formErrors.innerHTML = errors.map(e => `<div>• ${e}</div>`).join('');
        return;
      }

      // Simulate successful submit and show success UI (in real life, post to server)
      success.hidden = false;
      form.hidden = true;
    });
  }

  // Close success panel
  const successClose = $('#success-close');
  if (successClose) {
    successClose.addEventListener('click', () => {
      const s = $('#form-success');
      const f = $('#contact-form');
      if (s) s.hidden = true;
      if (f) {
        f.hidden = false;
        f.reset();
      }
    });
  }

  // Close nav when clicking a link on mobile
  $$('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

})();