// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isAdmin: boolean;
  rating: number;
  totalReviews: number;
  totalListings: number;
  totalSales: number;
  lastActive: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar?: string;
  isVerified: boolean;
  isAdmin: boolean;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  parent?: string;
  isActive: boolean;
  listingCount: number;
}

// Listing types
export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';
export type ListingStatus = 'active' | 'sold' | 'reserved' | 'expired' | 'deleted';

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: ListingCondition;
  category: Category;
  seller: User;
  images: string[];
  city: string;
  location?: string;
  status: ListingStatus;
  views: number;
  favorites: number;
  isFeatured: boolean;
  isNegotiable: boolean;
  contactPhone: string;
  contactWhatsApp?: string;
  tags: string[];
  expiresAt: string;
  soldAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFormData {
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
  category: string;
  city: string;
  location?: string;
  isNegotiable: boolean;
  contactPhone: string;
  contactWhatsApp?: string;
  tags: string[];
  images: File[];
}

// Chat types
export interface Message {
  _id: string;
  sender: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  _id: string;
  participants: User[];
  listing: Listing;
  messages: Message[];
  lastMessage?: string;
  lastMessageAt?: string;
  isActive: boolean;
  createdAt: string;
}

// Review types
export interface Review {
  _id: string;
  reviewer: User;
  reviewee: User;
  listing: Listing;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

// Notification types
export type NotificationType = 'message' | 'listing' | 'review' | 'system' | 'favorite';

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Zambia specific types
export const ZAMBIA_CITIES = [
  'Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Livingstone',
  'Chipata', 'Mansa', 'Mongu', 'Solwezi', 'Kasama',
  'Mufulira', 'Luanshya',
] as const;

export type ZambiaCity = typeof ZAMBIA_CITIES[number];

export const CONDITION_LABELS: Record<ListingCondition, string> = {
  'new': 'New',
  'like-new': 'Like New',
  'good': 'Good',
  'fair': 'Fair',
  'poor': 'Poor',
};

export const formatPrice = (price: number): string => {
  return `K ${price.toLocaleString()}`;
};

export const formatPhone = (phone: string): string => {
  if (phone.startsWith('+260')) {
    return phone;
  }
  return `+260${phone.replace(/^0/, '')}`;
};
