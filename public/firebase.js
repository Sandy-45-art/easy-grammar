// firebase.js

// Import the necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDbGlNhxbb8lbIK32kxFqHgUlem9QJwdXI",
    authDomain: "grammarapp-d5633.firebaseapp.com",
    projectId: "grammarapp-d5633",
    storageBucket: "grammarapp-d5633.appspot.com",
    messagingSenderId: "758256755101",
    appId: "1:758256755101:web:da51a15b17c5693f998f74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firestore and Authentication for use in other scripts
export { db, auth };
