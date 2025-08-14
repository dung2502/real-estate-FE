import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  Square3Stack3DIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Property, PropertyImage } from '../types';
import apiService from '../services/api';
import { useQuery } from '@tanstack/react-query';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Fetch images for this property using the separate API
  const { data: imagesData } = useQuery({
    queryKey: ['property-images', property.id],
    queryFn: () => apiService.getPropertyImages(property.id),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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

  // Get images from the API response
  const images = imagesData?.images || [];
  const primaryImage = images.find((img: PropertyImage) => img.is_primary) || images[0];

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
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-4xl mb-2">📷</div>
              <p className="text-gray-500 text-sm">Không có ảnh</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(property.status)}`}>
            {getStatusText(property.status)}
          </span>
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
            {getPropertyTypeText(property.property_type)}
          </span>
        </div>

        {/* Image Count Badge */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black bg-opacity-75 text-white">
              +{images.length - 1} ảnh
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          <MapPinIcon className="inline h-4 w-4 mr-1" />
          {property.district}, {property.city}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-green-600">
            <CurrencyDollarIcon className="h-5 w-5 mr-1" />
            <span className="font-semibold">{formatPrice(property.price)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Square3Stack3DIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">{formatArea(property.area)}</span>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          {property.bedrooms && property.bedrooms > 0 && (
            <span>🛏️ {property.bedrooms} phòng ngủ</span>
          )}
          {property.bathrooms && property.bathrooms > 0 && (
            <span>🚿 {property.bathrooms} phòng tắm</span>
          )}
          {property.floors && property.floors > 1 && (
            <span>🏢 {property.floors} tầng</span>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/properties/${property.id}`}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          <EyeIcon className="h-4 w-4 mr-2" />
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
