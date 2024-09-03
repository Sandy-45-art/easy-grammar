import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


const firebaseConfig = {
  // Your Firebase project configuration goes here
  apiKey: "AIzaSyDbGlNhxbb8lbIK32kxFqHgUlem9QJwdXI",
  authDomain: "grammarapp-d5633.firebaseapp.com",
  projectId: "grammarapp-d5633",
  storageBucket: "grammarapp-d5633.appspot.com",
  messagingSenderId: "758256755101",
  appId: "1:758256755101:web:da51a15b17c5693f998f74"
};

// Initialize Firebase (optional for handling initialization state)
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();


const googleLogin = document.getElementById("google-signin");
googleLogin.addEventListener("click", function () {

  const username = document.getElementById("username").value;

  if (username.trim() === "") {
    alert("Please enter a username before continuing.");
    return;
  }

  signInWithPopup(auth, provider)
    .then(async (result) => {
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        username: username,
        lastLogin: new Date(),
      });

      localStorage.setItem("userName", user.displayName);
      localStorage.setItem("userEmail", user.email);

      console.log(user);
      window.location.href = "home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in with Google:", error, errorCode, errorMessage);
      // Handle errors appropriately, e.g., display error messages to users
    });
});



