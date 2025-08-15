import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import apiService from '../services/api';
import { PropertyFormData, Property, PropertyImage } from '../types';

const schema = yup.object({
  title: yup.string().required('Tiêu đề là bắt buộc'),
  description: yup.string().optional(),
  property_type: yup.string().oneOf(['apartment', 'house', 'villa', 'office', 'land']).required('Loại bất động sản là bắt buộc'),
  status: yup.string().oneOf(['available', 'sold', 'rented', 'pending']).required('Trạng thái là bắt buộc'),
  price: yup.number().positive('Giá phải là số dương').required('Giá là bắt buộc'),
  area: yup.number().positive('Diện tích phải là số dương').required('Diện tích là bắt buộc'),
  bedrooms: yup.number().min(0, 'Số phòng ngủ không được âm').optional(),
  bathrooms: yup.number().min(0, 'Số phòng tắm không được âm').optional(),
  floors: yup.number().min(1, 'Số tầng phải từ 1 trở lên').optional(),
  address: yup.string().required('Địa chỉ là bắt buộc'),
  city: yup.string().required('Thành phố là bắt buộc'),
  district: yup.string().required('Quận/Huyện là bắt buộc'),
  postal_code: yup.string().optional(),
  latitude: yup.number().min(-90).max(90).optional(),
  longitude: yup.number().min(-180).max(180).optional(),
  year_built: yup.number().min(1900).max(new Date().getFullYear()).optional(),
  contact_name: yup.string().required('Tên liên hệ là bắt buộc'),
  contact_phone: yup.string().required('Số điện thoại liên hệ là bắt buộc'),
  contact_email: yup.string().email('Email không hợp lệ').optional(),
  features: yup.array().of(yup.string()).optional(),
  images: yup.array().of(yup.mixed<File>().test("fileSize", "Ảnh phải nhỏ hơn 10MB", file => {
    return !file || (file && file.size <= 10 * 1024 * 1024);
  })).optional()
}).required();

const PropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const { data: property, isLoading: isLoadingProperty } = useQuery({
    queryKey: ['property', id],
    queryFn: () => apiService.getProperty(Number(id)),
    enabled: isEditing,
  });

  const { data: existingImagesData } = useQuery({
    queryKey: ['property-images', id],
    queryFn: () => apiService.getPropertyImages(Number(id)),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      property_type: 'apartment',
      status: 'available',
      bedrooms: 1,
      bathrooms: 1,
      floors: 1,
      features: [],
    },
  });

  useEffect(() => {
    if (property) {
      setValue('title', property.title);
      setValue('description', property.description || '');
      setValue('property_type', property.property_type);
      setValue('status', property.status);
      setValue('price', property.price);
      setValue('area', property.area);
      setValue('bedrooms', property.bedrooms || 0);
      setValue('bathrooms', property.bathrooms || 0);
      setValue('floors', property.floors || 1);
      setValue('address', property.address);
      setValue('city', property.city);
      setValue('district', property.district);
      setValue('postal_code', property.postal_code || '');
      setValue('latitude', property.latitude || undefined);
      setValue('longitude', property.longitude || undefined);
      setValue('year_built', property.year_built || undefined);
      setValue('contact_name', property.contact_name);
      setValue('contact_phone', property.contact_phone);
      setValue('contact_email', property.contact_email || '');
      setFeatures(property.features || []);
    }
  }, [property, setValue]);
  useEffect(() => {
    if (existingImagesData && existingImagesData.images) {
      const previewUrls = existingImagesData.images.map(img => img.image_path);
      setImagePreviews(previewUrls);
    }
  }, [existingImagesData]);

  const createMutation = useMutation({
    mutationFn: (data: PropertyFormData) => apiService.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate('/properties');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<PropertyFormData>) => apiService.updateProperty(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['property-images', id] });
      navigate('/properties');
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

const deleteImageMutation = useMutation({
  mutationFn: ({ propertyId, imageId }: { propertyId: number; imageId: number }) => 
    apiService.deletePropertyImage(propertyId, imageId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['property-images', id] });
  },
});

