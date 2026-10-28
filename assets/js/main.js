/**
* Kalpesh Pawar - Developer Portfolio Scripts
* Modern Vanilla JavaScript implementation
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    const header = document.querySelector('#header');
    if (header) {
      header.classList.toggle('header-show');
    }
    if (headerToggleBtn) {
      headerToggleBtn.classList.toggle('bi-list');
      headerToggleBtn.classList.toggle('bi-x');
    }
  }
  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', headerToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll (AOS)
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Typed.js init
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped && typeof Typed !== 'undefined') {
    const typedStrings = selectTyped.getAttribute('data-typed-items');
    if (typedStrings) {
      new Typed('.typed', {
        strings: typedStrings.split(','),
        loop: true,
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 2000
      });
    }
  }

  /**
   * GLightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Project Portfolio Filtering
   */
  const filterButtons = document.querySelectorAll('.portfolio-filters li');
  const projectItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('filter-active'));
        this.classList.add('filter-active');

        const filterValue = this.getAttribute('data-filter');

        projectItems.forEach(item => {
          if (filterValue === '*' || item.classList.contains(filterValue.replace('.', ''))) {
            item.style.display = 'block';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
            item.style.opacity = '0';
          }
        });

        if (typeof aosInit === 'function') {
          aosInit();
        }
      });
    });
  }

  /**
   * ============================================================
   * CONTACT FORM CUSTOM SMTP HANDLER (/api/contact)
   * ============================================================
   * Connects directly to custom Gmail SMTP (ksptechsolustions@gmail.com)
   * via secure serverless endpoint with automatic Netlify/Vercel routing.
   */
  const contactForm = document.querySelector('#contact-form') || document.querySelector('.contact-form-handler') || document.querySelector('.php-email-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const thisForm = this;
      const loading = thisForm.querySelector('.loading');
      const errorMessage = thisForm.querySelector('.error-message');
      const sentMessage = thisForm.querySelector('.sent-message');
      const submitBtn = thisForm.querySelector('button[type="submit"]');

      if (loading) loading.style.display = 'block';
      if (errorMessage) {
        errorMessage.style.display = 'none';
        errorMessage.innerHTML = '';
      }
      if (sentMessage) sentMessage.style.display = 'none';
      if (submitBtn) submitBtn.disabled = true;

      const name = (thisForm.querySelector('input[name="name"]') || {}).value || '';
      const email = (thisForm.querySelector('input[name="email"]') || {}).value || '';
      const subject = (thisForm.querySelector('input[name="subject"]') || {}).value || '';
      const message = (thisForm.querySelector('textarea[name="message"]') || {}).value || '';

      const payload = { name, email, subject, message };

      // Primary endpoint: /api/contact (Works natively on Vercel and Netlify via netlify.toml)
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(async response => {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          data = null;
        }

        if (response.ok && (!data || data.success !== false)) {
          if (loading) loading.style.display = 'none';
          if (submitBtn) submitBtn.disabled = false;
          if (sentMessage) {
            sentMessage.innerHTML = 'Your message has been sent successfully via SMTP! Thank you for reaching out.';
            sentMessage.style.display = 'block';
          }
          thisForm.reset();
        } else {
          const msg = (data && data.message) ? data.message : 'Failed to send message via SMTP server (Status: ' + response.status + ').';
          throw new Error(msg);
        }
      })
      .catch(error => {
        console.error('Contact Form Error:', error);
        if (loading) loading.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
        if (errorMessage) {
          errorMessage.innerHTML = error.message || 'Error occurred while contacting SMTP server. Please email kp154437@gmail.com directly.';
          errorMessage.style.display = 'block';
        }
      });
    });
  }

  /**
   * Correct scrolling position for hash links on load and navigation
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          const scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - (parseInt(scrollMarginTop) || 0),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  const navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return;
      const position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();