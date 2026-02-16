// Messages API
window.API = window.API || {};
window.API.messages = {
    create: (data) =>
        request("/messages/create", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    getAll: () => request("/messages/all"),
    getById: (id) => request(`/messages/${id}`),
    markAsRead: (id) =>
        request(`/messages/${id}`, {
            method: "PUT",
        }),
    delete: (id) =>
        request(`/messages/${id}`, {
            method: "DELETE",
        }),
};