const removeImage = async (index: number) => {
  if (isEditing && index < (existingImagesData?.images?.length || 0)) {
    const imageToDelete = existingImagesData?.images?.[index];
    if (imageToDelete) {
      try {
        await deleteImageMutation.mutateAsync({
          propertyId: Number(id),
          imageId: imageToDelete.id
        });
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting image:', error);
      
      }
    }
  } else {
    const adjustedIndex = isEditing ? index - (existingImagesData?.images?.length || 0) : index;
    setSelectedImages(prev => prev.filter((_, i) => i !== adjustedIndex));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }
};

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(prev => prev.filter(f => f !== feature));
  };

  const onSubmit = async (data: any) => {
    console.log('Form data before submission:', data);
    console.log('Features:', features);

    const formData: PropertyFormData = {
      ...data,
      features,
      images: selectedImages.length > 0 ? selectedImages : undefined,
    };

    console.log('Final form data:', formData);

    if (isEditing) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  if (isEditing && isLoadingProperty) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isEditing && !property) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Không thể tải dữ liệu bất động sản</div>
      </div>
    );
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Chỉnh sửa bất động sản' : 'Thêm bất động sản mới'}
          </h2>

          <form key={id || 'create'} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tiêu đề *
                  </label>
                  <input
                      {...register('title')}
                      type="text"
                      id="title"
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          errors.title ? 'border-red-300' : ''
                      }`}
                  />
                  {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">
                    Loại bất động sản *
                  </label>
                  <select
                      {...register('property_type')}
                      id="property_type"
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          errors.property_type ? 'border-red-300' : ''
                      }`}
                  >
                    <option value="apartment">Căn hộ</option>
                    <option value="house">Nhà phố</option>
                    <option value="villa">Biệt thự</option>
                    <option value="office">Văn phòng</option>
                    <option value="land">Đất nền</option>
                  </select>
                  {errors.property_type && (
                      <p className="mt-1 text-sm text-red-600">{errors.property_type.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Giá (VNĐ) *
                  </label>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                      id="price"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.price ? 'border-red-300' : ''
                    }`}
                        />
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                    Diện tích (m²) *
                  </label>
                  <input
                    {...register('area', { valueAsNumber: true })}
                      type="number"
                      id="area"
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          errors.area ? 'border-red-300' : ''
                      }`}
                  />
                  {errors.area && (
                      <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Trạng thái *
                  </label>
                  <select
                      {...register('status')}
                      id="status"
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          errors.status ? 'border-red-300' : ''
                      }`}
                  >
                    <option value="available">Có sẵn</option>
                    <option value="sold">Đã bán</option>
                    <option value="rented">Đã cho thuê</option>
                    <option value="pending">Chờ xử lý</option>
                  </select>
                  {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                    Số phòng ngủ
                  </label>
                  <input
                    {...register('bedrooms', { valueAsNumber: true })}
                      type="number"
                      id="bedrooms"
                      min="0"
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          errors.bedrooms ? 'border-red-300' : ''
                      }`}
                  />
                  {errors.bedrooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                    Số phòng tắm
                  </label>
                  <input
                    {...register('bathrooms', { valueAsNumber: true })}
                      type="number"
                      id="bathrooms"
                      min="0"
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          errors.bathrooms ? 'border-red-300' : ''
                      }`}
                  />
                  {errors.bathrooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="floors" className="block text-sm font-medium text-gray-700">
                    Số tầng
                  </label>
                  <input
                    {...register('floors', { valueAsNumber: true })}
                      type="number"
                      id="floors"
                      min="1"
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          errors.floors ? 'border-red-300' : ''
                      }`}
                  />
                  {errors.floors && (
                      <p className="mt-1 text-sm text-red-600">{errors.floors.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="year_built" className="block text-sm font-medium text-gray-700">
                    Năm xây dựng
                  </label>
                  <input
                    {...register('year_built', { valueAsNumber: true })}
                      type="number"
                      id="year_built"
                    min="1900"
                    max={new Date().getFullYear()}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.year_built ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.year_built && (
                      <p className="mt-1 text-sm text-red-600">{errors.year_built.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin vị trí</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Địa chỉ *
                  </label>
                  <textarea
                      {...register('address')}
                      id="address"
                      rows={2}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          errors.address ? 'border-red-300' : ''
                      }`}
                      placeholder="Nhập địa chỉ chi tiết..."
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Thành phố *
                  </label>
                  <input
                    {...register('city')}
                    type="text"
                    id="city"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.city ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    Quận/Huyện *
                  </label>
                  <input
                    {...register('district')}
                    type="text"
                    id="district"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.district ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                    Mã bưu điện
                  </label>
                  <input
                    {...register('postal_code')}
                    type="text"
                    id="postal_code"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                    Vĩ độ
                  </label>
                  <input
                    {...register('latitude', { valueAsNumber: true })}
                    type="number"
                    id="latitude"
                    step="any"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="10.762622"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                    Kinh độ
                  </label>
                  <input
                    {...register('longitude', { valueAsNumber: true })}
                    type="number"
                    id="longitude"
                    step="any"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="106.660172"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
                    Tên liên hệ *
                  </label>
                  <input
                    {...register('contact_name')}
                    type="text"
                    id="contact_name"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.contact_name ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.contact_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                    Số điện thoại *
                  </label>
                  <input
                    {...register('contact_phone')}
                    type="tel"
                    id="contact_phone"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.contact_phone ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.contact_phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_phone.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                    Email liên hệ
                  </label>
                  <input
                    {...register('contact_email')}
                    type="email"
                    id="contact_email"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.contact_email ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.contact_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mô tả</h3>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Mô tả chi tiết
                </label>
                <textarea
                  {...register('description')}
                  id="description"
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Mô tả chi tiết về bất động sản..."
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tiện ích</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Thêm tiện ích..."
                  className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Thêm
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h3>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      {isEditing && existingImagesData?.images && index < existingImagesData.images.length && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                            Hiện có
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Tải ảnh lên</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageSelect}
                      />
                    </label>
                    <p className="pl-1">hoặc kéo thả</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/properties')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
