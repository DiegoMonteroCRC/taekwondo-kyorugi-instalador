/**
 * TKD Judge Systems - Módulo de Contacto, Cotización y WhatsApp
 * Integración nativa con Web3Forms API y WhatsApp Direct
 * tkdjudgesystems.com
 */

// 1. Clave de acceso a Web3Forms:
const WEB3FORMS_ACCESS_KEY = "ed4b8dc8-8944-4f5d-8f0f-c5a2ce5e6a20";

// 2. Número de WhatsApp para contacto directo y atención inmediata:
// (Formato internacional sin signos: 506 + número celular en Costa Rica)
const CONFIG_WHATSAPP_NUMERO = "50670812041";

/**
 * Procesa el envío del formulario con Web3Forms y sincroniza el enlace de WhatsApp
 * @param {Event} e - Evento de submit del formulario
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');
  const successBanner = document.getElementById('form-success');
  const errorBanner = document.getElementById('form-error');
  const errorDesc = document.getElementById('form-error-desc');
  const btnWhatsapp = document.getElementById('btn-whatsapp-direct');

  // Ocultar avisos previos
  if (errorBanner) errorBanner.classList.add('hidden');
  if (successBanner) successBanner.classList.add('hidden');

  // Extraer datos del formulario
  const formData = {
    nombre: document.getElementById('nombre').value.trim(),
    organizacion: document.getElementById('organizacion').value.trim(),
    email: document.getElementById('email').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    modalidad: document.getElementById('modalidad_interes').value,
    detalles: document.getElementById('detalles').value.trim(),
    fecha: new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })
  };

  // Detección y bloqueo Anti-Spam (Honeypot)
  const botcheck = document.getElementById('botcheck');
  if (botcheck && botcheck.checked) {
    console.warn("Intento de envío automatizado detectado por honeypot.");
    return;
  }

  // Validación preventiva de Access Key
  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "TU_ACCESS_KEY_AQUI") {
    if (errorBanner && errorDesc) {
      errorDesc.textContent = "Falta ingresar tu Access Key de Web3Forms. Puedes generarla gratis en https://web3forms.com.";
      errorBanner.classList.remove('hidden');
      errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    return;
  }

  // Estado visual de carga
  btnText.textContent = "Enviando solicitud...";
  btnSpinner.classList.remove('hidden');
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        botcheck: "",
        subject: `🥋 Nueva Cotización TKD Judge Systems: ${formData.organizacion} (${formData.nombre})`,
        from_name: "TKD Judge Systems (tkdjudgesystems.com)",
        "Nombre": formData.nombre,
        "Organización": formData.organizacion,
        "Email": formData.email,
        "Teléfono": formData.telefono,
        "Modalidad de Interés": formData.modalidad,
        "Detalles o Requerimientos": formData.detalles || "Sin detalles adicionales",
        "Fecha de Registro": formData.fecha
      })
    });

    const result = await response.json();

    if (result.success) {
      // Configurar enlace directo a WhatsApp con los datos ya completados
      const waText = encodeURIComponent(
        `🥋 *Nueva Solicitud - TKD Judge Systems*\n\n` +
        `👤 *Nombre:* ${formData.nombre}\n` +
        `🏢 *Academia / Federación:* ${formData.organizacion}\n` +
        `📧 *Email:* ${formData.email}\n` +
        `📱 *Teléfono:* ${formData.telefono}\n` +
        `🎯 *Modalidad:* ${formData.modalidad}\n` +
        (formData.detalles ? `📝 *Detalles:* ${formData.detalles}\n` : '') +
        `\n_Enviado desde tkdjudgesystems.com_`
      );
      if (btnWhatsapp) {
        btnWhatsapp.href = `https://wa.me/${CONFIG_WHATSAPP_NUMERO}?text=${waText}`;
      }

      // Respaldo de seguridad en el almacenamiento local del cliente
      try {
        const storedLeads = JSON.parse(localStorage.getItem('tkd_judge_leads') || '[]');
        storedLeads.push(formData);
        localStorage.setItem('tkd_judge_leads', JSON.stringify(storedLeads));
      } catch (e) { }

      // Mostrar mensaje de éxito
      successBanner.classList.remove('hidden');
      form.reset();
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      throw new Error(result.message || "No se pudo procesar el envío con Web3Forms.");
    }
  } catch (err) {
    console.error("Error al enviar con Web3Forms:", err);
    if (errorBanner && errorDesc) {
      errorDesc.textContent = err.message || "Hubo un problema de conexión al enviar el formulario. Por favor contáctenos directamente por WhatsApp.";
      errorBanner.classList.remove('hidden');
      errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } finally {
    btnText.textContent = "Enviar Solicitud";
    btnSpinner.classList.add('hidden');
    submitBtn.disabled = false;
  }
}
