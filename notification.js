document.addEventListener("DOMContentLoaded", () => {
    const notificationList = document.getElementById("notification-list");
    const notificationDot = document.getElementById("notification-dot");
    const clearNotificationsBtn = document.getElementById("clear-notifications");

    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    function updateNotifications() {
        notificationList.innerHTML = "";
        notifications.forEach((notif, index) => {
            const li = document.createElement("li");
            li.textContent = notif;
            notificationList.appendChild(li);
        });

        if (notifications.length > 0) {
            notificationDot.style.visibility = "visible";
        } else {
            notificationDot.style.visibility = "hidden";
        }
    }

    function addNotification(message) {
        notifications.push(message);
        localStorage.setItem("notifications", JSON.stringify(notifications));
        updateNotifications();
    }

    clearNotificationsBtn.addEventListener("click", () => {
        notifications = [];
        localStorage.removeItem("notifications");
        updateNotifications();
    });

    updateNotifications();
});

// Function to add notifications from other pages
function sendNotification(message) {
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push(message);
    localStorage.setItem("notifications", JSON.stringify(notifications));
}


document.addEventListener("DOMContentLoaded", async () => {
    const notificationList = document.getElementById("notification-list");
    const notificationDot = document.getElementById("notification-dot");
    const clearNotificationsBtn = document.getElementById("clear-notifications");

    async function fetchNotifications() {
        try {
            const response = await fetch("http://localhost:5000/api/notifications");
            const notifications = await response.json();

            notificationList.innerHTML = "";
            notifications.forEach(notif => {
                const li = document.createElement("li");
                li.textContent = `${notif.type.toUpperCase()}: ${notif.message}`;
                notificationList.appendChild(li);
            });

            notificationDot.style.visibility = notifications.length > 0 ? "visible" : "hidden";
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }

    clearNotificationsBtn.addEventListener("click", async () => {
        await fetch("http://localhost:5000/api/notifications", { method: "DELETE" });
        fetchNotifications();
    });

    fetchNotifications();
});
