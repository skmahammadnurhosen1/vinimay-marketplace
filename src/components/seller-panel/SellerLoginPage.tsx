import React, { useState } from 'react';
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface SellerLoginPageProps {
  onLoginSuccess: () => void;
  onRegisterClick?: () => void;
  onBackToStorefront: () => void;
}

export const SellerLoginPage: React.FC<SellerLoginPageProps> = ({
  onLoginSuccess,
  onRegisterClick,
  onBackToStorefront,
}) => {
  const { login, resetPassword, currentUser, profile } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isForgotMode) {
      if (!email.trim()) {
        setErrorMessage('Please enter your seller account email.');
        return;
      }
      setLoading(true);
      try {
        await resetPassword(email.trim());
        setResetSuccess(true);
        showToast('Reset Email Sent', 'Password reset instructions sent to your email.', 'info');
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to send password reset email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { user, profile: fetchedProfile } = await login(email.trim(), password);

      if (fetchedProfile.role !== 'SELLER' && fetchedProfile.role !== 'ADMIN') {
        showToast(
          'Seller Profile Required',
          'Logged in as customer. Please complete seller registration to access the seller panel.',
          'info'
        );
        onRegisterClick?.();
        return;
      }

      showToast(
        'Welcome, Seller Partner!',
        `Signed in to Seller Central as ${fetchedProfile.displayName || user.email}.`,
        'success'
      );
      onLoginSuccess();
    } catch (err: any) {
      let msg = 'Authentication failed. Please verify your seller credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid seller credentials. Please verify your email and password.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No seller account registered with this email address.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071530] flex flex-col justify-center items-center p-4 sm:p-6 text-white font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#FFBA00]/10 border border-[#FFBA00]/30 rounded-full text-[#FFBA00] text-xs font-black uppercase tracking-wider mb-2">
            <Store className="w-4 h-4 text-[#FFBA00]" />
            <span>AutoPartsHub Seller Central</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Partner Portal Gateway
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/70 max-w-sm mx-auto">
            Manage your automotive product catalog, multi-warehouse stock, and customer dispatches.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#0D1F44] border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Customer logged in notice */}
          {currentUser && profile && profile.role === 'CUSTOMER' && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-300">Customer Account Detected</span>
                You are currently signed in as a buyer ({currentUser.email}). Register your business to activate Seller Panel privileges.
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {resetSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Password recovery instructions have been sent to your email.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
                Seller Account Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-blue-300/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="seller@autopartshub.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071530] border border-blue-800/80 rounded-xl text-xs text-white placeholder-blue-300/30 focus:outline-none focus:border-[#FFBA00] transition-colors"
                />
              </div>
            </div>

            {!isForgotMode && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-200">
                    Account Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setErrorMessage(null);
                    }}
                    className="text-xs text-[#FFBA00] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-blue-300/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#071530] border border-blue-800/80 rounded-xl text-xs text-white placeholder-blue-300/30 focus:outline-none focus:border-[#FFBA00] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full justify-center bg-[#FFBA00] hover:bg-[#EAA500] text-gray-950 py-3 text-xs font-black uppercase tracking-wider shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Partner Credentials...</span>
                  </div>
                ) : isForgotMode ? (
                  <span>Send Recovery Email</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Enter Seller Central</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>

            {isForgotMode && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(false);
                  setErrorMessage(null);
                }}
                className="w-full text-center text-xs text-blue-300 hover:text-white mt-2 cursor-pointer font-semibold"
              >
                ← Back to Seller Sign In
              </button>
            )}
          </form>

          {/* Registration CTA */}
          <div className="pt-4 border-t border-blue-900/60 text-center space-y-2">
            <p className="text-xs text-blue-200/70">Don’t have a verified Seller ID yet?</p>
            <button
              type="button"
              onClick={onRegisterClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFBA00] hover:text-yellow-300 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Register as Authorized Auto Parts Seller →</span>
            </button>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-1.5 text-xs text-blue-300/70 hover:text-white cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Marketplace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
