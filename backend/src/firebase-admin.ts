import admin from 'firebase-admin';

const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH || 'serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URI,
});

export default admin;
