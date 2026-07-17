const { pool } = require("../../config/database");

module.exports.getProfile = async (userId) => {
  const sql = `select id, fullName, email, phone, auth_provider, createdAt from users where id = ?`;
  const [users] = await pool.query(sql, [userId]);

  if (users.length === 0) return null;
  return users[0];
};

module.exports.updateProfile = async (userId, data) => {
  try {
    const sql = `Update users set fullName = ? , phone = ? where id = ?`;

    await pool.query(sql, [data.fullName, data.phone || null, userId]);

    return {
      success: true,
      message: "Cập nhật tài khoản thành công",
    };
  } catch (error) {
    console.error("Lỗi:", error);
    throw new Error("Lỗi Server khi cập nhật user");
  }
};
