import axios, { AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  AuthResponse, 
  Property, 
  PropertyFormData, 
  PropertyFilters, 
  PaginatedResponse,
  ApiResponse 
} from '../types';

// Tạo instance axios với base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>('/logout');
    return response.data;
  }

  // Properties
  async getProperties(filters: PropertyFilters): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.city) params.append('city', filters.city);
    if (filters.status) params.append('status', filters.status);
    if (filters.min_price) params.append('min_price', filters.min_price.toString());
    if (filters.max_price) params.append('max_price', filters.max_price.toString());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const response = await api.get<PaginatedResponse<Property>>(`/properties?${params.toString()}`);
    return response.data;
  }

  async getProperty(id: number): Promise<Property> {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  }

  async createProperty(data: PropertyFormData): Promise<ApiResponse<Property>> {
    const formData = new FormData();
    
    // Thêm các trường cơ bản
    formData.append('title', data.title);
    formData.append('price', data.price.toString());
    formData.append('area', data.area.toString());
    formData.append('city', data.city);
    formData.append('district', data.district);
    formData.append('status', data.status);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.features && data.features.length > 0) {
      data.features.forEach(feature => {
        formData.append('features[]', feature);
      });
    }
    
    // Thêm ảnh nếu có
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images[]', image);
      });
    }

    const response = await api.post<ApiResponse<Property>>('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateProperty(id: number, data: Partial<PropertyFormData>): Promise<ApiResponse<void>> {
    const formData = new FormData();
    
    // Thêm các trường có giá trị
    if (data.title) formData.append('title', data.title);
    if (data.price) formData.append('price', data.price.toString());
    if (data.area) formData.append('area', data.area.toString());
    if (data.city) formData.append('city', data.city);
    if (data.district) formData.append('district', data.district);
    if (data.status) formData.append('status', data.status);
    if (data.description) formData.append('description', data.description);
    
    if (data.features && data.features.length > 0) {
      data.features.forEach(feature => {
        formData.append('features[]', feature);
      });
    }
    
    // Thêm ảnh mới nếu có
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images[]', image);
      });
    }

    const response = await api.put<ApiResponse<void>>(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteProperty(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/properties/${id}`);
    return response.data;
  }

  async restoreProperty(id: number): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>(`/properties/${id}/restore`);
    return response.data;
  }

  // Property Images
  async uploadPropertyImages(propertyId: number, images: File[]): Promise<ApiResponse<void>> {
    const formData = new FormData();
    
    images.forEach(image => {
      formData.append('images[]', image);
    });

    const response = await api.post<ApiResponse<void>>(`/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deletePropertyImage(propertyId: number, imageId: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/properties/${propertyId}/images/${imageId}`);
    return response.data;
  }
}

export default new ApiService();
