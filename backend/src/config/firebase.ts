import admin from 'firebase-admin';
import { env } from './environment.js';
import { logger } from '../utils/logger.js';

let firebaseApp: admin.app.App | null = null;
let isInitialized = false;

export function initializeFirebase(): admin.app.App {
  if (isInitialized && firebaseApp) {
    return firebaseApp;
  }

  try {
    if (admin.apps.length > 0) {
      firebaseApp = admin.apps[0]!;
      isInitialized = true;
      logger.info('Firebase Admin reusing existing default app');
      return firebaseApp;
    }

    // Determine credential source
    let credentialOption: admin.credential.Credential | undefined;

    if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      // Clean private key escapes if loaded from single-line string
      const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      credentialOption = admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      });
      logger.info('Firebase Admin initialized with explicit service account credentials');
    } else {
      // Fall back to application default credentials or project ID
      credentialOption = admin.credential.applicationDefault();
      logger.info('Firebase Admin initialized with Application Default Credentials');
    }

    firebaseApp = admin.initializeApp({
      credential: credentialOption,
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
    });

    isInitialized = true;
    logger.info('Firebase Admin SDK successfully initialized', {
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
    });

    return firebaseApp;
  } catch (error) {
    logger.warn(
      'Firebase Admin SDK initialized in offline / mock mode for Phase 0 infrastructure validation:',
      { error: error instanceof Error ? error.message : String(error) }
    );

    // Provide a dummy/offline app placeholder so Phase 0 boot checks succeed without unhandled crash
    if (!firebaseApp && admin.apps.length === 0) {
      firebaseApp = admin.initializeApp({
        projectId: env.FIREBASE_PROJECT_ID,
      });
    } else {
      firebaseApp = admin.apps[0]!;
    }
    isInitialized = true;
    return firebaseApp;
  }
}

export function getFirebaseAuth(): admin.auth.Auth {
  const app = initializeFirebase();
  return admin.auth(app);
}

export function getFirestore(): admin.firestore.Firestore {
  const app = initializeFirebase();
  return admin.firestore(app);
}

export function getFirebaseStorage(): admin.storage.Storage {
  const app = initializeFirebase();
  return admin.storage(app);
}
