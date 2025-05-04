// src/controllers/messageController.js
const { sendMessageToN8N, processIncomingMessage } = require('../services/messageService');

/**
 * Maneja los mensajes entrantes de WhatsApp
 * @param {object} provider - Proveedor de WhatsApp
 * @param {object} msg - Mensaje recibido
 */
const handleIncomingMessage = async (provider, msg) => {
  return await processIncomingMessage(provider, msg);
};

/**
 * Maneja las solicitudes de webhook de n8n
 * @param {object} req - Objeto de solicitud
 * @param {object} res - Objeto de respuesta
 * @param {object} provider - Proveedor de WhatsApp
 */
const handleWebhookRequest = async (req, res, provider) => {
  try {
    const { action, data } = req.body;
    console.log('📥 Recibida petición de webhook:', { action, data });
    
    switch (action) {
      case 'send_message':
        const { phone, message } = data;
        
        if (!phone || !message) {
          console.log('❌ Error: Faltan datos', { phone, message });
          return res.status(400).json({ error: 'Missing phone or message' });
        }

        const formattedPhone = phone.includes('@s.whatsapp.net') 
          ? phone 
          : `${phone}@s.whatsapp.net`;

        console.log('📤 Intentando enviar mensaje a:', formattedPhone);

        try {
          await provider.getInstance().sendMessage(formattedPhone, {
            text: message
          });
          
          console.log('✅ Mensaje enviado exitosamente');
          res.json({ success: true, message: 'Mensaje enviado' });
        } catch (error) {
          console.error('❌ Error enviando mensaje:', error);
          res.status(500).json({ 
            error: 'Error enviando mensaje',
            details: error.message 
          });
        }
        break;

      default:
        console.log('❌ Acción no soportada:', action);
        return res.status(400).json({ error: 'Action not supported' });
    }
  } catch (error) {
    console.error('❌ Error general en webhook:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

module.exports = {
  handleIncomingMessage,
  handleWebhookRequest
};
