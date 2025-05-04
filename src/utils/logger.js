// src/utils/logger.js
const fs = require('fs');
const path = require('path');

// Asegurarse de que el directorio de logs exista
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);

const logger = {
  info: (message, data = {}) => {
    const logEntry = {
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...data
    };
    console.log(`ℹ️ ${logEntry.message}`, data);
    fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');
  },
  
  error: (message, error = {}) => {
    const logEntry = {
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      error: error instanceof Error ? { 
        message: error.message, 
        stack: error.stack 
      } : error
    };
    console.error(`❌ ${logEntry.message}`, error);
    fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');
  },
  
  warning: (message, data = {}) => {
    const logEntry = {
      level: 'warning',
      timestamp: new Date().toISOString(),
      message,
      ...data
    };
    console.warn(`⚠️ ${logEntry.message}`, data);
    fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');
  }
};

module.exports = logger;
