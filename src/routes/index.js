const express = require('express');
const router = express.Router();
const { handleWebhookRequest } = require('../controllers/messageController');
const config = require('../config');

// Middleware de autenticación para webhooks
const authMiddleware = (req, res, next) => {
  const token = req.headers['x-webhook-token'];
  
  // Log para depuración
  console.log('Token recibido:', token);
  console.log('Token esperado:', config.webhookToken);
  
  if (!token || token !== config.webhookToken) {
    console.log('❌ Autenticación fallida');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  console.log('✅ Autenticación exitosa');
  next();
};

// Configuración de rutas
const setupRoutes = (app, provider) => {
  // Ruta para recibir mensajes de n8n - Formato 1
  router.post('/n8n-webhook', authMiddleware, (req, res) => {
    console.log('📥 Solicitud recibida en /n8n-webhook:', req.body);
    handleWebhookRequest(req, res, provider);
  });
  
  // Ruta alternativa para compatibilidad - Formato 2
  router.post('/send-message', authMiddleware, (req, res) => {
    console.log('📥 Solicitud recibida en /send-message:', req.body);
    
    // Adaptar el formato de la solicitud
    if (req.body.telefono && req.body.respuesta) {
      req.body = {
        action: 'send_message',
        data: {
          phone: req.body.telefono,
          message: req.body.respuesta
        }
      };
    }
    
    handleWebhookRequest(req, res, provider);
  });

  // Ruta para verificar el estado del bot
  router.get('/status', (req, res) => {
    res.json({
      status: 'online',
      timestamp: new Date().toISOString()
    });
  });

  // Aplicar rutas a la app
  app.use('/api', router);
  
  console.log('🛣️ Rutas configuradas correctamente');
};

module.exports = {
  setupRoutes
};
