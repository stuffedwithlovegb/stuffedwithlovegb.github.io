const STORAGE_KEY = "swlOpsV2";

/* =========================================================
   BUSINESS DATA
========================================================= */

const PLUSH_OPTIONS = [
  {
    id: "golden",
    name: "Golden Retriever"
  },
  {
    id: "bear",
    name: "Honey Bear"
  },
  {
    id: "cat",
    name: "Orange Cat"
  },
  {
    id: "unicorn",
    name: "Unicorn"
  },
  {
    id: "dino",
    name: "Dino"
  },
  {
    id: "frog",
    name: "Frog"
  }
];

const PACKAGE_DATA = {
  "$30 Package": {
    pricePerGuest: 30,
    description:
      "Stuffing experience, heart ceremony, adoption certificate + travel bag"
  },

  "$35 Package": {
    pricePerGuest: 35,
    description:
      "Everything in $30 + custom T-shirt"
  },

  "$40 Package": {
    pricePerGuest: 40,
    description:
      "Full birthday experience with shirt, vinyl, accessories + birthday outfit"
  },

  "Custom": {
    pricePerGuest: null,
    description:
      "Use for retirement, corporate, partner or unusual events"
  }
};

const ADD_ON_PRICING = {
  outfit: 8,
  voiceChip: 10,
  extraShirt: 5,
  vinyl: 5
};


/* =========================================================
   INVENTORY
========================================================= */

const inventorySeed = [
  {
    id: "golden",
    name: "Golden Retrievers",
    category: "Plush",
    onHand: 27
  },

  {
    id: "bear",
    name: "Honey Bears",
    category: "Plush",
    onHand: 42
  },

  {
    id: "cat",
    name: "Orange Cats",
    category: "Plush",
    onHand: 18
  },

  {
    id: "unicorn",
    name: "Unicorns",
    category: "Plush",
    onHand: 41
  },

  {
    id: "dino",
    name: "Dinos",
    category: "Plush",
    onHand: 36
  },

  {
    id: "frog",
    name: "Frogs",
    category: "Plush",
    onHand: 10
  },

  {
    id: "sound",
    name: "Sound / Voice Chips",
    category: "Supplies",
    onHand: 18
  },

  {
    id: "girl-bday",
    name: "Girl Birthday Outfits",
    category: "Outfits",
    onHand: 18
  },

  {
    id: "boy-bday",
    name: "Boy Birthday Outfits",
    category: "Outfits",
    onHand: 24
  },

  {
    id: "travel-bags",
    name: "Travel Bags",
    category: "Supplies",
    onHand: 135
  },

  {
    id: "hearts",
    name: "Wishing Hearts",
    category: "Supplies",
    onHand: 300
  },

  {
    id: "white-shirt",
    name: "White T-Shirts",
    category: "Shirts",
    onHand: 50
  },

  {
    id: "fluff",
    name: "Fluff",
    category: "Supplies",
    onHand: 2,
    unit: "boxes",
    autoReserve: false
  }
];


/* =========================================================
   PACKING
========================================================= */

const masterPackingList = [
  "Stuffing machine",
  "Fluff",
  "EcoFlow / power",
  "Rugs",
  "Tablecloths",
  "Tables",
  "Wood crates",
  "Photo-op pieces / photo hearts",
  "Friend Hotel",
  "Adoption certificates",
  "Wishing hearts",
  "Pens",
  "Welcome sign",
  "Signage",
  "Trash bags",
  "Felt-wall accessories",
  "Clothes / mini wardrobe rack"
];


/* =========================================================
   APP STATE
========================================================= */

let state = loadState();

let currentScreen = "home";
let currentEventId = null;

let wizard = null;
let wizardStep = 0;

const wizardSteps = [
  "Basics",
  "Where",
  "Party",
  "Extras",
  "Payment",
  "Review"
];


/* =========================================================
   STATE
========================================================= */

function createInitialState() {
  return {
    events: [],
    inventory: structuredClone(inventorySeed),
    attention: [],
    notes: []
  };
}


function loadState() {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {

    const fresh = createInitialState();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(fresh)
    );

    return fresh;
  }

  try {

    const parsed = JSON.parse(saved);

    parsed.events ||= [];
    parsed.attention ||= [];
    parsed.notes ||= [];

    if (!parsed.inventory?.length) {
      parsed.inventory = structuredClone(inventorySeed);
    }

    return parsed;

  } catch {

    return createInitialState();

  }
}


function saveState() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

  updateAttentionBadge();
}


/* =========================================================
   BASIC UTILITIES
========================================================= */

function makeId(prefix = "id") {

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

}


function escapeHTML(value = "") {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function money(value) {

  const number = Number(value || 0);

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  ).format(number);

}


function formatDate(dateString) {

  if (!dateString) {
    return "Date not set";
  }

  const date =
    new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric"
    }
  );

}


/*
  Converts:
  14:00 -> 2:00 PM
  09:30 -> 9:30 AM
*/

function formatTime(timeString) {

  if (!timeString) {
    return "";
  }

  const [hourString, minuteString] =
    timeString.split(":");

  const hour =
    Number(hourString);

  const minute =
    Number(minuteString || 0);

  const suffix =
    hour >= 12
      ? "PM"
      : "AM";

  const normalHour =
    hour % 12 || 12;

  return `${normalHour}:${String(minute).padStart(2, "0")} ${suffix}`;

}


function daysUntil(dateString) {

  if (!dateString) {
    return null;
  }

  const today =
    new Date();

  today.setHours(0, 0, 0, 0);

  const date =
    new Date(`${dateString}T00:00:00`);

  return Math.ceil(
    (date - today) / 86400000
  );

}


/* =========================================================
   INVENTORY CALCULATIONS
========================================================= */

function getInventoryItem(itemId) {

  return state.inventory.find(
    item => item.id === itemId
  );

}


function calculateReserved(itemId) {

  return state.events
    .filter(event => !event.closed)
    .reduce(
      (total, event) => {

        const reservation =
          event.reservations?.find(
            reservation =>
              reservation.itemId === itemId
          );

        return (
          total +
          Number(
            reservation?.quantity || 0
          )
        );

      },
      0
    );

}


function inventoryAvailable(itemId) {

  const item =
    getInventoryItem(itemId);

  if (!item) {
    return 0;
  }

  return (
    item.onHand -
    calculateReserved(itemId)
  );

}


/* =========================================================
   EVENT ISSUES
========================================================= */

function eventIssues(event) {

  const issues = [];

  if (!event.date) {
    issues.push("Event date is missing");
  }

  if (!event.address) {
    issues.push("Address is missing");
  }

  if (!event.hostName) {
    issues.push("Host name is missing");
  }


  for (
    const reservation
    of event.reservations || []
  ) {

    const item =
      getInventoryItem(
        reservation.itemId
      );

    if (!item) {
      continue;
    }

    const otherReserved =
      calculateReserved(item.id) -
      reservation.quantity;

    const availableForThisEvent =
      item.onHand -
      otherReserved;

    if (
      reservation.quantity >
      availableForThisEvent
    ) {

      const shortage =
        reservation.quantity -
        availableForThisEvent;

      issues.push(
        `Short ${shortage} ${item.name}`
      );

    }

  }

  return issues;

}


