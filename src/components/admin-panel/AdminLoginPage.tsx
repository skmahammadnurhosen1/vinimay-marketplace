import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onSwitchToStorefront?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onSwitchToStorefront,
}) => {
  const { logout, refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForgotMode, setIsForgotMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both administrator email and security passcode.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sign in with Firebase Auth
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);

      // 2. Fetch/Sync profile to verify role
      const profile = await refreshProfile();

      // 3. Verify that role is ADMIN
      if (profile?.role !== 'ADMIN') {
        await logout();
        setErrorMessage(
          `Access Denied: Account is authenticated as ${profile?.role || 'CUSTOMER'}, but does not possess Master Platform Administrator privileges.`
        );
        return;
      }

      setSuccessMessage('Administrator credentials verified. Launching Master Console...');
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } catch (err: any) {
      console.error('Admin authentication failed:', err);
      let msg = 'Authentication failed. Please verify your administrator credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid administrator email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Access temporarily restricted. Try again later.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email to receive password recovery instructions.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMessage(`A password reset link has been dispatched to ${email.trim()}.`);
      setIsForgotMode(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch password recovery email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1015] text-gray-100 flex flex-col justify-between font-sans selection:bg-[#C59B27] selection:text-stone-950">
      {/* Top Security Banner */}
      <header className="h-16 border-b border-gray-800 bg-[#16181D]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onSwitchToStorefront && (
            <button
              onClick={onSwitchToStorefront}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-[#C59B27]" />
              <span>Storefront</span>
            </button>
          )}
          <span className="text-gray-700">|</span>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#C59B27] to-[#E5C158] flex items-center justify-center text-gray-950 font-black text-sm shadow-md">
              A
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
              AutoParts<span className="text-[#C59B27]">Hub</span>
            </span>
            <span className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider bg-[#C59B27]/20 border border-[#C59B27]/40 px-2 py-0.5 rounded ml-1">
              Admin Gateway
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <ShieldAlert className="w-3.5 h-3.5 text-[#C59B27]" />
          <span className="hidden sm:inline">Restricted Access • Monitored Security Zone</span>
        </div>
      </header>

      {/* Main Authentication Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-[#16181D] border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/80 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <KeyRound className="w-7 h-7 text-[#C59B27]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Platform Master Console
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Sign in with your privileged administrator credentials
            </p>
          </div>

          {/* Error / Success Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}

          {isForgotMode ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@autopartshub.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] border border-gray-700 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C59B27] transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#C59B27] hover:bg-[#b0881f] text-gray-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Link</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setErrorMessage(null);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Standard Admin Sign-In Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@autopartshub.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] border border-gray-700 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C59B27] transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-300">
                    Security Passcode
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-[#C59B27] hover:underline"
                  >
                    Forgot passcode?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] border border-gray-700 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C59B27] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C59B27] to-[#E5C158] hover:from-[#b3891d] hover:to-[#d4ae43] text-gray-950 font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-lg mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gray-950" />
                    <span>Verifying Privileges...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate to Admin Console</span>
                    <ArrowRight className="w-4 h-4 text-gray-950" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Strict Role-Based Access Control (RBAC) enforced via Firebase Auth.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-600 border-t border-gray-800/80">
        &copy; {new Date().getFullYear()} AutoPartsHub Global Technologies. Master Administration Operations.
      </footer>
    </div>
  );
};
