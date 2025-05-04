// src/bot/events/qr.js
const logger = require('../../utils/logger');

/**
 * Configura el evento de QR
 * @param {Object} provider - Instancia del proveedor
 */
const setupQrEvent = (provider) => {
  provider.on('qr', (qr) => {
    logger.info('🔄 Nuevo código QR generado');
  });
  
  logger.info('✅ Evento de QR configurado');
};

module.exports = setupQrEvent;
