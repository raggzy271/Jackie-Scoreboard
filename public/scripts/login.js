import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { auth } from "./firebase.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("/update.html");
  } else {
    document.body.classList.remove("d-none");
  }
});

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

const loginBtn = document.getElementById("login-button");
loginBtn.addEventListener(
  "click",
  () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email && !password) {
      showToast("Please enter email and password", true);
    } else if (!email) {
      showToast("Please enter email", true);
    } else if (!password) {
      showToast("Please enter password", true);
    } else {
      showSpinner();
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          hideSpinner();
          showToast("Login successful");
        })
        .catch((error) => {
          hideSpinner();
          showToast(error.message, true);
        });
    }
  },
  false
);
