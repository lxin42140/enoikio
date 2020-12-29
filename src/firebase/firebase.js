import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {

};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const database = firebase.database();
const auth = firebase.auth();

export { storage, database, auth, firebase as default };
