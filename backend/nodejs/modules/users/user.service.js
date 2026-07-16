const { pool } = require("../../config/database");
module.exports.getProfile = async (userId) => {
  const sql = `select id, fullName, email, phone, auth_provider, createdAt from users where id = ?`;
  const [users] = await pool.query(sql, [userId]);

  if (users.length === 0) return null;
  return users[0];
};
