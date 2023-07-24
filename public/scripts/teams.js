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
const teamList = document.getElementsByClassName("team-list");

// Update data fields on value change
onValue(ref(db, "/"), (snapshot) => {
  const data = snapshot.val();
  // Update team names
  if (data.teamNames && data.teamNames.length === 2) {
    teamNames[0].textContent = data.teamNames[0];
    teamNames[1].textContent = data.teamNames[1];
  }
  // Update team list
  teamList[0].innerHTML = "";
  if (data.team1Players) {
    data.team1Players.forEach((player) => {
      teamList[0].innerHTML += `<li>${player}</li>`;
    });
  }
  teamList[1].innerHTML = "";
  if (data.team2Players) {
    data.team2Players.forEach((player) => {
      teamList[1].innerHTML += `<li>${player}</li>`;
    });
  }
});

// Show Live Time
const liveTime = document.getElementById("live-time");
liveTime.textContent = new Date().toLocaleTimeString();

// Update live time every second
setInterval(() => {
  liveTime.textContent = new Date().toLocaleTimeString();
}, 1000);
