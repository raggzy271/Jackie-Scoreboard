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

function showAnimation(animation) {
  showSpinner();
  set(ref(db, "animation"), animation)
    .then(() => {
      hideSpinner();
      showToast("Animation started!");

      // Clear animation after 5 seconds
      setTimeout(() => {
        set(ref(db, "animation"), "");
      }, 5000);
    })
    .catch(() => {
      hideSpinner();
      showToast("An error occurred", true);
    });
}

const teams = document.getElementsByClassName("team-name");
const team1ScoreInput = document.getElementById("team-1-score-input");
const team2ScoreInput = document.getElementById("team-2-score-input");
const teamSelect = document.getElementById("team-select");
const outgoingElement = document.getElementById("outgoing");
const substituteElement = document.getElementById("substitute");

// Update data fields on value change
onValue(ref(db, "/"), (snapshot) => {
  const data = snapshot.val();
  if (data.teamNames && data.teamNames.length === 2) {
    teams[0].value = data.teamNames[0];
    teams[1].value = data.teamNames[1];

    // Update team options
    teamSelect.innerHTML = `
      <option>${data.teamNames[0]}</option>
      <option>${data.teamNames[1]}</option>
    `;
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

  if (data.showSubstitution) {
    teamSelect.value = data.substitutionTeam;
    outgoingElement.value = data.outgoing;
    substituteElement.value = data.substitute;
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
              showAnimation("goal");
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
              showAnimation("goal");
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
              showAnimation("goal");
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
              showAnimation("goal");
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

// Show substitution
const showSubstitution = document.getElementById("show-substitution");
showSubstitution.addEventListener(
  "click",
  () => {
    const team = teamSelect.value;
    if (team === "") {
      showToast("Please select a team for substitution", true);
      return;
    }
    const outgoing = outgoingElement.value.trim();
    if (outgoing === "") {
      showToast("Please enter the outgoing jersey number", true);
      return;
    }
    const substitute = substituteElement.value.trim();
    if (substitute === "") {
      showToast("Please enter the substitute jersey number", true);
      return;
    }

    showSpinner();
    update(dbRef, {
      substitutionTeam: team,
      outgoing: outgoing,
      substitute: substitute,
      showSubstitution: true,
    })
      .then(() => {
        hideSpinner();
        showToast("Substitution Shown!");
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

// Hide substitution
const hideSubstitution = document.getElementById("hide-substitution");
hideSubstitution.addEventListener(
  "click",
  () => {
    teamSelect.value = "";
    outgoingElement.value = "";
    substituteElement.value = "";

    showSpinner();
    update(dbRef, {
      substitutionTeam: "",
      outgoing: "",
      substitute: "",
      showSubstitution: false,
    })
      .then(() => {
        hideSpinner();
        showToast("Substitution Hidden!");
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

// Show Animations
const animationButtons = document.getElementById("animation-buttons");
animationButtons.addEventListener(
  "click",
  (event) => {
    const target = event.target;
    if (target.classList.contains("btn")) {
      showAnimation(target.textContent);
    }
  },
  false
);

const customModal = new bootstrap.Modal("#customModal");

// Show Custom Animation
const showCustomAnimation = document.getElementById("show-custom-animation");
showCustomAnimation.addEventListener(
  "click",
  () => {
    const customMessage = document.getElementById("custom-message");
    const message = customMessage.value.trim();
    if (message) {
      showAnimation(message);
      customModal.hide();
      customMessage.value = "";
    } else {
      showToast("Please enter a message", true);
    }
  },
  false
);
