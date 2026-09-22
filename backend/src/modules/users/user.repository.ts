import { UserProfile, AccountStatus } from '../../types/auth.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface IUserRepository {
  findById(uid: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<UserProfile | null>;
  create(profile: UserProfile): Promise<UserProfile>;
  update(uid: string, data: Partial<UserProfile>): Promise<UserProfile>;
  updateStatus(uid: string, status: AccountStatus): Promise<void>;
  updateAccountStatus(uid: string, status: AccountStatus): Promise<UserProfile>;
  updateLastLogin(uid: string): Promise<void>;
  findAll(): Promise<UserProfile[]>;
  findByUid(uid: string): Promise<UserProfile | null>;
}

// In-Memory User Store (Used for testing and offline development fallback)
const inMemoryUsers = new Map<string, UserProfile>();

class FirestoreUserRepository implements IUserRepository {
  private collectionName = 'users';

  private shouldUseFirestore(): boolean {
    // Only query Firestore if live credentials are configured and not running in pure unit test mode
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async findById(uid: string): Promise<UserProfile | null> {
    if (!this.shouldUseFirestore()) {
      return inMemoryUsers.get(uid) || null;
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(uid).get();
      if (!doc.exists) return null;
      return doc.data() as UserProfile;
    } catch (error) {
      logger.warn('Firestore findById fallback to in-memory:', { uid, error });
      return inMemoryUsers.get(uid) || null;
    }
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const normalized = email.toLowerCase().trim();

    if (!this.shouldUseFirestore()) {
      for (const user of inMemoryUsers.values()) {
        if (user.email.toLowerCase() === normalized) {
          return user;
        }
      }
      return null;
    }

    try {
      const db = getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('email', '==', normalized)
        .limit(1)
        .get();

      if (snapshot.empty) return null;
      return snapshot.docs[0]!.data() as UserProfile;
    } catch (error) {
      logger.warn('Firestore findByEmail fallback to in-memory:', { email, error });
      for (const user of inMemoryUsers.values()) {
        if (user.email.toLowerCase() === normalized) {
          return user;
        }
      }
      return null;
    }
  }

  async create(profile: UserProfile): Promise<UserProfile> {
    inMemoryUsers.set(profile.uid, profile);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(profile.uid).set(profile);
      } catch (error) {
        logger.error('Failed to persist user profile to Firestore:', { uid: profile.uid, error });
      }
    }

    return profile;
  }

  async update(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const existing = await this.findById(uid);
    if (!existing) {
      throw new Error(`User with uid ${uid} not found`);
    }

    const updated: UserProfile = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    inMemoryUsers.set(uid, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(uid).update(updated as unknown as Record<string, unknown>);
      } catch (error) {
        logger.error('Failed to update user profile in Firestore:', { uid, error });
      }
    }

    return updated;
  }

  async updateStatus(uid: string, status: AccountStatus): Promise<void> {
    await this.update(uid, { accountStatus: status });
  }

  async updateLastLogin(uid: string): Promise<void> {
    const now = new Date().toISOString();
    const existing = inMemoryUsers.get(uid);
    if (existing) {
      existing.lastLoginAt = now;
      existing.updatedAt = now;
    }

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(uid).update({
          lastLoginAt: now,
          updatedAt: now,
        });
      } catch (error) {
        logger.error('Failed to update last login in Firestore:', { uid, error });
      }
    }
  }

  async updateAccountStatus(uid: string, status: AccountStatus): Promise<UserProfile> {
    return this.update(uid, { accountStatus: status });
  }

  async findByUid(uid: string): Promise<UserProfile | null> {
    return this.findById(uid);
  }

  async findAll(): Promise<UserProfile[]> {
    if (!this.shouldUseFirestore()) {
      return Array.from(inMemoryUsers.values());
    }

    try {
      const db = getFirestore();
      const snapshot = await db.collection(this.collectionName).get();
      return snapshot.docs.map((doc) => doc.data() as UserProfile);
    } catch (error) {
      logger.warn('Firestore findAll fallback to in-memory:', { error });
      return Array.from(inMemoryUsers.values());
    }
  }

  // Testing helper to reset or seed user state
  _clearMemory(): void {
    inMemoryUsers.clear();
  }

  _seedUser(profile: UserProfile): void {
    inMemoryUsers.set(profile.uid, profile);
  }
}

export const userRepository = new FirestoreUserRepository();
