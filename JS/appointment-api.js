// Appointments API
window.API = window.API || {};
window.API.appointments = {
    create: (data) =>
        request("/appointments/new_appointment", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    getAll: () => request("/appointments/"),
    getById: (id) => request(`/appointments/${id}`),
    update: (id, data) =>
        request(`/appointments/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    updateResponse: (id, response) =>
        request(`/appointments/${id}/response`, {
            method: "PUT",
            body: JSON.stringify({ response }),
        }),
    delete: (id) =>
        request(`/appointments/${id}`, {
            method: "DELETE",
        }),
};
