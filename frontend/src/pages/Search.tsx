import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useListings, useCategories } from '../hooks/useListings';
import ListingGrid from '../components/listing/ListingGrid';
import { ZAMBIA_CITIES, CONDITION_LABELS } from '../types';
import { cn } from '../lib/utils';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-views', label: 'Most Viewed' },
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const { listings, pagination, isLoading, setFilters, setPage } = useListings();
  const { categories } = useCategories();

  // Local filter state
  const [localFilters, setLocalFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });

  useEffect(() => {
    // Apply filters from URL on mount
    const filters: any = {};
    if (searchParams.get('q')) filters.q = searchParams.get('q');
    if (searchParams.get('category')) filters.category = searchParams.get('category');
    if (searchParams.get('city')) filters.city = searchParams.get('city');
    if (searchParams.get('condition')) filters.condition = searchParams.get('condition');
    if (searchParams.get('minPrice')) filters.minPrice = parseInt(searchParams.get('minPrice')!);
    if (searchParams.get('maxPrice')) filters.maxPrice = parseInt(searchParams.get('maxPrice')!);
    if (searchParams.get('sort')) filters.sort = searchParams.get('sort');

    setFilters(filters);
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams();
    const filters: any = {};

    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
        if (key === 'minPrice' || key === 'maxPrice') {
          filters[key] = parseInt(value);
        } else {
          filters[key] = value;
        }
      }
    });

    setSearchParams(params);
    setFilters(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setLocalFilters({
      q: '',
      category: '',
      city: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt',
    });
    setSearchParams({});
    setFilters({});
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (v, i) => v && (i !== 5 || v !== '-createdAt')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zed-text">
            {localFilters.q ? `Results for "${localFilters.q}"` : 'All Listings'}
          </h1>
          <p className="text-zed-text-muted">
            {pagination.total} items found
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={localFilters.sort}
              onChange={(e) => {
                setLocalFilters({ ...localFilters, sort: e.target.value });
                const filters: any = { ...localFilters, sort: e.target.value };
                setFilters(filters);
              }}
              className="appearance-none bg-white border border-zed-border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-zed-orange"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zed-text-muted pointer-events-none" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'btn flex items-center gap-2',
              hasActiveFilters ? 'btn-primary' : 'btn-outline'
            )}
          >
            <Filter className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-zed-orange w-5 h-5 rounded-full text-xs flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-zed-text mb-1">
                Category
              </label>
              <select
                value={localFilters.category}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, category: e.target.value })
                }
                className="input"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-zed-text mb-1">
                City
              </label>
              <select
                value={localFilters.city}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, city: e.target.value })
                }
                className="input"
              >
                <option value="">All Cities</option>
                {ZAMBIA_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-zed-text mb-1">
                Condition
              </label>
              <select
                value={localFilters.condition}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, condition: e.target.value })
                }
                className="input"
              >
                <option value="">Any Condition</option>
                {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-zed-text mb-1">
                Price Range (ZMW)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, minPrice: e.target.value })
                  }
                  className="input w-1/2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, maxPrice: e.target.value })
                  }
                  className="input w-1/2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={clearFilters} className="btn btn-ghost">
              Clear All
            </button>
            <button onClick={applyFilters} className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <ListingGrid
        listings={listings}
        isLoading={isLoading}
        emptyMessage="No listings match your filters"
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={cn(
                'w-10 h-10 rounded-lg font-medium transition-colors',
                page === pagination.page
                  ? 'bg-zed-orange text-white'
                  : 'bg-white text-zed-text hover:bg-gray-100'
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
