// ==========================================
// OII CHAT
// FIREBASE GOOGLE LOGIN + USERS + CONTACTS
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
// MESSAGE
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
// SAVE USER
// ==========================================

async function saveUser(user) {

    try {

        const userRef =
            doc(db, "users", user.uid);


        await setDoc(

            userRef,

            {

                uid: user.uid,

                name:
                    user.displayName || "",

                email:
                    user.email || "",

                photoURL:
                    user.photoURL || "",

                lastLogin:
                    new Date(),

                createdAt:
                    new Date()

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
// UPDATE MY PROFILE
// ==========================================

function updateMyProfile(user) {

    if (!user) return;


    if (myProfile && user.photoURL) {

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
// NORMALIZE PHONE NUMBER
// ==========================================

function normalizePhone(phone) {

    if (!phone) return "";


    let number =
        phone.replace(
            /[^0-9+]/g,
            ""
        );


    // India number handling
    if (
        number.startsWith("0") &&
        number.length === 10
    ) {

        number =
            "+91" +
            number.substring(1);

    }


    if (
        number.length === 10 &&
        !number.startsWith("+")
    ) {

        number =
            "+91" +
            number;

    }


    return number;

}


// ==========================================
// FIND USER BY PHONE
// ==========================================

async function findUserByPhone(phone) {

    try {

        const normalized =
            normalizePhone(phone);


        if (!normalized) {

            return null;

        }


        const usersRef =
            collection(db, "users");


        const q =
            query(
                usersRef,
                where(
                    "phone",
                    "==",
                    normalized
                )
            );


        const snapshot =
            await getDocs(q);


        if (
            snapshot.empty
        ) {

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
            "Find user error:",
            error
        );

        return null;

    }

}


// ==========================================
// SHOW FRIEND
// ==========================================

function addFriendToScreen(user) {

    if (!friendsList) return;


    const friend =
        document.createElement(
            "div"
        );


    friend.className =
        "friend-card";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        user.photoURL ||
        "profile.png";


    image.alt =
        user.name || "Friend";


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


    friend.appendChild(image);

    friend.appendChild(info);


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
// FIND FRIENDS FROM CONTACTS
// ==========================================

async function findFriendsFromContacts() {

    if (!auth.currentUser) {

        showContactsMessage(
            "Please login first ❌"
        );

        return;

    }


    // Browser support check

    if (
        !("contacts" in navigator) ||
        !("ContactsManager" in window)
    ) {

        showContactsMessage(

            "இந்த browser-ல் Contacts access support இல்லை. Android app version-ல் இதை properly செய்யலாம். 📱"

        );

        return;

    }


    try {

        showContactsMessage(
            "Contacts permission கேட்கிறது... 📱"
        );


        const properties = [
            "name",
            "tel"
        ];


        const options = {
            multiple: true
        };


        const contacts =
            await navigator.contacts.select(

                properties,

                options

            );


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
            "Friends தேடுகிறது... 🔍"
        );


        let foundCount = 0;


        for (
            const contact of contacts
        ) {


            if (!contact.tel) {

                continue;

            }


            for (
                const phone of contact.tel
            ) {


                const user =
                    await findUserByPhone(
                        phone
                    );


                if (user) {


                    // Don't show yourself

                    if (
                        auth.currentUser.uid
                        === user.uid
                    ) {

                        continue;

                    }


                    addFriendToScreen(
                        user
                    );


                    foundCount++;

                    break;

                }

            }

        }


        if (foundCount === 0) {

            showContactsMessage(

                "உன் contacts-ல Oii Chat use பண்ற friends இன்னும் கிடைக்கவில்லை. 😕"

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


        showContactsMessage(

            "Contacts access cancelled அல்லது error ஏற்பட்டது ❌"

        );

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
// DEBUG
// ==========================================

console.log(
    "Oii Chat loaded successfully ✅"
);