function allCurrentIssues() {

  const generated = [];

  for (
    const event
    of state.events.filter(
      event => !event.closed
    )
  ) {

    eventIssues(event)
      .forEach(issue => {

        generated.push({
          id: `${event.id}-${issue}`,
          eventId: event.id,
          title: issue,
          type: "generated"
        });

      });

  }

  const manual =
    state.attention.filter(
      item => !item.done
    );

  return [
    ...generated,
    ...manual
  ];

}


/* =========================================================
   HEADER / NAVIGATION
========================================================= */

function updateAttentionBadge() {

  const badge =
    document.getElementById(
      "attentionBadge"
    );

  if (!badge) {
    return;
  }

  const count =
    allCurrentIssues().length;

  badge.textContent = count;

  badge.classList.toggle(
    "hidden",
    count === 0
  );

}


function setHeader(
  title,
  showAdd = false
) {

  document.getElementById(
    "pageTitle"
  ).textContent = title;

  const action =
    document.getElementById(
      "headerAction"
    );

  action.classList.toggle(
    "hidden",
    !showAdd
  );

}


function navigate(screen) {

  currentScreen = screen;
  currentEventId = null;

  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.screen === screen
      );

    });

  render();

}


function render() {

  updateAttentionBadge();

  switch (currentScreen) {

    case "events":
      renderEvents();
      break;

    case "inventory":
      renderInventory();
      break;

    case "attention":
      renderAttention();
      break;

    case "event-detail":
      renderEventDetail();
      break;

    default:
      renderHome();

  }

}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

  setHeader("Ops");

  const main =
    document.getElementById(
      "mainContent"
    );

  const upcoming =
    [...state.events]
      .filter(event => !event.closed)
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );

  const nextEvent =
    upcoming[0];

  const issues =
    allCurrentIssues();

  let html = "";


  if (issues.length === 0) {

    html += `
      <div class="status-banner">
        Everything’s looking good. Nothing needs you right now. ❤️
      </div>
    `;

  } else {

    html += `
      <div class="status-banner warning">
        You’ve got ${issues.length}
        thing${issues.length === 1 ? "" : "s"}
        that need attention.
      </div>
    `;

  }


  html += `
    <section class="section">

      <div class="section-heading">
        <h2>Next Up</h2>
      </div>
  `;


  if (!nextEvent) {

    html += `
      <div class="card empty-card">

        <strong>
          No events booked yet.
        </strong>

        <p>
          When you add your first event,
          it’ll show up here.
        </p>

        <div style="margin-top:16px;">

          <button
            class="primary-button full-width"
            onclick="openAddEventWizard()"
          >
            + Add Event
          </button>

        </div>

      </div>
    `;

  } else {

    const issuesForEvent =
      eventIssues(nextEvent);

    const days =
      daysUntil(nextEvent.date);

    html += `
      <div
        class="card hero-card tap-card"
        onclick="openEvent('${nextEvent.id}')"
      >

        <div class="card-label">
          Next event
        </div>

        <h2>
          ${escapeHTML(nextEvent.name)}
        </h2>

        <div>
          ${formatDate(nextEvent.date)}
          ${
            nextEvent.time
              ? ` · ${formatTime(nextEvent.time)}`
              : ""
          }
        </div>

        <div class="meta-row">

          ${
            days !== null
              ? `
                <span class="pill">
                  ${
                    days === 0
                      ? "Today"
                      : `${days} days`
                  }
                </span>
              `
              : ""
          }

          ${
            nextEvent.guestCount
              ? `
                <span class="pill">
                  ${nextEvent.guestCount} guests
                </span>
              `
              : ""
          }

          ${
            nextEvent.package
              ? `
                <span class="pill">
                  ${escapeHTML(nextEvent.package)}
                </span>
              `
              : ""
          }

          ${
            issuesForEvent.length
              ? `
                <span class="pill warning">
                  ${issuesForEvent.length}
                  need attention
                </span>
              `
              : `
                <span class="pill success">
                  ✓ On track
                </span>
              `
          }

        </div>

        ${
          Number(nextEvent.balanceDue || 0) > 0
            ? `
              <div
                style="
                  margin-top:15px;
                  font-weight:800;
                "
              >
                ${money(nextEvent.balanceDue)}
                due
              </div>
            `
            : ""
        }

      </div>
    `;

  }

  html += `
    </section>
  `;


  html += `
    <section class="section">

      <div class="section-heading">

        <h2>
          Needs Attention
        </h2>

        <button
          onclick="navigate('attention')"
        >
          View all
        </button>

      </div>
  `;


  if (issues.length === 0) {

    html += `
      <div class="card empty-card">

        <strong>
          ✓ Nothing needs your attention
        </strong>

        <p>
          Your future events are
          currently on track.
        </p>

      </div>
    `;

  } else {

    issues
      .slice(0, 3)
      .forEach(issue => {

        const event =
          state.events.find(
            e => e.id === issue.eventId
          );

        html += `
          <div
            class="card list-card tap-card"
            ${
              issue.eventId
                ? `onclick="openEvent('${issue.eventId}')"`
                : ""
            }
          >

            <h3>
              ${escapeHTML(issue.title)}
            </h3>

            <p>
              ${
                event
                  ? escapeHTML(event.name)
                  : "Reminder"
              }
            </p>

          </div>
        `;

      });

  }

  html += `
    </section>
  `;


  if (upcoming.length > 1) {

    html += `
      <section class="section">

        <div class="section-heading">

          <h2>
            Coming Up
          </h2>

          <button
            onclick="navigate('events')"
          >
            View all
          </button>

        </div>
    `;


    upcoming
      .slice(1, 5)
      .forEach(event => {

        const issueCount =
          eventIssues(event).length;

        html += `
          <div
            class="card list-card tap-card"
            onclick="openEvent('${event.id}')"
          >

            <h3>
              ${escapeHTML(event.name)}
            </h3>

            <p>
              ${formatDate(event.date)}

              ${
                event.time
                  ? ` · ${formatTime(event.time)}`
                  : ""
              }

              ${
                event.guestCount
                  ? ` · ${event.guestCount} guests`
                  : ""
              }
            </p>

            <div class="meta-row">

              ${
                issueCount
                  ? `
                    <span class="pill warning">
                      ⚠ ${issueCount}
                      issue${issueCount === 1 ? "" : "s"}
                    </span>
                  `
                  : `
                    <span class="pill success">
                      ✓ On track
                    </span>
                  `
              }

            </div>

          </div>
        `;

      });


    html += `
      </section>
    `;

  }


  main.innerHTML = html;

}


/* =========================================================
   EVENTS
========================================================= */

