document.addEventListener("DOMContentLoaded", () => {
    const savingsGoalInput = document.getElementById("savings-goal");
    const amountInput = document.getElementById("amount");
    const addSavingsBtn = document.getElementById("add-savings");
    const withdrawSavingsBtn = document.getElementById("withdraw-savings");
    const totalSavedDisplay = document.getElementById("total-saved");
    const remainingDisplay = document.getElementById("remaining");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    // Load saved data from localStorage
    let savingsGoal = parseFloat(localStorage.getItem('savingsGoal')) || 0;
    let totalSaved = parseFloat(localStorage.getItem('totalSaved')) || 0;
    let savingsHistory = JSON.parse(localStorage.getItem('savingsHistory')) || [];

    // Initialize savings goal if it exists
    if (savingsGoal > 0) {
        savingsGoalInput.value = savingsGoal;
    }

    // Initialize Chart.js
    const ctx = document.getElementById("savingsChart").getContext("2d");
    const savingsChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: savingsHistory.map((_, i) => `Transaction ${i+1}`),
            datasets: [{
                label: "Total Savings",
                data: savingsHistory,
                borderColor: "#3498db",
                backgroundColor: "rgba(52, 152, 219, 0.1)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Transactions'
                    }
                }
            }
        }
    });

    // Update the display with current savings and progress
    function updateDisplay() {
        totalSavedDisplay.textContent = `$${totalSaved.toFixed(2)}`;
        const remaining = Math.max(0, savingsGoal - totalSaved);
        remainingDisplay.textContent = `$${remaining.toFixed(2)}`;

        // Update progress bar
        const progress = savingsGoal > 0 ? (totalSaved / savingsGoal) * 100 : 0;
        progressBar.value = progress;
        progressText.textContent = `${progress.toFixed(2)}% Completed`;

        // Check if the savings goal is reached
        if (savingsGoal > 0 && totalSaved >= savingsGoal) {
            showNotification(`🎉 Congratulations! You reached your savings goal of $${savingsGoal}!`);
        }

        // Save to localStorage
        localStorage.setItem('totalSaved', totalSaved);
        localStorage.setItem('savingsHistory', JSON.stringify(savingsHistory));
        if (savingsGoal > 0) {
            localStorage.setItem('savingsGoal', savingsGoal);
        }

        // Update the chart
        savingsChart.data.labels = savingsHistory.map((_, i) => `Transaction ${i+1}`);
        savingsChart.data.datasets[0].data = savingsHistory;
        savingsChart.update();
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Add savings
    addSavingsBtn.addEventListener("click", () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            showNotification("Please enter a valid amount.");
            return;
        }
        totalSaved += amount;
        savingsHistory.push(totalSaved);
        amountInput.value = '';
        updateDisplay();
        showNotification(`$${amount.toFixed(2)} added to savings!`);
    });

    // Withdraw savings
    withdrawSavingsBtn.addEventListener("click", () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            showNotification("Please enter a valid amount.");
            return;
        }
        if (amount > totalSaved) {
            showNotification("You cannot withdraw more than your total savings.");
            return;
        }
        totalSaved -= amount;
        savingsHistory.push(totalSaved);
        amountInput.value = '';
        updateDisplay();
        showNotification(`$${amount.toFixed(2)} withdrawn from savings.`);
    });

    // Set savings goal
    savingsGoalInput.addEventListener("change", () => {
        const goal = parseFloat(savingsGoalInput.value);
        if (isNaN(goal) || goal <= 0) {
            showNotification("Please enter a valid savings goal.");
            savingsGoalInput.value = '';
            return;
        }
        savingsGoal = goal;
        updateDisplay();
        showNotification(`Savings goal set to $${goal.toFixed(2)}!`);
    });

    // Initial display update
    updateDisplay();
});