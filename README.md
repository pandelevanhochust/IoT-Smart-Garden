# IoT Smart Garden

## Dự án Backend khu vườn IoT thông minh

## Thiết bị IoT: ESP32 + cảm biến + MQTT

## Lệnh chạy

chạy lệnh 

```bash
npm run install
npm run build
npm run start
```

## Cấu hình biến .env

```typescript
DATABASE_URL="postgresql://postgres:12345@localhost:5432/postgres?schema=public"
PORT = 3000
SECRET = "LVT"
JWT_EXPIRES_IN=1d

MQTT_URL="mqtt://broker.hivemq.com:1883"
MQTT_USERNAME=""
MQTT_PASSWORD=""
```

## Clone 
```
cd existing_repo
git remote add origin https://gitlab.yootek.com.vn:60009/pandelevan/nestjs-internship.git
git branch -M main
git push -uf origin main
```

## APIs
### Gardens

- `POST /gardens`  
  Tạo mới một khu vườn (chỉ dành cho User sở hữu hoặc Admin).

- `GET /gardens`  
  Lấy danh sách các khu vườn (User chỉ xem được vườn của mình, Admin xem được tất cả).

- `GET /gardens/:id`  
  Lấy thông tin chi tiết của một khu vườn.

- `PUT /gardens/:id`  
  Cập nhật thông tin khu vườn.

- `DELETE /gardens/:id`  
  Xóa một khu vườn.

---

### Vegetables

- `POST /vegetables`  
  Thêm loại rau mới vào hệ thống.

- `GET /vegetables`  
  Lấy danh sách các loại rau hiện có.

- `PUT /vegetables/:id`  
  Cập nhật thông tin loại rau (bao gồm số lượng nhập/bán).

- `POST /vegetables/:id/price`  
  Thêm giá mới cho loại rau.

- `PUT /vegetables/:id/price`  
  Cập nhật giá của loại rau.

- `DELETE /vegetables/:id/price`  
  Xóa giá của loại rau.

- `GET /vegetables/:id/price`  
  Lấy thông tin giá của loại rau.

---

### Sale

- `POST /sales`  
  Ghi nhận một giao dịch bán rau.

- `GET /sales`  
  Lấy danh sách các giao dịch bán rau.

- `GET /sales/:id`  
  Lấy chi tiết một giao dịch bán rau.

- `PUT /sales/:id`  
  Cập nhật thông tin giao dịch bán rau.

- `DELETE /sales/:id`  
  Xóa một giao dịch bán rau.

---

### Price

- `GET /prices `
  Lấy danh sách giá rau theo ngày, tuần hoặc tháng.
---

### Sensor (Cảm biến)

- `GET /sensors/:gardenId?from=YYYY-MM-DD&to=YYYY-MM-DD`  
  Lấy lịch sử dữ liệu cảm biến của khu vườn trong khoảng thời gian chỉ định.

- `POST /sensors/:gardenId/led`  
  Điều khiển trạng thái đèn của khu vườn qua MQTT.  
  **Body ví dụ:**  
  ```json
  {
    "led1State": "On",
    "led2State": "Off",
    "led3State": "On"
  }
  ```

---

### Authentication

- `POST /auth/login`  
  Đăng nhập với email và password.

- `POST /auth/register`  
  Đăng ký tài khoản mới.

---

## MQTT
Hiện tại đang có hai phiên bản MQTTService
- mqtt.service.ts sử dụng https://console.hivemq.cloud/ cần có credential để subscribe tới broker

- mqtt2.service.ts sử dụng MQTTBox để subscribe tới broker, hiện đang được sử dụng

- Dữ liệu từ cảm biến đi kèm với topic humidity và temperature
```json
{
  "value": 90,
  "gardenId": 1,
  "recordedAt": "2025-08-26T12:00:00Z" //Optional
}
```

-Dữ liệu điều khiển led của khu vườn với topic led và leds
```json
{
    "gardenId": 1,
    "led1State": "On",
    "led2State": "Off",
    "led3State": "On",
    "recordedAt": "2025-08-27T12:05:00.000Z"  //Optional
}
```

MQTT Service có hàm publish tuy nhiên không được sử dụng để tránh lỗi Dependency với SensorService

## Swagger
