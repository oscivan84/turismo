const express = require('express');
const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const JsonFileAdapter = require('@bot-whatsapp/database/json');
const axios = require('axios');
const config = require('./src/config');
const { setupRoutes } = require('./src/routes');

// Crear la aplicación Express
const app = express();
app.use(express.json());

// Función principal para iniciar la aplicación
const main = async () => {
  try {
    // Inicializar componentes del bot
    const adapterDB = new JsonFileAdapter();
    const adapterFlow = createFlow([]);
    const adapterProvider = createProvider(BaileysProvider);

    // Crear el bot
    const bot = await createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

    // Configurar evento de mensaje
    adapterProvider.on('message', async (message) => {
      // Ignorar mensajes de estado o del propio bot
      if (message.from === 'status@broadcast' || message.from === adapterProvider.number) return;

      console.log(`📨 Mensaje recibido de ${message.from}: ${message.body}`);

      try {
        // Crear el payload según el formato especificado
        const payload = {
          sender: message.from,
          message: message.body,
          answerBot: "" // Esto lo llenará n8n
        };

        // Enviar el mensaje a n8n
        const response = await axios.post(config.n8nWebhookUrl, payload);
        console.log('🤖 Mensaje enviado a n8n:', response.data);
      } catch (error) {
        console.error('❌ Error enviando mensaje a n8n:', error.message);
      }
    });

    // Configurar rutas
    setupRoutes(app, adapterProvider);
    
    // Iniciar el servidor
    app.listen(config.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
      console.log(`📲 Webhook listo para recibir peticiones de n8n`);
    });
    
  } catch (error) {
    console.error('❌ Error iniciando la aplicación:', error);
    process.exit(1);
  }
};

// Iniciar la aplicación
main();
