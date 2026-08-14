import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyCzPOAjXI0dJ33RJCVIUyCCFGyeI50Dvd0",
    authDomain: "oii-chat-8802e.firebaseapp.com",
    projectId: "oii-chat-8802e",
    storageBucket: "oii-chat-8802e.firebasestorage.app",
    messagingSenderId: "1017345795063",
    appId: "1:1017345795063:web:c6f7930dac8b37760d84f2",
    measurementId: "G-TRX2FSBNRB"
};


// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ===============================
// GOOGLE PROVIDER
// ===============================

const googleProvider = new GoogleAuthProvider();


// ===============================
// ELEMENTS
// ===============================

const loginScreen = document.getElementById("loginScreen");
const chatApp = document.getElementById("chatApp");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const message = document.getElementById("authMessage");


// ===============================
// MESSAGE
// ===============================

function showMessage(text) {
    if (message) {
        message.innerText = text;
    }
}


// ===============================
// GOOGLE LOGIN
// ===============================

googleLoginBtn.addEventListener("click", async () => {

    try {

        googleLoginBtn.disabled = true;

        showMessage("Google login opening... 🔵");

        console.log("[Oii Chat] Google login started");

        const result = await signInWithPopup(
            auth,
            googleProvider
        );

        const user = result.user;

        console.log("[Oii Chat] Login successful:", user.uid);

        showMessage(
            `Welcome ${user.displayName || "to Oii Chat"} ❤️`
        );

        // Hide login screen
        loginScreen.style.display = "none";

        // Show chat app
        chatApp.style.display = "block";

    } catch (error) {

        console.error(
            "[Oii Chat] Google login error:",
            error.code
        );

        if (error.code === "auth/popup-closed-by-user") {

            showMessage(
                "Google login cancel pannitinga."
            );

        } else if (error.code === "auth/popup-blocked") {

            showMessage(
                "Google login popup browser block panniduchu. Please allow popups."
            );

        } else {

            showMessage(
                "Google login failed ❌ Please try again."
            );
        }

    } finally {

        googleLoginBtn.disabled = false;
    }
});


// ===============================
// CHECK LOGIN STATE
// ===============================

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log(
            "[Oii Chat] Existing login detected:",
            user.uid
        );

        loginScreen.style.display = "none";
        chatApp.style.display = "block";

    } else {

        console.log("[Oii Chat] No user logged in");

        loginScreen.style.display = "flex";
        chatApp.style.display = "none";
    }
});
