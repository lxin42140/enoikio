import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA8gGPPoETtgZc0vygcR2-ya0BYHDzQEIc",
  authDomain: "enoikio-orbit2020.firebaseapp.com",
  databaseURL: "https://enoikio-orbit2020.firebaseio.com",
  projectId: "enoikio-orbit2020",
  storageBucket: "enoikio-orbit2020.appspot.com",
  messagingSenderId: "966582410192",
  appId: "1:966582410192:web:1569e763c1deefd0a9f7d5",
  measurementId: "G-0XTHT5R087",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const database = firebase.database();

export { storage, database, firebase as default };
