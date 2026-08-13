import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber
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


// ===============================
// MESSAGE
// ===============================

const message = document.getElementById("authMessage");

function showMessage(text) {
    message.innerText = text;
}


// ===============================
// reCAPTCHA
// ===============================

let recaptchaVerifier;
let confirmationResult;

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
}


// ===============================
// SEND OTP
// ===============================

window.sendOTP = async function () {

    const phoneNumber =
        document.getElementById("phoneNumber").value.trim();

    if (!phoneNumber) {
        showMessage("Phone number enter pannunga 📱");
        return;
    }

    if (!phoneNumber.startsWith("+")) {
        showMessage(
            "Country code use pannunga. Example: +919876543210"
        );
        return;
    }

    try {

        showMessage("OTP sending... 📩");

        setupRecaptcha();

        confirmationResult =
            await signInWithPhoneNumber(
                auth,
                phoneNumber,
                recaptchaVerifier
            );

        showMessage(
            "OTP sent successfully ❤️ 6-digit OTP enter pannunga."
        );

    } catch (error) {

        console.error(error);

        showMessage(
            "OTP send aagala ❌ " + error.message
        );

        if (recaptchaVerifier) {
            recaptchaVerifier.clear();
            recaptchaVerifier = null;
        }
    }
};


// ===============================
// VERIFY OTP
// ===============================

window.verifyOTP = async function () {

    const otp =
        document.getElementById("otpInput").value.trim();

    if (!confirmationResult) {
        showMessage("First Send OTP click pannunga 📩");
        return;
    }

    if (otp.length !== 6) {
        showMessage("6-digit OTP enter pannunga 🔢");
        return;
    }

    try {

        showMessage("Verifying OTP... ⏳");

        await confirmationResult.confirm(otp);

        showMessage("Login successful ❤️");

        // Hide login
        document.getElementById("loginScreen").style.display = "none";

        // Show chat
        document.getElementById("chatApp").style.display = "block";

    } catch (error) {

        console.error(error);

        showMessage(
            "Wrong OTP ❌ Please try again."
        );
    }
};
