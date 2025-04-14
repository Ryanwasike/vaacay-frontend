// Auto-detects environment
export const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001' 
  : 'https://vacation-budget-planner-backend.onrender.com';