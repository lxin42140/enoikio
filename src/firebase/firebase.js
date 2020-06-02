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

const functions = require("firebase/firebase-functions");

functions.database.ref("/chats/{pushId}/").onCreate((snapshot, context) => {
  // Grab the current value of what was written to the Realtime Database.
  const original = snapshot.val();
  console.log(context.params.pushId, original);
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to the Firebase Realtime Database.
  // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
  return null;
});

export { storage, database, functions, firebase as default };
