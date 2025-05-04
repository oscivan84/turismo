// src/utils/messageFormatter.js

/**
 * Formatea un número de teléfono para asegurar que tenga el formato correcto para WhatsApp
 * @param {string} phone - Número de teléfono
 * @returns {string} - Número formateado
 */
const formatPhone = (phone) => {
  // Eliminar cualquier carácter que no sea número
  let cleaned = phone.replace(/\D/g, '');
  
  // Asegurarse de que tenga el formato correcto para WhatsApp
  if (!cleaned.includes('@s.whatsapp.net')) {
    cleaned = `${cleaned}@s.whatsapp.net`;
  }
  
  return cleaned;
};

/**
 * Extrae el número de teléfono sin el sufijo de WhatsApp
 * @param {string} phone - Número de teléfono con formato WhatsApp
 * @returns {string} - Número limpio
 */
const extractPhone = (phone) => {
  return phone.replace('@s.whatsapp.net', '');
};

/**
 * Formatea un mensaje para mostrar en consola o logs
 * @param {object} msg - Objeto de mensaje
 * @returns {string} - Mensaje formateado
 */
const formatMessageForLog = (msg) => {
  const sender = msg.from ? extractPhone(msg.from) : 'Unknown';
  const content = msg.body || '[MEDIA]';
  return `${sender}: ${content}`;
};

module.exports = {
  formatPhone,
  extractPhone,
  formatMessageForLog
};
