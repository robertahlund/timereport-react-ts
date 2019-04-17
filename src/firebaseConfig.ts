import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyDFHNB7tTHCjDELxK9cVoVpfG0DYV46hPc",
  authDomain: "time-e29fa.firebaseapp.com",
  databaseURL: "https://time-e29fa.firebaseio.com",
  projectId: "time-e29fa",
  storageBucket: "time-e29fa.appspot.com",
  messagingSenderId: "816455198616"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();