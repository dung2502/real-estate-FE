import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  Square3Stack3DIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import apiService from '../services/api';
import { Property, PropertyImage } from '../types';
import DeleteConfirmModal from './DeleteConfirmModal';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: property, isLoading: isLoadingProperty, error: propertyError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => apiService.getProperty(Number(id)),
  });

  const { data: imagesData, isLoading: isLoadingImages, error: imagesError } = useQuery({
    queryKey: ['property-images', id],
    queryFn: () => apiService.getPropertyImages(Number(id)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiService.deleteProperty(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property-images', id] });
      navigate('/properties');
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number) => {
    return `${area}m²`;
  };

  const getPropertyTypeText = (type: string) => {
    switch (type) {
      case 'apartment':
        return 'Căn hộ';
      case 'house':
        return 'Nhà phố';
      case 'villa':
        return 'Biệt thự';
      case 'office':
        return 'Văn phòng';
      case 'land':
        return 'Đất nền';
      default:
        return type;
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment':
        return '🏢';
      case 'house':
        return '🏠';
      case 'villa':
        return '🏰';
      case 'office':
        return '🏢';
      case 'land':
        return '🌱';
      default:
        return '🏠';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Có sẵn';
      case 'sold':
        return 'Đã bán';
      case 'rented':
        return 'Đã cho thuê';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  if (isLoadingProperty || isLoadingImages) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (propertyError || imagesError || !property) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Không thể tải thông tin bất động sản</div>
        <div className="text-sm text-gray-600 mt-2">
          {propertyError instanceof Error ? propertyError.message : 
           imagesError instanceof Error ? imagesError.message : 
           'Không thể kết nối đến server'}
        </div>
        <button
          onClick={() => navigate('/properties')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    setShowDeleteModal(false);
    deleteMutation.mutate();
  };

  // Get images from the separate API response
  const images = imagesData?.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <span className="text-sm text-gray-600">
                {property.district}, {property.city}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getPropertyTypeIcon(property.property_type)} {getPropertyTypeText(property.property_type)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              to={`/properties/${property.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Xóa
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          {hasImages ? (
            <div className="mb-8">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                <img
                  src={images[selectedImageIndex]?.image_path}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 bg-gray-200 rounded-lg overflow-hidden ${
                        index === selectedImageIndex ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      <img
                        src={image.image_path}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                        }}
                      />
                      {image.is_primary && (
                        <div className="absolute top-1 left-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary-600 text-white">
                            Chính
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-8">
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-4">📷</div>
                  <p className="text-gray-500">Không có hình ảnh</p>
                </div>
              </div>
            </div>
          )}

          {/* Property Information */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin chi tiết</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Giá</p>
                  <p className="text-lg font-semibold text-green-600">{formatPrice(property.price)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Square3Stack3DIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Diện tích</p>
                  <p className="text-lg font-semibold text-gray-900">{formatArea(property.area)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Thành phố</p>
                  <p className="text-lg font-semibold text-gray-900">{property.city}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Quận/Huyện</p>
                  <p className="text-lg font-semibold text-gray-900">{property.district}</p>
                </div>
              </div>

              {property.bedrooms && property.bedrooms > 0 && (
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-blue-100 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">🛏️</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phòng ngủ</p>
                    <p className="text-lg font-semibold text-gray-900">{property.bedrooms}</p>
                  </div>
                </div>
              )}

              {property.bathrooms && property.bathrooms > 0 && (
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-blue-100 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">🚿</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phòng tắm</p>
                    <p className="text-lg font-semibold text-gray-900">{property.bathrooms}</p>
                  </div>
                </div>
              )}

              {property.floors && property.floors > 1 && (
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-blue-100 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">🏢</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Số tầng</p>
                    <p className="text-lg font-semibold text-gray-900">{property.floors}</p>
                  </div>
                </div>
              )}

              {property.year_built && (
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-blue-100 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">🏗️</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Năm xây dựng</p>
                    <p className="text-lg font-semibold text-gray-900">{property.year_built}</p>
                  </div>
                </div>
              )}

              {property.postal_code && (
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-blue-100 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">📮</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mã bưu điện</p>
                    <p className="text-lg font-semibold text-gray-900">{property.postal_code}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Address */}
            {property.address && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Địa chỉ</h3>
                <p className="text-gray-600">{property.address}</p>
              </div>
            )}

            {/* Status */}
            <div className="mt-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                {getStatusText(property.status)}
              </span>
            </div>

            {/* Description */}
            {property.description && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mô tả</h3>
                <p className="text-gray-600">{property.description}</p>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tiện ích</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Thông tin liên hệ</h3>
              <div className="space-y-2">
                {property.contact_name && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tên:</span> {property.contact_name}
                  </p>
                )}
                {property.contact_phone && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Điện thoại:</span> {property.contact_phone}
                  </p>
                )}
                {property.contact_email && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {property.contact_email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6 sticky top-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin tóm tắt</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Giá</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(property.price)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Loại bất động sản</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getPropertyTypeIcon(property.property_type)} {getPropertyTypeText(property.property_type)}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {getStatusText(property.status)}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Diện tích</p>
                <p className="text-lg font-semibold text-gray-900">{formatArea(property.area)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Vị trí</p>
                <p className="text-sm text-gray-900">{property.district}, {property.city}</p>
              </div>

              {property.address && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                  <p className="text-sm text-gray-900">{property.address}</p>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to={`/properties/${property.id}/edit`}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Xóa bất động sản
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xóa bất động sản"
        message={`Bạn có chắc chắn muốn xóa "${property.title}"? Hành động này không thể hoàn tác.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default PropertyDetail;
