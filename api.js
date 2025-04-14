import { API_BASE_URL } from './config.js';

async function fetchData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`);
    const data = await response.json();
    console.log(data); // { message: "Hello from backend!" }
  } catch (error) {
    console.error("API Error:", error);
  }
}

// Call on page load
window.addEventListener('DOMContentLoaded', fetchData);