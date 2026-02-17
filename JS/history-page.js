// JS Logic for History.html
document.addEventListener("DOMContentLoaded", async () => {
    const user = typeof UserManager !== 'undefined' ? UserManager.get() : null;
    if (!user || user.role !== 'client') {
        window.location.href = "./auth.html";
        return;
    }

    // Initialize Page Content
    const welcomeTitle = document.getElementById("welcomeTitle");
    if (welcomeTitle && user.name) {
        welcomeTitle.innerText = `History for ${user.name}`;
    }

    try {
        const history = await API.clients.getCompletedSessions(user.clients_id);
        renderHistory(history);
    } catch (err) {
        console.error("Load history failed:", err);
        const container = document.getElementById("historyList");
        if (container) {
            container.innerHTML = `<p style="text-align:center; padding: 20px; color: #ef4444;">Error loading history. Please try again later.</p>`;
        }
    }
});

function renderHistory(sessions) {
    const container = document.getElementById("historyList");
    if (!container) return;
    container.innerHTML = sessions.length ? "" : '<p style="text-align:center; padding: 20px;">No completed sessions found.</p>';

    sessions.forEach(s => {
        const box = document.createElement("div");
        box.className = "session-box";
        box.innerHTML = `
            <div class="session-info">
                <span class="status-badge status-completed" style="background:#d1fae5; color:#059669; padding:4px 8px; border-radius:4px; font-size:0.8rem; display:inline-block; margin-bottom:8px;">Completed</span>
                <h3>${s.counsellor_name}</h3>
                <p><strong>Type:</strong> ${s.therapy_type || 'General Counselling'}</p>
                <p><strong>Date:</strong> ${s.date} at ${s.time}</p>
            </div>
            <button class="feedback-btn" onclick="giveFeedback(${s.appointment_id})" style="background:var(--primary); color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;">Give Feedback</button>
        `;
        container.appendChild(box);
    });
}

function giveFeedback(id) {
    alert("Feedback system coming soon!");
}

window.giveFeedback = giveFeedback;
