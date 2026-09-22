import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import { apiClient } from '../services/apiClient';

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'GARAGE' | 'FLEET' | 'MANUFACTURER';
export type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISABLED';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  displayName: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  permissions: string[];
  twoFactorEnabled?: boolean;
  twoFactorVerified?: boolean;
  phone?: string;
  phoneNumber?: string;
  sellerId?: string;
  b2bAccountId?: string;
  manufacturerBrand?: string;
}

export interface SellerProfileData {
  id: string;
  userId: string;
  businessName: string;
  sellerType: string;
  kycStatus: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  commissionRate?: number;
  businessAddress?: any;
  pickupAddress?: any;
  bankDetails?: any;
}

export interface B2BAccountData {
  id: string;
  userId: string;
  businessName: string;
  accountType: 'GARAGE' | 'FLEET';
  gstin: string;
  pan: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  creditLimit: number;
}

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  sellerProfile: SellerProfileData | null;
  b2bAccount: B2BAccountData | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: UserRole;
  isCustomer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  isGarage: boolean;
  isFleet: boolean;
  isManufacturer: boolean;
  login: (email: string, password: string) => Promise<{ user: User; profile: UserProfile }>;
  signup: (
    email: string,
    password: string,
    displayName: string,
    initialRole?: UserRole
  ) => Promise<{ user: User; profile: UserProfile }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  setLocalSellerProfile: (seller: SellerProfileData | null) => void;
  setLocalB2BAccount: (b2b: B2BAccountData | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfileData | null>(null);
  const [b2bAccount, setB2bAccount] = useState<B2BAccountData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronize authenticated user with backend profile and role-specific accounts
  const syncWithBackend = async (
    fbUser: User,
    initialRole: UserRole = 'CUSTOMER',
    customDisplayName?: string
  ): Promise<UserProfile | null> => {
    try {
      const userToken = await fbUser.getIdToken();
      setToken(userToken);

      // Call backend sync-profile
      const syncRes = await apiClient.post<UserProfile>('/auth/sync', {
        initialRole,
        displayName: customDisplayName || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      });

      if (syncRes.success && syncRes.data) {
        const fetchedProfile = syncRes.data;
        setProfile(fetchedProfile);

        // If user is SELLER, attempt to fetch seller profile
        if (fetchedProfile.role === 'SELLER' || fetchedProfile.role === 'ADMIN') {
          try {
            const sellerRes = await apiClient.get<{ seller: SellerProfileData }>('/sellers/me');
            if (sellerRes.success && sellerRes.data?.seller) {
              setSellerProfile(sellerRes.data.seller);
            }
          } catch {
            // Seller profile might not be registered yet
            setSellerProfile(null);
          }
        }

        // If user is B2B (GARAGE / FLEET), attempt to fetch B2B account
        if (fetchedProfile.role === 'GARAGE' || fetchedProfile.role === 'FLEET') {
          try {
            const b2bRes = await apiClient.get<{ account: B2BAccountData }>('/b2b/account/me');
            if (b2bRes.success && b2bRes.data?.account) {
              setB2bAccount(b2bRes.data.account);
            }
          } catch {
            setB2bAccount(null);
          }
        }

        return fetchedProfile;
      }
    } catch (err) {
      console.warn('Backend sync failed, constructing fallback profile from Firebase Auth:', err);
      // Fallback profile if backend is unreachable
      const fallbackProfile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        role: initialRole,
        accountStatus: 'ACTIVE',
        displayName: customDisplayName || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        emailVerified: fbUser.emailVerified,
        phoneVerified: !!fbUser.phoneNumber,
        permissions: ['CATALOG_READ', 'ORDER_CREATE'],
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setCurrentUser(fbUser);
        try {
          const userToken = await fbUser.getIdToken();
          setToken(userToken);
          // Try fetching existing profile from /auth/me
          const meRes = await apiClient.get<UserProfile>('/auth/me');
          if (meRes.success && meRes.data) {
            setProfile(meRes.data);
            // Hydrate role-specific profiles
            if (meRes.data.role === 'SELLER' || meRes.data.role === 'ADMIN') {
              try {
                const sRes = await apiClient.get<{ seller: SellerProfileData }>('/sellers/me');
                if (sRes.success && sRes.data?.seller) {
                  setSellerProfile(sRes.data.seller);
                }
              } catch {
                setSellerProfile(null);
              }
            }
            if (meRes.data.role === 'GARAGE' || meRes.data.role === 'FLEET') {
              try {
                const bRes = await apiClient.get<{ account: B2BAccountData }>('/b2b/account/me');
                if (bRes.success && bRes.data?.account) {
                  setB2bAccount(bRes.data.account);
                }
              } catch {
                setB2bAccount(null);
              }
            }
          } else {
            await syncWithBackend(fbUser);
          }
        } catch {
          await syncWithBackend(fbUser);
        }
      } else {
        setCurrentUser(null);
        setProfile(null);
        setSellerProfile(null);
        setB2bAccount(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const synced = await syncWithBackend(userCredential.user);
      return { user: userCredential.user, profile: synced! };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    pass: string,
    displayName: string,
    initialRole: UserRole = 'CUSTOMER'
  ) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const synced = await syncWithBackend(userCredential.user, initialRole, displayName);
      return { user: userCredential.user, profile: synced! };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Continue even if backend call fails
      }
      await signOut(auth);
      setCurrentUser(null);
      setProfile(null);
      setSellerProfile(null);
      setB2bAccount(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!currentUser) return null;
    return syncWithBackend(currentUser, profile?.role || 'CUSTOMER');
  };

  const userRole = profile?.role || 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        sellerProfile,
        b2bAccount,
        token,
        loading,
        isAuthenticated: !!currentUser,
        role: userRole,
        isCustomer: userRole === 'CUSTOMER',
        isSeller: userRole === 'SELLER',
        isAdmin: userRole === 'ADMIN',
        isGarage: userRole === 'GARAGE',
        isFleet: userRole === 'FLEET',
        isManufacturer: userRole === 'MANUFACTURER',
        login,
        signup,
        logout,
        resetPassword,
        refreshProfile,
        setLocalSellerProfile: setSellerProfile,
        setLocalB2BAccount: setB2bAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
