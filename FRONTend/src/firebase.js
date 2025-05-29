
  // // Import the functions you need from the SDKs you need
  // import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  // // TODO: Add SDKs for Firebase products that you want to use
  // // https://firebase.google.com/docs/web/setup#available-libraries

  // // Your web app's Firebase configuration
  // const firebaseConfig = {
  //   apiKey: "AIzaSyA-4v-RVTv-io_-WOh-xLrld36OhQDbCNQ",
  //   authDomain: "sdlogin-5473b.firebaseapp.com",
  //   projectId: "sdlogin-5473b",
  //   storageBucket: "sdlogin-5473b.firebasestorage.app",
  //   messagingSenderId: "15320781706",
  //   appId: "1:15320781706:web:c8d14c9822d7b3e199ee73"
  // };

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);


import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

 const firebaseConfig = {
    apiKey: "AIzaSyA-4v-RVTv-io_-WOh-xLrld36OhQDbCNQ",
    authDomain: "sdlogin-5473b.firebaseapp.com",
    projectId: "sdlogin-5473b",
    storageBucket: "sdlogin-5473b.firebasestorage.app",
    messagingSenderId: "15320781706",
    appId: "1:15320781706:web:c8d14c9822d7b3e199ee73"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
