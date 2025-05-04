// src/config/database.js
const { Client } = require('pg');
const config = require('./index');

const client = new Client(config.database);

// Conectar al iniciar la aplicación
const connectDB = async () => {
  try {
    await client.connect();
    console.log('✅ Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    // No terminamos el proceso aquí para permitir que la aplicación funcione sin BD
    console.log('⚠️ La aplicación continuará sin conexión a la base de datos');
  }
};

module.exports = { client, connectDB };
