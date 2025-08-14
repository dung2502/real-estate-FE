import axios, { AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  AuthResponse, 
  Property, 
  PropertyFormData, 
  PropertyFilters, 
  PaginatedResponse,
  ApiResponse,
  PropertyImage
} from '../types';

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
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>('/logout');
    return response.data;
  }

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
    console.log(response.data);
    return response.data;
  }

  async createProperty(data: PropertyFormData): Promise<ApiResponse<Property>> {
    const formData = new FormData();

    // Required fields
    formData.append('title', data.title);
    formData.append('price', data.price.toString());
    formData.append('area', data.area.toString());
    formData.append('city', data.city);
    formData.append('district', data.district);
    formData.append('status', data.status);
    formData.append('property_type', data.property_type);
    formData.append('address', data.address);
    formData.append('contact_name', data.contact_name);
    formData.append('contact_phone', data.contact_phone);
    formData.append('bedrooms', data.bedrooms?.toString() ?? '0');
    formData.append('bathrooms', data.bathrooms?.toString() ?? '0');
    formData.append('floors', data.floors?.toString() ?? '1');

    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.postal_code) {
      formData.append('postal_code', data.postal_code);
    }
    if (data.latitude !== undefined && data.latitude !== null) {
      formData.append('latitude', data.latitude.toString());
    }
    if (data.longitude !== undefined && data.longitude !== null) {
      formData.append('longitude', data.longitude.toString());
    }
    if (data.year_built) {
      formData.append('year_built', data.year_built.toString());
    }
    if (data.contact_email) {
      formData.append('contact_email', data.contact_email);
    }

    if (data.features && data.features.length > 0) {
      data.features.forEach(feature => {
        formData.append('features[]', feature);
      });
    }

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

    if (data.title !== undefined) formData.append('title', data.title);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.area !== undefined) formData.append('area', data.area.toString());
    if (data.city !== undefined) formData.append('city', data.city);
    if (data.district !== undefined) formData.append('district', data.district);
    if (data.status !== undefined) formData.append('status', data.status);
    if (data.property_type !== undefined) formData.append('property_type', data.property_type);
    if (data.address !== undefined) formData.append('address', data.address);
    if (data.contact_name !== undefined) formData.append('contact_name', data.contact_name);
    if (data.contact_phone !== undefined) formData.append('contact_phone', data.contact_phone);

    if (data.bedrooms !== undefined) formData.append('bedrooms', data.bedrooms.toString());
    if (data.bathrooms !== undefined) formData.append('bathrooms', data.bathrooms.toString());
    if (data.floors !== undefined) formData.append('floors', data.floors.toString());

    if (data.description !== undefined) formData.append('description', data.description);
    if (data.postal_code !== undefined) formData.append('postal_code', data.postal_code);
    if (data.latitude !== undefined) formData.append('latitude', data.latitude.toString());
    if (data.longitude !== undefined) formData.append('longitude', data.longitude.toString());
    if (data.year_built !== undefined) formData.append('year_built', data.year_built.toString());
    if (data.contact_email !== undefined) formData.append('contact_email', data.contact_email);

    if (data.features && data.features.length > 0) {
      data.features.forEach(feature => {
        formData.append('features[]', feature);
      });
    }

    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images[]', image);
      });
    }

    const response = await api.post<ApiResponse<void>>(`/properties/${id}?_method=PUT`, formData, {
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


  async getPropertyImages(propertyId: number): Promise<{ property_id: string; images: PropertyImage[] }> {
    const response = await api.get(`/properties/${propertyId}/images`);
    return response.data;
  }

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
