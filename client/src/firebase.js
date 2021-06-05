import firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyBjfXxAlh8GbtSdPb9C0blSWP70mp0EM3g',
  authDomain: 'kaisen-os.firebaseapp.com',
  projectId: 'kaisen-os',
  storageBucket: 'kaisen-os.appspot.com',
  messagingSenderId: '794113547364',
  appId: '1:794113547364:web:e406c6a1d50b8749b49371',
  measurementId: 'G-PHP7E5ZRRN',
};

firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
firebase.analytics().logEvent('notification_received');
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

export default firebase;
