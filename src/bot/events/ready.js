// src/bot/events/ready.js
const logger = require('../../utils/logger');

/**
 * Configura el evento de ready
 * @param {Object} provider - Instancia del proveedor
 */
const setupReadyEvent = (provider) => {
  provider.on('ready', () => {
    logger.info('🟢 WhatsApp está listo y conectado');
  });
  
  logger.info('✅ Evento de ready configurado');
};

module.exports = setupReadyEvent;
