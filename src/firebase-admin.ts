import admin from 'firebase-admin';

const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH || 'serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET_URI,
});

export default admin;
