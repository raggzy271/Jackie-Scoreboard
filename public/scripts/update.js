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
const dbRef = ref(db);

const spinner = document.getElementById("spinner-container");

function showSpinner() {
  spinner.classList.remove("d-none");
}

function hideSpinner() {
  spinner.classList.add("d-none");
}

function showToast(message, error = false) {
  const toast = document.getElementById("toast");
  if (error) {
    toast.classList.remove("text-bg-success");
    toast.classList.add("text-bg-danger");
  } else {
    toast.classList.remove("text-bg-danger");
    toast.classList.add("text-bg-success");
  }
  const toastBody = toast.querySelector(".toast-body");
  toastBody.textContent = message;
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
  toastBootstrap.show();
}

const teams = document.getElementsByClassName("team-name");
const team1ScoreInput = document.getElementById("team-1-score-input");
const team2ScoreInput = document.getElementById("team-2-score-input");

// Update data fields on value change
onValue(ref(db, "/"), (snapshot) => {
  const data = snapshot.val();
  if (data.teamNames && data.teamNames.length === 2) {
    teams[0].value = data.teamNames[0];
    teams[1].value = data.teamNames[1];
  }
  if (data.goals1) {
    team1ScoreInput.value = data.goals1;
  } else {
    team1ScoreInput.value = 0;
  }
  if (data.goals2) {
    team2ScoreInput.value = data.goals2;
  } else {
    team2ScoreInput.value = 0;
  }
});

// Update team names
const updateTeamNames = document.getElementById("update-team-names");
updateTeamNames.addEventListener(
  "click",
  () => {
    const teamNames = [];
    for (let i = 0; i < teams.length; i++) {
      const teamName = teams[i].value.trim();
      if (teamName === "") {
        showToast("Team name cannot be empty", true);
        return;
      }
      teamNames.push(teams[i].value);
    }
    showSpinner();
    set(ref(db, "teamNames"), [teams[0].value, teams[1].value])
      .then(() => {
        hideSpinner();
        showToast("Team names updated!");
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

// Add goal for team 1
const team1Goal = document.getElementById("team-1-goal");
team1Goal.addEventListener(
  "click",
  () => {
    showSpinner();
    get(child(dbRef, "goals1"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // If goals1 exists, increment it
          update(dbRef, { goals1: increment(1) })
            .then(() => {
              hideSpinner();
              const teamName = teams[0].value.trim() || "Team 1";
              showToast(`Added 1 goal for ${teamName}!`);
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        } else {
          // If goals1 does not exist, set it to 1
          set(ref(db, "goals1"), 1)
            .then(() => {
              hideSpinner();
              const teamName = teams[0].value.trim() || "Team 1";
              showToast(`Added 1 goal for ${teamName}!`);
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        }
      })
      .catch((error) => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

// Add goal for team 2
const team2Goal = document.getElementById("team-2-goal");
team2Goal.addEventListener(
  "click",
  () => {
    showSpinner();
    get(child(dbRef, "goals2"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // If goals2 exists, increment it
          update(dbRef, { goals2: increment(1) })
            .then(() => {
              hideSpinner();
              const teamName = teams[1].value.trim() || "Team 2";
              showToast(`Added 1 goal for ${teamName}!`);
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        } else {
          // If goals2 does not exist, set it to 1
          set(ref(db, "goals2"), 1)
            .then(() => {
              hideSpinner();
              const teamName = teams[1].value.trim() || "Team 2";
              showToast(`Added 1 goal for ${teamName}!`);
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        }
      })
      .catch((error) => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

// Reset goals
const resetGoals = document.getElementById("reset-goals");
resetGoals.addEventListener(
  "click",
  () => {
    showSpinner();
    update(dbRef, {
      goals1: 0,
      goals2: 0,
    })
      .then(() => {
        hideSpinner();
        showToast("Goals reset!");
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

// Update goals
const updateGoals = document.getElementById("update-goals");
updateGoals.addEventListener(
  "click",
  () => {
    showSpinner();
    update(dbRef, {
      goals1: parseInt(team1ScoreInput.value),
      goals2: parseInt(team2ScoreInput.value),
    })
      .then(() => {
        hideSpinner();
        showToast("Goals updated!");
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);
