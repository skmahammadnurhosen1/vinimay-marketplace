import { getFirebaseAuth } from '../../config/firebase.js';
import { userRepository } from '../users/user.repository.js';
import { UserProfile, UserRole, AccountStatus } from '../../types/auth.js';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/apiResponse.js';
import { env } from '../../config/environment.js';

export interface DecodedAuthToken {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  displayName?: string;
  role?: UserRole;
  claims: Record<string, unknown>;
}

export class AuthService {
  /**
   * Verifies Firebase ID token, checking for revocation and expiration.
   */
  async verifyIdToken(idToken: string): Promise<DecodedAuthToken> {
    if (!idToken || typeof idToken !== 'string') {
      throw new AppError('Missing or malformed authorization token', 401, 'AUTH_MISSING_TOKEN');
    }

    // Mock token support for local testing / unit tests without requiring live Google Auth server
    if (env.NODE_ENV === 'test' || idToken.startsWith('mock-token-')) {
      return this.verifyMockToken(idToken);
    }

    try {
      const auth = getFirebaseAuth();
      // checkRevoked = true ensures revoked sessions fail immediately
      const decoded = await auth.verifyIdToken(idToken, true);

      return {
        uid: decoded.uid,
        email: decoded.email,
        emailVerified: decoded.email_verified,
        phoneNumber: decoded.phone_number,
        displayName: decoded.name,
        role: (decoded.role as UserRole) || undefined,
        claims: decoded,
      };
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      logger.warn('Firebase token verification failure:', { code: err.code, message: err.message });

      if (err.code === 'auth/id-token-expired') {
        throw new AppError('Authorization token has expired. Please refresh your session.', 401, 'AUTH_TOKEN_EXPIRED');
      }
      if (err.code === 'auth/id-token-revoked') {
        throw new AppError('Authorization token has been revoked.', 401, 'AUTH_TOKEN_REVOKED');
      }
      if (err.code === 'auth/user-disabled') {
        throw new AppError('The user account has been disabled in the authentication system.', 403, 'AUTH_ACCOUNT_DISABLED');
      }

      throw new AppError('Invalid authorization token provided.', 401, 'AUTH_INVALID_TOKEN');
    }
  }

  /**
   * Retrieves or initializes a synchronized user profile for an authenticated Firebase UID.
   */
  async getOrCreateUserProfile(
    decoded: DecodedAuthToken,
    initialRole: UserRole = 'CUSTOMER'
  ): Promise<UserProfile> {
    let profile = await userRepository.findById(decoded.uid);

    if (!profile) {
      const now = new Date().toISOString();
      profile = {
        uid: decoded.uid,
        email: decoded.email || `${decoded.uid}@placeholder.autopartshub.com`,
        phoneNumber: decoded.phoneNumber || null,
        displayName: decoded.displayName || (decoded.email ? decoded.email.split('@')[0]! : 'Marketplace User'),
        role: decoded.role || initialRole,
        accountStatus: (decoded.claims?.status as AccountStatus) || 'ACTIVE',
        emailVerified: !!decoded.emailVerified,
        phoneVerified: !!decoded.phoneNumber,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
        twoFactorEnabled: false,
        twoFactorVerified: false,
      };

      await userRepository.create(profile);
      logger.info('Created new user profile synchronized with Firebase Auth', {
        uid: profile.uid,
        role: profile.role,
      });
    } else {
      // Keep login timestamp fresh
      await userRepository.updateLastLogin(profile.uid);
    }

    return profile;
  }

  /**
   * Assigns a server-side verified role to a user and sets Firebase Custom Claims.
   */
  async assignRole(uid: string, role: UserRole): Promise<UserProfile> {
    const updated = await userRepository.update(uid, { role });

    // Set custom user claims in Firebase Auth if available
    try {
      if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY && env.NODE_ENV !== 'test') {
        const auth = getFirebaseAuth();
        await auth.setCustomUserClaims(uid, { role });
      }
    } catch (error) {
      logger.error('Failed to set custom claims in Firebase Auth:', { uid, role, error });
    }

    logger.info('User role assigned successfully', { uid, role });
    return updated;
  }

  /**
   * Updates the user's account status (ACTIVE, SUSPENDED, DISABLED).
   */
  async updateAccountStatus(uid: string, status: AccountStatus): Promise<UserProfile> {
    const updated = await userRepository.update(uid, { accountStatus: status });
    logger.info('User account status changed', { uid, status });
    return updated;
  }

  /**
   * Revokes all refresh tokens for a user (forces sign-out on all clients).
   */
  async revokeSessions(uid: string): Promise<void> {
    try {
      if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY && env.NODE_ENV !== 'test') {
        const auth = getFirebaseAuth();
        await auth.revokeRefreshTokens(uid);
      }
      logger.info('Revoked refresh tokens for user', { uid });
    } catch (error) {
      logger.warn('Failed to revoke tokens via Firebase Auth (mock or offline):', { uid, error });
    }
  }

  /**
   * Testing harness: Parses structured mock tokens for deterministic test coverage.
   * Format: mock-token-<role>-<uid>-<accountStatus>
   * E.g.: "mock-token-ADMIN-admin123-ACTIVE", "mock-token-CUSTOMER-cust1-SUSPENDED", "mock-token-EXPIRED"
   */
  private verifyMockToken(token: string): DecodedAuthToken {
    if (token === 'mock-token-EXPIRED') {
      throw new AppError('Authorization token has expired. Please refresh your session.', 401, 'AUTH_TOKEN_EXPIRED');
    }
    if (token === 'mock-token-REVOKED') {
      throw new AppError('Authorization token has been revoked.', 401, 'AUTH_TOKEN_REVOKED');
    }
    if (token === 'mock-token-INVALID') {
      throw new AppError('Invalid authorization token provided.', 401, 'AUTH_INVALID_TOKEN');
    }

    const match = token.match(/^mock-token-([^-]+)-(.+)-([^-]+)$/);
    let role: UserRole = 'CUSTOMER';
    let uid = 'mock-user-1';
    let status: AccountStatus = 'ACTIVE';

    if (match) {
      role = match[1] as UserRole;
      uid = match[2];
      status = match[3] as AccountStatus;
    } else {
      const parts = token.split('-');
      role = (parts[2] as UserRole) || 'CUSTOMER';
      uid = parts[3] || 'mock-user-1';
      status = (parts[4] as AccountStatus) || 'ACTIVE';
    }

    return {
      uid,
      email: `${uid.toLowerCase()}@test.autopartshub.com`,
      emailVerified: true,
      phoneNumber: '+919876543210',
      displayName: `Test ${role}`,
      role,
      claims: {
        role,
        sub: uid,
        status,
      },
    };
  }
}

export const authService = new AuthService();
