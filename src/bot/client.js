// src/bot/client.js
const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const JsonFileAdapter = require('@bot-whatsapp/database/json');
const logger = require('../utils/logger');

let botInstance = null;
let providerInstance = null;

/**
 * Inicializa el cliente de WhatsApp
 * @returns {Object} - Instancia del bot y provider
 */
const initializeClient = async () => {
  try {
    logger.info('🤖 Inicializando cliente de WhatsApp...');
    
    const adapterDB = new JsonFileAdapter();
    const adapterFlow = createFlow([]); // Sin flujos
    const adapterProvider = createProvider(BaileysProvider);

    const bot = await createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

    botInstance = bot;
    providerInstance = adapterProvider;
    
    logger.info('✅ Cliente de WhatsApp inicializado correctamente');
    
    return {
      bot: botInstance,
      provider: providerInstance
    };
  } catch (error) {
    logger.error('❌ Error al inicializar cliente de WhatsApp', error);
    throw error;
  }
};

/**
 * Obtiene la instancia del bot
 * @returns {Object} - Instancia del bot
 */
const getBot = () => {
  if (!botInstance) {
    throw new Error('Bot no inicializado. Llama a initializeClient primero.');
  }
  return botInstance;
};

/**
 * Obtiene la instancia del provider
 * @returns {Object} - Instancia del provider
 */
const getProvider = () => {
  if (!providerInstance) {
    throw new Error('Provider no inicializado. Llama a initializeClient primero.');
  }
  return providerInstance;
};

module.exports = {
  initializeClient,
  getBot,
  getProvider
};
