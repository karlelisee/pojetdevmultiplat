import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCORtithe23jelTv34QVQFyuQlC8GHnqjQ",
    authDomain: "covroom-40306.firebaseapp.com",
    projectId: "covroom-40306",
    storageBucket: "covroom-40306.firebasestorage.app",
    messagingSenderId: "473834480845",
    appId: "1:473834480845:web:0ab74181459a86b66fb584",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
