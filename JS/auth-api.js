// Authentication API endpoints
window.API = window.API || {};

window.API.auth = {
    clientSignup: (data) =>
        request("/clients/signup", {
            method: "POST",
            body: JSON.stringify(data),
            skipAuth: true,
        }),

    clientLogin: (email, password) =>
        request("/clients/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        }),

    counsellorSignup: (data) =>
        request("/counsellors/signup", {
            method: "POST",
            body: JSON.stringify(data),
            skipAuth: true,
        }),

    counsellorLogin: (email, password) =>
        request("/counsellors/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        }),

    adminSignup: (data) =>
        request("/admins/signup", {
            method: "POST",
            body: JSON.stringify(data),
            skipAuth: true,
        }),

    adminLogin: (email, password) =>
        request("/admins/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        }),

    getReviewQueue: () =>
        request("/admins/review-queue"),

    logout: () => {
        if (typeof TokenManager !== 'undefined') TokenManager.remove();
        if (typeof UserManager !== 'undefined') UserManager.remove();
        window.location.href = "/HTML/auth.html";
    },
};
