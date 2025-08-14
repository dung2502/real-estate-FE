export interface User {
  id: number;
  name: string;
  email: string;
}

export interface PropertyImage {
  id: number;
  property_id: number;
  image_path: string;
  image_name: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: number;
  title: string;
  description?: string;
  property_type: 'apartment' | 'house' | 'villa' | 'office' | 'land';
  status: 'available' | 'sold' | 'rented' | 'pending';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  address: string;
  city: string;
  district: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  year_built?: number;
  features?: string[];
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  title: string;
  description?: string;
  property_type: 'apartment' | 'house' | 'villa' | 'office' | 'land';
  status: 'available' | 'sold' | 'rented' | 'pending';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  address: string;
  city: string;
  district: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  year_built?: number;
  features?: string[];
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  images?: File[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PropertyFilters {
  page?: number;
  city?: string;
  status?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  per_page?: number;
}
