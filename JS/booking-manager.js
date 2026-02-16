// Common logic for booking flow

const BookingManager = {
    // Save step 1: Counsellor, Date, Time, Mode
    saveStep1: (data) => {
        localStorage.setItem("booking_step1", JSON.stringify(data));
    },

    // Save step 2: Therapy Type, Reasons
    saveStep2: (data) => {
        localStorage.setItem("booking_step2", JSON.stringify(data));
    },

    // Get all data
    getCompleteData: () => {
        const step1 = JSON.parse(localStorage.getItem("booking_step1") || "{}");
        const step2 = JSON.parse(localStorage.getItem("booking_step2") || "{}");
        return { ...step1, ...step2 };
    },

    // Clear data
    clear: () => {
        localStorage.removeItem("booking_step1");
        localStorage.removeItem("booking_step2");
        localStorage.removeItem("selected_time");
    }
};

window.BookingManager = BookingManager;
