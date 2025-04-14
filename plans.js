document.addEventListener("DOMContentLoaded", async function () {
    // DOM Elements
    const tripNameInput = document.getElementById("trip-name");
    const tripDateInput = document.getElementById("trip-dates");
    const tripBudgetInput = document.getElementById("trip-budget");
    const tripDestinationInput = document.getElementById("trip-destination");
    const addTripButton = document.getElementById("add-trip");
    const tripList = document.getElementById("trip-list");
    const calendar = document.getElementById("calendar");

    // Initialize date picker
    flatpickr("#trip-dates", {
        mode: "range",
        dateFormat: "Y-m-d",
        minDate: "today"
    });

    // Load trips from backend
    async function fetchTrips() {
        try {
            const response = await fetch("http://localhost:5000/api/trips");
            if (!response.ok) throw new Error("Failed to fetch trips");
            return await response.json();
        } catch (error) {
            console.error("Error fetching trips:", error);
            return [];
        }
    }

    // Display trips in UI
    async function displayTrips() {
        const trips = await fetchTrips();
        
        // Clear existing trips
        tripList.innerHTML = "";
        calendar.innerHTML = "<h3>Trip Calendar</h3>";
        
        if (trips.length === 0) {
            tripList.innerHTML = '<p class="empty-message">No trips planned yet</p>';
            calendar.innerHTML += '<p class="empty-message">No upcoming trips</p>';
            return;
        }

        // Sort trips by date
        trips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        // Create trip cards
        trips.forEach(trip => {
            // Trip card
            const tripCard = document.createElement("div");
            tripCard.className = "trip-card";
            tripCard.innerHTML = `
                <h4>${trip.name}</h4>
                <p class="trip-destination">📍 ${trip.destination || "No destination specified"}</p>
                <p class="trip-dates">📅 ${formatDateRange(trip.startDate, trip.endDate)}</p>
                <p class="trip-budget">💰 $${trip.budget}</p>
                <button class="delete-btn" data-id="${trip._id}">×</button>
            `;
            tripList.appendChild(tripCard);

            // Calendar event
            const calendarEvent = document.createElement("div");
            calendarEvent.className = "calendar-event";
            calendarEvent.innerHTML = `
                <h4>${trip.name}</h4>
                <p>${formatDateRange(trip.startDate, trip.endDate)}</p>
                <p>${trip.destination ? `📍 ${trip.destination}` : ''}</p>
            `;
            calendar.appendChild(calendarEvent);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", deleteTrip);
        });
    }

    // Add new trip
    addTripButton.addEventListener("click", async function () {
        const name = tripNameInput.value.trim();
        const dateString = tripDateInput.value;
        const budget = tripBudgetInput.value.trim();
        const destination = tripDestinationInput.value.trim();

        if (!name || !dateString || !budget) {
            alert("Please fill in all required fields!");
            return;
        }

        const [startDate, endDate] = dateString.split(" to ");

        try {
            const response = await fetch("http://localhost:5000/api/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name, 
                    startDate, 
                    endDate, 
                    budget,
                    destination 
                })
            });

            if (!response.ok) throw new Error("Failed to add trip");

            // Clear form
            tripNameInput.value = "";
            tripDateInput.value = "";
            tripBudgetInput.value = "";
            tripDestinationInput.value = "";

            // Refresh trip list
            await displayTrips();
        } catch (error) {
            console.error("Error adding trip:", error);
            alert("Failed to add trip. Please try again.");
        }
    });

    // Delete trip
    async function deleteTrip(event) {
        const tripId = event.target.dataset.id;
        
        if (!confirm("Are you sure you want to delete this trip?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete trip");

            // Refresh trip list
            await displayTrips();
        } catch (error) {
            console.error("Error deleting trip:", error);
            alert("Failed to delete trip. Please try again.");
        }
    }

    // Helper function to format date range
    function formatDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start.toDateString() === end.toDateString()) {
            return start.toLocaleDateString();
        }
        
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    }

    // Initial display
    await displayTrips();
});