document.addEventListener('DOMContentLoaded', function() {
    const budgetData = JSON.parse(localStorage.getItem('budgetData')) || {};
    
    let totalSpent = 0;
    let categorySpent = { food: 0, travel: 0, accommodation: 0 };

    document.getElementById('add-expense').addEventListener('click', function() {
        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        
        // Assign categories dynamically
        const category = prompt("Enter category: food, travel, or accommodation").toLowerCase();
        
        if (categorySpent[category] !== undefined) {
            categorySpent[category] += expenseAmount;
            totalSpent += expenseAmount;

            updateProgress();
        } else {
            alert("Invalid category! Please enter food, travel, or accommodation.");
        }
    });

    function updateProgress() {
        Object.keys(categorySpent).forEach(category => {
            const budget = parseFloat(budgetData[category] || 0);
            const spent = categorySpent[category];

            let percentageSpent = (spent / budget) * 100;
            let color = percentageSpent < 80 ? "green" : percentageSpent < 100 ? "yellow" : "red";

            document.getElementById(`${category}-value`).innerText = `${percentageSpent.toFixed(2)}% spent`;
            document.getElementById(`${category}-value`).style.color = color;

            if (percentageSpent >= 100) {
                alert(`Warning! You have exceeded your ${category} budget.`);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const expenseName = document.getElementById("expense-name");
    const expenseAmount = document.getElementById("expense-amount");
    const expenseCategory = document.getElementById("expense-category");
    const addExpenseBtn = document.getElementById("add-expense");
    const expenseList = document.getElementById("expense-list");
    const totalExpenseDisplay = document.getElementById("total-expense");
    const budgetStatus = document.getElementById("budget-status");

    let totalExpense = 0;
    let categoryExpenses = { food: 0, travel: 0, accommodation: 0 };
    let budgetLimit = 500; // Example budget

    addExpenseBtn.addEventListener("click", () => {
        const name = expenseName.value.trim();
        const amount = parseFloat(expenseAmount.value);
        const category = expenseCategory.value;

        if (name === "" || isNaN(amount) || amount <= 0) {
            alert("Please enter valid expense details.");
            return;
        }

        // Add expense to list
        const li = document.createElement("li");
        li.textContent = `${name}: $${amount} (${category})`;
        expenseList.appendChild(li);

        // Update total expense
        totalExpense += amount;
        categoryExpenses[category] += amount;
        totalExpenseDisplay.textContent = `$${totalExpense}`;

        // Update progress bar
        updateProgress();

        // Check for alerts
        checkAlerts(category);

        // Clear input fields
        expenseName.value = "";
        expenseAmount.value = "";
    });

    function updateProgress() {
        Object.keys(categoryExpenses).forEach(category => {
            const progressBar = document.getElementById(`${category}-progress`);
            const percentage = (categoryExpenses[category] / budgetLimit) * 100;
            progressBar.style.width = `${percentage}%`;
            progressBar.style.backgroundColor = percentage >= 100 ? "red" : "#4caf50";
        });

        if (totalExpense > budgetLimit) {
            budgetStatus.textContent = "Warning: You are exceeding your budget!";
            budgetStatus.style.color = "red";
        } else {
            budgetStatus.textContent = "You are within your budget.";
            budgetStatus.style.color = "green";
        }
    }

    function checkAlerts(category) {
        if (categoryExpenses[category] > budgetLimit / 2) {
            sendNotification(`You're spending a lot on ${category}!`);
        }
        if (totalExpense > budgetLimit) {
            sendNotification("You have exceeded your budget!");
        }
    }

    function sendNotification(message){
        alert(message); // Replace with notification page functionality
    }
});

document.getElementById("receipt-upload").addEventListener("change", function(event) {
    const { files } = event.target;
    const receiptContainer = document.getElementById("uploaded-receipts");
    receiptContainer.innerHTML = ""; // Clear previous receipts

    for (let i = 0; i < files.length; i++) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(files[i]);
        img.style.width = "100px";
        img.style.margin = "5px";
        receiptContainer.appendChild(img);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const expenseName = document.getElementById("expense-name");
    const expenseAmount = document.getElementById("expense-amount");
    const expenseCategory = document.getElementById("expense-category");
    const addExpenseBtn = document.getElementById("add-expense");
    const expenseList = document.getElementById("expense-list");
    const totalExpenseDisplay = document.getElementById("total-expense");

    let totalExpense = 0;
    let categoryExpenses = { Food: 0, Travel: 0, Accommodation: 0 };

    // Initialize Chart.js
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const expenseChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: Object.keys(categoryExpenses),
            datasets: [{
                data: Object.values(categoryExpenses),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" }
            }
        }
    });

    addExpenseBtn.addEventListener("click", () => {
        const name = expenseName.value.trim();
        const amount = parseFloat(expenseAmount.value);
        const category = expenseCategory.value;

        if (name === "" || isNaN(amount) || amount <= 0) {
            alert("Please enter valid expense details.");
            return;
        }

        // Add expense to list
        const li = document.createElement("li");
        li.textContent = `${name}: $${amount} (${category})`;
        expenseList.appendChild(li);

        // Update category expenses
        categoryExpenses[category] += amount;
        totalExpense += amount;
        totalExpenseDisplay.textContent = `$${totalExpense}`;

        // Update Chart
        expenseChart.data.datasets[0].data = Object.values(categoryExpenses);
        expenseChart.update();

        // Clear input fields
        expenseName.value = "";
        expenseAmount.value = "";
    });
});addExpenseBtn.addEventListener("click", async () => {
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;

    if (name === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter valid expense details.");
        return;
    }

    // Send expense to backend
    try {
        const response = await fetch("http://localhost:5000/api/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, amount, category })
        });

        const data = await response.json();
        console.log(data.message);

        if (response.ok) {
            fetchExpenses(); // Refresh list
        }
    } catch (error) {
        console.error("Error adding expense:", error);
    }
});

// 📌 Fetch expenses from backend
async function fetchExpenses() {
    try {
        const response = await fetch("http://localhost:5000/api/expenses");
        const expenses = await response.json();

        expenseList.innerHTML = "";
        expenses.forEach(exp => {
            const li = document.createElement("li");
            li.textContent = `${exp.name}: $${exp.amount} (${exp.category})`;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.onclick = () => deleteExpense(exp._id);

            li.appendChild(deleteBtn);
            expenseList.appendChild(li);
        });

        totalExpenseDisplay.textContent = `$${expenses.reduce((acc, exp) => acc + exp.amount, 0)}`;
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
}

// 📌 Delete an Expense
async function deleteExpense(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            fetchExpenses(); // Refresh list
        }
    } catch (error) {
        console.error("Error deleting expense:", error);
    }
}

// Load expenses on page load
fetchExpenses();


if (amountValue > budgetCategoryLimit) {
    sendNotification(`⚠️ You exceeded the budget for ${category} by $${amountValue - budgetCategoryLimit}`);
}



