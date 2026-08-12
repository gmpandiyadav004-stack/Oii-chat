// ==========================================
// OII CHAT - FULL JAVASCRIPT
// Mobile Number + OTP + Chat
// ==========================================

import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
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
// PHONE OTP
// ==========================================

let recaptchaVerifier = null;
let confirmationResult = null;


// ==========================================
// RECAPTCHA
// ==========================================

function setupRecaptcha() {

    if (recaptchaVerifier) {
        return;
    }

    recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
            size: "normal"
        }
    );

    recaptchaVerifier.render();
}


// ==========================================
// SEND OTP
// ==========================================

window.sendOTP = async function () {

    const phoneInput =
        document.getElementById("phoneNumber");

    if (!phoneInput) {
        return;
    }

    let phone =
        phoneInput.value.trim();

    if (!phone) {

        showAuthMessage(
            "Mobile number enter pannunga da 📱"
        );

        return;
    }

    // India 10 digit number
    if (/^[0-9]{10}$/.test(phone)) {
        phone = "+91" + phone;
    }

    // International number check
    if (!/^\+[1-9][0-9]{7,14}$/.test(phone)) {

        showAuthMessage(
            "Correct mobile number enter pannunga da."
        );

        return;
    }

    try {

        setupRecaptcha();

        showAuthMessage(
            "OTP sending... 📱"
        );

        confirmationResult =
            await signInWithPhoneNumber(
                auth,
                phone,
                recaptchaVerifier
            );

        showAuthMessage(
            "OTP send aayiduchu da ❤️"
        );

    } catch (error) {

        console.log(error);

        if (recaptchaVerifier) {

            try {
                recaptchaVerifier.clear();
            } catch (e) {
                console.log(e);
            }

            recaptchaVerifier = null;
        }

        if (
            error.code ===
            "auth/invalid-phone-number"
        ) {

            showAuthMessage(
                "Mobile number correct-aa enter pannunga da."
            );

        } else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            showAuthMessage(
                "Too many attempts. Konjam neram wait pannunga da."
            );

        } else {

            showAuthMessage(
                "OTP send aagala da. Please try again."
            );
        }
    }
};


// ==========================================
// VERIFY OTP
// ==========================================

window.verifyOTP = async function () {

    const otpInput =
        document.getElementById("otp");

    if (!otpInput) {
        return;
    }

    const otp =
        otpInput.value.trim();

    if (!confirmationResult) {

        showAuthMessage(
            "First Send OTP press pannunga da 📱"
        );

        return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {

        showAuthMessage(
            "6 digit OTP enter pannunga da."
        );

        return;
    }

    try {

        showAuthMessage(
            "OTP verify pannudhu... ⏳"
        );

        await confirmationResult.confirm(otp);

        showAuthMessage(
            "Login successful! ❤️"
        );

    } catch (error) {

        console.log(error);

        if (
            error.code ===
            "auth/invalid-verification-code"
        ) {

            showAuthMessage(
                "OTP wrong da. Correct OTP enter pannunga."
            );

        } else if (
            error.code ===
            "auth/code-expired"
        ) {

            showAuthMessage(
                "OTP expired da. New OTP send pannunga."
            );

        } else {

            showAuthMessage(
                "OTP verification failed da."
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

        console.log(
            "User logged out"
        );

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

    if (!chatWindow) {
        return;
    }

    if (chatTitle) {
        chatTitle.innerText = name;
    }

    if (chatStatus) {
        chatStatus.innerText = status;
    }

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

        chatWindow.style.display =
            "none";
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

    if (!input || !messages) {
        return;
    }

    const message =
        input.value.trim();

    if (message === "") {
        return;
    }

    const messageBox =
        document.createElement("div");

    messageBox.className =
        "message sent";

    const text =
        document.createElement("span");

    text.innerText =
        message;

    const time =
        document.createElement("small");

    time.innerText =
        getTime() + " ✓";

    messageBox.appendChild(text);
    messageBox.appendChild(time);

    messages.appendChild(messageBox);

    input.value = "";

    messages.scrollTop =
        messages.scrollHeight;

    setTimeout(() => {

        time.innerText =
            getTime() + " ✓✓";

    }, 1000);

    setTimeout(() => {

        time.innerText =
            getTime() + " 💞";

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

    const now = new Date();

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

    const clickedTab =
        Array.from(tabs).find(tab => {

            return tab.innerText
                .toLowerCase()
                .includes(
                    tabName.toLowerCase()
                );

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
        document.getElementById(
            "searchInput"
        );

    if (!input) {
        return;
    }

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
            chat.innerText
                .toLowerCase();

        if (text.includes(search)) {

            chat.style.display = "flex";

        } else {

            chat.style.display = "none";
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
            "Oii Chat JavaScript loaded successfully ❤️"
        );

    }
);
