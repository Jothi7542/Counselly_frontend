// Analytics page logic
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Analytics dashboard loaded");

    // In a real app, we would fetch these from the backend
    // const stats = await API.admins.getGlobalStats();

    // For now, we use simulated growth animation
    animateKPI("totalClients", 1280);
    animateKPI("activeExperts", 84);
    animateKPI("monthlySessions", 426);
});

function animateKPI(id, target) {
    const el = document.getElementById(id);
    if (!el) return;

    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.innerText = target.toLocaleString();
            clearInterval(timer);
        } else {
            el.innerText = Math.floor(current).toLocaleString();
        }
    }, 16);
}
