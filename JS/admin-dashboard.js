document.addEventListener("DOMContentLoaded", () => {
    const user = UserManager.get();
    if (!user || user.role !== 'admin') {
        alert("Unauthorized access. Admin privileges required.");
        window.location.href = "./auth.html";
        return;
    }

    loadReviewQueue();
});

async function loadReviewQueue() {
    const container = document.getElementById("expertsQueue");
    const pendingCountEl = document.getElementById("pendingCount");
    const verifiedCountEl = document.getElementById("verifiedCount");

    if (!container) return;

    try {
        const counsellors = await API.auth.getReviewQueue();

        const pending = counsellors.filter(c => c.status === 'pending');
        const active = counsellors.filter(c => c.status === 'active');

        if (pendingCountEl) pendingCountEl.innerText = pending.length;
        if (verifiedCountEl) verifiedCountEl.innerText = active.length;

        if (counsellors.length === 0) {
            container.innerHTML = "<p style='color: var(--text-muted); padding: 20px;'>No experts found in the system.</p>";
            return;
        }

        let html = "";
        counsellors.forEach(c => {
            const isPending = c.status === 'pending';
            html += `
                <div class="counsellor-row">
                    <img src="${c.profile_image || '../Assets/Wireframep1.webp'}" alt="Profile">
                    <div>
                        <strong style="font-size: 1.1rem; color: var(--primary);">${c.name}</strong>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${c.email} | ${c.specialization || 'General Counselling'}</p>
                    </div>
                    <div>
                        <span class="status-pill ${isPending ? 'status-pending' : 'status-active'}">${c.status}</span>
                    </div>
                    <div class="action-btns">
                        ${isPending ?
                    `<button class="action-btn btn-approve" onclick="approveCounsellor(${c.counsellors_id})">Approve</button>` :
                    `<span style="color: #16a34a; font-weight: 600; font-size: 0.85rem;">✓ Verified</span>`
                }
                        <button class="action-btn btn-reject" onclick="deleteCounsellor(${c.counsellors_id})">Remove</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (err) {
        console.error("Failed to fetch queue:", err);
        container.innerHTML = "<p style='color: #ef4444; padding: 20px;'>Error loading andmission board. Please try again.</p>";
    }
}

async function approveCounsellor(id) {
    if (!confirm("Are you sure you want to approve this expert? They will be visible to all users.")) return;

    try {
        await API.counsellors.update(id, { status: "active" });
        alert("Expert approved successfully!");
        loadReviewQueue();
    } catch (err) {
        console.error("Approval failed:", err);
        alert("Failed to approve expert.");
    }
}

async function deleteCounsellor(id) {
    if (!confirm("Are you sure you want to remove this expert? This action cannot be undone.")) return;

    try {
        await API.counsellors.delete(id);
        alert("Expert removed from system.");
        loadReviewQueue();
    } catch (err) {
        console.error("Deletion failed:", err);
        alert("Failed to remove expert.");
    }
}

window.approveCounsellor = approveCounsellor;
window.deleteCounsellor = deleteCounsellor;
