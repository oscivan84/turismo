// src/database/models/conversation.js
const db = require('../index');

class Conversation {
  static async findOrCreateByUserId(userId) {
    // Buscar conversación activa
    const findQuery = `
      SELECT * FROM conversations 
      WHERE user_id = $1 AND status = 'active' 
      ORDER BY updated_at DESC 
      LIMIT 1
    `;
    const findResult = await db.query(findQuery, [userId]);
    
    if (findResult.rows.length > 0) {
      return findResult.rows[0];
    }
    
    // Crear nueva conversación
    const createQuery = `
      INSERT INTO conversations (user_id, status) 
      VALUES ($1, 'active') 
      RETURNING *
    `;
    const createResult = await db.query(createQuery, [userId]);
    return createResult.rows[0];
  }

  static async addMessage(conversationId, direction, content) {
    // Agregar mensaje
    const query = `
      INSERT INTO messages (conversation_id, direction, content) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const result = await db.query(query, [conversationId, direction, content]);
    
    // Actualizar timestamp de la conversación
    await db.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [conversationId]
    );
    
    return result.rows[0];
  }

  static async getMessages(conversationId, limit = 10) {
    const query = `
      SELECT * FROM messages 
      WHERE conversation_id = $1 
      ORDER BY timestamp DESC 
      LIMIT $2
    `;
    const result = await db.query(query, [conversationId, limit]);
    return result.rows;
  }
}

module.exports = Conversation;
