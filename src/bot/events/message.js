// src/bot/events/message.js
const { handleIncomingMessage } = require('../../controllers/messageController');

/**
 * Configura el evento de mensaje
 * @param {Object} provider - Instancia del proveedor
 */
const setupMessageEvent = (provider) => {
  provider.on('message', async (msg) => {
    try {
      await handleIncomingMessage(provider, msg);
    } catch (error) {
      console.error('❌ Error procesando mensaje entrante:', error);
    }
  });
  
  console.log('✅ Evento de mensaje configurado');
};

module.exports = setupMessageEvent;
