document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('errorMessage');

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        return;
    }
 
    try {
        const response = await fetch("http://localhost:5001/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        const data = await response.json();
            console.log("Response data:", data);

        if (response.ok) {
            alert(" Signup Successful! Redirecting...");
            console.log("Redirecting to dashboard...");
            window.location.href = "dashboard.html";
        } else {
            errorMessage.textContent = data.error || "Signup failed. Try again.";
        }
    } catch (error) {
        errorMessage.textContent = "Error signing up. Please try again.";
    }
});
