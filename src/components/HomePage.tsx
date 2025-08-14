import React from 'react';
import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chào mừng đến với hệ thống quản lý bất động sản
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Quản lý hiệu quả danh sách bất động sản, theo dõi trạng thái và tối ưu hóa quy trình kinh doanh
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          to="/properties"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
        >
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-12 w-12 text-primary-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Xem danh sách</h3>
              <p className="text-gray-600">Quản lý tất cả bất động sản trong hệ thống</p>
            </div>
          </div>
        </Link>

        <Link
          to="/properties/create"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
        >
          <div className="flex items-center">
            <PlusIcon className="h-12 w-12 text-green-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Thêm mới</h3>
              <p className="text-gray-600">Tạo bất động sản mới vào hệ thống</p>
            </div>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <ChartBarIcon className="h-12 w-12 text-blue-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Thống kê</h3>
              <p className="text-gray-600">Xem báo cáo và phân tích dữ liệu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Tính năng chính
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quản lý bất động sản</h3>
            <p className="text-sm text-gray-600">Thêm, sửa, xóa và quản lý thông tin bất động sản</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tìm kiếm & Lọc</h3>
            <p className="text-sm text-gray-600">Tìm kiếm nhanh chóng với bộ lọc đa tiêu chí</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <PlusIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload ảnh</h3>
            <p className="text-sm text-gray-600">Quản lý gallery ảnh cho từng bất động sản</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phân trang</h3>
            <p className="text-sm text-gray-600">Hiển thị dữ liệu theo trang với navigation dễ dàng</p>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bắt đầu ngay hôm nay
        </h2>
        <p className="text-gray-600 mb-6">
          Khám phá các tính năng mạnh mẽ của hệ thống quản lý bất động sản
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Xem danh sách bất động sản
          <BuildingOfficeIcon className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
