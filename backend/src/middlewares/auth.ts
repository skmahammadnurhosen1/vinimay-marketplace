import { Request, Response, NextFunction } from 'express';
import { authService } from '../modules/auth/auth.service.js';
import { userRepository } from '../modules/users/user.repository.js';
import { UserRole, Permission } from '../types/auth.js';
import { getPermissionsForRole } from '../config/rbac.js';
import { AppError, sendError } from '../utils/apiResponse.js';

/**
 * Extracts Bearer token from the Authorization header.
 */
function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const parts = authHeader.trim().split(' ');
  if (parts.length !== 2 || parts[0]?.toLowerCase() !== 'bearer') {
    return null;
  }

  return parts[1] || null;
}

/**
 * Middleware: Requires valid Firebase ID token and active account status.
 * Rejects missing, expired, revoked, or unauthorized tokens.
 * Rejects suspended or disabled accounts.
 */
export async function requireAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = extractBearerToken(req);

  if (!token) {
    sendError(res, 'Authentication token required. Please sign in.', 401, 'AUTH_MISSING_TOKEN');
    return;
  }

  try {
    const decoded = await authService.verifyIdToken(token);
    const profile = await authService.getOrCreateUserProfile(decoded);

    // 1. Account Status Enforcement
    if (profile.accountStatus === 'SUSPENDED') {
      sendError(
        res,
        'Your account has been suspended. Please contact platform support.',
        403,
        'AUTH_ACCOUNT_SUSPENDED'
      );
      return;
    }

    if (profile.accountStatus === 'DISABLED') {
      sendError(
        res,
        'Your account has been disabled.',
        403,
        'AUTH_ACCOUNT_DISABLED'
      );
      return;
    }

    // 2. Attach server-verified user context to Request
    req.user = {
      uid: profile.uid,
      email: profile.email,
      role: profile.role,
      accountStatus: profile.accountStatus,
      emailVerified: profile.emailVerified,
      phoneVerified: profile.phoneVerified,
      displayName: profile.displayName,
      permissions: getPermissionsForRole(profile.role),
      twoFactorEnabled: profile.twoFactorEnabled,
      twoFactorVerified: profile.twoFactorVerified,
      tokenClaims: decoded.claims,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode, error.code, error.details);
      return;
    }
    sendError(res, 'Invalid authorization credentials provided.', 401, 'AUTH_INVALID_TOKEN');
  }
}

/**
 * Middleware: Enforces that the authenticated user possesses one of the authorized roles.
 * Must be preceded by requireAuthentication.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required to access this resource.', 401, 'AUTH_REQUIRED');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]`,
        403,
        'AUTH_FORBIDDEN_ROLE'
      );
      return;
    }

    next();
  };
}

/**
 * Middleware: Enforces fine-grained permission checks.
 */
export function requirePermission(...requiredPermissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401, 'AUTH_REQUIRED');
      return;
    }

    const hasAllPermissions = requiredPermissions.every((perm) =>
      req.user!.permissions.includes(perm)
    );

    if (!hasAllPermissions) {
      sendError(
        res,
        'Access denied: insufficient permissions to perform this operation.',
        403,
        'AUTH_INSUFFICIENT_PERMISSIONS'
      );
      return;
    }

    next();
  };
}

/**
 * Optional Authentication: Attaches req.user if a valid token is provided,
 * but allows unauthenticated visitors to proceed anonymously.
 */
export async function optionalAuthentication(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const token = extractBearerToken(req);
  if (!token) {
    return next();
  }

  try {
    const decoded = await authService.verifyIdToken(token);
    const profile = await userRepository.findById(decoded.uid);

    if (profile && profile.accountStatus === 'ACTIVE') {
      req.user = {
        uid: profile.uid,
        email: profile.email,
        role: profile.role,
        accountStatus: profile.accountStatus,
        emailVerified: profile.emailVerified,
        phoneVerified: profile.phoneVerified,
        displayName: profile.displayName,
        permissions: getPermissionsForRole(profile.role),
        twoFactorEnabled: profile.twoFactorEnabled,
        twoFactorVerified: profile.twoFactorVerified,
        tokenClaims: decoded.claims,
      };
    }
  } catch {
    // Ignore invalid tokens for optional auth and proceed as anonymous
  }

  next();
}
