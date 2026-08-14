// ==========================================
// OII CHAT
// FIREBASE GOOGLE LOGIN + USERS + CONTACTS
// OTP இல்லாமல்
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

const myProfile =
    document.getElementById("myProfile");


// ==========================================
// AUTH MESSAGE
// ==========================================

function showMessage(text) {

    if (authMessage) {

        authMessage.textContent = text;

    }

}


// ==========================================
// CONTACT MESSAGE
// ==========================================

function showContactsMessage(text) {

    if (contactsMessage) {

        contactsMessage.textContent = text;

    }

}


// ==========================================
// NORMALIZE EMAIL
// ==========================================

function normalizeEmail(email) {

    if (!email) return "";

    return email
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

    // +91 9876543210
    if (
        number.startsWith("+91")
    ) {

        number =
            "+91" +
            number.substring(3)
                .replace(/\D/g, "");

    }

    // 0091 9876543210
    else if (
        number.startsWith("0091")
    ) {

        number =
            "+91" +
            number.substring(4);

    }

    // 09876543210
    else if (
        number.startsWith("0") &&
        number.length === 11
    ) {

        number =
            "+91" +
            number.substring(1);

    }

    // 9876543210
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

    try {

        const userRef =
            doc(db, "users", user.uid);

        const userData = {

            uid: user.uid,

            name:
                user.displayName || "",

            email:
                normalizeEmail(
                    user.email || ""
                ),

            photoURL:
                user.photoURL || "",

            lastLogin:
                new Date(),

            createdAt:
                new Date()

        };


        // If Firebase Auth has a phone
        // number, save it too.

        if (user.phoneNumber) {

            userData.phone =
                normalizePhone(
                    user.phoneNumber
                );

        }


        await setDoc(

            userRef,

            userData,

            {
                merge: true
            }

        );


        console.log(
            "Oii Chat user saved ✅",
            userData
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
// UPDATE MY PROFILE
// ==========================================

function updateMyProfile(user) {

    if (!user) return;

    if (
        myProfile &&
        user.photoURL
    ) {

        myProfile.src =
            user.photoURL;

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


                console.log(
                    "Google login successful:",
                    user.email
                );


                await saveUser(user);

                updateMyProfile(user);


                showMessage(
                    "Welcome to Oii Chat ❤️"
                );


                if (loginScreen) {

                    loginScreen.style.display =
                        "none";

                }


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

}


// ==========================================
// FIND USER BY EMAIL
// ==========================================

async function findUserByEmail(email) {

    const normalizedEmail =
        normalizeEmail(email);

    if (!normalizedEmail) {

        return null;

    }


    try {

        const usersRef =
            collection(db, "users");


        const q =
            query(

                usersRef,

                where(
                    "email",
                    "==",
                    normalizedEmail
                )

            );


        const snapshot =
            await getDocs(q);


        if (snapshot.empty) {

            return null;

        }


        let foundUser = null;


        snapshot.forEach(

            function (document) {

                foundUser =
                    document.data();

            }

        );


        return foundUser;


    } catch (error) {

        console.error(
            "Find user by email error:",
            error
        );

        return null;

    }

}


// ==========================================
// FIND USER BY PHONE
// ==========================================

async function findUserByPhone(phone) {

    const normalizedPhone =
        normalizePhone(phone);

    if (!normalizedPhone) {

        return null;

    }


    try {

        const usersRef =
            collection(db, "users");


        const q =
            query(

                usersRef,

                where(
                    "phone",
                    "==",
                    normalizedPhone
                )

            );


        const snapshot =
            await getDocs(q);


        if (snapshot.empty) {

            return null;

        }


        let foundUser = null;


        snapshot.forEach(

            function (document) {

                foundUser =
                    document.data();

            }

        );


        return foundUser;


    } catch (error) {

        console.error(
            "Find user by phone error:",
            error
        );

        return null;

    }

}


// ==========================================
// FIND USER FROM ONE CONTACT
// ==========================================

async function findOiiUserFromContact(contact) {

    // --------------------------------------
    // 1. EMAIL MATCH
    // --------------------------------------

    if (contact.email) {

        for (
            const email of contact.email
        ) {

            const user =
                await findUserByEmail(
                    email
                );


            if (user) {

                return user;

            }

        }

    }


    // --------------------------------------
    // 2. PHONE MATCH
    // --------------------------------------

    if (contact.tel) {

        for (
            const phone of contact.tel
        ) {

            const user =
                await findUserByPhone(
                    phone
                );


            if (user) {

                return user;

            }

        }

    }


    return null;

}


// ==========================================
// DIRECT CHAT
// ==========================================

function openDirectChat(user) {

    if (!user) return;


    console.log(
        "Opening direct chat with:",
        user.name,
        user.uid
    );


    /*
       If your existing chat system already
       has a function called openChat(),
       use it automatically.
    */

    if (
        typeof window.openChat ===
        "function"
    ) {

        window.openChat(user);

        return;

    }


    /*
       Otherwise keep selected user
       ready for the next chat system.
    */

    window.selectedOiiChatUser =
        user;


    showContactsMessage(

        `${user.name || "Friend"} selected 💬`

    );

}


// ==========================================
// SHOW FRIEND
// ==========================================

function addFriendToScreen(user) {

    if (!friendsList) return;


    // --------------------------------------
    // FRIEND CARD
    // --------------------------------------

    const friend =
        document.createElement(
            "div"
        );


    friend.className =
        "friend-card";


    friend.style.cursor =
        "pointer";


    friend.style.display =
        "flex";


    friend.style.alignItems =
        "center";


    friend.style.gap =
        "12px";


    friend.style.padding =
        "10px";


    // --------------------------------------
    // PROFILE IMAGE
    // --------------------------------------

    const image =
        document.createElement(
            "img"
        );


    image.src =
        user.photoURL ||
        "profile.png";


    image.alt =
        user.name ||
        "Friend";


    image.width = 50;

    image.height = 50;


    image.style.borderRadius =
        "50%";


    image.style.objectFit =
        "cover";


    // --------------------------------------
    // INFO
    // --------------------------------------

    const info =
        document.createElement(
            "div"
        );


    const name =
        document.createElement(
            "h3"
        );


    name.textContent =
        user.name ||
        "Oii Chat User";


    const email =
        document.createElement(
            "p"
        );


    email.textContent =
        user.email || "";


    info.appendChild(name);

    info.appendChild(email);


    // --------------------------------------
    // ADD
    // --------------------------------------

    friend.appendChild(image);

    friend.appendChild(info);


    // --------------------------------------
    // TAP FRIEND
    // --------------------------------------

    friend.addEventListener(

        "click",

        function () {

            openDirectChat(user);

        }

    );


    friendsList.appendChild(friend);

}


// ==========================================
// CLEAR FRIENDS
// ==========================================

function clearFriends() {

    if (friendsList) {

        friendsList.innerHTML = "";

    }

}


// ==========================================
// FIND FRIENDS FROM PHONE CONTACTS
// ==========================================

async function findFriendsFromContacts() {

    // --------------------------------------
    // LOGIN CHECK
    // --------------------------------------

    if (!auth.currentUser) {

        showContactsMessage(
            "Please login first ❌"
        );

        return;

    }


    // --------------------------------------
    // CONTACTS API CHECK
    // --------------------------------------

    if (
        !("contacts" in navigator)
    ) {

        showContactsMessage(

            "இந்த browser-ல் Phone Contacts access இல்லை. 📱"

        );

        return;

    }


    if (
        !navigator.contacts ||
        !navigator.contacts.select
    ) {

        showContactsMessage(

            "இந்த device/browser Contacts API support செய்யவில்லை. 📱"

        );

        return;

    }


    try {

        showContactsMessage(
            "Contacts permission கேட்கிறது... 📱"
        );


        // ----------------------------------
        // REQUEST CONTACT DATA
        // ----------------------------------

        const properties = [

            "name",

            "tel",

            "email"

        ];


        const options = {

            multiple: true

        };


        const contacts =
            await navigator.contacts.select(

                properties,

                options

            );


        // ----------------------------------
        // NOTHING SELECTED
        // ----------------------------------

        if (
            !contacts ||
            contacts.length === 0
        ) {

            showContactsMessage(

                "Contacts select செய்யவில்லை."

            );

            return;

        }


        clearFriends();


        showContactsMessage(
            "Oii Chat users தேடுகிறது... 🔍"
        );


        // ----------------------------------
        // PREVENT DUPLICATES
        // ----------------------------------

        const foundUserIds =
            new Set();


        let foundCount = 0;


        // ----------------------------------
        // CHECK EVERY CONTACT
        // ----------------------------------

        for (
            const contact of contacts
        ) {

            const user =
                await findOiiUserFromContact(
                    contact
                );


            if (!user) {

                continue;

            }


            // --------------------------------
            // DON'T SHOW MYSELF
            // --------------------------------

            if (
                auth.currentUser.uid ===
                user.uid
            ) {

                continue;

            }


            // --------------------------------
            // DON'T SHOW DUPLICATES
            // --------------------------------

            if (
                foundUserIds.has(
                    user.uid
                )
            ) {

                continue;

            }


            foundUserIds.add(
                user.uid
            );


            addFriendToScreen(user);

            foundCount++;

        }


        // ----------------------------------
        // RESULT
        // ----------------------------------

        if (
            foundCount === 0
        ) {

            showContactsMessage(

                "உன் contacts-ல Oii Chat use பண்றவர்கள் கிடைக்கவில்லை. 😕"

            );

        } else {

            showContactsMessage(

                `${foundCount} Oii Chat friend(s) found ❤️`

            );

        }


    } catch (error) {

        console.error(
            "Contacts error:",
            error
        );


        if (
            error.name ===
            "NotAllowedError"
        ) {

            showContactsMessage(

                "Contacts permission கொடுக்கவில்லை ❌"

            );

        } else {

            showContactsMessage(

                "Contacts access error ❌"

            );

        }

    }

}


// ==========================================
// CONTACT BUTTON
// ==========================================

if (findContactsBtn) {

    findContactsBtn.addEventListener(

        "click",

        findFriendsFromContacts

    );

}


// ==========================================
// LOGIN STATE
// ==========================================

onAuthStateChanged(

    auth,

    async function (user) {

        if (user) {

            console.log(
                "User logged in:",
                user.email
            );


            try {

                await saveUser(user);

            } catch (error) {

                console.error(
                    "Auto save error:",
                    error
                );

            }


            updateMyProfile(user);


            if (loginScreen) {

                loginScreen.style.display =
                    "none";

            }


            if (chatApp) {

                chatApp.style.display =
                    "block";

            }


        } else {

            console.log(
                "No user logged in"
            );


            if (loginScreen) {

                loginScreen.style.display =
                    "flex";

            }


            if (chatApp) {

                chatApp.style.display =
                    "none";

            }

        }

    }

);


// ==========================================
// LOGOUT
// ==========================================

window.logoutOiiChat =
    async function () {

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


// ==========================================
// MAKE FUNCTIONS AVAILABLE
// ==========================================

window.findFriendsFromContacts =
    findFriendsFromContacts;

window.openDirectChat =
    openDirectChat;


// ==========================================
// DEBUG
// ==========================================

console.log(
    "Oii Chat Contacts System loaded ✅"
);

console.log(
    "Google Login + Users + Contacts + Matching ready 🔥"
);
