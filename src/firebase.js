import firebase from 'firebase/app';
import 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyD14HuWoZ625ed831k6Bf0Fen6Je9zwQUE",
  authDomain: "live-lecture-feedback.firebaseapp.com",
  databaseURL: "https://live-lecture-feedback.firebaseio.com",
  projectId: "live-lecture-feedback",
  storageBucket: "live-lecture-feedback.appspot.com",
  messagingSenderId: "547086373748",
  appId: "1:547086373748:web:b5e2edd24bc37b92"
};

firebase.initializeApp(firebaseConfig);


export const db = firebase.firestore();