function renderEvents() {

  setHeader(
    "Events",
    true
  );

  const main =
    document.getElementById(
      "mainContent"
    );

  const events =
    [...state.events]
      .filter(event => !event.closed)
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );


  let html = `
    <button
      class="primary-button full-width"
      onclick="openAddEventWizard()"
    >
      + Add Event
    </button>

    <section class="section">
  `;


  if (events.length === 0) {

    html += `
      <div class="card empty-card">

        <strong>
          No events yet.
        </strong>

        <p>
          Your confirmed bookings
          will live here.
        </p>

      </div>
    `;

  } else {

    events.forEach(event => {

      const issues =
        eventIssues(event);

      html += `
        <div
          class="card list-card tap-card"
          onclick="openEvent('${event.id}')"
        >

          <h3>
            ${escapeHTML(event.name)}
          </h3>

          <p>
            ${formatDate(event.date)}

            ${
              event.time
                ? ` · ${formatTime(event.time)}`
                : ""
            }
          </p>

          <div class="meta-row">

            ${
              event.guestCount
                ? `
                  <span class="pill">
                    ${event.guestCount} guests
                  </span>
                `
                : ""
            }

            ${
              event.package
                ? `
                  <span class="pill">
                    ${escapeHTML(event.package)}
                  </span>
                `
                : ""
            }

            ${
              issues.length
                ? `
                  <span class="pill warning">
                    ${issues.length}
                    need attention
                  </span>
                `
                : `
                  <span class="pill success">
                    ✓ On track
                  </span>
                `
            }

          </div>

        </div>
      `;

    });

  }


  html += `
    </section>
  `;

  main.innerHTML = html;

}


/* =========================================================
   EVENT DETAIL
========================================================= */

function openEvent(id) {

  currentEventId = id;
  currentScreen = "event-detail";

  render();

}


function renderEventDetail() {

  const event =
    state.events.find(
      e => e.id === currentEventId
    );


  if (!event) {

    navigate("events");

    return;

  }


  setHeader("Event");

  const main =
    document.getElementById(
      "mainContent"
    );

  const issues =
    eventIssues(event);


  let html = `
    <button
      class="back-button"
      onclick="navigate('events')"
    >
      ← Events
    </button>


    <div class="detail-header">

      <h2>
        ${escapeHTML(event.name)}
      </h2>

      <div class="muted">

        ${formatDate(event.date)}

        ${
          event.time
            ? ` · ${formatTime(event.time)}`
            : ""
        }

      </div>


      <div class="meta-row">

        ${
          event.guestCount
            ? `
              <span class="pill">
                ${event.guestCount} guests
              </span>
            `
            : ""
        }

        ${
          event.package
            ? `
              <span class="pill">
                ${escapeHTML(event.package)}
              </span>
            `
            : ""
        }

      </div>

    </div>
  `;


  if (issues.length) {

    html += `
      <section class="section">

        <div class="section-heading">
          <h2>Needs Attention</h2>
        </div>

        <div class="card detail-card">
    `;


    issues.forEach(issue => {

      html += `
        <div class="attention-row">

          <strong>
            ${escapeHTML(issue)}
          </strong>

          <span class="warning-text">
            !
          </span>

        </div>
      `;

    });


    html += `
        </div>

      </section>
    `;

  } else {

    html += `
      <div class="status-banner">
        ✓ Everything looks good
        for this event.
      </div>
    `;

  }


  html += `
    <section class="section">

      <div class="section-heading">
        <h2>Event Details</h2>
      </div>

      <div class="card detail-card">

        <div class="detail-row">
          <span>Date</span>
          <strong>
            ${formatDate(event.date)}
          </strong>
        </div>

        <div class="detail-row">
          <span>Time</span>
          <strong>
            ${
              event.time
                ? formatTime(event.time)
                : "—"
            }
          </strong>
        </div>

        <div class="detail-row">
          <span>Location</span>
          <strong>
            ${escapeHTML(event.address || "Not added")}
          </strong>
        </div>

        <div class="detail-row">
          <span>Host</span>
          <strong>
            ${escapeHTML(event.hostName || "Not added")}
          </strong>
        </div>

        <div class="detail-row">
          <span>Phone</span>
          <strong>
            ${escapeHTML(event.hostPhone || "—")}
          </strong>
        </div>

        <div class="detail-row">
          <span>Guests</span>
          <strong>
            ${event.guestCount || "—"}
          </strong>
        </div>

        <div class="detail-row">
          <span>Package</span>
          <strong>
            ${escapeHTML(event.package || "Custom")}
          </strong>
        </div>

      </div>

    </section>
  `;


  html += `
    <section class="section">

      <div class="section-heading">
        <h2>Plush Options</h2>
      </div>

      <div class="card detail-card">
  `;


  if (event.selectedPlush?.length) {

    event.selectedPlush.forEach(
      plushId => {

        const plush =
          PLUSH_OPTIONS.find(
            p => p.id === plushId
          );

        const reservation =
          event.reservations?.find(
            r => r.itemId === plushId
          );

        html += `
          <div class="requirement-row">

            <span>
              ${escapeHTML(plush?.name || plushId)}
            </span>

            <strong>
              ${reservation?.quantity || 0} bringing
            </strong>

          </div>
        `;

      }
    );

  } else {

    html += `
      <div class="muted">
        No plush choices selected.
      </div>
    `;

  }


  html += `
      </div>

    </section>
  `;


  html += `
    <section class="section">

      <div class="section-heading">
        <h2>Tracked Requirements</h2>
      </div>

      <div class="card detail-card">
  `;


  const nonPlushReservations =
    (event.reservations || [])
      .filter(
        reservation =>
          !PLUSH_OPTIONS.some(
            plush =>
              plush.id ===
              reservation.itemId
          )
      );


  if (
    nonPlushReservations.length
  ) {

    nonPlushReservations
      .forEach(reservation => {

        const item =
          getInventoryItem(
            reservation.itemId
          );

        if (!item) {
          return;
        }

        html += `
          <div class="requirement-row">

            <span>
              ${escapeHTML(item.name)}
            </span>

            <strong>
              ${reservation.quantity}
            </strong>

          </div>
        `;

      });

  } else {

    html += `
      <div class="muted">
        No additional tracked inventory.
      </div>
    `;

  }


  html += `
      </div>

    </section>
  `;


  html += `
    <section class="section">

      <div class="section-heading">
        <h2>Payment</h2>
      </div>

      <div class="card detail-card">

        <div class="detail-row">
          <span>Total</span>
          <strong>
            ${money(event.total)}
          </strong>
        </div>

        <div class="detail-row">
          <span>Deposit</span>

          <strong>

            ${
              event.depositPaid
                ? `✓ ${money(event.depositAmount)} received`
                : "Not received"
            }

          </strong>
        </div>

        <div class="detail-row">
          <span>Remaining</span>

          <strong>
            ${money(event.balanceDue)}
          </strong>
        </div>

      </div>

    </section>
  `;


  html += `
    <section class="section">

      <div class="section-heading">
        <h2>Prep & Packing</h2>
      </div>

      <div class="card detail-card">
  `;


  event.packing ||=
    masterPackingList.map(
      item => ({
        id: makeId("pack"),
        name: item,
        done: false
      })
    );


  event.packing.forEach(item => {

    html += `
      <label class="toggle-row">

        <span>
          ${escapeHTML(item.name)}
        </span>

        <input
          type="checkbox"
          ${item.done ? "checked" : ""}
          onchange="
            togglePacking(
              '${event.id}',
              '${item.id}',
              this.checked
            )
          "
        />

      </label>
    `;

  });


  html += `
      </div>

    </section>


    <section class="section">

      <button
        class="secondary-button full-width"
        onclick="deleteEvent('${event.id}')"
      >
        Delete Event
      </button>

    </section>
  `;


  main.innerHTML = html;

  saveState();

}


