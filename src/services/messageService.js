// src/services/messageService.js
const axios = require('axios');
const config = require('../config');

/**
 * Envía un mensaje a n8n para procesamiento
 * @param {string} sender - Número del remitente
 * @param {string} message - Contenido del mensaje
 * @returns {Promise<object>} - Respuesta de n8n
 */
const sendMessageToN8N = async (sender, message) => {
  try {
    const response = await axios.post(config.n8nWebhookUrl, {
      sender: sender.replace('@s.whatsapp.net', ''),
      message: message
    });
    console.log('🤖 Mensaje enviado a n8n', { sender, message });
    return response.data;
  } catch (error) {
    console.error('❌ Error enviando mensaje a n8n:', error.message);
    return null;
  }
};

/**
 * Procesa un mensaje entrante
 * @param {object} provider - Proveedor de WhatsApp
 * @param {object} msg - Mensaje recibido
 */
const processIncomingMessage = async (provider, msg) => {
  // Ignorar mensajes de estado o del propio bot
  if (msg.from === 'status@broadcast' || msg.from === provider.number) return;
  
  const sender = msg.from;
  const text = msg.body;
  
  if (!text) return;
  
  console.log(`📨 Mensaje recibido de ${sender}: ${text}`);
  
  // Enviar a n8n para procesamiento
  const n8nResponse = await sendMessageToN8N(sender, text);
  
  return n8nResponse;
};

module.exports = {
  sendMessageToN8N,
  processIncomingMessage
};
