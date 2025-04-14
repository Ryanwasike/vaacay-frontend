document.addEventListener("DOMContentLoaded", function() {
    // Get DOM elements
    const expenseName = document.getElementById("expense-name");
    const expenseAmount = document.getElementById("expense-amount");
    const expenseCategory = document.getElementById("expense-category");
    const addExpenseBtn = document.getElementById("add-expense");
    const expenseList = document.getElementById("expense-list");
    const totalExpenseDisplay = document.getElementById("total-expense");
    const budgetStatus = document.getElementById("budget-status");
    const receiptUpload = document.getElementById("receipt-upload");
    const uploadedReceipts = document.getElementById("uploaded-receipts");

    // Initialize variables with entertainment category
    let expenses = [];
    let totalExpense = 0;
    let categoryExpenses = { 
        food: 0, 
        travel: 0, 
        accommodation: 0,
        entertainment: 0 
    };
    
    let budgetData = JSON.parse(localStorage.getItem('budgetData')) || {};
    
    // Update category options in the select element
    updateCategoryOptions();

    // Initialize Chart.js with all categories
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const expenseChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: Object.keys(categoryExpenses),
            datasets: [{
                data: Object.values(categoryExpenses),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" }
            }
        }
    });

    // Load existing expenses from localStorage
    loadExpenses();
    updateProgress();

    // Event listeners
    addExpenseBtn.addEventListener("click", addExpense);
    receiptUpload.addEventListener("change", handleReceiptUpload);

    function updateCategoryOptions() {
        // Clear existing options
        expenseCategory.innerHTML = '';
        
        // Add all categories including entertainment
        const categories = [
            { value: "food", text: "Food" },
            { value: "travel", text: "Travel" },
            { value: "accommodation", text: "Accommodation" },
            { value: "entertainment", text: "Entertainment" }
        ];
        
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.value;
            option.textContent = cat.text;
            expenseCategory.appendChild(option);
        });
    }

    function addExpense() {
        const name = expenseName.value.trim();
        const amount = parseFloat(expenseAmount.value);
        const category = expenseCategory.value;

        if (name === "" || isNaN(amount) || amount <= 0) {
            showAlert("Please enter valid expense details.", "error");
            return;
        }

        // Create expense object
        const expense = {
            id: Date.now().toString(),
            name,
            amount,
            category,
            date: new Date().toISOString()
        };

        // Add to expenses array
        expenses.push(expense);
        
        // Update totals
        totalExpense += amount;
        categoryExpenses[category] += amount;

        // Save to localStorage
        saveExpenses();
        
        // Update UI
        renderExpense(expense);
        updateProgress();
        updateChart();
        
        // Check budget limits
        checkBudgetLimits(category, amount);
        
        // Clear inputs
        expenseName.value = "";
        expenseAmount.value = "";
        
        showAlert("Expense added successfully!");
    }

    function loadExpenses() {
        const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses = savedExpenses;
        
        // Calculate totals
        totalExpense = 0;
        categoryExpenses = { 
            food: 0, 
            travel: 0, 
            accommodation: 0,
            entertainment: 0 
        };
        
        expenses.forEach(expense => {
            totalExpense += expense.amount;
            categoryExpenses[expense.category] += expense.amount;
        });
        
        // Render all expenses
        expenseList.innerHTML = "";
        expenses.forEach(expense => renderExpense(expense));
        
        // Update displays
        totalExpenseDisplay.textContent = `$${totalExpense.toFixed(2)}`;
        updateChart();
    }

    function renderExpense(expense) {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${expense.name}: $${expense.amount.toFixed(2)} (${expense.category})</span>
            <button class="delete-btn" data-id="${expense.id}">❌</button>
        `;
        expenseList.appendChild(li);
        
        // Add delete event
        li.querySelector(".delete-btn").addEventListener("click", function() {
            deleteExpense(expense.id);
        });
    }

    function deleteExpense(id) {
        // Find expense index
        const index = expenses.findIndex(exp => exp.id === id);
        if (index === -1) return;
        
        // Get expense details
        const expense = expenses[index];
        
        // Update totals
        totalExpense -= expense.amount;
        categoryExpenses[expense.category] -= expense.amount;
        
        // Remove from array
        expenses.splice(index, 1);
        
        // Save to localStorage
        saveExpenses();
        
        // Update UI
        expenseList.innerHTML = "";
        expenses.forEach(exp => renderExpense(exp));
        totalExpenseDisplay.textContent = `$${totalExpense.toFixed(2)}`;
        updateProgress();
        updateChart();
        
        showAlert("Expense deleted successfully!");
    }

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function updateProgress() {
        // Get budget data
        const totalBudget = parseFloat(budgetData.totalIncome) || 0;
        const foodBudget = (parseFloat(budgetData.food) || 0) * totalBudget / 100;
        const travelBudget = (parseFloat(budgetData.travel) || 0) * totalBudget / 100;
        const accommodationBudget = (parseFloat(budgetData.accommodation) || 0) * totalBudget / 100;
        const entertainmentBudget = (parseFloat(budgetData.entertainment) || 0) * totalBudget / 100;
        
        // Update progress bars for all categories
        updateProgressBar('food', categoryExpenses.food, foodBudget);
        updateProgressBar('travel', categoryExpenses.travel, travelBudget);
        updateProgressBar('accommodation', categoryExpenses.accommodation, accommodationBudget);
        updateProgressBar('entertainment', categoryExpenses.entertainment, entertainmentBudget);
        
        // Update budget status
        if (totalBudget > 0) {
            const totalPercentage = (totalExpense / totalBudget) * 100;
            if (totalPercentage >= 100) {
                budgetStatus.textContent = "⚠️ Warning: You have exceeded your total budget!";
                budgetStatus.style.color = "red";
            } else if (totalPercentage >= 80) {
                budgetStatus.textContent = "⚠️ Warning: You're approaching your budget limit!";
                budgetStatus.style.color = "orange";
            } else {
                budgetStatus.textContent = "✅ You are within your budget.";
                budgetStatus.style.color = "green";
            }
        }
    }

    function updateProgressBar(category, spent, budget) {
        const progressBar = document.getElementById(`${category}-progress`);
        if (!progressBar) return;
        
        if (budget > 0) {
            const percentage = Math.min((spent / budget) * 100, 100);
            progressBar.style.width = `${percentage}%`;
            
            if (percentage >= 100) {
                progressBar.style.backgroundColor = "red";
            } else if (percentage >= 80) {
                progressBar.style.backgroundColor = "orange";
            } else {
                progressBar.style.backgroundColor = "#4CAF50";
            }
        } else {
            progressBar.style.width = "0%";
        }
    }

    function checkBudgetLimits(category, amount) {
        const totalBudget = parseFloat(budgetData.totalIncome) || 0;
        const categoryPercentage = parseFloat(budgetData[category]) || 0;
        const categoryBudget = categoryPercentage * totalBudget / 100;
        
        if (categoryBudget > 0) {
            const newTotal = categoryExpenses[category];
            const percentage = (newTotal / categoryBudget) * 100;
            
            if (newTotal > categoryBudget) {
                showAlert(`⚠️ You have exceeded your ${category} budget by $${(newTotal - categoryBudget).toFixed(2)}!`, "error");
            } else if (percentage >= 80) {
                showAlert(`⚠️ Warning: You're approaching your ${category} budget limit!`, "warning");
            }
        }
    }

    function updateChart() {
        // Update chart with all categories including entertainment
        expenseChart.data.labels = Object.keys(categoryExpenses);
        expenseChart.data.datasets[0].data = Object.values(categoryExpenses);
        expenseChart.update();
    }

    function handleReceiptUpload(event) {
        const files = event.target.files;
        uploadedReceipts.innerHTML = "";
        
        for (let i = 0; i < files.length; i++) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(files[i]);
            img.style.width = "100px";
            img.style.margin = "5px";
            img.style.borderRadius = "4px";
            uploadedReceipts.appendChild(img);
        }
    }

    function showAlert(message, type = "success") {
        const alertDiv = document.createElement("div");
        alertDiv.className = `alert ${type}`;
        alertDiv.textContent = message;
        
        const alertsSection = document.querySelector("#alerts");
        if (!alertsSection) return;
        
        alertsSection.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
});