document.addEventListener("DOMContentLoaded", () => {
    const notificationList = document.getElementById("notification-list");
    const notificationBadge = document.getElementById("notification-badge");
    const clearNotificationsBtn = document.getElementById("clear-notifications");
    const markAllReadBtn = document.getElementById("mark-all-read");

    // Load notifications from localStorage
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    
    // Initialize notification system
    initNotifications();

    function initNotifications() {
        updateNotificationUI();
        setupEventListeners();
    }

    function updateNotificationUI() {
        notificationList.innerHTML = "";
        
        // Count unread notifications
        const unreadCount = notifications.filter(n => !n.read).length;
        
        // Update badge
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? "inline-block" : "none";
        
        if (notifications.length === 0) {
            notificationList.innerHTML = `<li class="empty-message">No notifications yet</li>`;
            return;
        }

        // Add notifications to list
        notifications.forEach((notification, index) => {
            const li = document.createElement("li");
            li.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
            li.innerHTML = `
                <div class="notification-content">
                    <span class="notification-type ${notification.type}">${notification.type.toUpperCase()}</span>
                    <p class="notification-message">${notification.message}</p>
                    <small class="notification-time">${formatTime(notification.timestamp)}</small>
                </div>
                <button class="delete-notification" data-id="${index}">×</button>
            `;
            
            // Mark as read when clicked
            li.addEventListener("click", () => {
                if (!notification.read) {
                    notification.read = true;
                    saveNotifications();
                    li.classList.remove("unread");
                    li.classList.add("read");
                    updateNotificationBadge();
                }
            });
            
            notificationList.appendChild(li);
        });
    }

    function setupEventListeners() {
        // Clear all notifications
        clearNotificationsBtn.addEventListener("click", () => {
            if (notifications.length > 0 && confirm("Are you sure you want to clear all notifications?")) {
                notifications = [];
                saveNotifications();
                updateNotificationUI();
            }
        });

        // Mark all as read
        markAllReadBtn.addEventListener("click", () => {
            notifications.forEach(n => n.read = true);
            saveNotifications();
            updateNotificationUI();
        });

        // Delete single notification (event delegation)
        notificationList.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-notification")) {
                e.stopPropagation();
                const index = parseInt(e.target.getAttribute("data-id"));
                notifications.splice(index, 1);
                saveNotifications();
                updateNotificationUI();
            }
        });
    }

    function saveNotifications() {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }

    function updateNotificationBadge() {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
});

// Function to add notifications from other pages
function sendNotification(message, type = "info") {
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.unshift({
        message,
        type,
        read: false,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    // Update badge if on notification page
    const badge = document.getElementById("notification-badge");
    if (badge) {
        const unreadCount = notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }
}