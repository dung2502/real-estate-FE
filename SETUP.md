# 🚀 Hướng dẫn Setup và Chạy Ứng dụng Real Estate Frontend

## 📋 Yêu cầu hệ thống

- **Node.js**: Version 16.0.0 trở lên
- **npm**: Version 8.0.0 trở lên
- **Backend Laravel**: Đang chạy trên http://localhost:8000

## 🛠️ Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Tạo file môi trường
Tạo file `.env` trong thư mục gốc với nội dung:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
REACT_APP_ENABLE_LOGGING=true
REACT_APP_ENABLE_ANALYTICS=false
```

### 3. Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## 🔧 Troubleshooting

### Lỗi PowerShell Execution Policy
Nếu gặp lỗi PowerShell, hãy chạy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Lỗi TypeScript
Nếu gặp lỗi TypeScript, hãy:
1. Xóa thư mục `node_modules`
2. Xóa file `package-lock.json`
3. Chạy lại `npm install`

### Lỗi API Connection
Đảm bảo backend Laravel đang chạy và có thể truy cập tại http://localhost:8000

## 📱 Tính năng chính

- ✅ **Đăng nhập/Đăng xuất** với JWT token
- ✅ **Quản lý bất động sản** (CRUD)
- ✅ **Tìm kiếm và lọc** nâng cao
- ✅ **Upload ảnh** với preview
- ✅ **Responsive design** cho mọi thiết bị
- ✅ **Form validation** với Yup
- ✅ **State management** với React Query

## 🌐 API Endpoints

- `POST /api/login` - Đăng nhập
- `POST /api/logout` - Đăng xuất
- `GET /api/properties` - Danh sách bất động sản
- `POST /api/properties` - Tạo mới
- `GET /api/properties/{id}` - Chi tiết
- `PUT /api/properties/{id}` - Cập nhật
- `DELETE /api/properties/{id}` - Xóa

## 🎨 UI Components

- **LoginForm**: Form đăng nhập
- **PropertyList**: Danh sách bất động sản
- **PropertyForm**: Form tạo/sửa bất động sản
- **PropertyDetail**: Chi tiết bất động sản
- **PropertyCard**: Card hiển thị bất động sản
- **PropertyFiltersForm**: Form lọc và tìm kiếm
- **Layout**: Layout chính với navigation
- **HomePage**: Trang chủ dashboard

## 🔐 Authentication

- Sử dụng JWT token
- Token được lưu trong localStorage
- Auto-redirect khi token hết hạn
- Protected routes cho các trang cần đăng nhập

## 📊 State Management

- **React Query**: Quản lý server state
- **React Context**: Quản lý authentication state
- **React Hook Form**: Quản lý form state
- **Yup**: Schema validation

## 🎯 Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Heroicons
- **UI Components**: Headless UI
- **Form**: React Hook Form + Yup
- **State**: TanStack React Query

## 📁 Cấu trúc thư mục

```
src/
├── components/          # React components
├── contexts/           # React contexts
├── services/           # API services
├── types/              # TypeScript types
├── App.tsx            # Main app component
└── index.tsx          # Entry point
```

## 🚀 Deployment

### Build production
```bash
npm run build
```

### Serve production build
```bash
npx serve -s build
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console browser để xem lỗi JavaScript
2. Network tab để xem lỗi API
3. Terminal để xem lỗi build/compile
4. Đảm bảo backend Laravel đang chạy

---

**Happy Coding! 🎉**
