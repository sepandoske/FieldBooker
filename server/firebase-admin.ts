import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let app;
if (getApps().length === 0) {
  try {
    // Try to use service account key if available
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : null;
    
    if (serviceAccount) {
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    } else {
      // Fallback to default credentials
      app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'mini-football-booking',
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Fallback to default credentials
    app = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'mini-football-booking',
    });
  }
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export { app as adminApp };