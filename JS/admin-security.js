// JS Logic for Admin_security.html
document.addEventListener("DOMContentLoaded", () => {
    const passwordForm = document.getElementById("passwordForm");
    const passwordStatus = document.getElementById("passwordStatus");

    if (passwordForm) {
        passwordForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById("currentPassword").value;
            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            // Simple validation
            if (newPassword !== confirmPassword) {
                showStatus("New passwords do not match!", "#fee2e2", "#991b1b");
                return;
            }

            if (newPassword.length < 8) {
                showStatus("Password must be at least 8 characters long.", "#fee2e2", "#991b1b");
                return;
            }

            try {
                // In a real app, you would call an API like:
                // await API.admin.updatePassword({ currentPassword, newPassword });

                console.log("[Admin Security] Password change requested (Simulated)");

                // Simulate network delay
                showStatus("Updating...", "#f1f5f9", "#475569");
                await new Promise(resolve => setTimeout(resolve, 1000));

                showStatus("Password updated successfully!", "#dcfce7", "#166534");
                passwordForm.reset();
            } catch (err) {
                console.error("[Admin Security] Failed to update password:", err);
                showStatus("Failed to update password: " + err.message, "#fee2e2", "#991b1b");
            }
        });
    }

    function showStatus(message, bg, color) {
        passwordStatus.innerText = message;
        passwordStatus.style.background = bg;
        passwordStatus.style.color = color;
        passwordStatus.style.display = "block";

        // Hide after 5 seconds if success
        if (bg === "#dcfce7") {
            setTimeout(() => {
                passwordStatus.style.display = "none";
            }, 5000);
        }
    }
});
