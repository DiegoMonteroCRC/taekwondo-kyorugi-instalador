/**
 * TKD Judge Systems - Script Principal de Interacción y UI
 * tkdjudgesystems.com
 */

// =========================================================================
// 1. BANNER DE CONSENTIMIENTO DE COOKIES (RGPD / LOPDGDD)
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const rejectBtn = document.getElementById('cookie-reject-btn');
  const consent = localStorage.getItem('tkd_cookie_consent');

  if (!consent && cookieBanner) {
    setTimeout(() => {
      cookieBanner.classList.remove('translate-y-full');
    }, 1800);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('tkd_cookie_consent', 'accepted');
      if (cookieBanner) cookieBanner.classList.add('translate-y-full');
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('tkd_cookie_consent', 'rejected_optional');
      if (cookieBanner) cookieBanner.classList.add('translate-y-full');
    });
  }
});

// =========================================================================
// 2. INICIALIZADOR DE SPLASH SCREEN / PRELOADER DE ALTO IMPACTO
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress');
  if (progressBar) {
    setTimeout(() => { progressBar.style.width = '100%'; }, 50);
  }
  setTimeout(() => {
    if (preloader) {
      preloader.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => preloader.remove(), 700);
    }
  }, 1200);
});

// =========================================================================
// 3. NAVEGACIÓN MÓVIL Y SCROLL SUAVE
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Auto-cerrar menú al hacer clic en un enlace de navegación
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
});

// Preselección de modalidad en el selector y desplazamiento suave
function prefillContact(tipo) {
  const select = document.getElementById('modalidad_interes');
  if (select) {
    select.value = tipo;
  }
  const contactoSection = document.getElementById('contacto');
  if (contactoSection) {
    contactoSection.scrollIntoView({ behavior: 'smooth' });
  }
}
