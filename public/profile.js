import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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
const auth = getAuth();
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {

  async function fetchQuizScores() {
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(db, "quizScores"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        let scoresHtml = "";
        if (querySnapshot.empty) {
          scoresHtml = "<p>No quiz scores available.</p>";
        } else {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const topic = data.topic || "Unknown Topic"; // Fallback if topic is missing
            const score = data.score || "No score available"; // Fallback if score is missing
            scoresHtml += `<p>Topic: ${topic} - Score: ${score}</p>`;
          });
        }

        document.getElementById("scores").innerHTML = scoresHtml;

      } catch (error) {
        console.error("Error fetching quiz scores: ", error);
        document.getElementById("scores").innerHTML = "<p>Error loading quiz scores.</p>";
      }
    } else {
      console.log("No user is logged in.");
    }
  }

  // Function to display the username
  function displayUsername() {
    const user = auth.currentUser;
    if (user) {
      const usernameElement = document.getElementById("username");
      usernameElement.textContent = user.displayName ? user.displayName : user.email;
    } else {
      console.log("No user is logged in.");
      document.getElementById("username").textContent = "Guest";
    }
  }

  // Listen for auth state changes and load user data
  onAuthStateChanged(auth, (user) => {
    if (user) {
      displayUsername();
      fetchQuizScores();
    } else {
      console.log("No user is logged in.");
    }
  });

});
