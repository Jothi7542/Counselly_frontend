// Availability API
window.API = window.API || {};
window.API.availability = {
    create: (data) =>
        request("/availability/create", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    getFreeSlots: (counsellorId, date) =>
        request(`/availability/counsellor/${counsellorId}?date=${date}`, { skipAuth: true }),
};
