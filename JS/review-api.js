// Reviews API
window.API = window.API || {};
window.API.reviews = {
    create: (data) =>
        request("/reviews/create", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    getAll: () => request("/reviews/all", { skipAuth: true }),
    getByCounsellor: (counsellorId) =>
        request(`/reviews/counsellor/${counsellorId}`, { skipAuth: true }),
    update: (id, data) =>
        request(`/reviews/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id) =>
        request(`/reviews/${id}`, {
            method: "DELETE",
        }),
    getAverageRating: (counsellorId) =>
        request(`/reviews/counsellor/${counsellorId}/average-rating`, { skipAuth: true }),
    getCount: (counsellorId) =>
        request(`/reviews/counsellor/${counsellorId}/count`, { skipAuth: true }),
};
