// JS Logic for C_profile.html (Counsellor Profile Settings)
document.addEventListener("DOMContentLoaded", async () => {
    const user = typeof UserManager !== 'undefined' ? UserManager.get() : null;
    if (!user || user.role !== 'counsellor') {
        window.location.href = "./auth.html";
        return;
    }

    // Initialize Navbar & Sidebar is handled by common.js
    // Page Specific: Fetch fresh data and handle form
    try {
        const freshUser = await API.counsellors.getById(user.counsellors_id);

        const nameInput = document.getElementById("profileName");
        const emailInput = document.getElementById("profileEmail");
        const specInput = document.getElementById("profileSpecialization");
        const expInput = document.getElementById("profileExperience");
        const currentImg = document.getElementById("currentProfileImage");
        const sidebarImg = document.getElementById("sidebarProfileImage");

        if (nameInput) nameInput.value = freshUser.name || "";
        if (emailInput) emailInput.value = freshUser.email || "";
        if (specInput) specInput.value = freshUser.specialization || "";
        if (expInput) expInput.value = freshUser.experience || "";

        const imgUrl = freshUser.profile_image || user.profile_image;
        if (imgUrl) {
            if (currentImg) currentImg.src = imgUrl;
            if (sidebarImg) sidebarImg.src = imgUrl;
        }

        // Handle Image Upload
        const imageInput = document.getElementById("profileImageInput");
        if (imageInput) {
            imageInput.addEventListener("change", async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const statusMsg = document.getElementById("uploadStatus");
                if (statusMsg) {
                    statusMsg.innerText = "Uploading...";
                    statusMsg.style.color = "var(--text-muted)";
                }

                try {
                    const result = await API.counsellors.uploadProfileImage(user.counsellors_id, file);
                    console.log("Upload success:", result);

                    if (currentImg) currentImg.src = result.image_url;
                    if (sidebarImg) sidebarImg.src = result.image_url;

                    if (statusMsg) {
                        statusMsg.innerText = "Updated successfully!";
                        statusMsg.style.color = "green";
                    }

                    // Update local storage
                    user.profile_image = result.image_url;
                    UserManager.set(user);

                } catch (err) {
                    console.error("Upload failed:", err);
                    if (statusMsg) {
                        statusMsg.innerText = "Upload failed. Try again.";
                        statusMsg.style.color = "red";
                    }
                }
            });
        }

        // Handle Form Submission
        const profileForm = document.getElementById("profileForm");
        if (profileForm) {
            profileForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const updateData = {
                    name: nameInput.value,
                    specialization: specInput.value,
                    experience: parseInt(expInput.value)
                };

                try {
                    await API.counsellors.update(user.counsellors_id, updateData);
                    alert("Profile updated successfully!");

                    // Update local storage name
                    user.name = updateData.name;
                    UserManager.set(user);
                } catch (err) {
                    console.error("Update failed:", err);
                    alert("Failed to update profile: " + err.message);
                }
            });
        }

    } catch (err) {
        console.error("Failed to fetch fresh profile:", err);
        // Fallback to local storage
        const nameInput = document.getElementById("profileName");
        const emailInput = document.getElementById("profileEmail");
        const currentImg = document.getElementById("currentProfileImage");

        if (nameInput) nameInput.value = user.name || "";
        if (emailInput) emailInput.value = user.email || "";
        if (currentImg && user.profile_image) currentImg.src = user.profile_image;
    }
});
