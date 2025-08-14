import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, CurrencyDollarIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
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

  const primaryImage = property.images.find(img => img.is_primary) || property.images[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {primaryImage ? (
          <img
            src={primaryImage.image_path}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Square3Stack3DIcon className="h-16 w-16" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {getStatusText(property.status)}
          </span>
        </div>

        {/* Image Count Badge */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black bg-opacity-75 text-white">
              +{property.images.length - 1} ảnh
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Price */}
        <div className="flex items-center mb-3">
          <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-1" />
          <span className="text-xl font-bold text-green-600">
            {formatPrice(property.price)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center mb-3 text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {property.district}, {property.city}
          </span>
        </div>

        {/* Area */}
        <div className="flex items-center mb-4 text-gray-600">
          <Square3Stack3DIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {formatArea(property.area)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`/properties/${property.id}`}
            className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
          >
            Xem chi tiết
          </Link>
          <Link
            to={`/properties/${property.id}/edit`}
            className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
          >
            Chỉnh sửa
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
