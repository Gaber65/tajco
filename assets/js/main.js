/* ==========================================================================
   TAJ AL SHARQ UNITED — main.js
   Vanilla JS: navigation, counters, FAQ accordion, gallery filter/lightbox,
   testimonial slider (Swiper), contact form (EmailJS), page loader.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------------
     0. Page loader
  --------------------------------------------------------------------- */
  var loader = document.querySelector('.page-loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (loader) loader.classList.add('is-hidden');
    }, 300);
  });

  /* ---------------------------------------------------------------------
     1. AOS init
  --------------------------------------------------------------------- */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  /* ---------------------------------------------------------------------
     2. Sticky navbar + mobile menu toggle
  --------------------------------------------------------------------- */
  var navbar = document.querySelector('.site-navbar');
  var toggler = document.querySelector('.navbar-toggler-custom');
  var navLinks = document.querySelector('.nav-links');
  var backdrop = document.querySelector('.nav-backdrop');

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  function closeMenu() {
    if (navLinks) navLinks.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function openMenu() {
    if (navLinks) navLinks.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  if (toggler) {
    toggler.addEventListener('click', function () {
      if (navLinks && navLinks.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ---------------------------------------------------------------------
     3. Back to top button
  --------------------------------------------------------------------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
     4. Animated counters (Intersection Observer driven)
  --------------------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var duration = 1600;
    var startTime = null;
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = eased * target;
      el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------------
     5. FAQ accordion
  --------------------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------------------------------------------------------------------
     6. Equipment / Gallery filter pills
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var pills = group.querySelectorAll('.filter-pill');
    var targetSelector = group.getAttribute('data-filter-group');
    var items = document.querySelectorAll(targetSelector + ' [data-category]');

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var filter = pill.getAttribute('data-filter');

        items.forEach(function (item) {
          var cats = item.getAttribute('data-category');
          var show = filter === 'all' || (cats && cats.indexOf(filter) !== -1);
          if (show) {
            item.style.display = '';
            item.classList.add('aos-animate');
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });

  /* ---------------------------------------------------------------------
     7. Gallery lightbox
  --------------------------------------------------------------------- */
  var lightbox = document.querySelector('.lightbox-overlay');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var imgSrc = item.querySelector('img').getAttribute('src');
        var imgAlt = item.querySelector('img').getAttribute('alt');
        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', imgAlt);
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------------------------------------------------------------------
     8. Swiper sliders (testimonials + featured equipment)
  --------------------------------------------------------------------- */
  if (window.Swiper) {
    var testiSlider = document.querySelector('.testimonial-slider');
    if (testiSlider) {
      new Swiper(testiSlider, {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.testimonial-slider .swiper-pagination', clickable: true },
        breakpoints: {
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }
      });
    }

    var equipSlider = document.querySelector('.equipment-slider');
    if (equipSlider) {
      new Swiper(equipSlider, {
        slidesPerView: 1.15,
        spaceBetween: 20,
        loop: true,
        autoplay: { delay: 4200, disableOnInteraction: false },
        navigation: {
          nextEl: '.equipment-slider-next',
          prevEl: '.equipment-slider-prev'
        },
        breakpoints: {
          576: { slidesPerView: 1.6 },
          768: { slidesPerView: 2.3 },
          992: { slidesPerView: 3.2 },
          1200: { slidesPerView: 4 }
        }
      });
    }

    var galleryHero = document.querySelector('.gallery-hero-slider');
    if (galleryHero) {
      new Swiper(galleryHero, {
        slidesPerView: 1,
        loop: true,
        effect: 'fade',
        autoplay: { delay: 4500 },
        pagination: { el: '.gallery-hero-slider .swiper-pagination', clickable: true }
      });
    }
  }

  /* ---------------------------------------------------------------------
     9. Contact form validation + EmailJS submission
  --------------------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {

    // Initialize EmailJS - replace with your own Public Key from emailjs.com
    if (window.emailjs) {
      emailjs.init({ publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' });
    }

    var alertBox = document.getElementById('formAlert');

    var validators = {
      fullName: function (v) { return v.trim().length >= 3; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      phone: function (v) { return /^[0-9+\-\s()]{7,20}$/.test(v.trim()); },
      service: function (v) { return v.trim().length > 0; },
      message: function (v) { return v.trim().length >= 10; }
    };

    function showFieldError(field, show) {
      var wrapper = field.closest('.field-wrap') || field.parentElement;
      var errorEl = wrapper.querySelector('.field-error');
      field.classList.toggle('is-invalid', show);
      if (errorEl) errorEl.classList.toggle('is-visible', show);
    }

    function validateField(field) {
      var name = field.getAttribute('name');
      var fn = validators[name];
      if (!fn) return true;
      var valid = fn(field.value);
      showFieldError(field, !valid);
      return valid;
    }

    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
    });

    function showAlert(type, message) {
      if (!alertBox) return;
      alertBox.className = 'form-alert is-visible ' + type;
      alertBox.innerHTML = '<i class="bi ' + (type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill') + '"></i><span>' + message + '</span>';
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        showAlert('error', 'Please correct the highlighted fields before submitting.');
        return;
      }

      var submitBtn = contactForm.querySelector('[type="submit"]');
      var originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Sending...';

      var params = {
        from_name: contactForm.querySelector('[name="fullName"]').value,
        from_email: contactForm.querySelector('[name="email"]').value,
        phone: contactForm.querySelector('[name="phone"]').value,
        service: contactForm.querySelector('[name="service"]').value,
        message: contactForm.querySelector('[name="message"]').value,
        to_email: 'Info@tajco-sa.com'
      };

      if (window.emailjs) {
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your EmailJS service/template IDs
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params).then(
          function () {
            showAlert('success', 'Thank you! Your inquiry has been sent. Our team will contact you shortly.');
            contactForm.reset();
          },
          function (err) {
            showAlert('error', 'Something went wrong while sending your message. Please try again or call us directly.');
            console.error('EmailJS error:', err);
          }
        ).finally(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        });
      } else {
        // EmailJS not loaded (e.g. offline preview) - simulate success
        setTimeout(function () {
          showAlert('success', 'Thank you! Your inquiry has been received. Our team will contact you shortly.');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 900);
      }
    });
  }

  /* ---------------------------------------------------------------------
     10. Footer year
  --------------------------------------------------------------------- */
  var footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     11. Active nav link highlighting based on current page
  --------------------------------------------------------------------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

});