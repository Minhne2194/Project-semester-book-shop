# **📚 Book Shop E-commerce Project**

Một hệ thống thương mại điện tử bán sách trực tuyến (lấy cảm hứng từ Tiki), được xây dựng trên nền tảng **MERN Stack** (MongoDB, Express, React, Node.js) và tích hợp **Docker** để triển khai dễ dàng.

## **🌟 Tính năng chính**

### **👤 Người dùng (User)**

* Xem danh sách sách với giao diện trực quan.  
* Tìm kiếm và lọc sách theo nhiều tiêu chí.  
* Xem chi tiết thông tin sách (mô tả, giá, tác giả...).  
* Thêm sách vào giỏ hàng và quản lý giỏ hàng.  
* Đặt hàng trực tuyến.

### **🛡️ Quản trị viên (Admin)**

* Dashboard quản lý tổng quan.  
* Quản lý sản phẩm (Thêm, sửa, xóa sách).  
* Quản lý đơn hàng và trạng thái vận chuyển.  
* Quản lý người dùng hệ thống.

### **🔥 Công nghệ nổi bật & Điểm nhấn**

* **🤖 AI Integration:** Tích hợp **Google GenAI** (@google/genai) để tự động gợi ý nội dung hoặc tóm tắt sách thông minh.  
* **☁️ Image Cloud:** Upload và quản lý ảnh bìa sách tối ưu trên **Cloudinary**.  
* **🕷️ Data Seeding:** Hệ thống Script tự động cào (crawl) dữ liệu sách thật từ **OpenLibrary**, giúp database luôn phong phú ngay từ đầu.  
* **🐳 Containerization:** Đóng gói toàn bộ ứng dụng (Frontend, Backend, Database) bằng **Docker & Docker Compose**, chạy chỉ với 1 lệnh.

## **🛠 Tech Stack**

### **Client (Frontend)**

* **Core:** React 19, Redux Toolkit (Quản lý State mạnh mẽ).  
* **UI/UX:** Bootstrap 5, React Bootstrap.  
* **Icons:** Lucide React.  
* **Integrations:** Axios (API request), Google GenAI SDK.

### **Server (Backend)**

* **Runtime:** Node.js.  
* **Framework:** Express.js.  
* **Database:** MongoDB, Mongoose ODM.  
* **Authentication:** JWT (JSON Web Token), BcryptJS (Mã hóa mật khẩu).  
* **Storage:** Cloudinary (Lưu trữ hình ảnh).

## **🚀 Cài đặt và Chạy ứng dụng**

Bạn có 2 cách để chạy dự án này: **Sử dụng Docker** (Khuyên dùng) hoặc **Chạy thủ công** (Manual).

### **📜 Cấu hình biến môi trường (.env)**

Trước khi chạy, hãy đảm bảo bạn đã tạo file .env trong thư mục server/.

\# File: server/.env

NODE\_ENV=development  
PORT=5000  
\# Nếu chạy thủ công (Manual)  
MONGO\_URI=mongodb://localhost:27017/BookShopDB  
\# Nếu chạy bằng Docker  
\# MONGO\_URI=mongodb://mongo:27017/BookShopDB

\# Cloudinary Config (Thay bằng key của bạn để upload ảnh)  
CLOUDINARY\_CLOUD\_NAME=your\_cloud\_name  
CLOUDINARY\_API\_KEY=your\_api\_key  
CLOUDINARY\_API\_SECRET=your\_api\_secret

\# JWT Secret (Chuỗi bí mật để ký token)  
JWT\_SECRET=your\_super\_secret\_key

### **🐳 Cách 1: Chạy bằng Docker (Khuyên dùng)**

**Yêu cầu:** Đã cài đặt Docker và Docker Desktop.

1. Tại thư mục gốc của dự án, chạy lệnh:  
   docker-compose up \--build

   *(Thêm cờ \-d nếu muốn chạy ngầm: docker-compose up \--build \-d)*  
2. Truy cập ứng dụng:  
   * **Web Client:** [http://localhost:80](https://www.google.com/search?q=http://localhost:80)  
   * **Server API:** [http://localhost:5000](https://www.google.com/search?q=http://localhost:5000)  
   * **Mongo Express (Quản lý DB):** [http://localhost:8081](https://www.google.com/search?q=http://localhost:8081)

### **💻 Cách 2: Chạy thủ công (Local Development)**

#### **1\. Backend Setup**

Mở terminal tại thư mục gốc:

cd server  
npm install

\# Import dữ liệu mẫu (Seeding Data) \- Quan trọng để có dữ liệu ban đầu  
npm run data:import

\# Chạy server (Development mode)  
npm run dev

👉 Server sẽ chạy tại: [http://localhost:5000](https://www.google.com/search?q=http://localhost:5000)

#### **2\. Frontend Setup**

Mở một terminal mới:

cd client  
npm install

\# Chạy React App  
npm start

👉 Client sẽ chạy tại: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

## **📂 Data Seeding & Scripts**

Backend đã tích hợp sẵn các script mạnh mẽ để nạp dữ liệu sách tự động từ OpenLibrary. Các lệnh chạy trong thư mục server/:

| Lệnh Script | Mô tả |
| :---- | :---- |
| npm run data:import | Nạp dữ liệu mẫu ban đầu vào Database. |
| npm run data:destroy | ⚠️ Xóa toàn bộ dữ liệu trong Database. |
| npm run get:openlib:finance | Lấy 20 cuốn sách chủ đề **Tài chính** từ OpenLibrary. |
| npm run get:openlib:scifi | Lấy 20 cuốn sách **Khoa học viễn tưởng**. |
| npm run get:random5:100 | Lấy ngẫu nhiên sách đa dạng thể loại. |

## **📁 Cấu trúc dự án**

├── client/                 \# Source code Frontend (React)  
│   ├── public/             \# Static assets  
│   ├── src/                \# Components, Redux slices, Pages  
│   ├── Dockerfile          \# Cấu hình Docker cho Client  
│   └── package.json  
├── server/                 \# Source code Backend (Node/Express)  
│   ├── config/             \# Cấu hình DB, Cloudinary  
│   ├── controllers/        \# Xử lý logic nghiệp vụ  
│   ├── models/             \# Mongoose Schemas (User, Product, Order)  
│   ├── routes/             \# API Endpoints  
│   ├── scripts/            \# Scripts import data (OpenLibrary Crawler)  
│   ├── Dockerfile          \# Cấu hình Docker cho Server  
│   └── package.json  
├── docs/                   \# Tài liệu dự án chi tiết  
├── SRS-demo/               \# Tài liệu đặc tả yêu cầu & sơ đồ thiết kế  
├── docker-compose.yml      \# Orchestration cho Client, Server, Mongo, MongoExpress  
└── README.md               \# Hướng dẫn sử dụng

## **📝 Authors**

* **Minhne2194** \- *Initial work & Development*