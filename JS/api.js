// API Configuration
const API_BASE_URL = "https://counselly-backend.vercel.app";

// Token Management
const TokenManager = {
    get: () => localStorage.getItem("access_token"),
    set: (token) => localStorage.setItem("access_token", token),
    remove: () => localStorage.removeItem("access_token"),
};

// User Management
const UserManager = {
    get: () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },
    set: (user) => localStorage.setItem("user", JSON.stringify(user)),
    remove: () => localStorage.removeItem("user"),
    getId: () => {
        const user = UserManager.get();
        return user ? (user.clients_id || user.counsellors_id) : null;
    },
    getRole: () => {
        const user = UserManager.get();
        return user ? user.role : null;
    }
};

// HTTP Request Helper
async function request(endpoint, options = {}) {
    const token = TokenManager.get();

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token && !options.skipAuth) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Handle 401 Unauthorized
        if (response.status === 401) {
            TokenManager.remove();
            UserManager.remove();
            window.location.href = "/HTML/auth.html";
            throw new Error("Unauthorized - Please login again");
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// API Methods
const API = {
    // Authentication
    auth: {
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

        logout: () => {
            TokenManager.remove();
            UserManager.remove();
            window.location.href = "/HTML/auth.html";
        },
    },

    // Clients
    clients: {
        getAll: () => request("/clients/"),
        getById: (id) => request(`/clients/${id}`),
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
    },

    // Counsellors
    counsellors: {
        getAll: () => request("/counsellors/"),
        getById: (id) => request(`/counsellors/${id}`),
        search: (params) => {
            const queryString = new URLSearchParams(params).toString();
            return request(`/counsellors/search?${queryString}`);
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
        getCard: (id) => request(`/counsellors/${id}/card`),
        addAvailability: (data) => API.availability.create(data),
        uploadProfileImage: (id, file) => {
            const formData = new FormData();
            formData.append("file", file);
            return request(`/counsellors/upload-profile-image/${id}`, {
                method: "POST",
                body: formData,
                headers: {}, // Let browser set Content-Type for FormData
            });
        },
    },

    // Appointments
    appointments: {
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
    },

    // Availability
    availability: {
        create: (data) =>
            request("/availability/create", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        getFreeSlots: (counsellorId, date) =>
            request(`/availability/counsellor/${counsellorId}?date=${date}`),
    },

    // Reviews
    reviews: {
        create: (data) =>
            request("/reviews/create", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        getAll: () => request("/reviews/all"),
        getByCounsellor: (counsellorId) =>
            request(`/reviews/counsellor/${counsellorId}`),
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
            request(`/reviews/counsellor/${counsellorId}/average-rating`),
        getCount: (counsellorId) =>
            request(`/reviews/counsellor/${counsellorId}/count`),
    },

    // Messages
    messages: {
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
    },
};

// Export for use in other files
window.API = API;
window.TokenManager = TokenManager;
window.UserManager = UserManager;
