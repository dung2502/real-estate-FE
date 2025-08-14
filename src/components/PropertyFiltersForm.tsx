import React from 'react';
import { PropertyFilters } from '../types';

interface PropertyFiltersFormProps {
  filters: PropertyFilters;
  onFilterChange: (filters: Partial<PropertyFilters>) => void;
}

const PropertyFiltersForm: React.FC<PropertyFiltersFormProps> = ({ filters, onFilterChange }) => {
  const cities = [
    'Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng',
    'Nha Trang',
    'Vũng Tàu',
    'Đà Lạt',
  ];

  const statuses = [
    { value: 'available', label: 'Có sẵn' },
    { value: 'sold', label: 'Đã bán' },
    { value: 'rented', label: 'Đã cho thuê' },
    { value: 'pending', label: 'Chờ xử lý' },
  ];

  const sortOptions = [
    { value: 'price', label: 'Giá' },
    { value: 'area', label: 'Diện tích' },
    { value: 'created_at', label: 'Ngày tạo' },
    { value: 'updated_at', label: 'Ngày cập nhật' },
  ];

  const handleInputChange = (field: keyof PropertyFilters, value: any) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      city: undefined,
      status: undefined,
      min_price: undefined,
      max_price: undefined,
      sort: 'created_at',
      order: 'desc',
    });
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Thành phố
          </label>
          <select
            id="city"
            value={filters.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value || undefined)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">Tất cả thành phố</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            id="status"
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value || undefined)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price Filter */}
        <div>
          <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
            Giá tối thiểu (VNĐ)
          </label>
          <input
            type="number"
            id="min_price"
            value={filters.min_price || ''}
            onChange={(e) => handleInputChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        {/* Max Price Filter */}
        <div>
          <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
            Giá tối đa (VNĐ)
          </label>
          <input
            type="number"
            id="max_price"
            value={filters.max_price || ''}
            onChange={(e) => handleInputChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Không giới hạn"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Sort Options */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sắp xếp theo
          </label>
          <select
            id="sort"
            value={filters.sort || 'created_at'}
            onChange={(e) => handleInputChange('sort', e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
            Thứ tự
          </label>
          <select
            id="order"
            value={filters.order || 'desc'}
            onChange={(e) => handleInputChange('order', e.target.value as 'asc' | 'desc')}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default PropertyFiltersForm;
