# Bước 1: Build ứng dụng bằng Maven
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# Copy file cấu hình maven và source code vào
COPY pom.xml .
COPY src ./src
# Build ra file .jar (bỏ qua chạy test để build nhanh hơn)
RUN mvn clean package -DskipTests

# Bước 2: Chạy ứng dụng với JRE nhẹ (chỉ tốn khoảng ~100MB)
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
# Copy file .jar đã build thành công từ Bước 1 sang Bước 2
COPY --from=build /app/target/*.jar app.jar

# Mở cổng 8080 (cổng mặc định của Spring Boot)
EXPOSE 8080
# Lệnh khởi chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]