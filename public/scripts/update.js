import {
  set,
  ref,
  get,
  child,
  update,
  increment,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { auth, db } from "./firebase.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.body.classList.remove("d-none");
  } else {
    window.location.replace("/login.html");
  }
});

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

function showAnimation(animation, duration = 5000) {
  showSpinner();
  set(ref(db, "animation"), animation)
    .then(() => {
      hideSpinner();
      showToast("Animation started!");

      // Clear animation after 'duration' seconds
      setTimeout(() => {
        set(ref(db, "animation"), "");
      }, duration);
    })
    .catch(() => {
      hideSpinner();
      showToast("An error occurred", true);
    });
}

const qualifyingTeamsElement = document.getElementById("qualifying-teams");

function addQualifyingTeam(team) {
  const qualifyingTeam = document.createElement("div");
  qualifyingTeam.classList.add("d-flex", "mb-2");
  qualifyingTeam.innerHTML += `
      <input type="text" class="qualifying-team form-control me-2" value="${
        team || ""
      }">
      <button class="btn btn-danger delete-qualifying-team"><span class="material-symbols-outlined">delete</span></button>
  `;
  qualifyingTeamsElement.appendChild(qualifyingTeam);
}

const matchSwitch = document.getElementById("match-switch");
const mainHeading = document.getElementById("main-heading-input")
const teams = document.getElementsByClassName("team-name");
const team1ScoreInput = document.getElementById("team-1-score-input");
const team2ScoreInput = document.getElementById("team-2-score-input");
const substitutionTeamInput = document.getElementById(
  "substitution-team-input"
);
const outgoingElement = document.getElementById("outgoing");
const substituteElement = document.getElementById("substitute");
const halves = document.getElementsByClassName("half");
const qualifyingHeading = document.getElementById("qualifying-heading");
const qualifyingTeamsSwitch = document.getElementById(
  "qualifying-teams-switch"
);

// Update page on value change
showSpinner();
onValue(ref(db, "/"), (snapshot) => {
  hideSpinner();
  const data = snapshot.val();
  if (data.matchOff) {
    matchSwitch.checked = false;
  } else {
    matchSwitch.checked = true;
  }

  if (data.mainHeading) {
    mainHeading.value = data.mainHeading;
  }

  if (data.teamNames && data.teamNames.length === 2) {
    teams[0].value = data.teamNames[0];
    teams[1].value = data.teamNames[1];

    const teamNameH3 = document.getElementsByClassName("team-name-h3");
    teamNameH3[0].textContent = data.teamNames[0];
    teamNameH3[1].textContent = data.teamNames[1];
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
    substitutionTeamInput.value = data.substitutionTeam;
    outgoingElement.value = data.outgoing;
    substituteElement.value = data.substitute;
  }

  if (data.halfText) {
    for (const half of halves) {
      half.checked = data.halfText === half.value;
    }
  }

  if (data.qualifyingHeading) {
    qualifyingHeading.value = data.qualifyingHeading;
  } else {
    qualifyingHeading.value = "";
  }

  if (data.showQualifyingTeams) {
    qualifyingTeamsSwitch.checked = true;
  } else {
    qualifyingTeamsSwitch.checked = false;
  }

  if (data.qualifyingTeams && data.qualifyingTeams.length > 0) {
    qualifyingTeamsElement.innerHTML = "";
    for (const qualifyingTeam of data.qualifyingTeams) {
      addQualifyingTeam(qualifyingTeam);
    }
  }
});

// Show/hide scoreboard
matchSwitch.addEventListener(
  "change",
  () => {
    showSpinner();
    update(ref(db), {
      matchOff: !matchSwitch.checked,
    })
      .then(() => {
        hideSpinner();
        if (matchSwitch.checked) {
          showToast("Scoreboard shown!");
        } else {
          showToast("Scoreboard hidden!");
        }
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

// Update main heading
const updateMainHeading = document.getElementById("update-main-heading");
updateMainHeading.addEventListener(
  "click",
  () => {
    const heading = mainHeading.value.trim();
    if (heading === "") {
      showToast("Main heading cannot be empty", true);
      return;
    }
    showSpinner();
    set(ref(db, "mainHeading"), heading)
      .then(() => {
        hideSpinner();
        showToast("Main heading updated!");
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

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
    const team = substitutionTeamInput.value;
    if (team === "") {
      showToast("Please enter the substitution team", true);
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

// Update half
const updateHalf = document.getElementById("update-half");
updateHalf.addEventListener(
  "click",
  () => {
    showSpinner();
    let halfText = "";
    for (const half of halves) {
      if (half.checked) {
        halfText = half.value;
        break;
      }
    }
    update(dbRef, {
      halfText: halfText,
    })
      .then(() => {
        hideSpinner();
        showToast("Half updated!");
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
    substitutionTeamInput.value = "";
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

// Add qualifying team
const addQualifyingTeamBtn = document.getElementById("add-qualifying-team");
addQualifyingTeamBtn.addEventListener(
  "click",
  () => addQualifyingTeam(),
  false
);

// Delete qualifying team
qualifyingTeamsElement.addEventListener(
  "click",
  (event) => {
    var target = event.target;
    if (target.classList.contains("material-symbols-outlined")) {
      target = target.parentElement;
    }
    if (target.classList.contains("delete-qualifying-team")) {
      const qualifyingTeam = target.parentElement;
      qualifyingTeamsElement.removeChild(qualifyingTeam);
    }
  },
  false
);

// Show/Hide qualifying teams
qualifyingTeamsSwitch.addEventListener(
  "change",
  () => {
    showSpinner();
    update(ref(db), {
      showQualifyingTeams: qualifyingTeamsSwitch.checked,
    })
      .then(() => {
        hideSpinner();
        if (qualifyingTeamsSwitch.checked) {
          showToast("Qualifying teams shown!");
        } else {
          showToast("Qualifying teams hidden!");
        }
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

// Update qualifying teams
const updateQualifyingTeams = document.getElementById(
  "update-qualifying-teams"
);
updateQualifyingTeams.addEventListener(
  "click",
  () => {
    const qualifyingTeams = document.getElementsByClassName("qualifying-team");
    const qualifyingTeamsData = [];
    for (const element of qualifyingTeams) {
      const qualifyingTeam = element.value.trim();
      console.log(element, qualifyingTeam);
      if (!qualifyingTeam) {
        showToast("Please do not leave qualifying team fields blank", true);
        return;
      }
      qualifyingTeamsData.push(qualifyingTeam);
    }
    showSpinner();
    update(ref(db), {
      qualifyingHeading: qualifyingHeading.value,
      qualifyingTeams: qualifyingTeamsData,
    })
      .then(() => {
        hideSpinner();
        showToast("Qualifying teams updated!");
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);

// Show match countdown
const showCountdown = document.getElementById("show-countdown");
showCountdown.addEventListener(
  "click",
  () => {
    showAnimation("match-countdown", 33000);
  },
  false
);
