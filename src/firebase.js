import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRwa6T4WBfNLnfA0488TGrpikYuGDtkXg",
  authDomain: "crud-biblioteca-497fe.firebaseapp.com",
  projectId: "crud-biblioteca-497fe",
  storageBucket: "crud-biblioteca-497fe.appspot.com",
  messagingSenderId: "285769857488",
  appId: "1:285769857488:web:049d6fb7a45e5de30b61d5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
export {firebase, auth}