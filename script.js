// ==========================================
// EVENT REGISTRATION MANAGEMENT SYSTEM
// ==========================================

let events =
    JSON.parse(
        localStorage.getItem("eventHubData")
    ) || [];


// ==========================================
// ELEMENTS
// ==========================================

const eventForm =
    document.getElementById("eventForm");

const eventNameInput =
    document.getElementById("eventName");

const organizerInput =
    document.getElementById("organizer");

const eventTypeInput =
    document.getElementById("eventType");

const venueInput =
    document.getElementById("venue");

const eventDateInput =
    document.getElementById("eventDate");

const capacityInput =
    document.getElementById("capacity");

const searchInput =
    document.getElementById("searchInput");

const typeFilter =
    document.getElementById("typeFilter");

const eventsContainer =
    document.getElementById("eventsContainer");


// ==========================================
// ADD EVENT
// ==========================================

eventForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const eventName =
            eventNameInput.value.trim();

        const organizer =
            organizerInput.value.trim();

        const eventType =
            eventTypeInput.value;

        const venue =
            venueInput.value.trim();

        const eventDate =
            eventDateInput.value;

        const capacity =
            Number(capacityInput.value);


        if (
            eventName === "" ||
            organizer === "" ||
            venue === "" ||
            eventDate === "" ||
            capacity <= 0
        ) {

            alert(
                "Please enter valid event details."
            );

            return;

        }


        const newEvent = {

            id: Date.now(),

            name: eventName,

            organizer: organizer,

            type: eventType,

            venue: venue,

            date: eventDate,

            capacity: capacity,

            registrations: 0

        };


        events.unshift(newEvent);


        saveEvents();

        eventForm.reset();

        displayEvents();

    }
);


// ==========================================
// SAVE EVENTS
// ==========================================

function saveEvents() {

    localStorage.setItem(
        "eventHubData",
        JSON.stringify(events)
    );

}


// ==========================================
// DISPLAY EVENTS
// ==========================================

function displayEvents() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        typeFilter.value;


    const filteredEvents =
        events.filter(
            item => {

                const matchesSearch =
                    item.name
                        .toLowerCase()
                        .includes(search) ||
                    item.organizer
                        .toLowerCase()
                        .includes(search) ||
                    item.venue
                        .toLowerCase()
                        .includes(search);


                const matchesType =
                    selectedType === "All" ||
                    item.type === selectedType;


                return (
                    matchesSearch &&
                    matchesType
                );

            }
        );


    eventsContainer.innerHTML = "";


    if (
        filteredEvents.length === 0
    ) {

        eventsContainer.innerHTML = `

            <div class="empty-message">

                <h3>
                    No events found
                </h3>

                <p>
                    Create your first event to get started.
                </p>

            </div>

        `;

        updateDashboard();

        return;

    }


    filteredEvents.forEach(
        item => {

            const card =
                document.createElement("div");

            card.className =
                "event-card";


            const remaining =
                item.capacity -
                item.registrations;


            const isFull =
                remaining <= 0;


            const percentage =
                Math.min(
                    100,
                    Math.round(
                        (item.registrations /
                            item.capacity) *
                        100
                    )
                );


            const statusClass =
                isFull
                    ? "status-full"
                    : "status-open";


            const statusText =
                isFull
                    ? "Full"
                    : "Open";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(item.name)}
                </h3>


                <p class="organizer">
                    Organized by:
                    ${escapeHTML(item.organizer)}
                </p>


                <div class="event-badges">

                    <span class="badge type-badge">
                        ${escapeHTML(item.type)}
                    </span>

                    <span class="badge ${statusClass}">
                        ${statusText}
                    </span>

                </div>


                <div class="event-details">

                    <div>
                        Date:
                        ${formatDate(item.date)}
                    </div>

                    <div>
                        Venue:
                        ${escapeHTML(item.venue)}
                    </div>

                </div>


                <div class="seat-info">

                    <strong>
                        ${item.registrations}
                        / ${item.capacity}
                        registered
                    </strong>

                    <div class="seat-bar">

                        <div
                            class="seat-fill"
                            style="width: ${percentage}%"
                        ></div>

                    </div>

                    <small>
                        ${remaining}
                        seats available
                    </small>

                </div>


                <div class="event-actions">

                    <button
                        class="register-btn"
                        onclick="registerParticipant(${item.id})"
                        ${isFull ? "disabled" : ""}
                    >
                        Register Participant
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteEvent(${item.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            eventsContainer.appendChild(card);

        }
    );


    updateDashboard();

}


// ==========================================
// REGISTER PARTICIPANT
// ==========================================

function registerParticipant(id) {

    const event =
        events.find(
            item =>
                item.id === id
        );


    if (!event) {
        return;
    }


    if (
        event.registrations >=
        event.capacity
    ) {

        alert(
            "This event is already full."
        );

        return;

    }


    const participant =
        prompt(
            "Enter participant name:"
        );


    if (
        participant === null ||
        participant.trim() === ""
    ) {

        return;

    }


    event.registrations++;


    saveEvents();

    displayEvents();


    alert(
        participant.trim() +
        " registered successfully!"
    );

}


// ==========================================
// DELETE EVENT
// ==========================================

function deleteEvent(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this event?"
        );


    if (!confirmDelete) {
        return;
    }


    events =
        events.filter(
            item =>
                item.id !== id
        );


    saveEvents();

    displayEvents();

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const totalEvents =
        events.length;


    const totalRegistrations =
        events.reduce(
            (total, event) =>
                total + event.registrations,
            0
        );


    const availableSeats =
        events.reduce(
            (total, event) =>
                total +
                (
                    event.capacity -
                    event.registrations
                ),
            0
        );


    const fullEvents =
        events.filter(
            event =>
                event.registrations >=
                event.capacity
        ).length;


    document.getElementById(
        "totalEvents"
    ).innerText =
        totalEvents;


    document.getElementById(
        "totalRegistrations"
    ).innerText =
        totalRegistrations;


    document.getElementById(
        "availableSeats"
    ).innerText =
        availableSeats;


    document.getElementById(
        "fullEvents"
    ).innerText =
        fullEvents;

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    const dateObject =
        new Date(
            date + "T00:00:00"
        );


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// SEARCH & FILTER
// ==========================================

searchInput.addEventListener(
    "input",
    displayEvents
);

typeFilter.addEventListener(
    "change",
    displayEvents
);


// ==========================================
// INITIAL LOAD
// ==========================================

displayEvents();