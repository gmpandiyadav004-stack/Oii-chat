// ==========================================
// OII CHAT - FIREBASE PHONE OTP
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

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

// ==========================================
// VARIABLES
// ==========================================

let recaptchaVerifier = null;
let confirmationResult = null;

// ==========================================
// MESSAGE
// ==========================================

function showAuthMessage(message) {
    const box = document.getElementById("authMessage");

    if (box) {
        box.innerText = message;
    }
}

// ==========================================
// SETUP reCAPTCHA
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

    const phoneInput = document.getElementById("phoneNumber");

    if (!phoneInput) {
        showAuthMessage("Phone number box கிடைக்கவில்லை");
        return;
    }

    let phone = phoneInput.value.trim();

    if (!phone) {
        showAuthMessage("தயவுசெய்து மொபைல் எண்ணை உள்ளிடவும்");
        return;
    }

    if (!phone.startsWith("+")) {
        showAuthMessage("Number-ஐ +91XXXXXXXXXX format-ல் உள்ளிடவும்");
        return;
    }

    try {

        showAuthMessage("reCAPTCHA loading...");

        setupRecaptcha();

        showAuthMessage("OTP அனுப்பப்படுகிறது...");

        confirmationResult = await signInWithPhoneNumber(
            auth,
            phone,
            recaptchaVerifier
        );

        showAuthMessage("OTP அனுப்பப்பட்டது! 📱");

    } catch (error) {

        console.error("OTP Error:", error);

        showAuthMessage(
            "OTP Error: " + error.message
        );
    }
};

// ==========================================
// VERIFY OTP
// ==========================================

window.verifyOTP = async function () {

    const otpInput = document.getElementById("otpInput");

    if (!otpInput) {
        return;
    }

    const otp = otpInput.value.trim();

    if (!otp) {
        showAuthMessage("தயவுசெய்து OTP-ஐ உள்ளிடவும்");
        return;
    }

    if (!confirmationResult) {
        showAuthMessage("முதலில் Send OTP அழுத்தவும்");
        return;
    }

    try {

        showAuthMessage("OTP சரிபார்க்கப்படுகிறது...");

        const result = await confirmationResult.confirm(otp);

        const user = result.user;

        console.log("Logged in:", user);

        showAuthMessage("Login வெற்றி! ❤️");

        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("chatApp").style.display = "block";

    } catch (error) {

        console.error("Verify Error:", error);

        showAuthMessage(
            "OTP தவறாக உள்ளது. மீண்டும் முயற்சிக்கவும்."
        );
    }
};
