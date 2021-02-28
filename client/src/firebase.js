import firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyCLZfdcAjFI68rP6vUfl5vytzcCZpyU20E',
  authDomain: 'mern-authentication-6634c.firebaseapp.com',
  databaseURL: 'https://mern-authentication-6634c.firebaseio.com',
  projectId: 'mern-authentication-6634c',
  storageBucket: 'mern-authentication-6634c.appspot.com',
  messagingSenderId: '840594058093',
  appId: '1:840594058093:web:ce274f8640b737aa43c864',
};

firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

export default firebase;
