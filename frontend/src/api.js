const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The booking service took too long to respond");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getBookings() {
  return request("/booking");
}

export async function bookDate(data) {
  return request("/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function adminLogin(credentials) {
  return request("/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });
}

export async function cancelBooking(date) {
  return request(`/admin/cancel/${encodeURIComponent(date)}`, {
    method: "DELETE"
  });
}

// Keepalive ping to prevent Render free tier cold starts
export function startKeepalive() {
  const ping = async () => {
    try {
      await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) });
    } catch {
      // Silently fail; keepalive is best-effort
    }
  };
  
  // Ping immediately on first load, then every 5 minutes
  ping();
  setInterval(ping, 5 * 60 * 1000);
}
