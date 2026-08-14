// ==========================================
// OII CHAT - FIREBASE GOOGLE LOGIN + USERS
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyCzPOAjXI0dJ33RJCVIUyCCFGyeI50Dvd0",
    authDomain: "oii-chat-8802e.firebaseapp.com",
    projectId: "oii-chat-8802e",
    storageBucket: "oii-chat-8802e.firebasestorage.app",
    messagingSenderId: "1017345795063",
    appId: "1:1017345795063:web:c6f7930dac8b37760d84f2",
    measurementId: "G-TRX2FSBNRB"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const loginScreen =
    document.getElementById("loginScreen");

const chatApp =
    document.getElementById("chatApp");

const googleLoginBtn =
    document.getElementById("googleLoginBtn");

const authMessage =
    document.getElementById("authMessage");


// ==========================================
// MESSAGE
// ==========================================

function showMessage(text) {

    if (authMessage) {
        authMessage.textContent = text;
    }

}


// ==========================================
// SAVE USER TO FIRESTORE
// ==========================================

async function saveUser(user) {

    try {

        const userRef =
            doc(db, "users", user.uid);

        await setDoc(
            userRef,
            {
                uid: user.uid,

                name: user.displayName || "",

                email: user.email || "",

                photoURL: user.photoURL || "",

                lastLogin: serverTimestamp(),

                createdAt: serverTimestamp()
            },
            {
                merge: true
            }
        );

        console.log(
            "User saved successfully ✅"
        );

    } catch (error) {

        console.error(
            "User save error:",
            error
        );

        throw error;
    }

}


// ==========================================
// GOOGLE LOGIN
// ==========================================

if (googleLoginBtn) {

    googleLoginBtn.addEventListener(
        "click",
        async function () {

            try {

                googleLoginBtn.disabled = true;

                showMessage(
                    "Google login opening... 🔵"
                );

                const result =
                    await signInWithPopup(
                        auth,
                        googleProvider
                    );

                const user = result.user;

                console.log(
                    "Google login successful:",
                    user.email
                );


                // SAVE USER
                await saveUser(user);


                showMessage(
                    "Welcome to Oii Chat ❤️"
                );


                // HIDE LOGIN
                if (loginScreen) {
                    loginScreen.style.display =
                        "none";
                }


                // SHOW CHAT
                if (chatApp) {
                    chatApp.style.display =
                        "block";
                }


            } catch (error) {

                console.error(
                    "Google Login Error:",
                    error
                );

                showMessage(
                    "Login failed ❌ " +
                    error.message
                );

            } finally {

                googleLoginBtn.disabled =
                    false;

            }

        }
    );

} else {

    console.error(
        "Google Login button not found ❌"
    );

}


// ==========================================
// CHECK LOGIN STATE
// ==========================================

onAuthStateChanged(
    auth,
    async function (user) {

        if (user) {

            console.log(
                "User already logged in:",
                user.email
            );


            // Save/update user
            try {

                await saveUser(user);

            } catch (error) {

                console.error(
                    "Auto save error:",
                    error
                );

            }


            // Hide login
            if (loginScreen) {
                loginScreen.style.display =
                    "none";
            }


            // Show app
            if (chatApp) {
                chatApp.style.display =
                    "block";
            }

        } else {

            console.log(
                "No user logged in"
            );


            // Show login
            if (loginScreen) {
                loginScreen.style.display =
                    "flex";
            }


            // Hide app
            if (chatApp) {
                chatApp.style.display =
                    "none";
            }

        }

    }
);


// ==========================================
// OPTIONAL LOGOUT FUNCTION
// ==========================================

window.logoutOiiChat = async function () {

    try {

        await signOut(auth);

        showMessage(
            "Logged out successfully 👋"
        );

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

};
