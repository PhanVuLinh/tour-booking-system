const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");
const database = require("./config/database");

const app = express();
const port = process.env.PORT;
const allowedOrigins = [process.env.URL_FE_1, process.env.URL_FE_2].filter(Boolean);

//Kết nối đến DB;
database.connect();

//cấu hình CORS
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//Cho phép gửi data lên dạng json
app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log(`API đang chạy cổng ${port}`);
});
