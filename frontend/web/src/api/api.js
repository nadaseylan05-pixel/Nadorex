// src/api/api.js

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Wrapper عام لـ fetch
 */
console.log("BASE_URL =", BASE_URL);
alert("api.js loaded");
export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  console.log("FINAL FETCH URL =", url);
  try {
    const res = await fetch(url, {
      credentials: "include", // cookies / session
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    // نطبع للمساعدة في التشخيص

    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));

    const text = await res.text();

    // لو الرد ليس JSON
    if (!res.headers.get("content-type")?.includes("application/json")) {
      throw new Error(text || "Response is not JSON");
    }

    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}