import { useEffect } from 'react';
import { useListingStore } from '../store/listingStore';
import type { ListingCondition } from '../types';

export const useListings = () => {
  const {
    listings,
    pagination,
    filters,
    isLoading,
    error,
    fetchListings,
    setFilters,
    clearFilters,
    setPage,
  } = useListingStore();

  useEffect(() => {
    if (listings.length === 0) {
      fetchListings();
    }
  }, []);

  return {
    listings,
    pagination,
    filters,
    isLoading,
    error,
    fetchListings,
    setFilters,
    clearFilters,
    setPage,
  };
};

export const useFeaturedListings = () => {
  const { featuredListings, fetchFeatured, isLoading } = useListingStore();

  useEffect(() => {
    if (featuredListings.length === 0) {
      fetchFeatured();
    }
  }, []);

  return { featuredListings, isLoading };
};

export const useListing = (id: string) => {
  const { currentListing, relatedListings, isLoading, error, fetchListing } = useListingStore();

  useEffect(() => {
    if (id) {
      fetchListing(id);
    }
  }, [id]);

  return { listing: currentListing, relatedListings, isLoading, error };
};

export const useCategories = () => {
  const { categories, fetchCategories } = useListingStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);

  return { categories };
};

export default useListings;
