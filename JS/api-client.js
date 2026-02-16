// API Configuration
const API_BASE_URL = "https://counselly-backend.vercel.app";

// HTTP Request Helper
async function request(endpoint, options = {}) {
    const token = typeof TokenManager !== 'undefined' ? TokenManager.get() : localStorage.getItem("access_token");

    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;

    // If skipAuth is true, we use a simple fetch without any custom headers
    // to avoid CORS preflight (OPTIONS) requests on public GET endpoints.
    if (options.skipAuth) {
        console.log(`[API] Fetching (skipAuth): ${url}`);
        try {
            const response = await fetch(url, {
                method: options.method || 'GET'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || `HTTP error! status: ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error(`[API] Fetch error for ${url} (skipAuth):`, error);
            throw error;
        }
    }

    // For non-skipAuth requests, we include headers and potentially the Auth token
    const headers = {
        "Accept": "application/json",
        ...options.headers,
    };

    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        method: options.method || 'GET',
        ...options,
        headers,
    };

    console.log(`[API] Fetching: ${url}`, { method: config.method, hasToken: !!token });

    try {
        const response = await fetch(url, config);

        // Handle 401 Unauthorized
        if (response.status === 401) {
            console.error("[API] 401 Unauthorized");
            if (typeof TokenManager !== 'undefined') TokenManager.remove();
            if (typeof UserManager !== 'undefined') UserManager.remove();
            // Optional: redirect to login if not already there
            if (!window.location.href.includes("auth.html")) {
                window.location.href = "/HTML/auth.html";
            }
            throw new Error("Unauthorized - Please login again");
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`[API] Fetch error for ${url}:`, error);
        throw error;
    }
}

// Global API object to be populated by domain-specific files
window.API = window.API || {};
window.request = request;
window.API_BASE_URL = API_BASE_URL;
