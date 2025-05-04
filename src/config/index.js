// src/config/index.js
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

// Verificar variables de entorno requeridas
const requiredEnvVars = [
  'WEBHOOK_TOKEN',
  'N8N_WEBHOOK_URL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Error: Faltan las siguientes variables de entorno: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Configuración unificada
const config = {
  // Configuración del servidor
  port: process.env.PORT || process.env.WEBHOOK_PORT || 3080,
  webhookToken: process.env.WEBHOOK_TOKEN,
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/whatsapp',
  
  // Configuración de la base de datos
  database: {
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'botwsp1.3',
    password: process.env.DB_PASSWORD || 'portIvan*.2015ñ',
    port: parseInt(process.env.DB_PORT) || 5432
  }
};

// Log para depuración durante el inicio
console.log('🔐 Token configurado:');
console.log('🚀 Puerto configurado:', config.port);
console.log('🔗 URL de webhook n8n configurada:', config.n8nWebhookUrl);

module.exports = config;
