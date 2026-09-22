import React from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { ShieldAlert, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackLogin?: React.ReactNode;
  portalName?: string;
  onBackToStorefront?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  fallbackLogin,
  portalName = 'Portal',
  onBackToStorefront,
}) => {
  const { currentUser, profile, loading, isAuthenticated, role, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0284C7] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-700">Verifying secure session...</p>
        <p className="text-xs text-gray-400 mt-1">Connecting to AutoPartsHub Authoritative Identity Service</p>
      </div>
    );
  }

  // If unauthenticated, show fallback login if provided
  if (!isAuthenticated || !currentUser) {
    if (fallbackLogin) {
      return <>{fallbackLogin}</>;
    }

    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 sm:p-6 text-white">
        <div className="max-w-md w-full bg-[#1E293B] border border-gray-700/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Authentication Required</h2>
            <p className="text-xs text-gray-400 mt-2">
              Please sign in to your authorized account to access the {portalName}.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            {onBackToStorefront && (
              <Button
                variant="outline"
                className="w-full justify-center border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={onBackToStorefront}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Customer Marketplace
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Account suspended guard
  if (profile?.accountStatus === 'SUSPENDED') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 sm:p-6 text-white">
        <div className="max-w-md w-full bg-[#1E293B] border border-rose-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Account Suspended</h2>
            <p className="text-xs text-rose-300 mt-2">
              Your account has been temporarily suspended by marketplace administrators.
            </p>
          </div>
          <div className="p-3.5 bg-rose-950/40 border border-rose-900/60 rounded-2xl text-xs text-rose-200">
            For dispute resolution or reinstatement, contact support at compliance@autopartshub.com.
          </div>
          <Button
            variant="outline"
            className="w-full justify-center border-gray-700 text-gray-300"
            onClick={() => logout()}
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Role verification guard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 sm:p-6 text-white">
        <div className="max-w-md w-full bg-[#1E293B] border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 mb-2">
              Access Restricted
            </span>
            <h2 className="text-xl font-bold text-white">Unauthorized Role</h2>
            <p className="text-xs text-gray-400 mt-2">
              Your current account ({profile?.email || currentUser.email}) is registered as{' '}
              <span className="font-bold text-white uppercase">{role}</span>, which lacks permissions for the{' '}
              {portalName}.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full justify-center border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => logout()}
            >
              Sign Out & Switch Account
            </Button>
            {onBackToStorefront && (
              <Button
                variant="primary"
                className="w-full justify-center bg-[#0284C7] hover:bg-[#0369A1]"
                onClick={onBackToStorefront}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Storefront
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
