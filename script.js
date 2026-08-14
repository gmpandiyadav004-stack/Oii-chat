// ==========================================
// OII CHAT
// GOOGLE LOGIN + PROFILE + CONTACTS
// MOBILE REDIRECT LOGIN
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    where
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
// INITIALIZE
// ==========================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);

const googleProvider =
    new GoogleAuthProvider();


// ==========================================
// HTML
// ==========================================

const loginScreen =
    document.getElementById("loginScreen");

const chatApp =
    document.getElementById("chatApp");

const googleLoginBtn =
    document.getElementById("googleLoginBtn");

const authMessage =
    document.getElementById("authMessage");

const myProfile =
    document.getElementById("myProfile");

const myStatus =
    document.getElementById("myStatus");


// PROFILE

const profileOpenBtn =
    document.getElementById("profileOpenBtn");

const profilePanel =
    document.getElementById("profilePanel");

const closeProfileBtn =
    document.getElementById("closeProfileBtn");

const profilePreview =
    document.getElementById("profilePreview");

const profilePhotoInput =
    document.getElementById("profilePhotoInput");

const profileNameInput =
    document.getElementById("profileNameInput");

const profileAboutInput =
    document.getElementById("profileAboutInput");

const profileEmailInput =
    document.getElementById("profileEmailInput");

const saveProfileBtn =
    document.getElementById("saveProfileBtn");

const profileMessage =
    document.getElementById("profileMessage");

const logoutBtn =
    document.getElementById("logoutBtn");


// CONTACTS

const findContactsBtn =
    document.getElementById("findContactsBtn");

const contactsPanel =
    document.getElementById("contactsPanel");

const closeContactsBtn =
    document.getElementById("closeContactsBtn");

const contactsMessage =
    document.getElementById("contactsMessage");

const contactFriendsList =
    document.getElementById(
        "contactFriendsList"
    );


// ==========================================
// DEFAULT PHOTO
// ==========================================

const DEFAULT_PROFILE =
    "profile.png";


// ==========================================
// PROFILE PHOTO TEMP
// ==========================================

let pendingProfilePhoto = null;


// ==========================================
// MESSAGES
// ==========================================

function showMessage(text) {

    if (authMessage) {

        authMessage.textContent =
            text;

    }

}


function showProfileMessage(text) {

    if (profileMessage) {

        profileMessage.textContent =
            text;

    }

}


function showContactsMessage(text) {

    if (contactsMessage) {

        contactsMessage.textContent =
            text;

    }

}


// ==========================================
// NORMALIZE PHONE
// ==========================================

function normalizePhone(phone) {

    if (!phone) return "";

    let number =
        String(phone).replace(
            /[^0-9+]/g,
            ""
        );


    if (
        number.startsWith("+91")
    ) {

        return number;

    }


    if (
        number.startsWith("0091")
    ) {

        return (
            "+91" +
            number.substring(4)
        );

    }


    if (
        number.startsWith("0") &&
        number.length === 11
    ) {

        return (
            "+91" +
            number.substring(1)
        );

    }


    if (
        number.length === 10
    ) {

        return (
            "+91" +
            number
        );

    }


    return number;

}


// ==========================================
// SAVE USER
// ==========================================

async function saveUser(user) {

    if (!user) return;

    try {

        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        const existing =
            await getDoc(userRef);


        const oldData =
            existing.exists()
                ? existing.data()
                : {};


        const userData = {

            uid:
                user.uid,

            name:
                oldData.name ||
                user.displayName ||
                "Oii Chat User",

            email:
                user.email ||
                "",

            photoURL:
                oldData.photoURL ||
                user.photoURL ||
                DEFAULT_PROFILE,

            about:
                oldData.about ||
                "Hey there! I am using Oii
