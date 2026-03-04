// JS Logic for Contact.html
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const statusDiv = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("contactName").value;
            const email = document.getElementById("contactEmail").value;
            const message = document.getElementById("contactMessage").value;

            // Prepare UI for submission
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending...";
            statusDiv.style.display = "none";

            try {
                const response = await API.contact.submit({
                    name: name,
                    email: email,
                    message: message
                });

                console.log("[Contact] Message sent successfully:", response);

                // Success UI
                statusDiv.innerText = "Message sent successfully! We'll get back to you soon.";
                statusDiv.style.background = "#dcfce7";
                statusDiv.style.color = "#166534";
                statusDiv.style.display = "block";

                // Reset Form
                contactForm.reset();
            } catch (err) {
                console.error("[Contact] Failed to send message:", err);

                // Error UI
                statusDiv.innerText = "Failed to send message: " + err.message;
                statusDiv.style.background = "#fee2e2";
                statusDiv.style.color = "#991b1b";
                statusDiv.style.display = "block";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "Send Message";
            }
        });
    }
});
