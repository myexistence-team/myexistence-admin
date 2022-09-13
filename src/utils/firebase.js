// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore"
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvh8vdcmswRQEDSWTdPWwhx_AexJfMDsg",
  authDomain: "myexistance-c4881.firebaseapp.com",
  databaseURL: "https://myexistance-c4881-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myexistance-c4881",
  storageBucket: "myexistance-c4881.appspot.com",
  messagingSenderId: "279276711391",
  appId: "1:279276711391:web:bae479b5385af0538f686a",
  measurementId: "G-1VNQ8RGEJZ"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore()

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export { firebase, firebaseConfig };