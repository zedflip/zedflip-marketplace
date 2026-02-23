import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ZAMBIA_CITIES } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

const Login = () => {
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+260', // Pre-fill with Zambia prefix
    password: '',
    confirmPassword: '',

  // Show success message if coming from verification
  useEffect(() => {
    if (location.state?.verified) {
      toast.success('Email verified successfully! You can now login.');
    }
  }, [location]);

    city: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone input to lock +260 prefix
    if (name === 'phone') {
      // Always ensure the value starts with +260
      let phoneValue = value;
      
      // If user tries to delete the prefix, restore it
      if (!phoneValue.startsWith('+260')) {
        phoneValue = '+260';
      }
      
      // Only allow numbers after +260
      const prefix = '+260';
      const numbers = phoneValue.slice(prefix.length).replace(/\D/g, '');
      phoneValue = prefix + numbers;
      
      // Limit to 9 digits after +260 (total 13 characters)
      if (numbers.length > 9) {
        phoneValue = prefix + numbers.slice(0, 9);
      }
      
      setFormData({ ...formData, [name]: phoneValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        // Validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (!formData.phone.match(/^\+260[0-9]{9}$/)) {
          setError('Please enter a valid Zambian phone number (+260XXXXXXXXX)');
          setIsLoading(false);
          return;
        }

        await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          city: formData.city,
        });

        // Redirect to verification page after successful registration
        toast.success('Registration successful! Please verify your email.');
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        await login(formData.email, formData.password);
        navigate('/');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      
      // Check if error is due to unverified email
      if (err.response?.status === 403 && errorMessage.includes('verify')) {
        setError(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
        setTimeout(() => {
          navigate('/verify-email', { state: { email: formData.email } });
        }, 2000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-zed-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <span className="text-2xl font-bold text-zed-text">
              Zed<span className="text-zed-orange">Flip</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Tabs */}
          <div className="flex mb-6">
            <button
              onClick={() => setIsRegister(false)}
              className={cn(
                'flex-1 py-2 text-center font-medium border-b-2 transition-colors',
                !isRegister
                  ? 'border-zed-orange text-zed-orange'
                  : 'border-transparent text-zed-text-muted hover:text-zed-text'
              )}
            >
              Login
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={cn(
                'flex-1 py-2 text-center font-medium border-b-2 transition-colors',
                isRegister
                  ? 'border-zed-orange text-zed-orange'
                  : 'border-transparent text-zed-text-muted hover:text-zed-text'
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-zed-text mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zed-text mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
                placeholder="you@example.com"
              />
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-zed-text mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={(e) => {
                      // Ensure +260 prefix is always present when focused
                      if (!e.target.value || e.target.value === '') {
                        setFormData({ ...formData, phone: '+260' });
                      }
                    }}
                    required
                    className="input"
                    placeholder="+260971234567"
                  />
                  <p className="text-xs text-zed-text-muted mt-1">
                    Format: +260XXXXXXXXX (Zambia only)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zed-text mb-1">
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Select your city</option>
                    {ZAMBIA_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-zed-text mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zed-text-muted"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-zed-text mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
            )}

            {!isRegister && (
              <div className="text-right">
                <a href="#" className="text-sm text-zed-orange hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRegister ? (
                'Create Account'
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Terms */}
          {isRegister && (
            <p className="text-xs text-zed-text-muted text-center mt-4">
              By signing up, you agree to our{' '}
              <a href="#" className="text-zed-orange hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-zed-orange hover:underline">
                Privacy Policy
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