function togglePacking(
  eventId,
  packingId,
  checked
) {

  const event =
    state.events.find(
      e => e.id === eventId
    );

  if (!event) {
    return;
  }

  const item =
    event.packing.find(
      item => item.id === packingId
    );

  if (!item) {
    return;
  }

  item.done = checked;

  saveState();

}


function deleteEvent(id) {

  if (
    !confirm(
      "Delete this event?"
    )
  ) {
    return;
  }

  state.events =
    state.events.filter(
      event =>
        event.id !== id
    );

  saveState();

  navigate("events");

}


/* =========================================================
   INVENTORY
========================================================= */

function renderInventory() {

  setHeader("Inventory");

  const main =
    document.getElementById(
      "mainContent"
    );


  const categories = [
    ...new Set(
      state.inventory.map(
        item => item.category
      )
    )
  ];


  let hasShortage = false;


  state.inventory.forEach(
    item => {

      if (
        inventoryAvailable(item.id) < 0
      ) {
        hasShortage = true;
      }

    }
  );


  let html =
    hasShortage
      ? `
        <div class="status-banner warning">
          Some future events require
          more stock than you currently have.
        </div>
      `
      : `
        <div class="status-banner">
          Everything looks good ✓
        </div>
      `;


  categories.forEach(
    category => {

      html += `
        <section class="section">

          <div class="section-heading">
            <h2>
              ${escapeHTML(category)}
            </h2>
          </div>

          <div class="card detail-card">
      `;


      state.inventory
        .filter(
          item =>
            item.category === category
        )
        .forEach(item => {

          const reserved =
            calculateReserved(item.id);

          const available =
            item.onHand -
            reserved;


          html += `
            <div
              class="inventory-row"
              onclick="openInventoryItem('${item.id}')"
            >

              <div>

                <strong>
                  ${escapeHTML(item.name)}
                </strong>

                ${
                  available < 0
                    ? `
                      <div class="warning-text">
                        Short ${Math.abs(available)}
                      </div>
                    `
                    : ""
                }

              </div>


              <div class="counts">

                <div class="available-count">
                  ${available}
                </div>

                <div
                  class="muted"
                  style="font-size:.75rem;"
                >
                  ${item.onHand} on hand
                  ·
                  ${reserved} reserved
                </div>

              </div>

            </div>
          `;

        });


      html += `
          </div>

        </section>
      `;

    }
  );


  main.innerHTML = html;

}


