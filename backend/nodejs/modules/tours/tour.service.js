const { pool } = require("../../config/database");

module.exports.getAllTours = async () => {
  const sql = "SELECT * FROM tours";
  const [rows] = await pool.query(sql);
  return rows;
};
