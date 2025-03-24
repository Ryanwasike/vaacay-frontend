document.addEventListener("DOMContentLoaded", function () {
    const tripNameInput = document.getElementById("trip-name");
    const tripDateInput = document.getElementById("trip-dates");
    const tripBudgetInput = document.getElementById("trip-budget");
    const addTripButton = document.getElementById("add-trip");
    const tripList = document.getElementById("trip-list");
    const calendar = document.getElementById("calendar");

    let trips = JSON.parse(localStorage.getItem("trips")) || [];

    // Function to display trips
    function displayTrips(){
        tripList.innerHTML = "";
        calendar.innerHTML = "<h4>Trip Calendar</h4>";

        trips.forEach((trip, index) => {
            const tripItem = document.createElement("li");
            tripItem.innerHTML = `
                <strong>${trip.name}</strong> - ${trip.date} <br>
                Budget: $${trip.budget}
                <button class="delete-btn" data-index="${index}">❌</button>
            `;
            tripList.appendChild(tripItem);

            // Add to calendar
            const calendarItem = document.createElement("p");
            calendarItem.innerHTML = `📅 <strong>${trip.date}</strong> - ${trip.name}`;
            calendar.appendChild(calendarItem);
        });

        // Attach delete event listeners
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", deleteTrip);
        });
    }

    // Function to add trip
    addTripButton.addEventListener("click", function () {
        const name = tripNameInput.value.trim();
        const date = tripDateInput.value;
        const budget = tripBudgetInput.value.trim();

        if (name === "" || date === "" || budget === "") {
            alert("Please fill in all fields!");
            return;
        }

        trips.push({ name, date, budget });
        localStorage.setItem("trips", JSON.stringify(trips));
        displayTrips();

        // Clear inputs
        tripNameInput.value = "";
        tripDateInput.value = "";
        tripBudgetInput.value = "";
    });

    // Function to delete a trip
    function deleteTrip(event) {
        const {index} = event.target.dataset.index;
        trips.splice(index, 1);
        localStorage.setItem("trips", JSON.stringify(trips));
        displayTrips();
    }

    // Initialize display
    displayTrips();
});


document.addEventListener("DOMContentLoaded", async function () {
    const tripNameInput = document.getElementById("trip-name");
    const tripDateInput = document.getElementById("trip-dates");
    const tripBudgetInput = document.getElementById("trip-budget");
    const addTripButton = document.getElementById("add-trip");
    const tripList = document.getElementById("trip-list");
    const calendar = document.getElementById("calendar");

    async function fetchTrips() {
        const response = await fetch("http://localhost:5000/api/trips");
        const trips = await response.json();
        displayTrips(trips);
    }

    function displayTrips(trips) {
        tripList.innerHTML = "";
        calendar.innerHTML = "<h4>Trip Calendar</h4>";

        trips.forEach(trip => {
            const tripItem = document.createElement("li");
            tripItem.innerHTML = `
                <strong>${trip.name}</strong> - ${new Date(trip.date).toDateString()} <br>
                Budget: $${trip.budget}
                <button class="delete-btn" data-id="${trip._id}">❌</button>
            `;
            tripList.appendChild(tripItem);

            const calendarItem = document.createElement("p");
            calendarItem.innerHTML = `📅 <strong>${new Date(trip.date).toDateString()}</strong> - ${trip.name}`;
            calendar.appendChild(calendarItem);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", deleteTrip);
        });
    }

    addTripButton.addEventListener("click", async function () {
        const name = tripNameInput.value.trim();
        const date = tripDateInput.value;
        const budget = tripBudgetInput.value.trim();

        if (!name || !date || !budget) {
            alert("Please fill in all fields!");
            return;
        }

        const response = await fetch("http://localhost:5000/api/trips/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, date, budget })
        });

        if (response.ok) {
            fetchTrips();
            tripNameInput.value = "";
            tripDateInput.value = "";
            tripBudgetInput.value = "";
        } else {
            alert("Failed to add trip");
        }
    });

    async function deleteTrip(event) {
        const tripId = event.target.dataset.id;

        const response = await fetch(`http://localhost:5000/api/trips/delete/${tripId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            fetchTrips();
        } else {
            alert("Failed to delete trip");
        }
    }

    fetchTrips();
});
