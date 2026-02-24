// Broadcast page logic
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("broadcastForm");
    const previewBox = document.getElementById("previewBox");
    const previewTitle = document.getElementById("previewTitle");
    const previewContent = document.getElementById("previewContent");

    // Update preview in real-time
    form.addEventListener("input", () => {
        const title = document.getElementById("title").value;
        const message = document.getElementById("message").value;

        if (title || message) {
            previewBox.style.display = "block";
            previewTitle.innerText = title || "Announcement Title";
            previewContent.innerText = message || "Message body will appear here...";
        } else {
            previewBox.style.display = "none";
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            title: document.getElementById("title").value,
            target: document.getElementById("target").value,
            type: document.getElementById("type").value,
            message: document.getElementById("message").value,
            sent_at: new Date().toISOString()
        };

        console.log("Sending broadcast:", data);

        // Mock API call
        alert("Broadcast dispatched successfully to " + data.target + "!");
        form.reset();
        previewBox.style.display = "none";
    });
});
