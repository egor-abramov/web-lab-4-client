import { store } from '../store/store.js';
import { setCredentials } from '../auth/model/authSlice.js';

const API_URL = "http://localhost:8080";

export async function apiFetch(url, method, accessToken, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(API_URL + url, {
        method,
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: "include",
        headers
    });
    if (response.status === 401) {
        throw new Error("Unauthorized");
    } else if(response.status === 403) {
        const refreshed = await refreshAccessToken();
        if (!refreshed?.accessToken) {
            return null;
        }

        store.dispatch(setCredentials(refreshed.accessToken));
        headers.Authorization = `Bearer ${refreshed.accessToken}`;
    
        const retryResponse = await fetch(API_URL + url, {
            method,
            body: options.body ? JSON.stringify(options.body) : {},
            credentials: "include",
            headers
        });
        if (retryResponse.ok) {
            return retryResponse;
        }
    }
    return response;
}

async function refreshAccessToken() {
    try {
        const response = await fetch(API_URL + "/auth/refresh", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (err) {
        console.error("Refresh failed", err);
    }
    return null;
}