// ==========================================
// OII CHAT
// FIREBASE GOOGLE LOGIN
// USERS + CONTACTS
// WHATSAPP STYLE FRONT PAGE
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

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
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider =
    new GoogleAuthProvider();


// ==========================================
// HTML ELEMENTS
// ==========================================

const loginScreen =
    document.getElementById("loginScreen");

const chatApp =
    document.getElementById("chatApp");

const googleLoginBtn =
    document.getElementById("googleLoginBtn");

const authMessage =
    document.getElementById("authMessage");

const findContactsBtn =
    document.getElementById("findContactsBtn");

const contactsMessage =
    document.getElementById("contactsMessage");

const friendsList =
    document.getElementById("friendsList");

const contactFriendsList =
    document.getElementById("contactFriendsList");

const contactsPanel =
    document.getElementById("contactsPanel");

const closeContactsBtn =
    document.getElementById("closeContactsBtn");

const emptyChats =
    document.getElementById("emptyChats");


// ==========================================
// MESSAGES
// ==========================================

function showMessage(text) {

    if (authMessage) {

        authMessage.textContent =
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
// NORMALIZE EMAIL
// ==========================================

function normalizeEmail(email) {

    if (!email) return "";

    return String(email)
        .trim()
        .toLowerCase();

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

        number =
            "+91" +
            number.substring(3);

    }

    else if (
        number.startsWith("0091")
    ) {

        number =
            "+91" +
            number.substring(4);

    }

    else if (
        number.startsWith("0") &&
        number.length === 11
    ) {

        number =
            "+91" +
            number.substring(1);

    }

    else if (
        number.length === 10
    ) {

        number =
            "+91" +
            number;

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


        const data = {

            uid:
                user.uid,

           
