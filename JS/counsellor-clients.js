// JS Logic for C_clients.html
document.addEventListener("DOMContentLoaded", async () => {
    const user = UserManager.get();
    if (!user || user.role !== 'counsellor') {
        window.location.href = "./auth.html";
        return;
    }

    try {
        const clients = await API.counsellors.getClients(user.counsellors_id);
        const tbody = document.getElementById("clientsTable");
        if (tbody) {
            tbody.innerHTML = clients.length ? "" : '<tr><td colspan="4" style="text-align:center;">No clients yet.</td></tr>';

            clients.forEach(c => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.total_sessions}</td>
            <td>${c.last_session}</td>
            <td><span class="status-badge status-completed">${c.status}</span></td>
          `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error("Failed to load clients:", err);
        const tbody = document.getElementById("clientsTable");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #ef4444;">Failed to load clients.</td></tr>`;
        }
    }
});
