// src/database/models/user.js
const db = require('../index');

class User {
  static async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone = $1';
    const result = await db.query(query, [phone]);
    return result.rows[0];
  }

  static async create(userData) {
    const { phone, name, email } = userData;
    const query = 'INSERT INTO users (phone, name, email) VALUES ($1, $2, $3) RETURNING *';
    const result = await db.query(query, [phone, name, email]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { name, email } = userData;
    const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
    const result = await db.query(query, [name, email, id]);
    return result.rows[0];
  }
}

module.exports = User;
