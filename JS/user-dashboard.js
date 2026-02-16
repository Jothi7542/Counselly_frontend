// JS Logic for User_dashboard.html
document.addEventListener("DOMContentLoaded", async () => {
    const user = UserManager.get();

    if (!user || user.role !== 'client') {
        window.location.href = "./auth.html";
        return;
    }

    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText) welcomeText.innerText = "Welcome, " + user.name + " 👋";

    const sidebarImg = document.getElementById("sidebarProfileImage");
    if (user.profile_image && sidebarImg) {
        sidebarImg.src = user.profile_image;
    }

    try {
        const upcoming = await API.clients.getUpcomingSessions(user.clients_id);
        const completed = await API.clients.getCompletedSessions(user.clients_id);

        const upcomingCount = document.getElementById("upcomingCount");
        const completedCount = document.getElementById("completedCount");

        if (upcomingCount) upcomingCount.innerText = `${upcoming.length} Sessions`;
        if (completedCount) completedCount.innerText = `${completed.length} Sessions`;
    } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
    }
});
