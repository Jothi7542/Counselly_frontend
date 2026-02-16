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

// Export to window for global access
window.TokenManager = TokenManager;
window.UserManager = UserManager;
