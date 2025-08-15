import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import apiService from '../services/api';
import { Property, PropertyFilters, PaginatedResponse } from '../types';
import PropertyCard from './PropertyCard';
import PropertyFiltersForm from './PropertyFiltersForm';

const PropertyList: React.FC = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    per_page: 2,
    sort: 'created_at',
    order: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = useQuery<PaginatedResponse<Property>>({
    queryKey: ['properties', filters],
    queryFn: () => apiService.getProperties(filters),
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setFilters(prev => ({ ...prev, page: 1 }));
    }
    refetch();
  };

  const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSort = (sort: string) => {
    setFilters(prev => ({
      ...prev,
      sort,
      order: prev.sort === sort && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Có lỗi xảy ra khi tải dữ liệu</div>
        <div className="text-sm text-gray-600 mt-2">
          {error instanceof Error ? error.message : 'Không thể kết nối đến server'}
        </div>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh sách bất động sản</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và xem tất cả bất động sản trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/properties/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm mới
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Tìm kiếm bất động sản..."
                />
              </div>
              <button
                type="submit"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
            </button>
          </div>

          {showFilters && (
            <PropertyFiltersForm
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
      </div>

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.data.map((property: Property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {data.meta.last_page > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {((data.meta.current_page - 1) * data.meta.per_page) + 1} đến{' '}
                {Math.min(data.meta.current_page * data.meta.per_page, data.meta.total)} trong tổng số{' '}
                {data.meta.total} kết quả
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(data.meta.current_page - 1)}
                  disabled={data.meta.current_page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(5, data.meta.last_page) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border text-sm font-medium rounded-md ${
                        page === data.meta.current_page
                          ? 'border-primary-500 text-primary-600 bg-primary-50'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(data.meta.current_page + 1)}
                  disabled={data.meta.current_page === data.meta.last_page}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Không tìm thấy bất động sản nào</div>
          <Link
            to="/properties/create"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm bất động sản đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
