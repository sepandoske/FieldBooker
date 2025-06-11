import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let app;
if (getApps().length === 0) {
  // In production, you would use a service account key
  // For development, we'll use the default credentials
  app = initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'mini-football-booking',
  });
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export { app as adminApp };