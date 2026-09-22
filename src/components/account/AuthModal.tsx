import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup' | 'forgot';
  initialTab?: 'signin' | 'signup' | 'forgot';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'signin',
  initialTab,
  onSuccess,
}) => {
  const { login, signup, resetPassword } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(initialTab || defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const switchTab = (tab: 'signin' | 'signup' | 'forgot') => {
    resetFormState();
    setActiveTab(tab);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { user, profile } = await login(email.trim(), password);
      showToast(
        'Welcome Back!',
        `Signed in successfully as ${profile.displayName || user.email}.`,
        'success'
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      let msg = 'Authentication failed. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email address. Please sign up first.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please reset your password or wait a moment.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMessage('Please enter email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { user } = await signup(email.trim(), password, fullName.trim(), 'CUSTOMER');
      showToast(
        'Account Created!',
        `Welcome to AutoPartsHub, ${fullName.trim()}! Your marketplace profile is active.`,
        'success'
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      let msg = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'The password is too weak. Please use at least 6 characters.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccessMessage(
        `A password reset link has been dispatched to ${email.trim()}. Please check your inbox and spam folder.`
      );
      showToast('Reset Link Sent', 'Password reset instructions sent to your email.', 'info');
    } catch (err: any) {
      let msg = 'Failed to dispatch password reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No account registered with this email address.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        activeTab === 'signin'
          ? 'Sign In to AutoPartsHub'
          : activeTab === 'signup'
          ? 'Create Customer Account'
          : 'Reset Your Password'
      }
      subtitle={
        activeTab === 'signin'
          ? 'Access your saved vehicles, track orders, manage fitment, and checkout quickly.'
          : activeTab === 'signup'
          ? 'Join India’s premier verified genuine automobile spare parts marketplace.'
          : 'Enter your verified account email to receive secure password recovery instructions.'
      }
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Navigation Tabs (if not in forgot password mode) */}
        {activeTab !== 'forgot' && (
          <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => switchTab('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              New Customer
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-800 text-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#0284C7] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => switchTab('forgot')}
                  className="text-xs text-[#0284C7] hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#0284C7] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center bg-[#0284C7] hover:bg-[#0369A1] py-3 text-xs font-bold uppercase tracking-wider shadow-sm mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#0284C7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#0284C7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+91 98111 22233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#0284C7] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#0284C7] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Confirm *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#0284C7] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 leading-relaxed pt-1">
              By creating an account, you agree to AutoPartsHub&apos;s{' '}
              <span className="text-[#0284C7] underline cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-[#0284C7] underline cursor-pointer">Privacy Policy</span>.
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center bg-[#0284C7] hover:bg-[#0369A1] py-3 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Register Account</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#0284C7] transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => switchTab('signin')}
                className="flex-1 justify-center text-xs"
              >
                Back to Sign In
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1 justify-center bg-[#0284C7] hover:bg-[#0369A1] text-xs font-bold"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        )}

        {/* Trust Badges */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Session</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>Firebase Auth Secured</span>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>PCI-DSS Protected</span>
        </div>
      </div>
    </Modal>
  );
};
