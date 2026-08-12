// ==========================================
// OII CHAT - FULL JAVASCRIPT
// ==========================================

// Firebase Auth imports
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ==========================================
// FIREBASE AUTH
// ==========================================

const auth = window.oiiAuth;


// ==========================================
// AUTH MESSAGE
// ==========================================

function showAuthMessage(message) {

    const box = document.getElementById("authMessage");

    if (box) {
        box.innerText = message;
    }
}


// ==========================================
// CREATE ACCOUNT
// ==========================================

window.registerUser = async function () {

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    if (!email || !password) {

        showAuthMessage(
            "Email and password enter pannunga da."
        );

        return;
    }

    if (password.length < 6) {

        showAuthMessage(
            "Password minimum 6 characters irukkanum."
        );

        return;
    }

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        showAuthMessage(
            "Account created successfully! "
        );

    } catch (error) {

        console.log(error);

        if (error.code === "auth/email-already-in-use") {

            showAuthMessage(
                " email already registered da."
            );

        } else if (error.code === "auth/invalid-email") {

            showAuthMessage(
                "Email  enter  da."
            );

        } else {

            showAuthMessage(
                "Account create .  try ."
            );
        }
    }
};


// ==========================================
// LOGIN
// ==========================================

window.loginUser = async function () {

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    if (!email || !password) {

        showAuthMessage(
            "Email and password enter pannunga da."
        );

        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        showAuthMessage(
            "Login successful! "
        );

    } catch (error) {

        console.log(error);

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password"
        ) {

            showAuthMessage(
                "Email  password  da."
            );

        } else if (
            error.code === "auth/user-not-found"
        ) {

            showAuthMessage(
                " email- account ."
            );

        } else {

            showAuthMessage(
                "Login .  try ."
            );
        }
    }
};


// ==========================================
// LOGOUT
// ==========================================

window.logoutUser = async function () {

    try {

        await signOut(auth);

        console.log("User logged out");

    } catch (error) {

        console.log(error);

    }
};


// ==========================================
// OPEN CHAT
// ==========================================

window.openChat = function (name, status) {

    const chatWindow =
        document.getElementById("chatWindow");

    const chatTitle =
        document.getElementById("chatTitle");

    const chatStatus =
        document.getElementById("chatStatus");

    if (!chatWindow) return;

    if (chatTitle) {
        chatTitle.innerText = name;
    }

    if (chatStatus) {
        chatStatus.innerText = status;
    }

    // IMPORTANT
    // Open chat window
    chatWindow.style.display = "flex";

    setTimeout(() => {

        const input =
            document.getElementById("messageInput");

        if (input) {
            input.focus();
        }

    }, 200);
};


// ==========================================
// CLOSE CHAT
// ==========================================

window.closeChat = function () {

    const chatWindow =
        document.getElementById("chatWindow");

    if (chatWindow) {

        chatWindow.style.display = "none";

    }
};


// ==========================================
// SEND MESSAGE
// ==========================================

window.sendMessage = function () {

    const input =
        document.getElementById("messageInput");

    const messages =
        document.getElementById("messages");

    if (!input || !messages) return;

    const message =
        input.value.trim();

    if (message === "") {
        return;
    }

    // Message container
    const messageBox =
        document.createElement("div");

    messageBox.className =
        "message sent";


    // Message text
    const text =
        document.createElement("span");

    text.innerText =
        message;


    // Time
    const time =
        document.createElement("small");

    time.innerText =
        getTime() + " ";


    messageBox.appendChild(text);

    messageBox.appendChild(time);

    messages.appendChild(messageBox);


    // Clear input
    input.value = "";


    // Scroll bottom
    messages.scrollTop =
        messages.scrollHeight;


    // Delivered
    setTimeout(() => {

        time.innerText =
            getTime() + " ";

    }, 1000);


    // Read
    setTimeout(() => {

        time.innerText =
            getTime() + " ";

    }, 2500);
};


// ==========================================
// ENTER TO SEND
// ==========================================

window.handleEnter = function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        window.sendMessage();

    }
};


// ==========================================
// CURRENT TIME
// ==========================================

function getTime() {

    const now =
        new Date();

    return now.toLocaleTimeString(
        [],
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


// ==========================================
// SHOW TABS
// ==========================================

window.showTab = function (tabName) {

    const contents =
        document.querySelectorAll(
            ".tab-content"
        );

    contents.forEach(content => {

        content.classList.remove("active");

    });


    const tabs =
        document.querySelectorAll(".tab");

    tabs.forEach(tab => {

        tab.classList.remove("active");

    });


    const selected =
        document.getElementById(tabName);

    if (selected) {

        selected.classList.add("active");

    }


    // Find clicked tab
    const clickedTab =
        Array.from(tabs).find(tab => {

            return tab.innerText
                .toLowerCase()
                .includes(tabName.toLowerCase());

        });


    if (clickedTab) {

        clickedTab.classList.add("active");

    }
};


// ==========================================
// SEARCH CHATS
// ==========================================

window.searchChats = function () {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const search =
        input.value
            .toLowerCase()
            .trim();


    const chats =
        document.querySelectorAll(
            ".chat-item"
        );


    chats.forEach(chat => {

        const text =
            chat.innerText.toLowerCase();

        if (text.includes(search)) {

            chat.style.display =
                "flex";

        } else {

            chat.style.display =
                "none";

        }

    });
};


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Oii Chat JavaScript loaded successfully "
        );

    }
);