const API_BASE = import.meta.env.VITE_API_URL || "https://hrms-lite-backend-s68f.onrender.com";

/**
 * Generic fetch wrapper with error handling.
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const config = {
        headers: { "Content-Type": "application/json" },
        ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.detail || `Request failed with status ${response.status}`;
        throw new Error(message);
    }

    return response.json();
}

// ---- Employee APIs ----

export function fetchEmployees() {
    return request("/api/employees");
}

export function addEmployee(data) {
    return request("/api/employees/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function deleteEmployee(employeeId) {
    return request(`/api/employees/${employeeId}`, {
        method: "DELETE",
    });
}

// ---- Attendance APIs ----

export function markAttendance(data) {
    return request("/api/attendance/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function fetchAttendanceByEmployee(employeeId) {
    return request(`/api/attendance/${employeeId}`);
}

export function fetchAllAttendance(date = "") {
    const query = date ? `?date=${date}` : "";
    return request(`/api/attendance${query}`);
}
