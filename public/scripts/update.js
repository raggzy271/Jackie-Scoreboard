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
const team1Players = document.getElementsByClassName("team-1-player");
const team2Players = document.getElementsByClassName("team-2-player");
const team1Score = document.getElementById("team-1-score");
const team2Score = document.getElementById("team-2-score");
const team1ScoreInput = document.getElementById("team-1-score-input");
const team2ScoreInput = document.getElementById("team-2-score-input");
const team1Tbody = document.getElementById("team-1-tbody");
const team2Tbody = document.getElementById("team-2-tbody");
const scorer1Select = document.getElementById("scorer-1-select");
const scorer2Select = document.getElementById("scorer-2-select");
const time1Input = document.getElementById("time-1-input");
const time2Input = document.getElementById("time-2-input");

// Update data fields on value change
onValue(ref(db, "/"), (snapshot) => {
  const data = snapshot.val();
  if (data.teamNames && data.teamNames.length === 2) {
    teams[0].value = data.teamNames[0];
    teams[1].value = data.teamNames[1];
  }
  if (data.team1Players && data.team1Players.length === team1Players.length) {
    for (var i = 0; i < team1Players.length; i++) {
      team1Players[i].value = data.team1Players[i];
    }
  }
  if (data.team2Players && data.team2Players.length === team2Players.length) {
    for (var i = 0; i < team2Players.length; i++) {
      team2Players[i].value = data.team2Players[i];
    }
  }
  if (data.goals1) {
    team1Score.textContent = data.goals1;
    team1ScoreInput.value = data.goals1;
  } else {
    team1Score.textContent = 0;
    team1ScoreInput.value = 0;
  }
  if (data.goals2) {
    team2Score.textContent = data.goals2;
    team2ScoreInput.value = data.goals2;
  } else {
    team2Score.textContent = 0;
    team2ScoreInput.value = 0;
    team2Tbody.innerHTML = "";
  }
  team1Tbody.innerHTML = "";
  team2Tbody.innerHTML = "";

  for (var i = 0; i < data.goals1; i++) {
    team1Tbody.innerHTML += `<tr>
            <td>${i + 1}</td>
            <td>
            <input type="text" class="form-control team-1-scorer" value="${
              data.team1Scorers && data.team1Scorers[i]
                ? data.team1Scorers[i]
                : ""
            }"></td>
            <td><input type="text" class="form-control team-1-scorer-time" value="${
              data.team1ScorerTimes && data.team1ScorerTimes[i]
                ? data.team1ScorerTimes[i]
                : ""
            }"></td>
        </tr>`;
  }
  for (var i = 0; i < data.goals2; i++) {
    team2Tbody.innerHTML += `<tr>
            <td>${i + 1}</td>
            <td><input type="text" class="form-control team-2-scorer" value="${
              data.team2Scorers && data.team2Scorers[i]
                ? data.team2Scorers[i]
                : ""
            }"></td>
            <td><input type="text" class="form-control team-2-scorer-time" value="${
              data.team2ScorerTimes && data.team2ScorerTimes[i]
                ? data.team2ScorerTimes[i]
                : ""
            }"></td>
        </tr>`;
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

// Update team 1 players
const updateTeam1Players = document.getElementById("update-team-1-players");
updateTeam1Players.addEventListener("click", () => {
  const playerNames = [];
  for (let i = 0; i < team1Players.length; i++) {
    const playerName = team1Players[i].value.trim();
    if (playerName === "") {
      showToast("Player names cannot be empty", true);
      return;
    }
    playerNames.push(team1Players[i].value);
  }
  showSpinner();
  set(ref(db, "team1Players"), playerNames)
    .then(() => {
      hideSpinner();
      const teamName = teams[0].value.trim() || "Team 1";
      showToast(`${teamName} players updated!`);
    })
    .catch(() => {
      hideSpinner();
      showToast("An error occurred", true);
    });
});

// Update team 2 players
const updateTeam2Players = document.getElementById("update-team-2-players");
updateTeam2Players.addEventListener("click", () => {
  const playerNames = [];
  for (let i = 0; i < team2Players.length; i++) {
    const playerName = team2Players[i].value.trim();
    if (playerName === "") {
      showToast("Player names cannot be empty", true);
      return;
    }
    playerNames.push(team2Players[i].value);
  }
  showSpinner();
  set(ref(db, "team2Players"), playerNames)
    .then(() => {
      hideSpinner();
      const teamName = teams[1].value.trim() || "Team 2";
      showToast(`${teamName} players updated!`);
    })
    .catch(() => {
      hideSpinner();
      showToast("An error occurred", true);
    });
});

// Trigger team 1's goal modal
const team1Goal = document.getElementById("team-1-goal");
const goal1Modal = new bootstrap.Modal("#goal1Modal");

team1Goal.addEventListener(
  "click",
  () => {
    scorer1Select.innerHTML = "<option selected>Select</option>";

    // Add Player Names to options
    for (let i = 0; i < team1Players.length; i++) {
      const playerName = team1Players[i].value.trim();
      if (playerName === "") {
        showToast("Please enter all player names first", true);
        return;
      }
      scorer1Select.innerHTML += `<option>${playerName}</option>`;
    }

    // Trigger modal
    goal1Modal.show();
  },
  false
);

// Add goal & scorer for team 1
const addGoal1 = document.getElementById("add-goal-1");
addGoal1.addEventListener(
  "click",
  () => {
    showSpinner();

    // Validate scorer form
    if (scorer1Select.selectedIndex === 0 || time1Input.value.trim() === "") {
      hideSpinner();
      showToast("Please fill in all fields", true);
      return;
    }

    var success = 0;

    // Update goals
    get(child(dbRef, "goals1"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // If goals1 exists, increment it
          update(dbRef, { goals1: increment(1) })
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer1Select.selectedIndex = 0;
                time1Input.value = "";
                goal1Modal.hide();
                const teamName = teams[0].value.trim() || "Team 1";
                showToast(`Added 1 goal for ${teamName}!`);
              }
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        } else {
          // If goals1 does not exist, set it to 1
          set(ref(db, "goals1"), 1)
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer1Select.selectedIndex = 0;
                time1Input.value = "";
                goal1Modal.hide();
                const teamName = teams[0].value.trim() || "Team 1";
                showToast(`Added 1 goal for ${teamName}!`);
              }
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

    // Update scorers
    get(child(dbRef, "team1Scorers"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // If team1Scorers exists, push to it
          set(ref(db, "team1Scorers"), [...snapshot.val(), scorer1Select.value])
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer1Select.selectedIndex = 0;
                time1Input.value = "";
                goal1Modal.hide();
                const teamName = teams[0].value.trim() || "Team 1";
                showToast(`Added 1 goal for ${teamName}!`);
              }
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        } else {
          // If team1Scorers does not exist, create it
          set(ref(db, "team1Scorers"), [scorer1Select.value])
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer1Select.selectedIndex = 0;
                time1Input.value = "";
                goal1Modal.hide();
                const teamName = teams[0].value.trim() || "Team 1";
                showToast(`Added 1 goal for ${teamName}!`);
              }
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

    // Update scorer times
    get(child(dbRef, "team1ScorerTimes"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // If team1ScorerTimes exists, push to it
          set(ref(db, "team1ScorerTimes"), [
            ...snapshot.val(),
            time1Input.value,
          ])
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer1Select.selectedIndex = 0;
                time1Input.value = "";
                goal1Modal.hide();
                const teamName = teams[0].value.trim() || "Team 1";
                showToast(`Added 1 goal for ${teamName}!`);
              }
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        } else {
          // If team1Scorers does not exist, create it
          set(ref(db, "team1ScorerTimes"), [time1Input.value])
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer1Select.selectedIndex = 0;
                time1Input.value = "";
                goal1Modal.hide();
                const teamName = teams[0].value.trim() || "Team 1";
                showToast(`Added 1 goal for ${teamName}!`);
              }
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

// Trigger team 2's goal modal
const team2Goal = document.getElementById("team-2-goal");
const goal2Modal = new bootstrap.Modal("#goal2Modal");

team2Goal.addEventListener(
  "click",
  () => {
    scorer2Select.innerHTML = "<option selected>Select</option>";

    // Add Player Names to options
    for (let i = 0; i < team2Players.length; i++) {
      const playerName = team2Players[i].value.trim();
      if (playerName === "") {
        showToast("Please enter all player names first", true);
        return;
      }
      scorer2Select.innerHTML += `<option>${playerName}</option>`;
    }

    // Trigger modal
    goal2Modal.show();
  },
  false
);

// Add goal & scorer for team 2
const addGoal2 = document.getElementById("add-goal-2");
addGoal2.addEventListener(
  "click",
  () => {
    showSpinner();

    // Validate scorer form
    if (scorer2Select.selectedIndex === 0 || time2Input.value.trim() === "") {
      hideSpinner();
      showToast("Please fill in all fields", true);
      return;
    }

    var success = 0;

    // Update goals
    get(child(dbRef, "goals2"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // If goals2 exists, increment it
          update(dbRef, { goals2: increment(1) })
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer2Select.selectedIndex = 0;
                time2Input.value = "";
                goal2Modal.hide();
                const teamName = teams[1].value.trim() || "Team 2";
                showToast(`Added 1 goal for ${teamName}!`);
              }
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        } else {
          // If goals2 does not exist, set it to 1
          set(ref(db, "goals2"), 1)
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer2Select.selectedIndex = 0;
                time2Input.value = "";
                goal2Modal.hide();
                const teamName = teams[1].value.trim() || "Team 2";
                showToast(`Added 1 goal for ${teamName}!`);
              }
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

    // Update scorers
    get(child(dbRef, "team2Scorers"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // If team2Scorers exists, push to it
          set(ref(db, "team2Scorers"), [...snapshot.val(), scorer2Select.value])
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer2Select.selectedIndex = 0;
                time2Input.value = "";
                goal2Modal.hide();
                const teamName = teams[1].value.trim() || "Team 2";
                showToast(`Added 1 goal for ${teamName}!`);
              }
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        } else {
          // If team2Scorers does not exist, create it
          set(ref(db, "team2Scorers"), [scorer2Select.value])
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer2Select.selectedIndex = 0;
                time2Input.value = "";
                goal2Modal.hide();
                const teamName = teams[1].value.trim() || "Team 2";
                showToast(`Added 1 goal for ${teamName}!`);
              }
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

    // Update scorer times
    get(child(dbRef, "team2ScorerTimes"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // If team2ScorerTimes exists, push to it
          set(ref(db, "team2ScorerTimes"), [
            ...snapshot.val(),
            scorer2Select.value,
          ])
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer2Select.selectedIndex = 0;
                time2Input.value = "";
                goal2Modal.hide();
                const teamName = teams[1].value.trim() || "Team 2";
                showToast(`Added 1 goal for ${teamName}!`);
              }
            })
            .catch(() => {
              hideSpinner();
              showToast("An error occurred", true);
            });
        } else {
          // If team2Scorers does not exist, create it
          set(ref(db, "team2ScorerTimes"), [time2Input.value])
            .then(() => {
              success++;
              if (success === 3) {
                hideSpinner();
                scorer2Select.selectedIndex = 0;
                time2Input.value = "";
                goal2Modal.hide();
                const teamName = teams[1].value.trim() || "Team 2";
                showToast(`Added 1 goal for ${teamName}!`);
              }
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
      team1Scorers: [],
      team2Scorers: [],
      team1ScorerTimes: [],
      team2ScorerTimes: [],
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
    const team1ScoreInput = document.getElementById("team-1-score-input");
    const team2ScoreInput = document.getElementById("team-2-score-input");
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

// Update scorers
const updateScorers = document.getElementById("update-scorers");
updateScorers.addEventListener(
  "click",
  () => {
    var success = 0;

    // Update team 1 scorers
    const team1ScorerInputs = document.getElementsByClassName("team-1-scorer");
    const team1Scorers = [];
    for (let i = 0; i < team1ScorerInputs.length; i++) {
      team1Scorers.push(team1ScorerInputs[i].value);
    }
    showSpinner();
    set(ref(db, "team1Scorers"), team1Scorers)
      .then(() => {
        success++;
        if (success === 4) {
          hideSpinner();
          showToast("Updated goal scorers!");
        }
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });

    // Update team 1 scorer times
    const team1ScorerTimeInputs =
      document.getElementsByClassName("team-1-scorer-time");
    const team1ScorerTimes = [];
    for (let i = 0; i < team1ScorerTimeInputs.length; i++) {
      team1ScorerTimes.push(team1ScorerTimeInputs[i].value);
    }
    set(ref(db, "team1ScorerTimes"), team1ScorerTimes)
      .then(() => {
        success++;
        if (success === 4) {
          hideSpinner();
          showToast("Updated goal scorers!");
        }
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });

    // Update team 2 scorers
    const team2ScorerInputs = document.getElementsByClassName("team-2-scorer");
    const team2Scorers = [];
    for (let i = 0; i < team2ScorerInputs.length; i++) {
      team2Scorers.push(team2ScorerInputs[i].value);
    }
    set(ref(db, "team2Scorers"), team2Scorers)
      .then(() => {
        success++;
        if (success === 4) {
          hideSpinner();
          showToast("Updated goal scorers!");
        }
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });

    // Update team 2 scorer times
    const team2ScorerTimeInputs =
      document.getElementsByClassName("team-2-scorer-time");
    const team2ScorerTimes = [];
    for (let i = 0; i < team2ScorerTimeInputs.length; i++) {
      team2ScorerTimes.push(team2ScorerTimeInputs[i].value);
    }
    set(ref(db, "team2ScorerTimes"), team2ScorerTimes)
      .then(() => {
        success++;
        if (success === 4) {
          hideSpinner();
          showToast("Updated goal scorers!");
        }
      })
      .catch(() => {
        hideSpinner();
        showToast("An error occurred", true);
      });
  },
  false
);
