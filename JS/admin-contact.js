// JS Logic for Admin_contact.html
document.addEventListener("DOMContentLoaded", () => {
    const listContainer = document.getElementById("messageList");

    loadMessages();

    async function loadMessages() {
        try {
            const messages = await API.contact.getAll();
            renderMessages(messages);
        } catch (err) {
            console.error("[Admin Contact] Failed to load messages:", err);
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #991b1b; background: #fee2e2; border-radius: 12px;">
                    <p><strong>Failed to load messages</strong></p>
                    <small>${err.message}</small>
                </div>
            `;
        }
    }

    function renderMessages(messages) {
        if (!messages || messages.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 50px; color: var(--text-muted);">
                    <p>No contact messages found.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = "";
        messages.forEach(msg => {
            const card = document.createElement("div");
            card.className = "message-card";

            const date = new Date(msg.created_at).toLocaleString();

            card.innerHTML = `
                <div class="message-header">
                    <div class="sender-info">
                        <h3>${msg.name}</h3>
                        <p><a href="mailto:${msg.email}" style="color: var(--primary); text-decoration: none;">${msg.email}</a></p>
                    </div>
                    <div class="message-date">${date}</div>
                </div>
                <div class="message-content">${msg.message}</div>
                <span class="status-badge status-${msg.status}">${msg.status}</span>
            `;
            listContainer.appendChild(card);
        });
    }
});
