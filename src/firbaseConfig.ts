import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://eagle-30f11-default-rtdb.firebaseio.com/',
});

const db = admin.database();
console.log('✅ Firebase Initialized');

export { db, admin };
