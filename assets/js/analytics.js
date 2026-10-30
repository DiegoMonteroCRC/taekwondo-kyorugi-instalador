/**
 * TKD Judge Systems - Módulo de Analítica Web (Google Analytics 4)
 * tkdjudgesystems.com
 */

// Ingrese su ID de Google Analytics cuando lo tenga disponible (ej: G-XXXXXXXXXX)
window.GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

if (window.GA_MEASUREMENT_ID && window.GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.GA_MEASUREMENT_ID;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', window.GA_MEASUREMENT_ID);
}
