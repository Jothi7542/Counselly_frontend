// Client API endpoints
window.API = window.API || {};

window.API.clients = {
    getAll: () => request("/clients/", { skipAuth: true }),
    getById: (id) => request(`/clients/${id}`, { skipAuth: true }),
    update: (id, data) =>
        request(`/clients/update/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id) =>
        request(`/clients/deleteClients/${id}`, {
            method: "DELETE",
        }),
    getUpcomingSessions: (id) => request(`/clients/${id}/upcoming-sessions`),
    getCompletedSessions: (id) => request(`/clients/${id}/completed-sessions`),
};
