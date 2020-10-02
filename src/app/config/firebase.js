import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDSBgYQ-plEtLtjO9ONnj-W3PQIxu7lvyk',
  authDomain: 'event-social-cf0ee.firebaseapp.com',
  databaseURL: 'https://event-social-cf0ee.firebaseio.com',
  projectId: 'event-social-cf0ee',
  storageBucket: 'event-social-cf0ee.appspot.com',
  messagingSenderId: '657614279236',
  appId: '1:657614279236:web:a0d874ac29876f1c5c2211',
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
