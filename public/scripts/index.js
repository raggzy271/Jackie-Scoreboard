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

// Update page on value change
onValue(ref(db, "/"), (snapshot) => {
  const data = snapshot.val();

  // Show logo when match is off
  const offMatch = document.getElementById("off-match");
  if (data.matchOff) {
    offMatch.style.display = "flex";
  } else {
    offMatch.style.display = "none";
  }

  // Update team names
  const teamNames = document.getElementsByClassName("team-name");
  if (data.teamNames && data.teamNames.length === 2) {
    teamNames[0].textContent = data.teamNames[0];
    teamNames[1].textContent = data.teamNames[1];
  }

  // Update scores
  const scores = document.getElementsByClassName("score");
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

  // Show substitution
  const substitutionTeam = document.getElementById("substitution-team");
  if (data.substitutionTeam) {
    substitutionTeam.textContent = data.substitutionTeam;
  }

  const outgoing = document.getElementById("outgoing");
  if (data.outgoing) {
    outgoing.textContent = data.outgoing;
  }

  const substitute = document.getElementById("substitute");
  if (data.substitute) {
    substitute.textContent = data.substitute;
  }

  const substitutionContainer = document.getElementById(
    "substitution-container"
  );
  if (data.showSubstitution) {
    substitutionContainer.style.display = "block";
  } else {
    substitutionContainer.style.display = "none";
  }

  // Show animation
  const animationContainer = document.getElementById("animation-container");
  if (data.animation) {
    if (data.animation === "goal") {
      animationContainer.innerHTML = `
          <div id="animation" class="animate__animated animate__fadeIn animate__fast green-bg">
            <div id="animation-content">
                <img src="images/football.png" alt="" id="animation-img"
                    class="animate__animated animate__fadeInBottomLeft animate__fast">
                <div id="animation-text" class="animate__animated animate__fadeIn animate__fast animate__delay-1s">
                    <span class="animate__animated animate__zoomInDown animate__fast animate__delay-1s">GOAAAL!</span>
                </div>
            </div>
          </div>
        `;
      // Remove animation after 5 seconds
      setTimeout(() => {
        animationContainer.innerHTML = `
            <div id="animation" class="animate__animated animate__fadeOut animate__fast animate__delay-1s green-bg">
              <div id="animation-content">
                  <img src="images/football.png" alt="" id="animation-img"
                      class="animate__animated animate__fadeOutTopRight animate__fast animate__delay-1s">
                  <div id="animation-text" class="animate__animated animate__fadeOut animate__fast">
                      <span class="animate__animated animate__zoomOutDown animate__fast">GOAAAL!</span>
                  </div>
              </div>
            </div>
          `;
      }, 5000);
    } else {
      var bg = "blue-bg";
      if (
        [
          "Miss!",
          "Hand Ball!",
          "Red Card!",
          "Offside!",
          "Penalty!",
          "Foul!",
          "Outside!",
        ].includes(data.animation)
      ) {
        bg = "red-bg";
      } else if (["Yellow Card!"].includes(data.animation)) {
        bg = "orange-bg";
      } else if (
        ["What a save!", "Free Kick!", "Corner Kick!", "Goal Kick!"].includes(
          data.animation
        )
      ) {
        bg = "green-bg";
      }

      animationContainer.innerHTML = `
          <div id="animation" class="animate__animated animate__fadeIn animate__fast ${bg}">
            <div id="animation-content">
                <div id="animation-text" class="animate__animated animate__fadeIn animate__fast">
                    <span class="animate__animated animate__zoomInDown animate__fast">${data.animation.toUpperCase()}</span>
                </div>
            </div>
          </div>
        `;
      // Remove animation after 5 seconds
      setTimeout(() => {
        animationContainer.innerHTML = `
            <div id="animation" class="animate__animated animate__fadeOut animate__fast ${bg}">
              <div id="animation-content">
                  <div id="animation-text" class="animate__animated animate__fadeOut animate__fast">
                      <span class="animate__animated animate__zoomOutDown animate__fast">${data.animation.toUpperCase()}</span>
                  </div>
              </div>
            </div>
          `;
      }, 5000);
    }
  }

  // Show/hide pools
  const poolsContainer = document.getElementById("pools-container");
  if (data.showPools) {
    poolsContainer.style.display = "flex";
  } else {
    poolsContainer.style.display = "none";
  }

  const pools = document.getElementById("pools");
  pools.innerHTML = "";
  if (data.pools && data.pools.length > 0) {
    for (const pool of data.pools) {
      pools.innerHTML += `
    <div class="pool">
        <h2 class="pool-heading">${pool.name}</h2>
        <p class="pool-p">${pool.team}</p>
    </div>
    `;
    }
  }
});
