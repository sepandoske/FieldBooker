import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';

// Initialize Firebase Admin
let app;
if (getApps().length === 0) {
  try {
    // Use service account file
    const serviceAccountPath = path.join(process.cwd(), 'server', 'firebase-service-account.json');
    
    app = initializeApp({
      credential: cert(serviceAccountPath),
      projectId: 'mini-football-booking',
    });
    
    console.log('Firebase Admin initialized successfully with service account');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Fallback to default credentials
    app = initializeApp({
      projectId: 'mini-football-booking',
    });
  }
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export { app as adminApp };