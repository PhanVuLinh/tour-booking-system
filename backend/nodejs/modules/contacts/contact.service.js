const { pool } = require("../../config/database");

module.exports.saveEmail = async (email) => {
    try {
        const checkSql = "SELECT id FROM contacts WHERE email = ?";
        const [existing] = await pool.query(checkSql, [email]);

        if (existing.length > 0) {
            return {
                success: false,
                message: "Email này đã được đăng ký trước đó!"
            };
        }

        const insertSql = "INSERT INTO contacts (email) VALUES (?)";
        await pool.query(insertSql, [email]);

        return { success: true };
    } catch (error) {
        console.error("Lỗi Service (Contacts):", error);
        return { success: false, message: "Lỗi cơ sở dữ liệu!" };
    }
};
