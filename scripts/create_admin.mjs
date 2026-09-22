import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCeahYd3lWzUmOBSPYPUlmo4M6Mey-dtX8",
  authDomain: "vinimay-p2p-marketplace.firebaseapp.com",
  projectId: "vinimay-p2p-marketplace",
  storageBucket: "vinimay-p2p-marketplace.firebasestorage.app",
  messagingSenderId: "156039209240",
  appId: "1:156039209240:web:026e706e28b00a6af73e6d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function run() {
  const adminEmail = 'admin@autopartshub.com';
  const adminPass = 'Admin@AutoParts2026!';

  try {
    const cred = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
    console.log('SUCCESS: Admin user created in Firebase Auth with UID:', cred.user.uid);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists in Firebase Auth. Testing sign-in...');
      try {
        const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
        console.log('SUCCESS: Admin sign-in verified! UID:', cred.user.uid);
      } catch (signInErr) {
        console.error('Sign-in failed for existing admin:', signInErr.message);
      }
    } else {
      console.error('Failed to create admin user:', err.message, err.code);
    }
  }
}

run();
