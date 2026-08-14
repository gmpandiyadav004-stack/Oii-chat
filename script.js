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

const googleProvider = new GoogleAuthProvider();


// ===============================
// GET HTML ELEMENTS
// ===============================

const loginScreen =
    document.getElementById("loginScreen");

const chatApp =
    document.getElementById("chatApp");

const googleLoginBtn =
    document.getElementById("googleLoginBtn");

const authMessage =
    document.getElementById("authMessage");


// ===============================
// MESSAGE
// ===============================

function showMessage(text) {

    if (authMessage) {
        authMessage.textContent = text;
    }

}


// ===============================
// GOOGLE LOGIN
// ===============================

if (googleLoginBtn) {

    googleLoginBtn.addEventListener(
        "click",
        async function () {

            try {

                googleLoginBtn.disabled = true;

                showMessage(
                    "Google login opening... 🔵"
                );

                console.log(
                    "Oii Chat: Google login started"
                );

                const result =
                    await signInWithPopup(
                        auth,
                        googleProvider
                    );

                const user = result.user;

                console.log(
                    "Oii Chat: Login successful",
                    user.email
                );

                showMessage(
                    "Login successful ❤️"
                );

                loginScreen.style.display =
                    "none";

                chatApp.style.display =
                    "block";

            }

            catch (error) {

                console.error(
                    "Oii Chat Google Login Error:",
                    error
                );

                showMessage(
                    "Google Login Error ❌ " +
                    error.message
                );

            }

            finally {

                googleLoginBtn.disabled =
                    false;

            }

        }
    );

} else {

    console.error(
        "Oii Chat: googleLoginBtn not found ❌"
    );

}


// ===============================
// LOGIN STATE
// ===============================

onAuthStateChanged(
    auth,
    function (user) {

        if (user) {

            console.log(
                "Oii Chat: User already logged in",
                user.email
            );

            loginScreen.style.display =
                "none";

            chatApp.style.display =
                "block";

        } else {

            console.log(
                "Oii Chat: No user logged in"
            );

            loginScreen.style.display =
                "flex";

            chatApp.style.display =
                "none";

        }

    }
);
