// Counsellor API endpoints
window.API = window.API || {};

window.API.counsellors = {
    getAll: () => request("/counsellors/search", { skipAuth: true }),
    getById: (id) => request(`/counsellors/${id}`, { skipAuth: true }),
    search: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return request(`/counsellors/search?${queryString}`, { skipAuth: true });
    },
    update: (id, data) =>
        request(`/counsellors/update/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id) =>
        request(`/counsellors/deleteCounsellors/${id}`, {
            method: "DELETE",
        }),
    getStats: (id) => request(`/counsellors/${id}/stats`),
    getRequests: (id) => request(`/counsellors/${id}/requests`),
    getUpcomingSessions: (id) => request(`/counsellors/${id}/upcoming-sessions`),
    getCompletedSessions: (id) => request(`/counsellors/${id}/completed-sessions`),
    getClients: (id) => request(`/counsellors/${id}/clients`),
    getCard: (id) => request(`/counsellors/${id}/card`, { skipAuth: true }),
    addAvailability: (data) => window.API.availability ? window.API.availability.create(data) : request("/availability/create", { method: "POST", body: JSON.stringify(data) }),
    uploadProfileImage: (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        return request(`/counsellors/upload-profile-image/${id}`, {
            method: "POST",
            body: formData,
            headers: {}, // Let browser set Content-Type for FormData
        });
    },
};
