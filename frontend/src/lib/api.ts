import axios from 'axios';
import type { ApiResponse, Listing, User, Category, Chat } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    city: string;
  }) => api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),

  getMe: () => api.get<ApiResponse<User>>('/auth/me'),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse<void>>('/auth/password', data),
};

// User API
export const userApi = {
  getProfile: (id: string) => api.get<ApiResponse<{ user: User; listings: Listing[]; reviews: any[] }>>(`/users/${id}`),

  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<User>>('/users/profile', data),

  updateAvatar: (formData: FormData) =>
    api.put<ApiResponse<{ avatar: string }>>('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getUserListings: (id: string, params?: { page?: number; status?: string }) =>
    api.get(`/users/${id}/listings`, { params }),

  getUserReviews: (id: string, params?: { page?: number }) =>
    api.get(`/users/${id}/reviews`, { params }),
};

// Listing API
export const listingApi = {
  getListings: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    q?: string;
    sort?: string;
  }) => api.get<ApiResponse<{ listings: Listing[]; pagination: any }>>('/listings', { params }),

  getListing: (id: string) =>
    api.get<ApiResponse<{ listing: Listing; relatedListings: Listing[] }>>(`/listings/${id}`),

  getFeatured: () => api.get<ApiResponse<Listing[]>>('/listings/featured'),

  create: (formData: FormData) =>
    api.post<ApiResponse<Listing>>('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: Partial<Listing>) =>
    api.put<ApiResponse<Listing>>(`/listings/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<void>>(`/listings/${id}`),

  markAsSold: (id: string) => api.put<ApiResponse<Listing>>(`/listings/${id}/sold`),
};

// Category API
export const categoryApi = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories'),
};

// Chat API
export const chatApi = {
  getChats: () => api.get<ApiResponse<Chat[]>>('/chats'),

  getChat: (id: string) => api.get<ApiResponse<Chat>>(`/chats/${id}`),

  startChat: (data: { listingId: string; message?: string }) =>
    api.post<ApiResponse<Chat>>('/chats', data),

  sendMessage: (chatId: string, content: string) =>
    api.post<ApiResponse<any>>(`/chats/${chatId}/messages`, { content }),

  getUnreadCount: () => api.get<ApiResponse<{ unreadCount: number }>>('/chats/unread'),
};

// Zambia API
export const zambiaApi = {
  getData: () => api.get('/zambia'),
};

export default api;
