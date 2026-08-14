console.log("Oii Chat script loaded");

const googleLoginBtn = document.getElementById("googleLoginBtn");

if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", function () {
        alert("Google button working ✅");
        console.log("Google button clicked");
    });
} else {
    console.error("googleLoginBtn not found ❌");
}
