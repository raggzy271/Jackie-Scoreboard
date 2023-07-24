import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  get,
  child,
  update,
  increment,
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
const goalScorers = document.getElementsByClassName("goal-scorers");

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
  // Update scorers
  goalScorers[0].innerHTML = "";
  if (data.team1Scorers && data.team1Scorers.length > 0) {
    for (var i = 0; i < data.team1Scorers.length; i++) {
      goalScorers[0].innerHTML += `
      <li>
        <span>${i + 1}. ${data.team1Scorers[i]}</span>
        <span>${
          data.team1ScorerTimes && data.team1ScorerTimes[i]
            ? data.team1ScorerTimes[i]
            : "-"
        }</span>
      </li>
      `;
    }
  }
  goalScorers[1].innerHTML = "";
  if (data.team2Scorers && data.team2Scorers.length > 0) {
    for (var i = 0; i < data.team2Scorers.length; i++) {
      goalScorers[1].innerHTML += `
      <li>
        <span>${i + 1}. ${data.team2Scorers[i]}</span>
        <span>${
          data.team2ScorerTimes && data.team2ScorerTimes[i]
            ? data.team2ScorerTimes[i]
            : "-"
        }</span>
      </li>
      `;
    }
  }
});

// Show Live Time
const liveTime = document.getElementById("live-time");
liveTime.textContent = new Date().toLocaleTimeString();

// Update live time every second
setInterval(() => {
  liveTime.textContent = new Date().toLocaleTimeString();
}, 1000);
