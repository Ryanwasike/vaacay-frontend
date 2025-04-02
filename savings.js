// Helper function for sending notifications (replace with your actual notification logic)
function sendNotification(message) {
    alert(message);
}

document.addEventListener("DOMContentLoaded", () => {
    const savingsGoalInput = document.getElementById("savings-goal");
    const amountInput = document.getElementById("amount");
    const addSavingsBtn = document.getElementById("add-savings");
    const withdrawSavingsBtn = document.getElementById("withdraw-savings");
    const totalSavedDisplay = document.getElementById("total-saved");
    const remainingDisplay = document.getElementById("remaining");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    let savingsGoal = 0;
    let totalSaved = 0;
    let savingsHistory = [];

    // Initialize Chart.js
    const ctx = document.getElementById("savingsChart").getContext("2d");
    const savingsChart = new Chart(ctx, {
        type: "line", // Use a line chart
        data: {
            labels: [], // Labels for the x-axis
            datasets: [{
                label: "Total Savings",
                data: [], // Data for the y-axis
                borderColor: "#3498db",
                fill: false,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    // Update the display with current savings and progress
    function updateDisplay() {
        totalSavedDisplay.textContent = `$${totalSaved}`;
        const remaining = savingsGoal - totalSaved;
        remainingDisplay.textContent = `$${remaining > 0 ? remaining : 0}`;

        // Update progress bar
        const progress = (totalSaved / savingsGoal) * 100;
        progressBar.value = progress;
        progressText.textContent = `${progress.toFixed(2)}% Completed`;

        // Check if the savings goal is reached
        if (totalSaved >= savingsGoal) {
            sendNotification(`🎉 Congratulations! You reached your savings goal of $${savingsGoal}!`);
        }

        // Update the chart
        savingsChart.data.labels.push(`Transaction ${savingsHistory.length}`);
        savingsChart.data.datasets[0].data.push(totalSaved);
        savingsChart.update();
    }

    // Add savings
    addSavingsBtn.addEventListener("click", () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount)){
            alert("Please enter a valid amount.");
            return;
        }
        totalSaved += amount;
        savingsHistory.push(totalSaved);
        updateDisplay();
    });

    // Withdraw savings
    withdrawSavingsBtn.addEventListener("click", () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount)) {
            alert("Please enter a valid amount.");
            return;
        }
        if (amount > totalSaved) {
            alert("You cannot withdraw more than your total savings.");
            return;
        }
        totalSaved -= amount;
        savingsHistory.push(totalSaved);
        updateDisplay();
    });

    // Set savings goal
    savingsGoalInput.addEventListener("change", () => {
        const goal = parseFloat(savingsGoalInput.value);
        if (isNaN(goal) || goal <= 0) {
            alert("Please enter a valid savings goal.");
            return;
        }
        savingsGoal = goal;
        progressBar.max = 100;
        updateDisplay();
    });
});


function depositToSavings() {
    const amount = parseFloat(document.getElementById('amount').value);
    const phoneNumber = "YOUR_PHONE_NUMBER"; // Replace with user's phone

    if (!amount || amount <= 0) {
        alert("Enter a valid amount.");
        return;
    }

    fetch('/api/savings/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, amount })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('total-saved').innerText = `$${data.totalSavings}`;
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Transaction failed. Try again.");
    });
}



async function depositToSavings() {
    const phoneNumber = document.getElementById("phone-number").value;
    const amount = document.getElementById("amount").value;

    const response = await fetch("/api/savings/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount }),
    });

    const data = await response.json();
    alert(data.message);
}
