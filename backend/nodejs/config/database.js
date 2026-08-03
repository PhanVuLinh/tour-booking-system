const mysql = require("mysql2/promise");

// 1. Khởi tạo pool ngay lập tức khi file được gọi
const pool = mysql.createPool(process.env.DB_URL);

// 2. Export pool ra để các file khác (Model, Controller) import vào và query data
module.exports.pool = pool;

// 3. Export hàm test kết nối (Giống với hàm connect của Mongoose bạn đưa)
module.exports.connect = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Kết nối database TiDB Cloud thành công!");
    connection.release(); // Nhớ release để trả connection lại cho pool
  } catch (error) {
    console.error("❌ Kết nối database thất bại:", error.message);
  }
};
