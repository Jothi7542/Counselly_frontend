// JS Logic for Upcoming_session.html
document.addEventListener("DOMContentLoaded", async () => {
    const user = UserManager.get();
    if (!user || user.role !== 'client') {
        window.location.href = "./auth.html";
        return;
    }

    const welcomeTitle = document.getElementById("welcomeTitle");
    if (welcomeTitle && user.name) {
        welcomeTitle.innerText = `Sessions for ${user.name}`;
    }

    const sidebarImg = document.getElementById("sidebarProfileImage");
    if (sidebarImg && user.profile_image) {
        sidebarImg.src = user.profile_image;
    }

    try {
        const upcoming = await API.clients.getUpcomingSessions(user.clients_id);
        renderUpcoming(upcoming);
    } catch (err) {
        console.error("Load upcoming sessions failed:", err);
    }

    function renderUpcoming(sessions) {
        const container = document.getElementById("upcomingList");
        if (!container) return;
        container.innerHTML = sessions.length ? "" : '<p style="text-align:center; padding: 20px;">No upcoming sessions found.</p>';

        sessions.forEach(s => {
            const box = document.createElement("div");
            box.className = "session-box";

            const isPending = s.status === 'pending';
            const isRejected = s.status === 'rejected' || s.status === 'cancelled';

            let statusBadge = '';
            if (isPending) {
                statusBadge = `<span style="background:#fef3c7; color:#d97706; padding:4px 8px; border-radius:4px; font-size:0.8rem;">Pending Approval</span>`;
            } else if (isRejected) {
                statusBadge = `<span style="background:#fee2e2; color:#ef4444; padding:4px 8px; border-radius:4px; font-size:0.8rem;">Rejected</span>`;
            } else {
                statusBadge = `<span style="background:#d1fae5; color:#059669; padding:4px 8px; border-radius:4px; font-size:0.8rem;">Confirmed</span>`;
            }

            box.innerHTML = `
                <div class="session-info">
                    <h3>${s.counsellor_name}</h3>
                    <div style="margin-bottom: 8px;">${statusBadge}</div>
                    <p><strong>Type:</strong> ${s.therapy_type || 'General Counselling'}</p>
                    <p><strong>Date:</strong> ${s.date}</p>
                    <p><strong>Time:</strong> ${s.time}</p>
                </div>
                ${isPending ?
                    `<button class="join-btn" style="background:#ccc; cursor:not-allowed;" disabled>Waiting for Approval</button>` :
                    isRejected ?
                        `<button class="join-btn" style="background:#ef4444; cursor:not-allowed;" disabled>Declined</button>` :
                        `<button class="join-btn" onclick="joinSession(${s.appointment_id})">Join Session</button>`
                }
            `;
            container.appendChild(box);
        });
    }

    window.joinSession = function (id) {
        alert("Session link will be available 5 minutes before the start time.");
    };
});
