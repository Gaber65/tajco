/* ==========================================================================
   contact.js — Contact form validation + EmailJS for Taj Al Sharq United
   ========================================================================== */

const ContactForm = (() => {
  'use strict';

  /* ---- Initialize EmailJS ---- */
  const initEmailJS = () => {
    if (window.emailjs) {
      emailjs.init({
        publicKey: "Ui6bZEGZqj5rNNnWq"
      });
    }
  };

  /* ---- Validators ---- */
  const validators = {
    fullName: (v) => v.trim().length >= 3,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => /^[0-9+\-\s()]{7,20}$/.test(v.trim()),
    service: (v) => v.trim().length > 0,
    message: (v) => v.trim().length >= 10
  };

  /* ---- Show / hide field error ---- */
  const showFieldError = (field, show) => {
    const wrapper = field.closest('.field-wrap') || field.parentElement;
    const errorEl = wrapper.querySelector('.field-error');
    field.classList.toggle('is-invalid', show);
    if (errorEl) errorEl.classList.toggle('is-visible', show);
  };

  /* ---- Validate a single field ---- */
  const validateField = (field) => {
    const name = field.getAttribute('name');
    const fn = validators[name];
    if (!fn) return true;
    const valid = fn(field.value);
    showFieldError(field, !valid);
    return valid;
  };

  /* ---- Show form alert ---- */
  const showAlert = (alertBox, type, message) => {
    if (!alertBox) return;
    alertBox.className = 'form-alert is-visible ' + type;
    alertBox.innerHTML = '<i class="bi ' + (type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill') + '"></i><span>' + message + '</span>';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* ---- Initialize contact form ---- */
  const init = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    initEmailJS();

    const alertBox = document.getElementById('formAlert');

    // Live validation on blur and input
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => { validateField(field); });
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
    });

    // Form submit
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
      let allValid = true;
      fields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        showAlert(alertBox, 'error', Language.t('contact.form.errorValidation'));
        return;
      }

      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> ' + Language.t('contact.form.sending');

      const params = {
        from_name: contactForm.querySelector('[name="fullName"]').value,
        from_email: contactForm.querySelector('[name="email"]').value,
        phone: contactForm.querySelector('[name="phone"]').value,
        service: contactForm.querySelector('[name="service"]').value,
        message: contactForm.querySelector('[name="message"]').value,
        to_email: 'Info@tajco-sa.com'
      };

      if (window.emailjs) {
        emailjs.send(
          "service_zdztnyt",
          "template_gexi8pn",
          params
        ).then(
          () => {
            showAlert(alertBox, 'success', Language.t('contact.form.successMessage'));
            contactForm.reset();
          },
          (err) => {
            showAlert(alertBox, 'error', Language.t('contact.form.errorMessage'));
            console.error('EmailJS error:', err);
          }
        ).finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        });
      } else {
        setTimeout(() => {
          showAlert(alertBox, 'success', Language.t('contact.form.successMessage'));
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 900);
      }
    });
  };

  return { init };
})();
