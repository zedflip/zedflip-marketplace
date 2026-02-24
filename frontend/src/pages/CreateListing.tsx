import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Loader2, Plus, Image as ImageIcon, DollarSign, MapPin, Tag } from 'lucide-react';
import { useRequireAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useListings';
import { listingApi } from '../lib/api';
import { ZAMBIA_CITIES, CONDITION_LABELS } from '../types';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const CreateListing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const { categories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    city: '',
    location: '',
    isNegotiable: true,
    contactPhone: '',
    contactWhatsApp: '',
    tags: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    if (images.length + fileArray.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const newImages = [...images, ...fileArray];
    setImages(newImages);

    // Create previews
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('condition', formData.condition);
      data.append('category', formData.category);
      data.append('city', formData.city);
      data.append('location', formData.location);
      data.append('isNegotiable', String(formData.isNegotiable));
      data.append('contactPhone', formData.contactPhone);
      if (formData.contactWhatsApp) {
        data.append('contactWhatsApp', formData.contactWhatsApp);
      }
      if (formData.tags) {
        data.append('tags', JSON.stringify(formData.tags.split(',').map((t) => t.trim())));
      }

      images.forEach((image) => {
        data.append('images', image);
      });

      const response = await listingApi.create(data);
      toast.success('Listing created successfully!');
      navigate(`/listing/${response.data.data?._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-zed-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEO
        title="Create Listing"
        description="Sell your items on ZedFlip - Zambia's leading marketplace"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zed-text mb-2">
            Create New Listing
          </h1>
          <p className="text-gray-600">
            Fill in the details below to list your item for sale
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section - Yango Style */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-zed-orange" />
              <h2 className="text-xl font-semibold text-zed-text">Photos</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Add up to 10 photos. The first photo will be your cover image.
            </p>

            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 mb-6 ${
                isDragging
                  ? 'border-zed-orange bg-orange-50'
                  : 'border-gray-300 hover:border-zed-orange hover:bg-gray-50'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag & drop photos here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse from your device
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Choose Photos
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-zed-orange text-white text-xs px-3 py-1 rounded-lg font-medium shadow-lg">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Listing Details - Yango Style */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-5 h-5 text-zed-orange" />
              <h2 className="text-xl font-semibold text-zed-text">Listing Details</h2>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  minLength={5}
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  placeholder="e.g., iPhone 13 Pro Max 256GB - Like New"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all resize-none"
                  placeholder="Describe your item in detail... Include condition, features, reason for selling, etc."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/2000 characters
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (ZMW) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min={0}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  >
                    <option value="">Select condition</option>
                    {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Negotiable Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isNegotiable"
                  checked={formData.isNegotiable}
                  onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                  className="w-5 h-5 text-zed-orange border-gray-300 rounded focus:ring-zed-orange"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">
                  Price is negotiable
                </label>
              </div>
            </div>
          </div>

          {/* Location Details - Yango Style */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-zed-orange" />
              <h2 className="text-xl font-semibold text-zed-text">Location</h2>
            </div>

            <div className="space-y-5">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                >
                  <option value="">Select your city</option>
                  {ZAMBIA_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specific Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Location (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  placeholder="e.g., Kabulonga, Near Manda Hill"
                />
              </div>
            </div>
          </div>

          {/* Contact Information - Yango Style */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold text-zed-text mb-6">Contact Information</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  placeholder="+260 97 123 4567"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank to use your registered phone number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  name="contactWhatsApp"
                  value={formData.contactWhatsApp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  placeholder="+260 97 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  placeholder="e.g., smartphone, apple, unlocked"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate tags with commas
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button - Yango Style */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || images.length === 0}
              className="flex-1 bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating Listing...
                </>
              ) : (
                'Post Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
