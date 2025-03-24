document.getElementById("confirm-logout").addEventListener("click", () => {
    // Clear user session (assuming authentication is stored in localStorage)
    localStorage.removeItem("loggedInUser");

    // Redirect to login or home page
    window.location.href = "Login.html"; // Change this if using a different login page
});

document.getElementById("cancel-logout").addEventListener("click", () => {
    // Redirect back to dashboard
    window.location.href = "dashboard.html";
});


document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = "dashboard.html"; // Redirect logged-in users
    }
});
