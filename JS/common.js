// Navbar and Global Common Logic
document.addEventListener("DOMContentLoaded", () => {
    const user = typeof UserManager !== 'undefined' ? UserManager.get() : null;
    const navButtons = document.getElementById("navButtons");

    if (user && navButtons) {
        // Initialize Navbar
        const dashboardUrl = user.role === 'client' ? './User_dashboard.html' : './Counsellor_dashboard.html';

        // Adjust paths if on root or in HTML subdir
        const isSubdir = window.location.pathname.includes('/HTML/');
        const baseDir = isSubdir ? '.' : './HTML';
        const logoutPath = isSubdir ? '../index.html' : './index.html';

        navButtons.innerHTML = `
        <div style="display: flex; gap: 15px; align-items: center;">
            <a class="login-btn" href="${dashboardUrl}">Dashboard</a>
            <a href="#" id="globalLogoutBtn" style="color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 14px;">Logout</a>
        </div>
      `;

        document.getElementById("globalLogoutBtn")?.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });

        // Initialize Profile Image
        const sidebarImg = document.getElementById("sidebarProfileImage");
        if (user.profile_image && sidebarImg) {
            sidebarImg.src = user.profile_image;
        }
    }
});

function logout() {
    if (typeof TokenManager !== 'undefined') TokenManager.remove();
    if (typeof UserManager !== 'undefined') UserManager.remove();
    const isSubdir = window.location.pathname.includes('/HTML/');
    window.location.href = isSubdir ? "../index.html" : "./index.html";
}

// Make globally available
window.logout = logout;
window.commonInit = true;
