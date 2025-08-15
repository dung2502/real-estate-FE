# 🏠 Real Estate Management System - Frontend

Hệ thống quản lý bất động sản với frontend React + TypeScript và backend Laravel API.

## ✨ Tính năng chính

- 🔐 **Xác thực người dùng** với JWT token
- 📋 **Quản lý bất động sản** (CRUD operations)
- 🔍 **Tìm kiếm và lọc** nâng cao
- 📱 **Giao diện responsive** với Tailwind CSS
- 🖼️ **Upload và quản lý ảnh** với preview
- 📊 **Phân trang và sắp xếp** dữ liệu
- 🎯 **Form validation** với Yup schema

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Routing
- **TanStack React Query** - State management
- **React Hook Form** - Form handling
- **Yup** - Schema validation
- **Axios** - HTTP client
- **Headless UI** - Accessible components
- **Heroicons** - Icon library

### Backend
- **Laravel 10** - PHP framework
- **Sanctum** - API authentication
- **MySQL/PostgreSQL** - Database
- **File Storage** - Image management

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm 9+ 
- TypeScript 4.9.7
- Laravel backend chạy trên `http://localhost:8000`

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd real-estate-fe
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường
Tạo file `.env` trong thư mục gốc:
```env
REACT_APP_API_URL=http://localhost:8000
```

### Bước 4: Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 🔧 Cấu hình Backend

### Yêu cầu Laravel Backend
- Laravel 10+
- Sanctum package
- Database với bảng `properties`, `property_images`, `users`
- API endpoints theo cấu trúc đã định nghĩa

### API Endpoints
```
POST   /api/login                    - Đăng nhập
POST   /api/logout                   - Đăng xuất
GET    /api/properties               - Danh sách bất động sản
GET    /api/properties/{id}          - Chi tiết bất động sản
POST   /api/properties               - Tạo bất động sản mới
PUT    /api/properties/{id}          - Cập nhật bất động sản
DELETE /api/properties/{id}          - Xóa bất động sản
POST   /api/properties/{id}/restore  - Khôi phục bất động sản
POST   /api/properties/{id}/images   - Upload ảnh
DELETE /api/properties/{id}/images/{imageId} - Xóa ảnh
```

## 📁 Cấu trúc dự án

```
src/
├── components/           # React components
│   ├── Layout.tsx       # Layout chính
│   ├── LoginForm.tsx    # Form đăng nhập
│   ├── PropertyList.tsx # Danh sách bất động sản
│   ├── PropertyCard.tsx # Card hiển thị property
│   ├── PropertyDetail.tsx # Chi tiết property
│   ├── PropertyForm.tsx # Form tạo/sửa property
│   ├── PropertyFiltersForm.tsx # Form bộ lọc
│   └── DeleteConfirmModal.tsx # Modal xác nhận xóa
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Context xác thực
├── services/            # API services
│   └── api.ts          # API client
├── types/               # TypeScript types
│   └── index.ts        # Interface definitions
├── App.tsx             # Component chính
└── index.tsx           # Entry point
```

## 🔐 Xác thực

### Đăng nhập
1. Truy cập `/login`
2. Nhập email và password
3. Hệ thống sẽ lưu JWT token vào localStorage
4. Chuyển hướng đến trang danh sách bất động sản

### Bảo mật
- JWT token được tự động thêm vào header của mọi API request
- Token hết hạn sẽ tự động logout và chuyển về trang login
- Protected routes chỉ cho phép user đã đăng nhập

## 📱 Giao diện người dùng

### Trang chủ (`/`)
- Dashboard với quick actions
- Navigation menu
- Responsive design

### Danh sách bất động sản (`/properties`)
- Grid layout hiển thị properties
- Tìm kiếm theo tiêu đề
- Bộ lọc: thành phố, trạng thái, giá, diện tích
- Sắp xếp: giá, diện tích, ngày tạo
- Phân trang với navigation

### Chi tiết bất động sản (`/properties/{id}`)
- Thông tin chi tiết đầy đủ
- Gallery ảnh với thumbnail
- Thông tin liên hệ
- Actions: Edit, Delete

### Tạo/Chỉnh sửa (`/properties/create`, `/properties/{id}/edit`)
- Form validation với Yup
- Upload nhiều ảnh với preview
- Quản lý tiện ích (features)
- Responsive form layout

## 🎨 Styling và UI

### Tailwind CSS
- Custom color scheme với primary colors
- Responsive breakpoints
- Component-based styling
- Dark mode ready

### Components
- **PropertyCard**: Card hiển thị property với hover effects
- **Modal**: Delete confirmation với Headless UI
- **Forms**: Validation states, error messages
- **Navigation**: Responsive navbar với mobile menu

## 🔄 State Management

### React Query (TanStack Query)
- Server state management
- Automatic caching và invalidation
- Optimistic updates
- Error handling

### Local State
- Form state với React Hook Form
- UI state (modals, filters, pagination)
- Authentication state

## 📊 API Integration

### Axios Configuration
- Base URL: `http://localhost:8000/api`
- Automatic token injection
- Error handling và retry logic
- Request/response interceptors

### Data Flow
1. User action → React component
2. Component → React Query mutation/query
3. React Query → API service
4. API service → Laravel backend
5. Response → Component update

**Made with ❤️ by Dung2502**
