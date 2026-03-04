// JS Logic for Admin_logs.html
document.addEventListener("DOMContentLoaded", () => {
    const logBody = document.getElementById("logBody");
    const levelFilter = document.getElementById("levelFilter");

    const mockLogs = [
        { id: 1, timestamp: "2025-03-04 16:20:15", level: "info", event: "Admin login successful", user: "admin@counselly.com", ip: "192.168.1.10" },
        { id: 2, timestamp: "2025-03-04 15:45:10", level: "warning", event: "Multiple failed login attempts", user: "unknown", ip: "45.12.33.101" },
        { id: 3, timestamp: "2025-03-04 14:30:05", level: "info", event: "Broadcast message dispatched", user: "admin@counselly.com", ip: "192.168.1.10" },
        { id: 4, timestamp: "2025-03-04 12:15:44", level: "error", event: "Database connection timeout", user: "system", ip: "127.0.0.1" },
        { id: 5, timestamp: "2025-03-04 11:00:22", level: "info", event: "Counsellor 'Dr. Smith' verified", user: "admin@counselly.com", ip: "192.168.1.10" },
        { id: 6, timestamp: "2025-03-04 10:20:11", level: "info", event: "New counsellor signup: Dr. Miller", user: "Dr. Miller", ip: "103.44.22.15" },
        { id: 7, timestamp: "2025-03-04 09:15:33", level: "warning", event: "High CPU usage detected", user: "system", ip: "127.0.0.1" }
    ];

    renderLogs(mockLogs);

    if (levelFilter) {
        levelFilter.addEventListener("change", () => {
            const level = levelFilter.value;
            if (level === "all") {
                renderLogs(mockLogs);
            } else {
                const filtered = mockLogs.filter(log => log.level === level);
                renderLogs(filtered);
            }
        });
    }

    function renderLogs(logs) {
        if (!logBody) return;

        if (logs.length === 0) {
            logBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-muted);">No logs found for the selected level.</td></tr>';
            return;
        }

        logBody.innerHTML = "";
        logs.forEach(log => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="color: #64748b; font-family: monospace;">${log.timestamp}</td>
                <td><span class="level-badge level-${log.level}">${log.level}</span></td>
                <td style="font-weight: 500;">${log.event}</td>
                <td>${log.user}</td>
                <td style="color: #64748b; font-family: monospace;">${log.ip}</td>
            `;
            logBody.appendChild(tr);
        });
    }
});
