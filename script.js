// ==========================================
// OII CHAT
// GOOGLE LOGIN + CONTACTS + PROFILE
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
// FIREBASE
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

const myProfile =
    document.getElementById("myProfile");

const myStatus =
    document.getElementById("myStatus");

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

const findContactsBtn =
    document.getElementById("findContactsBtn");

const contactsPanel =
    document.getElementById("contactsPanel");

const closeContactsBtn =
    document.getElementById("closeContactsBtn");

const contactsMessage =
    document.getElementById("contactsMessage");

const contactFriendsList =
    document.getElementById("contactFriendsList");

const friendsList =
    document.getElementById("friendsList");

const emptyChats =
    document.getElementById("emptyChats");


// ==========================================
// DEFAULT PROFILE
// ==========================================

const DEFAULT_PROFILE =
    "profile.png";


// ==========================================
// MESSAGE
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

        return "+91" +
            number.substring(4);

    }


    if (
        number.startsWith("0") &&
        number.length === 11
    ) {

        return "+91" +
            number.substring(1);

    }


    if (
        number.length === 10
    ) {

        return "+91" +
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


        const existing =
            await getDoc(userRef);


        const oldData =
            existing.exists()
                ? existing.data()
                : {};


        const data = {

            uid:
                user.uid,

            name:
                oldData.name ||
                user.displayName ||
                "Oii Chat User",

            email:
                user.email || "",

            photoURL:
                oldData.photoURL ||
                user.photoURL ||
                DEFAULT_PROFILE,

            about:
                oldData.about ||
                "Hey there! I am using Oii Chat.",

            lastLogin:
                new Date()

        };


        if (user.phoneNumber) {

            data.phone =
                normalizePhone(
                    user.phoneNumber
                );

        }


        if (!existing.exists()) {

            data.createdAt =
                new Date();

        }


        await setDoc(

            userRef,

            data,

            {
                merge: true
            }

        );


        console.log(
            "User saved successfully ✅"
        );


    } catch (error) {

        console.error(
            "Save user error:",
            error
        );

    }

}


// ==========================================
// LOAD MY PROFILE
// ==========================================

async function loadMyProfile(user) {

    if (!user) return;

    try {

        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        const snapshot =
            await getDoc(userRef);


        if (!snapshot.exists()) {

            await saveUser(user);

            return;

        }


        const data =
            snapshot.data();


        // NAME

        const name =
            data.name ||
            user.displayName ||
            "Oii Chat User";


        // ABOUT

        const about =
            data.about ||
            "Hey there! I am using Oii Chat.";


        // PHOTO

        const photo =
            data.photoURL ||
            user.photoURL ||
            DEFAULT_PROFILE;


        // UPDATE HOME

        if (myProfile) {

            myProfile.src =
                photo;

        }


        if (myStatus) {

            myStatus.textContent =
                "Online";

        }


        // UPDATE PROFILE PANEL

        if (profilePreview) {

            profilePreview.src =
                photo;

        }


        if (profileNameInput) {

            profileNameInput.value =
                name;

        }


        if (profileAboutInput) {

            profileAboutInput.value =
                about;

        }


        if (profileEmailInput) {

            profileEmailInput.value =
                user.email || "";

        }


        console.log(
            "Profile loaded ✅"
        );


    } catch (error) {

        console.error(
            "Profile load error:",
            error
        );

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

                googleLoginBtn.disabled =
                    true;


                showMessage(
                    "Google login opening... 🔵"
                );


                const result =
                    await signInWithPopup(

                        auth,

                        googleProvider

                    );


                const user =
                    result.user;


                await saveUser(user);

                await loadMyProfile(user);


                showMessage(
                    "Welcome to Oii Chat ❤️