function openInventoryItem(itemId) {

  const item =
    getInventoryItem(itemId);

  if (!item) {
    return;
  }


  const reserved =
    calculateReserved(item.id);

  const available =
    item.onHand -
    reserved;


  const reservingEvents =
    state.events
      .filter(
        event => !event.closed
      )
      .map(event => ({
        event,
        reservation:
          event.reservations?.find(
            reservation =>
              reservation.itemId ===
              item.id
          )
      }))
      .filter(
        entry =>
          entry.reservation?.quantity
      );


  let html = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >

      <div class="modal-sheet">

        <h2>
          ${escapeHTML(item.name)}
        </h2>

        <div class="card detail-card">

          <div class="detail-row">
            <span>On Hand</span>
            <strong>
              ${item.onHand}
            </strong>
          </div>

          <div class="detail-row">
            <span>Reserved</span>
            <strong>
              ${reserved}
            </strong>
          </div>

          <div class="detail-row">
            <span>Available</span>
            <strong>
              ${available}
            </strong>
          </div>

        </div>


        <section class="section">

          <div class="section-heading">
            <h2>
              Reserved For
            </h2>
          </div>
  `;


  if (
    !reservingEvents.length
  ) {

    html += `
      <div class="card empty-card">

        <p>
          Nothing is currently reserved.
        </p>

      </div>
    `;

  } else {

    reservingEvents.forEach(
      ({
        event,
        reservation
      }) => {

        html += `
          <div class="card list-card">

            <h3>
              ${escapeHTML(event.name)}
            </h3>

            <p>
              ${reservation.quantity}
              reserved
              ·
              ${formatDate(event.date)}
            </p>

          </div>
        `;

      }
    );

  }


  html += `
        </section>


        <div class="inline-fields">

          <button
            class="primary-button"
            onclick="
              adjustInventory(
                '${item.id}',
                'add'
              )
            "
          >
            + Add Stock
          </button>

          <button
            class="secondary-button"
            onclick="
              adjustInventory(
                '${item.id}',
                'set'
              )
            "
          >
            Adjust Count
          </button>

        </div>


        <div style="margin-top:12px;">

          <button
            class="secondary-button full-width"
            onclick="closeModal()"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  `;


  document.getElementById(
    "modalRoot"
  ).innerHTML = html;

}


function adjustInventory(
  itemId,
  mode
) {

  const item =
    getInventoryItem(itemId);

  if (!item) {
    return;
  }

  let value;


  if (mode === "add") {

    value = prompt(
      `How many ${item.name} are you adding?`
    );

    if (value === null) {
      return;
    }

    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      return;
    }

    item.onHand += number;

  } else {

    value = prompt(
      `What is the actual physical count of ${item.name}?`,
      item.onHand
    );

    if (value === null) {
      return;
    }

    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      return;
    }

    item.onHand = number;

  }


  saveState();

  closeModal();

  renderInventory();

}


/* =========================================================
   ATTENTION
========================================================= */

function renderAttention() {

  setHeader("Attention");

  const main =
    document.getElementById(
      "mainContent"
    );

  const issues =
    allCurrentIssues();


  let html = `
    <button
      class="primary-button full-width"
      onclick="addReminder()"
    >
      + Remember Something
    </button>


    <section class="section">

      <div class="section-heading">
        <h2>
          Needs Attention
        </h2>
      </div>
  `;


  if (!issues.length) {

    const nextEvent =
      [...state.events]
        .filter(
          event => !event.closed
        )
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )[0];


    html += `
      <div class="card empty-card">

        <strong>
          ✓ You’re all caught up.
        </strong>

        <p>
          Nothing needs you right now.

          ${
            nextEvent
              ? `
                Your next event is
                ${escapeHTML(nextEvent.name)}
                on
                ${formatDate(nextEvent.date)}.
              `
              : ""
          }

        </p>

      </div>
    `;

  } else {

    html += `
      <div class="card detail-card">
    `;


    issues.forEach(issue => {

      html += `
        <div class="attention-row">

          <div>

            <strong>
              ${escapeHTML(issue.title)}
            </strong>

            ${
              issue.eventId
                ? `
                  <div class="muted">
                    ${escapeHTML(
                      state.events.find(
                        e => e.id ===
                          issue.eventId
                      )?.name || ""
                    )}
                  </div>
                `
                : ""
            }

          </div>


          ${
            issue.type === "generated"
              ? `
                <button
                  class="text-button"
                  onclick="
                    openEvent(
                      '${issue.eventId}'
                    )
                  "
                >
                  Open
                </button>
              `
              : `
                <button
                  class="text-button"
                  onclick="
                    completeReminder(
                      '${issue.id}'
                    )
                  "
                >
                  ✓
                </button>
              `
          }

        </div>
      `;

    });


    html += `
      </div>
    `;

  }


  html += `
    </section>
  `;


  main.innerHTML = html;

}


function addReminder() {

  const title =
    prompt(
      "What do you want to remember?"
    );


  if (!title?.trim()) {
    return;
  }


  state.attention.push({
    id: makeId("reminder"),
    title: title.trim(),
    type: "manual",
    done: false,
    createdAt:
      new Date().toISOString()
  });


  saveState();

  renderAttention();

}


function completeReminder(id) {

  const reminder =
    state.attention.find(
      item => item.id === id
    );


  if (!reminder) {
    return;
  }


  reminder.done = true;

  saveState();

  renderAttention();

}


/* =========================================================
   ADD EVENT
========================================================= */

function createBlankEventDraft() {

  return {

    id:
      makeId("event"),

    name: "",

    eventType:
      "Birthday Party",

    date: "",

    time: "",


    hostName: "",

    hostPhone: "",

    hostEmail: "",


    address: "",

    arrivalNotes: "",


    guestCount: "",


    package: "",


    specialGuestName: "",

    specialGuestAge: "",


    selectedPlush: [],


    extraOutfits: 0,

    voiceChips: 0,

    extraShirts: 0,

    extraVinyl: 0,


    customRequirements: "",


    customTotal: "",


    depositAmount: 100,

    depositPaid: false,


    total: 0,

    balanceDue: 0,


    reservations: [],


    packing:
      masterPackingList.map(
        name => ({
          id: makeId("pack"),
          name,
          done: false
        })
      ),


    closed: false,

    createdAt:
      new Date().toISOString()

  };

}


function openAddEventWizard() {

  wizard =
    createBlankEventDraft();

  wizardStep = 0;

  renderWizard();

}


function closeWizard() {

  wizard = null;

  wizardStep = 0;

  document.getElementById(
    "modalRoot"
  ).innerHTML = "";

}


/* =========================================================
   PRICING
========================================================= */

function calculateEventTotal(
  event = wizard
) {

  if (!event) {
    return 0;
  }


  if (
    event.package === "Custom"
  ) {

    return Number(
      event.customTotal || 0
    );

  }


  const packageInfo =
    PACKAGE_DATA[
      event.package
    ];


  if (
    !packageInfo ||
    packageInfo.pricePerGuest === null
  ) {

    return 0;

  }


  const guestCount =
    Number(
      event.guestCount || 0
    );


  const base =
    guestCount *
    packageInfo.pricePerGuest;


  const outfitAddOns =
    Number(
      event.extraOutfits || 0
    ) *
    ADD_ON_PRICING.outfit;


  const voiceAddOns =
    Number(
      event.voiceChips || 0
    ) *
    ADD_ON_PRICING.voiceChip;


  const shirtAddOns =
    Number(
      event.extraShirts || 0
    ) *
    ADD_ON_PRICING.extraShirt;


  const vinylAddOns =
    Number(
      event.extraVinyl || 0
    ) *
    ADD_ON_PRICING.vinyl;


  return (
    base +
    outfitAddOns +
    voiceAddOns +
    shirtAddOns +
    vinylAddOns
  );

}


function recalculatePayment() {

  if (!wizard) {
    return;
  }


  wizard.total =
    calculateEventTotal(wizard);


  const paidDeposit =
    wizard.depositPaid
      ? Number(
          wizard.depositAmount || 0
        )
      : 0;


  wizard.balanceDue =
    Math.max(
      0,
      wizard.total -
      paidDeposit
    );

}


/* =========================================================
   RESERVATIONS
========================================================= */

function buildReservationsForWizard() {

  if (!wizard) {
    return;
  }


  const reservations = [];

  const guestCount =
    Number(
      wizard.guestCount || 0
    );


  /*
    PLUSH RULE

    Every plush option being offered
    gets guest count + 2.

    Example:
    15 kids + Golden selected
    = reserve 17 Goldens.

    If Golden + Bear + Cat:
    17 of EACH.
  */

  wizard.selectedPlush
    .forEach(plushId => {

      reservations.push({
        itemId: plushId,
        quantity:
          guestCount + 2
      });

    });


  /*
    STANDARD PARTY SUPPLIES
  */

  if (guestCount > 0) {

    reservations.push({
      itemId: "hearts",
      quantity: guestCount
    });

    reservations.push({
      itemId: "travel-bags",
      quantity: guestCount
    });

  }


  /*
    PACKAGE SHIRTS
  */

  if (
    wizard.package === "$35 Package" ||
    wizard.package === "$40 Package"
  ) {

    reservations.push({
      itemId: "white-shirt",
      quantity:
        guestCount +
        Number(
          wizard.extraShirts || 0
        )
    });

  } else if (
    Number(
      wizard.extraShirts || 0
    ) > 0
  ) {

    reservations.push({
      itemId: "white-shirt",
      quantity:
        Number(
          wizard.extraShirts
        )
    });

  }


  /*
    VOICE CHIPS
  */

  if (
    Number(
      wizard.voiceChips || 0
    ) > 0
  ) {

    reservations.push({
      itemId: "sound",
      quantity:
        Number(
          wizard.voiceChips
        )
    });

  }


  wizard.reservations =
    reservations;

}


/* =========================================================
   WIZARD
========================================================= */

function renderWizard() {

  recalculatePayment();

  let html = `
    <div class="wizard-shell">


      <div class="wizard-header">


        <div class="wizard-title-row">

          <h2>
            Add Event
          </h2>

          <button
            class="text-button"
            onclick="closeWizard()"
          >
            Cancel
          </button>

        </div>


        <div class="wizard-steps">
  `;


  wizardSteps.forEach(
    (step, index) => {

      html += `
        <button
          class="
            wizard-step
            ${
              index === wizardStep
                ? "active"
                : ""
            }
            ${
              index < wizardStep
                ? "done"
                : ""
            }
          "
          onclick="
            goToWizardStep(
              ${index}
            )
          "
        >

          ${
            index < wizardStep
              ? "✓ "
              : ""
          }

          ${step}

        </button>
      `;

    }
  );


  html += `
        </div>

      </div>


      <div
        id="wizardContent"
        class="wizard-content"
      >
        ${wizardStepHTML()}
      </div>


      <div class="wizard-footer">


        <button
          class="secondary-button"
          onclick="wizardBack()"
          ${
            wizardStep === 0
              ? "disabled"
              : ""
          }
        >
          Back
        </button>


        ${
          wizardStep ===
          wizardSteps.length - 1

            ? `
              <button
                class="primary-button"
                onclick="confirmEvent()"
              >
                Confirm Event
              </button>
            `

            : `
              <button
                class="primary-button"
                onclick="wizardNext()"
              >
                Next
              </button>
            `
        }


      </div>


    </div>
  `;


  document.getElementById(
    "modalRoot"
  ).innerHTML = html;

}


/* =========================================================
   WIZARD STEP HTML
========================================================= */

function wizardStepHTML() {

  switch (wizardStep) {

    case 0:
      return basicsStepHTML();

    case 1:
      return locationStepHTML();

    case 2:
      return partyStepHTML();

    case 3:
      return extrasStepHTML();

    case 4:
      return paymentStepHTML();

    default:
      return reviewStepHTML();

  }

}


/* =========================================================
   STEP 1 — BASICS
========================================================= */

function basicsStepHTML() {

  return `
    <div class="card form-card">


      <div class="field">

        <label>
          Event name
        </label>

        <input
          id="eventName"
          value="${escapeHTML(wizard.name)}"
          placeholder="Mason’s Birthday"
        />

      </div>


      <div class="field">

        <label>
          Event type
        </label>

        <select id="eventType">

          ${[
            "Birthday Party",
            "Private Experience",
            "Corporate / Partner",
            "Community Event",
            "Custom"
          ].map(
            type => `
              <option
                value="${type}"
                ${
                  wizard.eventType === type
                    ? "selected"
                    : ""
                }
              >
                ${type}
              </option>
            `
          ).join("")}

        </select>

      </div>


      <div class="inline-fields">


        <div class="field">

          <label>
            Date
          </label>

          <input
            id="eventDate"
            type="date"
            value="${wizard.date}"
          />

        </div>


        <div class="field">

          <label>
            Start time
          </label>

          <input
            id="eventTime"
            type="time"
            value="${wizard.time}"
          />

        </div>


      </div>


      <div class="field">

        <label>
          Host name
        </label>

        <input
          id="hostName"
          value="${escapeHTML(wizard.hostName)}"
        />

      </div>


      <div class="field">

        <label>
          Phone
        </label>

        <input
          id="hostPhone"
          type="tel"
          value="${escapeHTML(wizard.hostPhone)}"
        />

      </div>


      <div class="field">

        <label>
          Email
        </label>

        <input
          id="hostEmail"
          type="email"
          value="${escapeHTML(wizard.hostEmail)}"
        />

      </div>


    </div>
  `;

}


/* =========================================================
   STEP 2 — WHERE
========================================================= */

function locationStepHTML() {

  return `
    <div class="card form-card">


      <div class="field">

        <label>
          Event address
        </label>

        <textarea
          id="eventAddress"
          placeholder="Full event address"
        >${escapeHTML(wizard.address)}</textarea>

      </div>


      <div class="field">

        <label>
          Arrival / setup notes
        </label>

        <textarea
          id="arrivalNotes"
          placeholder="Use side gate, backyard setup, park in driveway..."
        >${escapeHTML(wizard.arrivalNotes)}</textarea>

      </div>


    </div>
  `;

}


/* =========================================================
   STEP 3 — PARTY
========================================================= */

function partyStepHTML() {

  return `
    <div class="card form-card">


      <div class="field">

        <label>
          Guest count
        </label>

        <input
          id="guestCount"
          type="number"
          min="1"
          value="${wizard.guestCount}"
          placeholder="15"
        />

      </div>


      <div class="field">

        <label>
          Package
        </label>


        <div class="choice-grid">

          ${packageChoice(
            "$30 Package"
          )}

          ${packageChoice(
            "$35 Package"
          )}

          ${packageChoice(
            "$40 Package"
          )}

          ${packageChoice(
            "Custom"
          )}

        </div>

      </div>


      ${
        wizard.eventType ===
        "Birthday Party"

          ? `
            <div class="inline-fields">


              <div class="field">

                <label>
                  Birthday child
                </label>

                <input
                  id="specialGuestName"
                  value="${escapeHTML(wizard.specialGuestName)}"
                  placeholder="Name"
                />

              </div>


              <div class="field">

                <label>
                  Age
                </label>

                <input
                  id="specialGuestAge"
                  type="number"
                  min="1"
                  value="${escapeHTML(wizard.specialGuestAge)}"
                />

              </div>


            </div>
          `

          : `
            <div class="field">

              <label>
                Guest of honor
              </label>

              <input
                id="specialGuestName"
                value="${escapeHTML(wizard.specialGuestName)}"
                placeholder="Optional"
              />

            </div>
          `
      }


      <div class="field">

        <label>
          Plush options being offered
        </label>

        <small>
          Tap every style guests can choose from.
          We’ll reserve guest count + 2 of
          each selected plush.
        </small>


        <div
          class="choice-grid"
          style="margin-top:12px;"
        >

          ${PLUSH_OPTIONS
            .map(
              plush =>
                plushChoice(plush)
            )
            .join("")}

        </div>

      </div>


    </div>
  `;

}


function packageChoice(
  packageName
) {

  const packageData =
    PACKAGE_DATA[
      packageName
    ];


  return `
    <button
      type="button"
      class="
        choice-card
        ${
          wizard.package ===
          packageName
            ? "selected"
            : ""
        }
      "
      onclick="
        selectPackage(
          '${packageName}'
        )
      "
    >

      <strong>
        ${packageName}
      </strong>

      <span>
        ${packageData.description}
      </span>

    </button>
  `;

}


function plushChoice(plush) {

  const selected =
    wizard.selectedPlush.includes(
      plush.id
    );


  const guestCount =
    Number(
      wizard.guestCount || 0
    );


  const bringCount =
    guestCount > 0
      ? guestCount + 2
      : 0;


  return `
    <button
      type="button"
      class="
        choice-card
        ${
          selected
            ? "selected"
            : ""
        }
      "
      onclick="
        togglePlush(
          '${plush.id}'
        )
      "
    >

      <strong>
        ${selected ? "✓ " : ""}
        ${plush.name}
      </strong>

      <span>
        ${
          bringCount
            ? `${bringCount} will be reserved`
            : "Select after entering guest count"
        }
      </span>

    </button>
  `;

}


/* =========================================================
   STEP 4 — EXTRAS
========================================================= */

function extrasStepHTML() {

  if (
    wizard.package === "Custom"
  ) {

    return `
      <div class="card form-card">


        <div class="field">

          <label>
            Custom requirements
          </label>

          <textarea
            id="customRequirements"
            placeholder="Example: 2 plush, hiking outfits, retirement embroidery, backyard setup..."
          >${escapeHTML(wizard.customRequirements)}</textarea>

        </div>


        <div class="field">

          <label>
            Voice chips
          </label>

          <input
            id="voiceChips"
            type="number"
            min="0"
            value="${wizard.voiceChips}"
          />

        </div>


      </div>
    `;

  }


  return `
    <div class="card form-card">


      <div class="field">

        <label>
          Extra outfits
        </label>

        <input
          id="extraOutfits"
          type="number"
          min="0"
          value="${wizard.extraOutfits}"
        />

        <small>
          ${money(ADD_ON_PRICING.outfit)} each
        </small>

      </div>


      <div class="field">

        <label>
          Voice chips
        </label>

        <input
          id="voiceChips"
          type="number"
          min="0"
          value="${wizard.voiceChips}"
        />

        <small>
          ${money(ADD_ON_PRICING.voiceChip)} each
        </small>

      </div>


      <div class="field">

        <label>
          Extra T-shirts
        </label>

        <input
          id="extraShirts"
          type="number"
          min="0"
          value="${wizard.extraShirts}"
        />

        <small>
          ${money(ADD_ON_PRICING.extraShirt)} each
        </small>

      </div>


      <div class="field">

        <label>
          Extra vinyl designs
        </label>

        <input
          id="extraVinyl"
          type="number"
          min="0"
          value="${wizard.extraVinyl}"
        />

        <small>
          ${money(ADD_ON_PRICING.vinyl)} each
        </small>

      </div>


    </div>
  `;

}


/* =========================================================
   STEP 5 — PAYMENT
========================================================= */

function paymentStepHTML() {

  recalculatePayment();


  const packageData =
    PACKAGE_DATA[
      wizard.package
    ];


  const guestCount =
    Number(
      wizard.guestCount || 0
    );


  const packageBase =
    packageData?.pricePerGuest
      ? guestCount *
        packageData.pricePerGuest
      : 0;


  return `
    <div class="card form-card">


      ${
        wizard.package === "Custom"
          ? `
            <div class="field">

              <label>
                Custom event total
              </label>

              <input
                id="customTotal"
                type="number"
                min="0"
                step="0.01"
                value="${wizard.customTotal}"
                placeholder="Enter agreed total"
                oninput="updateCustomTotalLive(this.value)"
              />

            </div>
          `
          : `
            <div class="detail-row">

              <span>
                ${escapeHTML(wizard.package)}
              </span>

              <strong>
                ${guestCount}
                ×
                ${money(packageData?.pricePerGuest || 0)}
              </strong>

            </div>


            <div class="detail-row">

              <span>
                Package subtotal
              </span>

              <strong>
                ${money(packageBase)}
              </strong>

            </div>
          `
      }


      ${
        Number(wizard.extraOutfits || 0)
          ? `
            <div class="detail-row">

              <span>
                Extra outfits
              </span>

              <strong>
                ${
                  wizard.extraOutfits
                }
                ×
                ${money(ADD_ON_PRICING.outfit)}
              </strong>

            </div>
          `
          : ""
      }


      ${
        Number(wizard.voiceChips || 0)
          ? `
            <div class="detail-row">

              <span>
                Voice chips
              </span>

              <strong>
                ${
                  wizard.voiceChips
                }
                ×
                ${money(ADD_ON_PRICING.voiceChip)}
              </strong>

            </div>
          `
          : ""
      }


      ${
        Number(wizard.extraShirts || 0)
          ? `
            <div class="detail-row">

              <span>
                Extra shirts
              </span>

              <strong>
                ${
                  wizard.extraShirts
                }
                ×
                ${money(ADD_ON_PRICING.extraShirt)}
              </strong>

            </div>
          `
          : ""
      }


      ${
        Number(wizard.extraVinyl || 0)
          ? `
            <div class="detail-row">

              <span>
                Extra vinyl
              </span>

              <strong>
                ${
                  wizard.extraVinyl
                }
                ×
                ${money(ADD_ON_PRICING.vinyl)}
              </strong>

            </div>
          `
          : ""
      }


      <div
        class="detail-row"
        style="
          margin-top:8px;
          font-size:1.1rem;
        "
      >

        <span>
          Event total
        </span>

        <strong id="paymentTotal">
          ${money(wizard.total)}
        </strong>

      </div>


      <div
        style="
          margin-top:24px;
        "
      >

        <label class="toggle-row">

          <span>

            <strong>
              Deposit received
            </strong>

            <br>

            <span class="muted">
              Normal reservation deposit is $100
            </span>

          </span>


          <input
            id="depositPaid"
            type="checkbox"
            ${
              wizard.depositPaid
                ? "checked"
                : ""
            }
            onchange="
              updateDepositLive(
                this.checked
              )
            "
          />

        </label>

      </div>


      <div class="field">

        <label>
          Deposit amount
        </label>

        <input
          id="depositAmount"
          type="number"
          min="0"
          step="0.01"
          value="${wizard.depositAmount}"
          oninput="
            updateDepositAmountLive(
              this.value
            )
          "
        />

      </div>


      <div class="detail-row">

        <span>
          Amount received
        </span>

        <strong id="depositReceivedDisplay">

          ${
            wizard.depositPaid
              ? money(wizard.depositAmount)
              : money(0)
          }

        </strong>

      </div>


      <div
        class="detail-row"
        style="
          font-size:1.1rem;
        "
      >

        <span>
          Remaining balance
        </span>

        <strong id="balanceDueDisplay">
          ${money(wizard.balanceDue)}
        </strong>

      </div>


    </div>
  `;

}


/* =========================================================
   STEP 6 — REVIEW
========================================================= */

function reviewStepHTML() {

  recalculatePayment();

  buildReservationsForWizard();


  return `
    <div class="card detail-card">


      <div class="card-label">
        Ready to create
      </div>


      <h2
        style="margin-top:6px;"
      >
        ${escapeHTML(
          wizard.name ||
          "Untitled Event"
        )}
      </h2>


      <div class="detail-row">

        <span>
          Date
        </span>

        <strong>
          ${formatDate(wizard.date)}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Time
        </span>

        <strong>
          ${
            wizard.time
              ? formatTime(wizard.time)
              : "—"
          }
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Host
        </span>

        <strong>
          ${escapeHTML(
            wizard.hostName || "—"
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Guests
        </span>

        <strong>
          ${wizard.guestCount || "—"}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Package
        </span>

        <strong>
          ${escapeHTML(
            wizard.package || "—"
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Event total
        </span>

        <strong>
          ${money(wizard.total)}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Deposit
        </span>

        <strong>

          ${
            wizard.depositPaid
              ? `✓ ${money(wizard.depositAmount)} received`
              : "Not received"
          }

        </strong>

      </div>


      <div class="detail-row">

        <span>
          Remaining
        </span>

        <strong>
          ${money(wizard.balanceDue)}
        </strong>

      </div>


    </div>


    <section class="section">


      <div class="section-heading">

        <h2>
          Plush
        </h2>

      </div>


      <div class="card detail-card">

        ${
          wizard.selectedPlush.length

            ? wizard.selectedPlush
                .map(plushId => {

                  const plush =
                    PLUSH_OPTIONS.find(
                      option =>
                        option.id ===
                        plushId
                    );


                  return `
                    <div class="requirement-row">

                      <span>
                        ${escapeHTML(plush?.name || plushId)}
                      </span>

                      <strong>
                        ${
                          Number(
                            wizard.guestCount || 0
                          ) + 2
                        }
                      </strong>

                    </div>
                  `;

                })
                .join("")

            : `
              <div class="warning-text">
                No plush options selected.
              </div>
            `
        }

      </div>


    </section>


    <section class="section">


      <div class="section-heading">

        <h2>
          Inventory Reservations
        </h2>

      </div>


      <div class="card detail-card">


        ${
          wizard.reservations.length

            ? wizard.reservations
                .map(
                  reservation => {

                    const item =
                      getInventoryItem(
                        reservation.itemId
                      );

                    return `
                      <div class="requirement-row">

                        <span>
                          ${escapeHTML(
                            item?.name ||
                            reservation.itemId
                          )}
                        </span>

                        <strong>
                          ${reservation.quantity}
                        </strong>

                      </div>
                    `;

                  }
                )
                .join("")

            : `
              <div class="muted">
                No inventory reservations generated.
              </div>
            `
        }


      </div>


    </section>


    <div class="status-banner">

      Confirming this event will add it
      to Home and Events and immediately
      reserve the inventory shown above.

    </div>
  `;

}


/* =========================================================
   SYNC CURRENT FORM
========================================================= */

function syncWizardFromCurrentStep() {

  if (!wizard) {
    return;
  }


  const get =
    id =>
      document.getElementById(id);


  if (wizardStep === 0) {

    if (get("eventName")) {
      wizard.name =
        get("eventName").value;
    }

    if (get("eventType")) {
      wizard.eventType =
        get("eventType").value;
    }

    if (get("eventDate")) {
      wizard.date =
        get("eventDate").value;
    }

    if (get("eventTime")) {
      wizard.time =
        get("eventTime").value;
    }

    if (get("hostName")) {
      wizard.hostName =
        get("hostName").value;
    }

    if (get("hostPhone")) {
      wizard.hostPhone =
        get("hostPhone").value;
    }

    if (get("hostEmail")) {
      wizard.hostEmail =
        get("hostEmail").value;
    }

  }


  if (wizardStep === 1) {

    if (get("eventAddress")) {
      wizard.address =
        get("eventAddress").value;
    }

    if (get("arrivalNotes")) {
      wizard.arrivalNotes =
        get("arrivalNotes").value;
    }

  }


  if (wizardStep === 2) {

    if (get("guestCount")) {

      wizard.guestCount =
        Number(
          get("guestCount").value || 0
        );

    }

    if (get("specialGuestName")) {

      wizard.specialGuestName =
        get("specialGuestName").value;

    }

    if (get("specialGuestAge")) {

      wizard.specialGuestAge =
        get("specialGuestAge").value;

    }

  }


  if (wizardStep === 3) {

    if (get("extraOutfits")) {

      wizard.extraOutfits =
        Number(
          get("extraOutfits").value || 0
        );

    }

    if (get("voiceChips")) {

      wizard.voiceChips =
        Number(
          get("voiceChips").value || 0
        );

    }

    if (get("extraShirts")) {

      wizard.extraShirts =
        Number(
          get("extraShirts").value || 0
        );

    }

    if (get("extraVinyl")) {

      wizard.extraVinyl =
        Number(
          get("extraVinyl").value || 0
        );

    }

    if (get("customRequirements")) {

      wizard.customRequirements =
        get("customRequirements").value;

    }

  }


  if (wizardStep === 4) {

    if (get("customTotal")) {

      wizard.customTotal =
        Number(
          get("customTotal").value || 0
        );

    }

    if (get("depositAmount")) {

      wizard.depositAmount =
        Number(
          get("depositAmount").value || 0
        );

    }

    if (get("depositPaid")) {

      wizard.depositPaid =
        get("depositPaid").checked;

    }

  }


  recalculatePayment();

}


/* =========================================================
   WIZARD CONTROLS
========================================================= */

function goToWizardStep(index) {

  syncWizardFromCurrentStep();

  wizardStep = index;

  renderWizard();

}


function wizardNext() {

  syncWizardFromCurrentStep();


  if (
    wizardStep === 0 &&
    !wizard.name.trim()
  ) {

    alert(
      "Give the event a name first."
    );

    return;

  }


  if (
    wizardStep === 2
  ) {

    if (
      !wizard.guestCount ||
      wizard.guestCount < 1
    ) {

      alert(
        "Enter the guest count."
      );

      return;

    }


    if (
      !wizard.package
    ) {

      alert(
        "Choose a package or Custom."
      );

      return;

    }

  }


  wizardStep =
    Math.min(
      wizardSteps.length - 1,
      wizardStep + 1
    );


  renderWizard();

}


function wizardBack() {

  syncWizardFromCurrentStep();

  wizardStep =
    Math.max(
      0,
      wizardStep - 1
    );

  renderWizard();

}


/* =========================================================
   PACKAGE + PLUSH SELECTION
========================================================= */

function selectPackage(
  packageName
) {

  syncWizardFromCurrentStep();

  wizard.package =
    packageName;


  /*
    $40 currently includes
    all six plush options.
    Default them all on.

    They can still be changed
    manually if an unusual event
    needs an exception.
  */

  if (
    packageName === "$40 Package"
  ) {

    wizard.selectedPlush =
      PLUSH_OPTIONS.map(
        plush => plush.id
      );

  }


  renderWizard();

}


function togglePlush(plushId) {

  syncWizardFromCurrentStep();


  if (
    wizard.selectedPlush.includes(
      plushId
    )
  ) {

    wizard.selectedPlush =
      wizard.selectedPlush.filter(
        id =>
          id !== plushId
      );

  } else {

    wizard.selectedPlush.push(
      plushId
    );

  }


  renderWizard();

}


/* =========================================================
   PAYMENT LIVE UPDATES
========================================================= */

function updateCustomTotalLive(
  value
) {

  wizard.customTotal =
    Number(value || 0);

  recalculatePayment();

  updatePaymentDisplay();

}


function updateDepositLive(
  checked
) {

  wizard.depositPaid =
    checked;

  recalculatePayment();

  updatePaymentDisplay();

}


function updateDepositAmountLive(
  value
) {

  wizard.depositAmount =
    Number(value || 0);

  recalculatePayment();

  updatePaymentDisplay();

}


function updatePaymentDisplay() {

  const total =
    document.getElementById(
      "paymentTotal"
    );

  const deposit =
    document.getElementById(
      "depositReceivedDisplay"
    );

  const balance =
    document.getElementById(
      "balanceDueDisplay"
    );


  if (total) {

    total.textContent =
      money(wizard.total);

  }


  if (deposit) {

    deposit.textContent =
      wizard.depositPaid
        ? money(
            wizard.depositAmount
          )
        : money(0);

  }


  if (balance) {

    balance.textContent =
      money(
        wizard.balanceDue
      );

  }

}


/* =========================================================
   CONFIRM EVENT
========================================================= */

function confirmEvent() {

  syncWizardFromCurrentStep();

  recalculatePayment();

  buildReservationsForWizard();


  if (
    !wizard.name.trim()
  ) {

    alert(
      "Event name is required."
    );

    return;

  }


  if (
    !wizard.selectedPlush.length
  ) {

    const continueWithoutPlush =
      confirm(
        "No plush options are selected. Create the event anyway?"
      );


    if (
      !continueWithoutPlush
    ) {
      return;
    }

  }


  const event =
    structuredClone(wizard);


  state.events.push(
    event
  );


  saveState();

  closeWizard();


  currentEventId =
    event.id;

  currentScreen =
    "event-detail";


  render();

}


/* =========================================================
   MODALS
========================================================= */

function closeModal() {

  document.getElementById(
    "modalRoot"
  ).innerHTML = "";

}


function closeModalFromBackdrop(
  event
) {

  if (
    event.target.classList.contains(
      "modal-backdrop"
    )
  ) {

    closeModal();

  }

}


/* =========================================================
   GLOBAL EVENTS
========================================================= */

document
  .querySelectorAll(".nav-item")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        navigate(
          button.dataset.screen
        );

      }
    );

  });


document
  .getElementById(
    "headerAction"
  )
  .addEventListener(
    "click",
    () => {

      if (
        currentScreen === "events"
      ) {

        openAddEventWizard();

      }

    }
  );


render();
