// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyz6lNXonsgHOtlGAPnitJuyfMqJOfQUM",
  authDomain: "test-aa862.firebaseapp.com",
  projectId: "test-aa862",
  storageBucket: "test-aa862.appspot.com",
  messagingSenderId: "361688836584",
  appId: "1:361688836584:web:2f8b347019a6edf1e29c5d",
  measurementId: "G-QZFSXYW3K0",
};

// Initialize Firebase

const FirebaseApp = firebase.initializeApp(firebaseConfig);
const auth = getAuth(FirebaseApp);
const db = firebase.firestore();

export default FirebaseApp;
export { db, auth };
