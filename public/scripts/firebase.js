import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Initialize Firebase
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

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);