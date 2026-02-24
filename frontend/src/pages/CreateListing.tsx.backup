import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { useRequireAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useListings';
import { listingApi } from '../lib/api';
import { ZAMBIA_CITIES, CONDITION_LABELS } from '../types';
import { cn } from '../lib/utils';

const CreateListing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const { categories } = useCategories();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (images.length === 0) {
      setError('Please add at least one image');
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
      navigate(`/listing/${response.data.data?._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create listing');
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zed-text mb-6">Create New Listing</h1>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="font-semibold mb-4">Photos</h2>
          <p className="text-sm text-zed-text-muted mb-4">
            Add up to 10 photos. First photo will be the cover.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-zed-orange text-white text-xs px-2 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {images.length < 10 && (
              <label className="aspect-square border-2 border-dashed border-zed-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-zed-orange transition-colors">
                <Plus className="w-8 h-8 text-zed-text-muted" />
                <span className="text-sm text-zed-text-muted mt-1">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="font-semibold mb-4">Listing Details</h2>

          <div>
            <label className="block text-sm font-medium text-zed-text mb-1">
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
              className="input"
              placeholder="e.g., iPhone 13 Pro Max 256GB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zed-text mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={20}
              maxLength={2000}
              rows={5}
              className="input resize-none"
              placeholder="Describe your item in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zed-text mb-1">
                Price (ZMW) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min={0}
                className="input"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zed-text mb-1">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="input"
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

          <div>
            <label className="block text-sm font-medium text-zed-text mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isNegotiable"
              name="isNegotiable"
              checked={formData.isNegotiable}
              onChange={handleChange}
              className="w-4 h-4 text-zed-orange rounded"
            />
            <label htmlFor="isNegotiable" className="text-sm text-zed-text">
              Price is negotiable
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="font-semibold mb-4">Location</h2>

          <div>
            <label className="block text-sm font-medium text-zed-text mb-1">
              City *
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Select city</option>
              {ZAMBIA_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zed-text mb-1">
              Specific Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Kabulonga, near Shoprite"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl p-6 space-y-4">
          <h2 className="font-semibold mb-4">Contact Information</h2>

          <div>
            <label className="block text-sm font-medium text-zed-text mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              pattern="\+260[0-9]{9}"
              className="input"
              placeholder="+260971234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zed-text mb-1">
              WhatsApp Number
            </label>
            <input
              type="tel"
              name="contactWhatsApp"
              value={formData.contactWhatsApp}
              onChange={handleChange}
              pattern="\+260[0-9]{9}"
              className="input"
              placeholder="+260971234567"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="font-semibold mb-4">Tags (Optional)</h2>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input"
            placeholder="e.g., apple, smartphone, 256gb (comma separated)"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full py-3 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating...
            </>
          ) : (
            'Post Listing'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
