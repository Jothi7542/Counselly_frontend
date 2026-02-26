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
        const [history, reviews] = await Promise.all([
            API.clients.getCompletedSessions(user.clients_id),
            API.reviews.getAll() // We'll filter this for the client's reviews
        ]);

        // Filter reviews given by this client
        const clientReviews = reviews.filter(r => r.clients_id === user.clients_id);
        renderHistory(history, clientReviews);
    } catch (err) {
        console.error("Load history failed:", err);
        const container = document.getElementById("historyList");
        if (container) {
            container.innerHTML = `<p style="text-align:center; padding: 20px; color: #ef4444;">Error loading history. Please try again later.</p>`;
        }
    }
});

function renderHistory(sessions, clientReviews = []) {
    const container = document.getElementById("historyList");
    if (!container) return;
    container.innerHTML = sessions.length ? "" : '<p style="text-align:center; padding: 20px;">No completed sessions found.</p>';

    sessions.forEach(s => {
        const review = clientReviews.find(r => r.appointment_id === s.appointment_id);

        const box = document.createElement("div");
        box.className = "session-box";
        box.innerHTML = `
            <div class="session-info">
                <span class="status-badge status-completed" style="background:#d1fae5; color:#059669; padding:4px 8px; border-radius:4px; font-size:0.8rem; display:inline-block; margin-bottom:8px;">Completed</span>
                <h3>${s.counsellor_name}</h3>
                <p><strong>Type:</strong> ${s.therapy_type || 'General Counselling'}</p>
                <p><strong>Date:</strong> ${s.date} at ${s.time}</p>
                ${review ? `
                    <div class="review-display" style="margin-top: 10px; padding: 10px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #FFD700;">
                        <div style="color: #FFD700; margin-bottom: 5px;">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        <p style="font-size: 0.9rem; color: #475569; margin: 0;">${review.comment || 'No comment provided.'}</p>
                    </div>
                ` : ''}
            </div>
            <div class="session-actions" style="display: flex; gap: 10px; align-items: flex-end;">
                ${review ? `
                    <button class="delete-btn" onclick="deleteReview(${review.reviews_id})" style="background:#fee2e2; color:#ef4444; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight: 600;">Delete Review</button>
                ` : `
                    <button class="feedback-btn" onclick="giveFeedback(${s.appointment_id}, ${s.counsellors_id})" style="background:var(--primary); color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;">Give Feedback</button>
                `}
            </div>
        `;
        container.appendChild(box);
    });
}

let currentAppointmentId = null;
let currentCounsellorId = null;

function giveFeedback(appointmentId, counsellorId) {
    currentAppointmentId = appointmentId;
    currentCounsellorId = counsellorId;
    const modal = document.getElementById("reviewModal");
    if (modal) {
        modal.style.display = "flex";
        const box = document.querySelector(`button[onclick*="giveFeedback(${appointmentId}"]`).closest('.session-box');
        const name = box ? box.querySelector('h3').innerText : 'Expert';
        document.getElementById("modalCounsellorName").innerText = name;
    }
}

function closeModal() {
    const modal = document.getElementById("reviewModal");
    if (modal) {
        modal.style.display = "none";
        // Reset modal fields
        document.querySelectorAll('input[name="stars"]').forEach(input => input.checked = false);
        document.getElementById("reviewComment").value = "";
    }
    currentAppointmentId = null;
    currentCounsellorId = null;
}

async function submitReview() {
    const user = UserManager.get();
    const starInput = document.querySelector('input[name="stars"]:checked');
    const comment = document.getElementById("reviewComment").value;

    if (!starInput) {
        alert("Please select a star rating.");
        return;
    }

    const rating = parseInt(starInput.value);
    const btn = document.querySelector(".submit-btn");

    try {
        btn.disabled = true;
        btn.innerText = "Submitting...";

        await API.reviews.create({
            appointment_id: currentAppointmentId,
            clients_id: user.clients_id,
            counsellors_id: currentCounsellorId,
            rating: rating,
            comment: comment
        });

        alert("Thank you for your feedback!");
        closeModal();
        location.reload(); // Refresh to show new review state
    } catch (err) {
        alert("Failed to submit review: " + err.message);
        btn.disabled = false;
        btn.innerText = "Submit Review";
    }
}

async function deleteReview(reviewId) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
        await API.reviews.delete(reviewId);
        alert("Review deleted successfully.");
        location.reload();
    } catch (err) {
        alert("Failed to delete review: " + err.message);
    }
}

window.giveFeedback = giveFeedback;
window.closeModal = closeModal;
window.submitReview = submitReview;
window.deleteReview = deleteReview;
