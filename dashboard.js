document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    if (!token) {
        alert("Unauthorized! Please log in first.");
        window.location.href = "login.html"; // Redirect to login page if no token
        return;
    }

    try {
        const response = await fetch("/protected", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("welcomeMessage").innerText = `Welcome back, ${data.user.email}!`;
        } else {
            alert(data.error);
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to fetch protected data.");
    }
});
