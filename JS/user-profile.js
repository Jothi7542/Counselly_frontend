// JS Logic for Profile.html (Client Profile)
document.addEventListener("DOMContentLoaded", () => {
    const user = UserManager.get();
    if (!user || user.role !== 'client') {
        window.location.href = "./auth.html";
        return;
    }

    // Populate text
    const welcomeEl = document.getElementById("profileWelcome");
    const nameDisplay = document.getElementById("displayName");
    const emailDisplay = document.getElementById("displayEmail");
    const avatarImg = document.getElementById("displayAvatar");
    const memberSinceEl = document.getElementById("memberSince");
    const sidebarImg = document.getElementById("sidebarProfileImage");

    if (welcomeEl) welcomeEl.innerText = `Welcome Back, ${user.name ? user.name.split(' ')[0] : 'User'}`;
    if (nameDisplay) nameDisplay.innerText = user.name || "User";
    if (emailDisplay) emailDisplay.innerText = user.email || "";

    if (user.profile_image) {
        if (avatarImg) avatarImg.src = user.profile_image;
        if (sidebarImg) sidebarImg.src = user.profile_image;
    }

    if (user.created_at && memberSinceEl) {
        const date = new Date(user.created_at);
        memberSinceEl.innerText = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    // Populate form
    const fName = document.getElementById("profName");
    const fEmail = document.getElementById("profEmail");
    const fPhone = document.getElementById("profPhone");
    const fGender = document.getElementById("profGender");
    const fAge = document.getElementById("profAge");
    const fAddr = document.getElementById("profAddress");
    const fLang = document.getElementById("profLanguage");

    if (fName) fName.value = user.name || "";
    if (fEmail) fEmail.value = user.email || "";
    if (fPhone) fPhone.value = user.phone_number || "";
    if (fGender) fGender.value = user.gender || "";
    if (fAge) fAge.value = user.age || "";
    if (fAddr) fAddr.value = user.address || "";
    if (fLang) fLang.value = Array.isArray(user.language) ? user.language.join(", ") : (user.language || "");
});

// Trigger file input on click
const avatarWrapper = document.querySelector('.avatar-wrapper');
if (avatarWrapper) {
    avatarWrapper.addEventListener('click', () => {
        const input = document.getElementById('imageInput');
        if (input) input.click();
    });
}

// Handle File Selection and Preview
const imageInput = document.getElementById('imageInput');
if (imageInput) {
    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.getElementById('displayAvatar');
                if (img) img.src = e.target.result; // Preview
            };
            reader.readAsDataURL(file);
        }
    });
}

const profileForm = document.getElementById("profileForm");
if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const user = UserManager.get();
        const submitBtn = e.target.querySelector('.save-btn');
        const originalText = submitBtn ? submitBtn.innerText : "Update Profile";

        const langVal = document.getElementById("profLanguage") ? document.getElementById("profLanguage").value : "";
        const languages = langVal
            .split(",")
            .map(s => s.trim())
            .filter(s => s !== "");

        const currentObj = document.getElementById('displayAvatar');
        const profileImage = currentObj ? currentObj.src : (user.profile_image || "");

        const updatedData = {
            name: document.getElementById("profName").value,
            phone_number: document.getElementById("profPhone").value,
            gender: document.getElementById("profGender").value,
            age: parseInt(document.getElementById("profAge").value) || null,
            address: document.getElementById("profAddress").value,
            language: languages,
            profile_image: profileImage
        };

        try {
            if (submitBtn) {
                submitBtn.innerText = "Updating...";
                submitBtn.disabled = true;
            }

            await API.clients.update(user.clients_id, updatedData);

            // Update local storage
            const newUser = { ...user, ...updatedData };
            UserManager.set(newUser);

            alert("Success: Your profile has been updated!");
            window.location.reload();
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            if (submitBtn) {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}
