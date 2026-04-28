const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function handleResponse(response, defaultMessage) {
  if (!response.ok) {
    let errorMessage = defaultMessage;
    try {
      const errorBody = await response.json();
      if (errorBody?.error) errorMessage = errorBody.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchStopsByBBox(bbox) {
  const params = new URLSearchParams({
    minLon: String(bbox.minLon),
    minLat: String(bbox.minLat),
    maxLon: String(bbox.maxLon),
    maxLat: String(bbox.maxLat),
  });

  const response = await fetch(`${API_BASE}/api/stops?${params.toString()}`);
  return handleResponse(response, "Failed to fetch stops");
}

export async function fetchStopById(stopId) {
  const response = await fetch(`${API_BASE}/api/stops/${stopId}`);
  return handleResponse(response, "Failed to fetch stop");
}
