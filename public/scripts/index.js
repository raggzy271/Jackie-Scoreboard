import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDe5JT2xVK-_a7Jm8KZPBGA_gx_x7dFa3o",
  authDomain: "jackie-scoreboard.firebaseapp.com",
  databaseURL:
    "https://jackie-scoreboard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jackie-scoreboard",
  storageBucket: "jackie-scoreboard.appspot.com",
  messagingSenderId: "952592407267",
  appId: "1:952592407267:web:05aa21739ff06eb4ebc3d6",
  measurementId: "G-SFH7SREZ1C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const teamNames = document.getElementsByClassName("team-name");
const scores = document.getElementsByClassName("score");

// Update data fields on value change
onValue(ref(db, "/"), (snapshot) => {
  const data = snapshot.val();
  // Update team names
  if (data.teamNames && data.teamNames.length === 2) {
    teamNames[0].textContent = data.teamNames[0];
    teamNames[1].textContent = data.teamNames[1];
  }
  // Update scores
  if (data.goals1) {
    scores[0].textContent = data.goals1;
  } else {
    scores[0].textContent = 0;
  }
  if (data.goals2) {
    scores[1].textContent = data.goals2;
  } else {
    scores[1].textContent = 0;
  }
});

// Show Live Time
const liveTime = document.getElementById("live-time");
liveTime.textContent = new Date().toLocaleTimeString();

// Update live time every second
setInterval(() => {
  liveTime.textContent = new Date().toLocaleTimeString();
}, 1000);
