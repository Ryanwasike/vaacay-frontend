document.addEventListener("DOMContentLoaded", function () {
    // Initialize the app
    initBudgetPlanner();
    
    // Check for notifications
    updateNotificationDot();
});

function initBudgetPlanner() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize slider values
    updateAllSliderValues();
    
    // Load any saved budget
    updateBudgetSummary();
}

function setupEventListeners() {
    // Slider events
    document.getElementById("food-budget").addEventListener("input", () => updateSliderValue('food'));
    document.getElementById("travel-budget").addEventListener("input", () => updateSliderValue('travel'));
    document.getElementById("accommodation-budget").addEventListener("input", () => updateSliderValue('accommodation'));
    
    // Template buttons
    document.querySelectorAll(".template-btn").forEach(button => {
        button.addEventListener("click", function() {
            loadTemplate(this.dataset.template);
        });
    });
    
    // Save budget button
    document.getElementById("save-budget").addEventListener("click", saveBudget);
}

function updateAllSliderValues() {
    updateSliderValue('food');
    updateSliderValue('travel');
    updateSliderValue('accommodation');
}

function updateSliderValue(category) {
    const slider = document.getElementById(`${category}-budget`);
    const valueDisplay = document.getElementById(`${category}-value`);
    valueDisplay.textContent = `${slider.value}%`;
    updateBudgetSummary();
}

function loadTemplate(type) {
    let food, travel, accommodation;
    
    switch(type) {
        case 'luxury':
            food = 15;
            travel = 25;
            accommodation = 60;
            break;
        case 'budget':
            food = 30;
            travel = 40;
            accommodation = 30;
            break;
        case 'family':
            food = 25;
            travel = 35;
            accommodation = 40;
            break;
        default:
            food = 20;
            travel = 30;
            accommodation = 50;
    }
    
    document.getElementById('food-budget').value = food;
    document.getElementById('travel-budget').value = travel;
    document.getElementById('accommodation-budget').value = accommodation;
    
    updateAllSliderValues();
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} template loaded! Adjust as needed.`);
}

function saveBudget() {
    const totalIncome = parseFloat(document.getElementById("total-income").value);

    if (!totalIncome || totalIncome <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    const budgetData = {
        totalIncome,
        food: parseFloat(document.getElementById("food-budget").value),
        travel: parseFloat(document.getElementById("travel-budget").value),
        accommodation: parseFloat(document.getElementById("accommodation-budget").value),
    };

    localStorage.setItem("budgetData", JSON.stringify(budgetData));
    updateBudgetSummary();
    alert("Budget saved successfully!");
}

function updateBudgetSummary() {
    const totalBudget = parseFloat(document.getElementById("total-income").value) || 0;
    const foodPercent = parseFloat(document.getElementById("food-budget").value) / 100;
    const travelPercent = parseFloat(document.getElementById("travel-budget").value) / 100;
    const accommodationPercent = parseFloat(document.getElementById("accommodation-budget").value) / 100;

    const foodAmount = totalBudget * foodPercent;
    const travelAmount = totalBudget * travelPercent;
    const accommodationAmount = totalBudget * accommodationPercent;
    
    const totalExpenses = foodAmount + travelAmount + accommodationAmount;

    // Update DOM elements
    document.getElementById("total-budget").textContent = totalBudget.toFixed(2);
    document.getElementById("total-expenses").textContent = totalExpenses.toFixed(2);
    document.getElementById("remaining-budget").textContent = (totalBudget - totalExpenses).toFixed(2);

    // Update progress bar
    const progressBar = document.getElementById("progress-bar");
    const progressPercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.style.backgroundColor = progressPercentage > 100 ? "red" : "#4CAF50";

    // Update alert message
    const alertMessage = document.getElementById("alert-message");
    if (totalExpenses > totalBudget) {
        alertMessage.textContent = "⚠️ Budget Exceeded! Your expenses are more than the set budget.";
        alertMessage.style.color = "red";
        sendAlertToNotifications("Budget exceeded!");
    } else {
        alertMessage.textContent = "✅ Budget is within limits!";
        alertMessage.style.color = "green";
    }
}

function sendAlertToNotifications(message) {
    localStorage.setItem('latestNotification', message);
    localStorage.setItem('newNotification', 'true');
    updateNotificationDot();
}

function updateNotificationDot() {
    const notificationDot = document.getElementById('notification-dot');
    notificationDot.style.display = localStorage.getItem('newNotification') === 'true' 
        ? 'inline' 
        : 'none';
}