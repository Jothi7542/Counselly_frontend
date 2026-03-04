// JS Logic for C_sessions.html
document.addEventListener("DOMContentLoaded", async () => {
    const user = UserManager.get();
    if (!user || user.role !== 'counsellor') {
        window.location.href = "./auth.html";
        return;
    }

    // Verify if the counsellor ID is still valid in the database
    try {
        const isValid = await API.counsellors.getById(user.counsellors_id);
        if (!isValid) {
            alert("Your session has expired or is invalid. Please login again.");
            TokenManager.remove();
            UserManager.remove();
            window.location.href = "../Index.html";
            return;
        }
    } catch (err) {
        console.error("Session verification failed:", err);
    }

    const sidebarImg = document.getElementById("sidebarProfileImage");
    if (sidebarImg && user.profile_image) {
        sidebarImg.src = user.profile_image;
    }

    loadSessions(user.counsellors_id);
});

async function loadSessions(counsellorId) {
    try {
        const completed = await API.counsellors.getCompletedSessions(counsellorId);
        renderHistory(completed);
    } catch (err) {
        console.error("Failed to load sessions:", err);
    }
}

function renderHistory(sessions) {
    const tbody = document.getElementById("historyTable");
    if (!tbody) return;
    tbody.innerHTML = sessions.length ? "" : '<tr><td colspan="7" style="text-align:center;">No session history</td></tr>';

    sessions.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${s.date}</td>
      <td>${s.time}</td>
      <td>${s.client_name}</td>
      <td><a href="mailto:${s.client_email}" style="color: var(--primary); text-decoration: none;">${s.client_email}</a></td>
      <td>${s.mode}</td>
      <td><span class="status-badge status-completed">${s.status}</span></td>
      <td>${s.notes || '---'}</td>
    `;
        tbody.appendChild(tr);
    });
}
