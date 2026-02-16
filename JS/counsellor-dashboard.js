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
