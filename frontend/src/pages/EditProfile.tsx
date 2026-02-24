import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Mail, MapPin, Phone, Upload } from 'lucide-react';
import { useRequireAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../lib/api';
import { ZAMBIA_CITIES } from '../types';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const EditProfile = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading } = useRequireAuth();
  const { user, setUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone?.replace('+260', '') || '',
        city: user.city || '',
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    setFormData({ ...formData, phone: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone.length !== 9) {
      toast.error('Phone number must be 9 digits');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = new FormData();
      updateData.append('fullName', formData.fullName);
      updateData.append('email', formData.email);
      updateData.append('phone', `+260${formData.phone}`);
      updateData.append('city', formData.city);
      
      if (avatarFile) {
        updateData.append('avatar', avatarFile);
      }

      const response = await userApi.updateProfile(updateData);
      
      // Update user in store
      if (response.data.data) {
        setUser(response.data.data);
      }

      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
      <SEO title="Edit Profile" description="Edit your ZedFlip profile" />
      
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-zed-orange transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-zed-text">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Update your personal information</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zed-orange to-zed-orange-dark flex items-center justify-center border-4 border-gray-100">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-zed-orange hover:bg-zed-orange-dark text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors"
                >
                  <Upload className="w-5 h-5" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">Click to upload new avatar (max 5MB)</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Mwansa"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                  <span className="text-gray-700 font-medium">+260</span>
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="97 123 4567"
                  className="block w-full pl-24 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">9 digits (Zambian format)</p>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select your city</option>
                  {ZAMBIA_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
