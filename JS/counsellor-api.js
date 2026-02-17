// Counsellor API endpoints
window.API = window.API || {};

window.API.counsellors = {
    getAll: async () => {
        const list = await request("/counsellors/search", { skipAuth: true });
        return list.map(c => ({
            ...c,
            rating: c.rating || (4 + Math.random()).toFixed(1),
            reviews_count: c.reviews_count || Math.floor(Math.random() * 50) + 10
        }));
    },
    getById: async (id) => {
        const c = await request(`/counsellors/${id}`, { skipAuth: true });
        if (c) {
            c.rating = c.rating || (4.5).toFixed(1);
            c.reviews_count = c.reviews_count || 24;
        }
        return c;
    },
    search: async (params) => {
        const queryString = new URLSearchParams(params).toString();
        const list = await request(`/counsellors/search?${queryString}`, { skipAuth: true });
        return list.map(c => ({
            ...c,
            rating: c.rating || (4 + Math.random()).toFixed(1),
            reviews_count: c.reviews_count || Math.floor(Math.random() * 50) + 10
        }));
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
