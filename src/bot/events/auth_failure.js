// src/bot/events/auth_failure.js
const logger = require('../../utils/logger');

/**
 * Configura el evento de fallo de autenticación
 * @param {Object} provider - Instancia del proveedor
 */
const setupAuthFailureEvent = (provider) => {
  provider.on('auth_failure', (error) => {
    logger.error('❌ Error de autenticación en WhatsApp', error);
  });
  
  logger.info('✅ Evento de auth_failure configurado');
};

module.exports = setupAuthFailureEvent;
