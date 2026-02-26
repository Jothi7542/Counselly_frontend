// JS Logic for Counsellor_dashboard.html
document.addEventListener("DOMContentLoaded", () => {
    const counsellor = UserManager.get();

    if (!counsellor || counsellor.role !== 'counsellor') {
        window.location.href = "./auth.html";
        return;
    }

    // Initialize Profile Info
    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText) welcomeText.innerText = "Welcome back, Dr. " + (counsellor.name || "Counsellor") + " 👋";

    const sidebarImg = document.getElementById("sidebarProfileImage");
    if (counsellor.profile_image && sidebarImg) {
        sidebarImg.src = counsellor.profile_image;
    }

    // Load Data
    loadDashboardStats(counsellor.counsellors_id);
    loadRequests(counsellor.counsellors_id);
    loadReviews(counsellor.counsellors_id);

    async function loadReviews(id) {
        try {
            const reviews = await API.reviews.getByCounsellor(id);
            const container = document.getElementById("feedbackList");
            if (!container) return;

            if (!reviews || reviews.length === 0) {
                container.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-muted);">No feedback received yet.</p>';
                return;
            }

            container.innerHTML = "";
            reviews.slice(0, 5).forEach(r => {
                const div = document.createElement("div");
                div.className = "feedback-item";
                div.style = "padding: 15px; border-bottom: 1px solid #eee; margin-bottom: 10px;";

                const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);

                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <span style="font-weight: 600; color: var(--primary);">${r.client_name || 'Anonymous Client'}</span>
                        <span style="color: #FFD700; font-size: 1.1rem;">${stars}</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #475569; margin: 0; line-height: 1.4;">${r.comment || 'No comment provided.'}</p>
                    <small style="color: #94a3b8; display: block; margin-top: 5px;">${new Date(r.created_at || Date.now()).toLocaleDateString()}</small>
                `;
                container.appendChild(div);
            });
        } catch (err) {
            console.error("Failed to load reviews:", err);
            const container = document.getElementById("feedbackList");
            if (container) container.innerHTML = '<p style="color: #ef4444; padding: 10px;">Failed to load feedback.</p>';
        }
    }

    async function loadDashboardStats(id) {
        try {
            const stats = await API.counsellors.getStats(id);
            document.getElementById("todayCount").innerText = stats.today_sessions || 0;
            document.getElementById("clientCount").innerText = stats.total_clients || 0;
            document.getElementById("upcomingCount").innerText = stats.upcoming_sessions || 0;

            const latestProfile = await API.counsellors.getById(id);
            if (latestProfile && latestProfile.profile_image && sidebarImg) {
                sidebarImg.src = latestProfile.profile_image;
                const currentUser = UserManager.get();
                currentUser.profile_image = latestProfile.profile_image;
                UserManager.set(currentUser);
            }
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
        }
    }

    async function loadRequests(id) {
        try {
            const [pending, accepted] = await Promise.all([
                API.counsellors.getRequests(id),
                API.counsellors.getUpcomingSessions(id)
            ]);

            const allSessions = [...pending, ...accepted];
            const tbody = document.getElementById("requestTable");
            if (tbody) {
                tbody.innerHTML = allSessions.length ? "" : '<tr><td colspan="6" style="text-align:center;">No active sessions or requests</td></tr>';

                allSessions.forEach(s => {
                    const tr = document.createElement("tr");
                    const isPending = s.status === 'pending';

                    tr.innerHTML = `
              <td>${s.date}</td>
              <td>${s.time}</td>
              <td>${s.client_name}</td>
              <td>${s.mode}</td>
              <td><span class="status-badge status-${isPending ? 'pending' : 'completed'}">${isPending ? 'Pending' : 'Confirmed'}</span></td>
              <td>
                 ${isPending ? `
                   <button class="find-button btn-accept" style="padding: 8px 16px; font-size: 0.85rem;" onclick="handleResponse(${s.appointment_id}, 'accepted')">Accept</button>
                   <button class="find-button btn-reject" style="padding: 8px 16px; font-size: 0.85rem;" onclick="handleResponse(${s.appointment_id}, 'rejected')">Reject</button>
                 ` : `
                   <button class="find-button btn-accept" style="padding: 8px 16px; font-size: 0.85rem;" onclick="completeSession(${s.appointment_id})">Complete</button>
                 `}
              </td>
            `;
                    tbody.appendChild(tr);
                });
            }
        } catch (err) {
            console.error("Failed to load sessions:", err);
            const tbody = document.getElementById("requestTable");
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444; background: #fee2e2; padding: 20px; border-radius: 8px;">
                <strong>Failed to load data</strong><br>
                <small>${err.message}</small>
              </td></tr>`;
            }
        }
    }

    window.handleResponse = async function (appointmentId, response) {
        if (!confirm(`Are you sure you want to ${response} this appointment?`)) return;
        try {
            await API.appointments.updateResponse(appointmentId, response);
            alert(`Appointment ${response} successfully`);
            location.reload();
        } catch (err) {
            alert("Failed to update response: " + err.message);
        }
    };

    window.completeSession = async function (appointmentId) {
        if (!confirm("Are you sure you want to mark this session as completed?")) return;
        try {
            await API.appointments.update(appointmentId, { status: 'completed' });
            alert("Session marked as completed successfully!");
            location.reload();
        } catch (err) {
            alert("Failed to complete session: " + err.message);
        }
    };
});
