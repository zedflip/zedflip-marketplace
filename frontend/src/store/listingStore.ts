import { create } from 'zustand';
import type { Listing, Category } from '../types';
import { listingApi, categoryApi } from '../lib/api';

interface ListingFilters {
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  q?: string;
  sort?: string;
}

interface ListingState {
  listings: Listing[];
  featuredListings: Listing[];
  categories: Category[];
  currentListing: Listing | null;
  relatedListings: Listing[];
  filters: ListingFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  isLoading: boolean;
  error: string | null;

  fetchListings: (filters?: ListingFilters, page?: number) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchListing: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setFilters: (filters: ListingFilters) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
}

export const useListingStore = create<ListingState>((set, get) => ({
  listings: [],
  featuredListings: [],
  categories: [],
  currentListing: null,
  relatedListings: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  error: null,

  fetchListings: async (filters?: ListingFilters, page?: number) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = filters || get().filters;
      const currentPage = page || get().pagination.page;

      const response = await listingApi.getListings({
        ...currentFilters,
        page: currentPage,
        limit: get().pagination.limit,
      });

      const { listings, pagination } = response.data.data!;

      set({
        listings,
        pagination,
        filters: currentFilters,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to fetch listings',
        isLoading: false,
      });
    }
  },

  fetchFeatured: async () => {
    try {
      const response = await listingApi.getFeatured();
      set({ featuredListings: response.data.data || [] });
    } catch (error) {
      console.error('Failed to fetch featured listings');
    }
  },

  fetchListing: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await listingApi.getListing(id);
      const { listing, relatedListings } = response.data.data!;

      set({
        currentListing: listing,
        relatedListings,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to fetch listing',
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await categoryApi.getAll();
      set({ categories: response.data.data || [] });
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  },

  setFilters: (filters: ListingFilters) => {
    set({ filters });
    get().fetchListings(filters, 1);
  },

  clearFilters: () => {
    set({ filters: {} });
    get().fetchListings({}, 1);
  },

  setPage: (page: number) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
    get().fetchListings(undefined, page);
  },
}));

export default useListingStore;
