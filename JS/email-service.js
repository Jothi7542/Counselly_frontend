/**
 * EmailService - Handles email notifications using EmailJS
 * 
 * IMPORTANT: You must configure your EmailJS credentials below.
 * Sign up at https://www.emailjs.com/
 */
const EmailService = {
    // --- USER CONFIGURATION START ---
    PUBLIC_KEY: "ve9YqBIKGPA_8UHjk", // Updated with your key
    SERVICE_ID: "service_adda4nb",   // Updated with your service id
    BOOKING_TEMPLATE_ID: "template_0xgrr4g", // Updated with your booking template id
    STATUS_UPDATE_TEMPLATE_ID: "template_m1sxu84", // Updated with your status update template id
    // --- USER CONFIGURATION END ---

    init: function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.PUBLIC_KEY);
            console.log("[EmailService] Initialized with Public Key.");
        } else {
            console.error("[EmailService] emailjs script not found! Make sure to include the CDN.");
        }
    },

    /**
     * Send notification when a client books a session
     */
    sendBookingNotification: async function(details) {
        this.init();
        const templateParams = {
            booking_id: details.bookingId,
            client_name: details.clientName || "Client",
            counsellor_name: details.doctorName,
            date: details.date,
            time: details.time,
            to_email: details.clientEmail || localStorage.getItem("user_email") // Fallback
        };

        try {
            const response = await emailjs.send(this.SERVICE_ID, this.BOOKING_TEMPLATE_ID, templateParams);
            console.log("[EmailService] Booking email sent successfully!", response.status, response.text);
            return response;
        } catch (error) {
            console.error("[EmailService] Failed to send booking email:", error);
            throw error;
        }
    },

    /**
     * Send notification when a counsellor accepts or rejects a session
     */
    sendStatusUpdateNotification: async function(appointmentId, status) {
        this.init();
        
        // Note: To get client email, we might need to fetch appointment details first
        // or pass them from the dashboard. For now, we assume appointment data is available.
        try {
            const appointment = await API.appointments.getById(appointmentId);
            
            const templateParams = {
                booking_id: appointmentId,
                client_name: appointment.client_name,
                counsellor_name: appointment.counsellor_name,
                status: status, // 'accepted' or 'rejected'
                date: appointment.date,
                time: appointment.time,
                to_email: appointment.client_email
            };

            const response = await emailjs.send(this.SERVICE_ID, this.STATUS_UPDATE_TEMPLATE_ID, templateParams);
            console.log("[EmailService] Status update email sent!", response.status, response.text);
            return response;
        } catch (error) {
            console.error("[EmailService] Failed to send status update email:", error);
            throw error;
        }
    }
};

window.EmailService = EmailService;
