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

let currentAppointmentId = null;

function giveFeedback(id) {
    currentAppointmentId = id;
    const modal = document.getElementById("reviewModal");
    if (modal) {
        modal.style.display = "flex";
        // Optionally find the counsellor name from the list
        const box = document.querySelector(`button[onclick="giveFeedback(${id})"]`).closest('.session-box');
        const name = box ? box.querySelector('h3').innerText : 'Expert';
        document.getElementById("modalCounsellorName").innerText = name;
    }
}

function closeModal() {
    const modal = document.getElementById("reviewModal");
    if (modal) modal.style.display = "none";
    currentAppointmentId = null;
}

async function submitReview() {
    const starInput = document.querySelector('input[name="stars"]:checked');
    const comment = document.getElementById("reviewComment").value;

    if (!starInput) {
        alert("Please select a star rating.");
        return;
    }

    const rating = starInput.value;
    console.log("Submitting review:", { id: currentAppointmentId, rating, comment });

    // Mock successful submission
    const btn = document.querySelector(".submit-btn");
    btn.disabled = true;
    btn.innerText = "Submitting...";

    setTimeout(() => {
        alert("Thank you for your feedback!");
        closeModal();
        btn.disabled = false;
        btn.innerText = "Submit Review";

        // Refresh or update UI
        const feedbackBtn = document.querySelector(`button[onclick="giveFeedback(${currentAppointmentId})"]`);
        if (feedbackBtn) {
            feedbackBtn.innerText = "Review Submitted";
            feedbackBtn.style.background = "#94a3b8";
            feedbackBtn.disabled = true;
        }
    }, 1500);
}

window.giveFeedback = giveFeedback;
window.closeModal = closeModal;
window.submitReview = submitReview;
