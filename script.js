// ==========================================
// OII CHAT - FULL JAVASCRIPT
// Mobile Number + OTP + Chat
// ==========================================

import { 
    RecaptchaVerifier, 
    signInWithPhoneNumber, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// ------------------------------------------
// FIREBASE AUTH
// ------------------------------------------

const auth = window.FirebaseAuth;

// ------------------------------------------
// AUTH MESSAGE
// ------------------------------------------

function showAuthMessage(message) {
    const box = document.getElementById("authMessage");
    
    if (box) {
        box.innerText = message;
    }
}

// ------------------------------------------
// PHONE & OTP
// ------------------------------------------

let recaptchaVerifier = null;
let confirmationResult = null;

// ------------------------------------------
// RECAPTCHA
// ------------------------------------------

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

// ------------------------------------------
// SEND OTP
// ------------------------------------------

window.sendOTP = async function () {
    const phoneInput = document.getElementById("phoneNumber");
    
    if (!phoneInput) {
        return;
    }
    
    let phone = phoneInput.value.trim();
    
    if (!phone) {
        showAuthMessage("தயவுசெய்து மொபைல் எண்ணை உள்ளிடவும்");
        return;
    }
    
    try {
        if (!recaptchaVerifier) {
            setupRecaptcha();
        }
        
        showAuthMessage("OTP அனுப்பப்படுகிறது...");
        confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
        showAuthMessage("OTP வெற்றிகரமாக அனுப்பப்பட்டது!");
        
    } catch (error) {
        console.error("Error sending OTP:", error);
        showAuthMessage("பிழை: " + error.message);
    }
};

// ------------------------------------------
// VERIFY OTP
// ------------------------------------------

window.verifyOTP = async function () {
    const otpElement = document.getElementById("otpInput");
    
    if (!otpElement) {
        return;
    }
    
    const otp = otpElement.value.trim();
    
    if (!otp) {
        showAuthMessage("தயவுசெய்து OTP-ஐ உள்ளிடவும்");
        return;
    }
    
    try {
        showAuthMessage("OTP சரிபார்க்கப்படுகிறது...");
        
        const result = await confirmationResult.confirm(otp);
        const user = result.user;
        
        showAuthMessage("Login வெற்றி! வணக்கம்.");
        console.log("Logged in user:", user);
        
    } catch (error) {
        console.error("Error during verifyOTP:", error);
        showAuthMessage("தவறான OTP. மீண்டும் முயற்சிக்கவும்.");
    }
};
