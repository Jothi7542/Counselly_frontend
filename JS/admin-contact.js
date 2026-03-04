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
            const isPending = msg.status === 'pending';

            card.innerHTML = `
                <div class="message-header">
                    <div class="sender-info">
                        <h3>${msg.name}</h3>
                        <p><a href="mailto:${msg.email}" style="color: var(--primary); text-decoration: none;">${msg.email}</a></p>
                    </div>
                    <div class="message-date">${date}</div>
                </div>
                <div class="message-content">${msg.message}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span class="status-badge status-${msg.status}">${msg.status}</span>
                    <div class="action-btns">
                        <button class="action-btn btn-approve" style="background: #3b82f6; color: white; padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.8rem; margin-right: 8px;" onclick="replyToClient('${msg.email}', '${msg.name}')">Reply</button>
                        ${isPending ? `<button class="action-btn btn-approve" style="background: #10b981; color: white; padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.8rem;" onclick="handleStatusUpdate(${msg.id}, 'reviewed')">Mark Reviewed</button>` : ''}
                    </div>
                </div>
            `;
            listContainer.appendChild(card);
        });
    }

    window.replyToClient = function (email, name) {
        const subject = encodeURIComponent("Regarding your inquiry at Counselly");
        const body = encodeURIComponent(`Hello ${name},\n\nThank you for reaching out to Counselly. `);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    window.handleStatusUpdate = async function (id, status) {
        if (!confirm(`Mark this message as ${status}?`)) return;
        try {
            await API.contact.updateStatus(id, status);
            alert(`Message status updated to ${status}`);
            loadMessages();
        } catch (err) {
            alert("Failed to update status: " + err.message);
        }
    };
});
