// Lightweight animations: 3D tilt, magnetic buttons, scroll reveal
(function () {
  function init3DTilt() {
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
      let rect = null;
      function onMove(e) {
        rect = rect || card.getBoundingClientRect();
        const x = ('clientX' in e) ? e.clientX : e.touches && e.touches[0].clientX;
        const y = ('clientY' in e) ? e.clientY : e.touches && e.touches[0].clientY;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rotateY = ((x - cx) / rect.width) * 20; // scaled
        const rotateX = ((y - cy) / rect.height) * -20;
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.03)`;
      }
      card.addEventListener('mousemove', onMove);
      card.addEventListener('touchmove', onMove, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-button');
    buttons.forEach(button => {
      function onMove(e) {
        const rect = button.getBoundingClientRect();
        const x = ('clientX' in e) ? e.clientX : e.touches && e.touches[0].clientX;
        const y = ('clientY' in e) ? e.clientY : e.touches && e.touches[0].clientY;
        const rx = x - (rect.left + rect.width / 2);
        const ry = y - (rect.top + rect.height / 2);
        // dampen movement
        const dx = (rx * 0.25).toFixed(2) + 'px';
        const dy = (ry * 0.2).toFixed(2) + 'px';
        button.style.setProperty('--mouse-x', dx);
        button.style.setProperty('--mouse-y', dy);
      }
      button.addEventListener('mousemove', onMove);
      button.addEventListener('touchmove', onMove, { passive: true });
      button.addEventListener('mouseleave', () => {
        button.style.setProperty('--mouse-x', '0px');
        button.style.setProperty('--mouse-y', '0px');
      });
      button.addEventListener('touchend', () => {
        button.style.setProperty('--mouse-x', '0px');
        button.style.setProperty('--mouse-y', '0px');
      });
    });
  }

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: reveal all
      document.querySelectorAll('.reveal-card, .fade-up').forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.reveal-card, .fade-up').forEach(el => observer.observe(el));
  }

  function initAllAnimations() {
    init3DTilt();
    initMagneticButtons();
    initScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
  } else {
    initAllAnimations();
  }
})();
