// src/database/index.js
const { Client } = require('pg');
const config = require('../config');

const client = new Client(config.dbConfig);

// Conectar al iniciar la aplicación
const connectDB = async () => {
  try {
    await client.connect();
    console.log('✅ Conexión exitosa a la base de datos PostgreSQL');
    
    // Crear tablas si no existen
    await initTables();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

// Inicializar tablas
const initTables = async () => {
  try {
    // Tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de conversaciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de mensajes
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id),
        direction VARCHAR(10) NOT NULL, -- 'incoming' o 'outgoing'
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'sent'
      )
    `);

    console.log('✅ Tablas inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar tablas:', error);
    throw error;
  }
};

module.exports = {
  client,
  connectDB,
  query: (text, params) => client.query(text, params)
};
