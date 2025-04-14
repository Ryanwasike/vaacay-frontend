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
            alert(`🎉 Congratulations! You reached your savings goal of $${savingsGoal}!`);
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