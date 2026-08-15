# HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH HỆ THỐNG TOUR BOOKING SYSTEM

Tài liệu này hướng dẫn chi tiết từng bước cài đặt và vận hành toàn bộ hệ thống **Tour Booking System** từ mã nguồn trên máy tính local với các giá trị cấu hình `.env` chính xác 100% từ dự án thực tế.

Hệ thống bao gồm 3 phân hệ chính:
1. **Frontend**: ReactJS (Vite + TailwindCSS) - Chạy tại cổng `5173`
2. **Backend Node.js**: Express.js API (Auth, Booking, VNPay, Mail, Cron) - Chạy tại cổng `3000`
3. **Backend Java**: Spring Boot API (Admin Service, JPA, Cloudinary) - Chạy tại cổng `8080`
4. **Cơ sở dữ liệu**: TiDB Cloud MySQL (Đã cấu hình sẵn kết nối trực tiếp)

---

## 📋 1. ĐIỀU KIỆN TIÊN QUYẾT (SYSTEM REQUIREMENTS)

Trước khi tiến hành cài đặt, máy tính cần được trang bị sẵn:

- **Node.js**: Phiên bản 18.x trở lên (Khuyên dùng v20.x LTS) & **npm** (v9+). [Tải tại nodejs.org](https://nodejs.org)
- **Java Development Kit (JDK)**: Java 17 hoặc Java 21 (Bắt buộc cho module Backend Java Spring Boot).

---

## 📁 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
tour-booking-system/
├── frontend/
│   └── react-app/        # Giao diện người dùng & Admin (React + Vite)
├── backend/
│   ├── nodejs/           # API Node.js Express (Auth, VNPay, Mail, Booking)
│   └── java/             # API Java Spring Boot (Admin Service, JPA)
├── README.md
└── HUONG_DAN_CAI_DAT.md  # File hướng dẫn cài đặt này
```

---

## 🚀 3. HƯỚNG DẪN CÀI ĐẶT CHI TIẾT THỰC TẾ

### 📂 Bước 1: Giải nén / Mở mã nguồn dự án
Giải nén file `.zip` (hoặc `git clone`) dự án vào thư mục mong muốn trên máy tính.

---

### 🟢 Bước 2: Cài đặt & Khởi chạy Backend Node.js

1. Mở cửa sổ **Terminal (PowerShell / CMD)** thứ nhất, chuyển vào thư mục Node.js:
   ```bash
   cd backend/nodejs
   ```

2. Cài đặt các gói thư viện Node.js:
   ```bash
   npm install
   ```

3. Tạo file cấu hình môi trường `.env`:
   - Tạo một file tên là `.env` trong thư mục `backend/nodejs/` và dán đúng nội dung cấu hình thực tế dưới đây:

   ```env
   PORT=3000
   DB_URL='mysql://4DVw32izV1v7FKS.root:ODpAJ6g7j6r8oSTp@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/BookingTour?ssl={"rejectUnauthorized":true}'

   URL_FE_1=http://localhost:5173
   URL_FE_2=http://localhost:5174

   JWT_SECRET=c84f196d18fb806aac84c261429b579e95def54a15f36ce21b31775ef56992df
   JWT_EXPIRES_IN=7d

   GOOGLE_CLIENT_ID=93753223175-1igelpig58robnqbv4ge6v57iklfenqm.apps.googleusercontent.com

   VNP_TMN_CODE=2L621I96
   VNP_HASH_SECRET=TOPDWQEHBVRPQYSICKUFZDHDSWYFFUSN
   VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
   VNP_RETURN_URL=https://dill-blurt-dedicate.ngrok-free.dev/api/payments/vnpay_return
   VNP_IPN_URL=https://dill-blurt-dedicate.ngrok-free.dev/api/payments/vnpay_ipn
   CLIENT_VNPAY_RETURN_URL=http://localhost:5173/payment/vnpay-return

   EMAIL_USER=linhphanzzz04@gmail.com
   EMAIL_PASSWORD=bryc zswm puom ewrz
   ```

4. Khởi chạy máy chủ Backend Node.js:
   ```bash
   npm run dev
   ```
   👉 *Backend Node.js sẽ khởi chạy tại địa chỉ:* **`http://localhost:3000`**

---

### ☕ Bước 3: Cài đặt & Khởi chạy Backend Java (Spring Boot)

1. Mở cửa sổ **Terminal** thứ hai, chuyển vào thư mục Java:
   ```bash
   cd backend/java
   ```

2. File cấu hình `src/main/resources/application.yaml` đã được thiết lập kết nối TiDB Cloud sẵn như sau:
   ```yaml
   spring:
     application:
       name: booking-admin
     datasource:
       url: jdbc:mysql://gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/BookingTour?sslMode=VERIFY_IDENTITY&tlsVersions=TLSv1.2,TLSv1.3
       username: 4DVw32izV1v7FKS.root
       password: ODpAJ6g7j6r8oSTp
       driver-class-name: com.mysql.cj.jdbc.Driver
   server:
     port: 8080
   ```

3. Khởi chạy ứng dụng Java Spring Boot:
   - **Trên Windows (CMD / PowerShell)**:
     ```cmd
     .\mvnw.cmd spring-boot:run
     ```
   - **Trên Linux / macOS**:
     ```bash
     ./mvnw spring-boot:run
     ```
   👉 *Backend Java sẽ khởi chạy tại địa chỉ:* **`http://localhost:8080`**

---

### 💻 Bước 4: Cài đặt & Khởi chạy Frontend React App

1. Mở cửa sổ **Terminal** thứ ba, chuyển vào thư mục Frontend:
   ```bash
   cd frontend/react-app
   ```

2. Cài đặt các thư viện cho Frontend:
   ```bash
   npm install
   ```

3. Tạo file cấu hình môi trường `.env` trong thư mục `frontend/react-app/`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=93753223175-1igelpig58robnqbv4ge6v57iklfenqm.apps.googleusercontent.com
   ```

4. Khởi chạy giao diện người dùng:
   ```bash
   npm run dev
   ```
   👉 *Frontend sẽ khởi chạy tại địa chỉ:* **`http://localhost:5173`**

---

### 🌐 Bước 5: Truy cập ứng dụng
Mở trình duyệt web và truy cập vào địa chỉ:
👉 **`http://localhost:5173`**

---

## 🔧 4. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

| Sự cố | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **Lỗi Port bị trùng (3000 / 8080 / 5173)** | Đã có ứng dụng khác đang chiếm cổng | Đổi `PORT` trong `.env` của Node.js, `server.port` trong `application.yaml` của Java, hoặc tắt ứng dụng cũ đang chạy. |
| **Lỗi Java Version (UnsupportedClassVersionError)** | Máy cài bản JDK thấp hơn 17 | Tải và cài đặt JDK 17 hoặc JDK 21, cập nhật lại biến môi trường `JAVA_HOME`. |
| **Lỗi CORS Policy** | Frontend gọi API bị chặn CORS | Kiểm tra biến `URL_FE_1` trong `.env` của `backend/nodejs` phải là `http://localhost:5173`. |
| **Lỗi Kết nối Cơ sở dữ liệu (TiDB Cloud)** | Cần mạng Internet | Đảm bảo máy tính có kết nối mạng Internet ổn định để truy vấn CSDL TiDB Cloud. |
