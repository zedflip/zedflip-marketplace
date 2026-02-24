import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Lock, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    fullName: '',
    email: '',
    city: '',
  });

  // Show success message if coming from verification
  useEffect(() => {
    if (location.state?.verified) {
      toast.success('Email verified successfully! You can now login.');
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullPhone = `+260${formData.phone}`;

    if (formData.phone.length !== 9) {
      toast.error('Phone number must be 9 digits');
      return;
    }

    try {
      if (isLoginMode) {
        await login(fullPhone, formData.password);
        toast.success('Login successful!');
        navigate('/');
      } else {
        if (!formData.fullName || !formData.email || !formData.city) {
          toast.error('Please fill in all fields');
          return;
        }
        await register({
          phone: fullPhone,
          password: formData.password,
          fullName: formData.fullName,
          email: formData.email,
          city: formData.city,
        });
        // Store email for verification page
        localStorage.setItem('verificationEmail', formData.email);
        toast.success('Registration successful! Please check your email for verification code.');
        navigate('/verify-email', { state: { email: formData.email } });
      }
    } catch (error: any) {
      // Handle unverified email error
      if (error.response?.status === 403 && error.response?.data?.message?.includes('verify')) {
        toast.error('Please verify your email before logging in');
        localStorage.setItem('verificationEmail', formData.email || '');
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  const zambiaCities = [
    'Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Mufulira', 'Livingstone',
    'Luanshya', 'Kasama', 'Chipata', 'Solwezi', 'Mongu', 'Mazabuka', 'Choma'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={isLoginMode ? 'Login' : 'Register'}
        description={isLoginMode ? 'Login to your ZedFlip account' : 'Create a ZedFlip account'}
      />
      
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-zed-orange to-zed-orange-dark bg-clip-text text-transparent">
              ZedFlip
            </h1>
          </Link>
          <p className="mt-2 text-gray-600">
            {isLoginMode ? 'Welcome back!' : 'Join Zambia\'s marketplace'}
          </p>
        </div>

        {/* Main Card - Yango Style */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zed-text">
              {isLoginMode ? 'Login' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isLoginMode ? 'Enter your details to continue' : 'Fill in your information to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input - Fixed +260 */}
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

            {/* Register Fields */}
            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Mwansa"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                    required={!isLoginMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                    required={!isLoginMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                    required={!isLoginMode}
                  >
                    <option value="">Select your city</option>
                    {zambiaCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zed-orange focus:border-transparent transition-all"
                  required
                  minLength={6}
                />
              </div>
              {!isLoginMode && (
                <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
              )}
            </div>

            {/* Submit Button - Yango Style Gradient */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-zed-orange to-zed-orange-dark text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  {isLoginMode ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                isLoginMode ? 'Continue' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-sm text-gray-600 hover:text-zed-orange transition-colors"
            >
              {isLoginMode ? (
                <>
                  Don't have an account?{' '}
                  <span className="font-semibold text-zed-orange">Register</span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className="font-semibold text-zed-orange">Login</span>
                </>
              )}
            </button>
          </div>

          {/* Forgot Password */}
          {isLoginMode && (
            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-zed-orange transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to ZedFlip's{' '}
            <Link to="/terms" className="text-zed-orange hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-zed-orange hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
