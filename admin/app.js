const STORAGE_KEY = "swlOpsV1";

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

function createInitialState() {
  return {
    events: [],
    inventory: inventorySeed,
    attention: [],
    notes: []
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    const fresh = createInitialState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    const parsed = JSON.parse(saved);

    if (!parsed.inventory || parsed.inventory.length === 0) {
      parsed.inventory = inventorySeed;
    }

    parsed.events ||= [];
    parsed.attention ||= [];
    parsed.notes ||= [];

    return parsed;
  } catch {
    return createInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateAttentionBadge();
}

function makeId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(dateString) {
  if (!dateString) return "Date not set";

  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function daysUntil(dateString) {
  if (!dateString) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(`${dateString}T00:00:00`);
  const diff = date - today;

  return Math.ceil(diff / 86400000);
}

function money(value) {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(number);
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function calculateReserved(itemId) {
  return state.events
    .filter(event => !event.closed)
    .reduce((total, event) => {
      const reservation = event.reservations?.find(r => r.itemId === itemId);
      return total + Number(reservation?.quantity || 0);
    }, 0);
}

function getInventoryItem(itemId) {
  return state.inventory.find(item => item.id === itemId);
}

function inventoryAvailable(itemId) {
  const item = getInventoryItem(itemId);
  if (!item) return 0;

  return item.onHand - calculateReserved(itemId);
}

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

  for (const reservation of event.reservations || []) {
    const item = getInventoryItem(reservation.itemId);
    if (!item) continue;

    const reservedAcrossOtherEvents =
      calculateReserved(item.id) - reservation.quantity;

    const availableBeforeThisEvent =
      item.onHand - reservedAcrossOtherEvents;

    if (reservation.quantity > availableBeforeThisEvent) {
      issues.push(
        `Short ${reservation.quantity - availableBeforeThisEvent} ${item.name}`
      );
    }
  }

  return issues;
}

function allCurrentIssues() {
  const generated = [];

  for (const event of state.events.filter(e => !e.closed)) {
    eventIssues(event).forEach(issue => {
      generated.push({
        id: `${event.id}-${issue}`,
        eventId: event.id,
        title: issue,
        type: "generated"
      });
    });
  }

  const manual = state.attention.filter(item => !item.done);

  return [...generated, ...manual];
}

function updateAttentionBadge() {
  const badge = document.getElementById("attentionBadge");
  if (!badge) return;

  const count = allCurrentIssues().length;

  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

function setHeader(title, showAdd = false) {
  document.getElementById("pageTitle").textContent = title;

  const action = document.getElementById("headerAction");
  action.classList.toggle("hidden", !showAdd);
}

function navigate(screen) {
  currentScreen = screen;
  currentEventId = null;

  document.querySelectorAll(".nav-item").forEach(button => {
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

/* HOME */

function renderHome() {
  setHeader("Ops");

  const main = document.getElementById("mainContent");

  const upcoming = [...state.events]
    .filter(event => !event.closed)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const nextEvent = upcoming[0];
  const issues = allCurrentIssues();

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
        You’ve got ${issues.length} thing${issues.length === 1 ? "" : "s"} that need attention.
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
        <strong>No events booked yet.</strong>
        <p>When you add your first event, it’ll show up here.</p>

        <div style="margin-top:16px;">
          <button class="primary-button full-width" onclick="openAddEventWizard()">
            + Add Event
          </button>
        </div>
      </div>
    `;
  } else {
    const issuesForEvent = eventIssues(nextEvent);
    const days = daysUntil(nextEvent.date);

    html += `
      <div class="card hero-card tap-card"
           onclick="openEvent('${nextEvent.id}')">

        <div class="card-label">Next event</div>

        <h2>${escapeHTML(nextEvent.name)}</h2>

        <div>
          ${formatDate(nextEvent.date)}
          ${nextEvent.time ? ` · ${escapeHTML(nextEvent.time)}` : ""}
        </div>

        <div class="meta-row">
          ${
            days !== null
              ? `<span class="pill">${days === 0 ? "Today" : `${days} days`}</span>`
              : ""
          }

          ${
            nextEvent.guestCount
              ? `<span class="pill">${nextEvent.guestCount} guests</span>`
              : ""
          }

          ${
            nextEvent.package
              ? `<span class="pill">${escapeHTML(nextEvent.package)}</span>`
              : ""
          }

          ${
            issuesForEvent.length
              ? `<span class="pill warning">${issuesForEvent.length} need attention</span>`
              : `<span class="pill success">✓ On track</span>`
          }
        </div>

        ${
          Number(nextEvent.balanceDue || 0) > 0
            ? `
              <div style="margin-top:15px;font-weight:800;">
                ${money(nextEvent.balanceDue)} due on arrival
              </div>
            `
            : ""
        }
      </div>
    `;
  }

  html += `</section>`;

  html += `
    <section class="section">
      <div class="section-heading">
        <h2>Needs Attention</h2>
        <button onclick="navigate('attention')">View all</button>
      </div>
  `;

  if (issues.length === 0) {
    html += `
      <div class="card empty-card">
        <strong>✓ Nothing needs your attention</strong>
        <p>Your future events are currently on track.</p>
      </div>
    `;
  } else {
    issues.slice(0, 3).forEach(issue => {
      html += `
        <div class="card list-card tap-card"
             ${issue.eventId ? `onclick="openEvent('${issue.eventId}')"` : ""}>
          <h3>${escapeHTML(issue.title)}</h3>
          <p>
            ${
              issue.eventId
                ? escapeHTML(state.events.find(e => e.id === issue.eventId)?.name || "")
                : "Reminder"
            }
          </p>
        </div>
      `;
    });
  }

  html += `</section>`;

  if (upcoming.length > 1) {
    html += `
      <section class="section">
        <div class="section-heading">
          <h2>Coming Up</h2>
          <button onclick="navigate('events')">View all</button>
        </div>
    `;

    upcoming.slice(1, 5).forEach(event => {
      const issueCount = eventIssues(event).length;

      html += `
        <div class="card list-card tap-card"
             onclick="openEvent('${event.id}')">

          <h3>${escapeHTML(event.name)}</h3>

          <p>
            ${formatDate(event.date)}
            ${event.guestCount ? ` · ${event.guestCount} guests` : ""}
          </p>

          <div class="meta-row">
            ${
              issueCount
                ? `<span class="pill warning">⚠ ${issueCount} issue${issueCount === 1 ? "" : "s"}</span>`
                : `<span class="pill success">✓ On track</span>`
            }
          </div>

        </div>
      `;
    });

    html += `</section>`;
  }

  main.innerHTML = html;
}

/* EVENTS */

function renderEvents() {
  setHeader("Events", true);

  const main = document.getElementById("mainContent");

  const events = [...state.events]
    .filter(event => !event.closed)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let html = `
    <button class="primary-button full-width"
            onclick="openAddEventWizard()">
      + Add Event
    </button>

    <section class="section">
  `;

  if (events.length === 0) {
    html += `
      <div class="card empty-card">
        <strong>No events yet.</strong>
        <p>Your confirmed bookings will live here.</p>
      </div>
    `;
  } else {
    events.forEach(event => {
      const issues = eventIssues(event);

      html += `
        <div class="card list-card tap-card"
             onclick="openEvent('${event.id}')">

          <h3>${escapeHTML(event.name)}</h3>

          <p>
            ${formatDate(event.date)}
            ${event.time ? ` · ${escapeHTML(event.time)}` : ""}
          </p>

          <div class="meta-row">
            ${
              event.guestCount
                ? `<span class="pill">${event.guestCount} guests</span>`
                : ""
            }

            ${
              event.package
                ? `<span class="pill">${escapeHTML(event.package)}</span>`
                : ""
            }

            ${
              issues.length
                ? `<span class="pill warning">${issues.length} need attention</span>`
                : `<span class="pill success">✓ On track</span>`
            }
          </div>

        </div>
      `;
    });
  }

  html += `</section>`;

  main.innerHTML = html;
}

/* EVENT DETAIL */

function openEvent(id) {
  currentEventId = id;
  currentScreen = "event-detail";
  render();
}

function renderEventDetail() {
  const event = state.events.find(e => e.id === currentEventId);

  if (!event) {
    navigate("events");
    return;
  }

  setHeader("Event");

  const main = document.getElementById("mainContent");
  const issues = eventIssues(event);

  let html = `
    <button class="back-button" onclick="navigate('events')">
      ← Events
    </button>

    <div class="detail-header">
      <h2>${escapeHTML(event.name)}</h2>

      <div class="muted">
        ${formatDate(event.date)}
        ${event.time ? ` · ${escapeHTML(event.time)}` : ""}
      </div>

      <div class="meta-row">
        ${
          event.guestCount
            ? `<span class="pill">${event.guestCount} guests</span>`
            : ""
        }

        ${
          event.package
            ? `<span class="pill">${escapeHTML(event.package)}</span>`
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
          <strong>${escapeHTML(issue)}</strong>
          <span class="warning-text">!</span>
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
        ✓ Everything looks good for this event.
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
          <strong>${formatDate(event.date)}</strong>
        </div>

        <div class="detail-row">
          <span>Time</span>
          <strong>${escapeHTML(event.time || "—")}</strong>
        </div>

        <div class="detail-row">
          <span>Location</span>
          <strong>${escapeHTML(event.address || "Not added")}</strong>
        </div>

        <div class="detail-row">
          <span>Host</span>
          <strong>${escapeHTML(event.hostName || "Not added")}</strong>
        </div>

        <div class="detail-row">
          <span>Phone</span>
          <strong>${escapeHTML(event.hostPhone || "—")}</strong>
        </div>

        <div class="detail-row">
          <span>Guests</span>
          <strong>${event.guestCount || "—"}</strong>
        </div>

        <div class="detail-row">
          <span>Package</span>
          <strong>${escapeHTML(event.package || "Custom")}</strong>
        </div>

      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <h2>Requirements</h2>
      </div>

      <div class="card detail-card">
  `;

  (event.reservations || []).forEach(reservation => {
    const item = getInventoryItem(reservation.itemId);

    if (!item) return;

    html += `
      <div class="requirement-row">
        <div>
          <strong>${escapeHTML(item.name)}</strong>
        </div>

        <strong>${reservation.quantity}</strong>
      </div>
    `;
  });

  if (!event.reservations?.length) {
    html += `
      <div class="muted">
        No tracked inventory requirements for this event.
      </div>
    `;
  }

  html += `
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <h2>Payment</h2>
      </div>

      <div class="card detail-card">

        <div class="detail-row">
          <span>Total</span>
          <strong>${money(event.total)}</strong>
        </div>

        <div class="detail-row">
          <span>Deposit</span>
          <strong>
            ${
              event.depositPaid
                ? `✓ ${money(event.depositAmount)} paid`
                : `${money(event.depositAmount)} not paid`
            }
          </strong>
        </div>

        <div class="detail-row">
          <span>Due on arrival</span>
          <strong>${money(event.balanceDue)}</strong>
        </div>

      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <h2>Prep & Packing</h2>
      </div>

      <div class="card detail-card">
  `;

  event.packing ||= masterPackingList.map(item => ({
    id: makeId("pack"),
    name: item,
    done: false
  }));

  event.packing.forEach(item => {
    html += `
      <label class="toggle-row">
        <span>${escapeHTML(item.name)}</span>
        <input
          type="checkbox"
          ${item.done ? "checked" : ""}
          onchange="togglePacking('${event.id}', '${item.id}', this.checked)"
        />
      </label>
    `;
  });

  html += `
      </div>
    </section>

    <section class="section">
      <button class="secondary-button full-width"
              onclick="deleteEvent('${event.id}')">
        Delete Event
      </button>
    </section>
  `;

  main.innerHTML = html;

  saveState();
}

function togglePacking(eventId, packingId, checked) {
  const event = state.events.find(e => e.id === eventId);
  if (!event) return;

  const item = event.packing.find(i => i.id === packingId);
  if (!item) return;

  item.done = checked;
  saveState();
}

function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;

  state.events = state.events.filter(event => event.id !== id);

  saveState();
  navigate("events");
}

/* INVENTORY */

function renderInventory() {
  setHeader("Inventory");

  const main = document.getElementById("mainContent");

  const categories = [
    ...new Set(state.inventory.map(item => item.category))
  ];

  let hasShortage = false;

  state.inventory.forEach(item => {
    if (inventoryAvailable(item.id) < 0) {
      hasShortage = true;
    }
  });

  let html = hasShortage
    ? `
      <div class="status-banner warning">
        Some future events require more stock than you currently have.
      </div>
    `
    : `
      <div class="status-banner">
        Everything looks good ✓
      </div>
    `;

  categories.forEach(category => {
    html += `
      <section class="section">
        <div class="section-heading">
          <h2>${escapeHTML(category)}</h2>
        </div>

        <div class="card detail-card">
    `;

    state.inventory
      .filter(item => item.category === category)
      .forEach(item => {
        const reserved = calculateReserved(item.id);
        const available = item.onHand - reserved;

        html += `
          <div class="inventory-row"
               onclick="openInventoryItem('${item.id}')">

            <div>
              <strong>${escapeHTML(item.name)}</strong>

              ${
                available < 0
                  ? `<div class="warning-text">Short ${Math.abs(available)}</div>`
                  : ""
              }
            </div>

            <div class="counts">
              <div class="available-count">
                ${available}
              </div>

              <div class="muted" style="font-size:.75rem;">
                ${item.onHand} on hand · ${reserved} reserved
              </div>
            </div>

          </div>
        `;
      });

    html += `
        </div>
      </section>
    `;
  });

  main.innerHTML = html;
}

function openInventoryItem(itemId) {
  const item = getInventoryItem(itemId);
  if (!item) return;

  const reserved = calculateReserved(item.id);
  const available = item.onHand - reserved;

  const reservingEvents = state.events
    .filter(event => !event.closed)
    .map(event => ({
      event,
      reservation: event.reservations?.find(r => r.itemId === item.id)
    }))
    .filter(entry => entry.reservation?.quantity);

  let html = `
    <div class="modal-backdrop"
         onclick="closeModalFromBackdrop(event)">

      <div class="modal-sheet">

        <h2>${escapeHTML(item.name)}</h2>

        <div class="card detail-card">

          <div class="detail-row">
            <span>On Hand</span>
            <strong>${item.onHand}</strong>
          </div>

          <div class="detail-row">
            <span>Reserved</span>
            <strong>${reserved}</strong>
          </div>

          <div class="detail-row">
            <span>Available</span>
            <strong>${available}</strong>
          </div>

        </div>

        <section class="section">

          <div class="section-heading">
            <h2>Reserved For</h2>
          </div>
  `;

  if (!reservingEvents.length) {
    html += `
      <div class="card empty-card">
        <p>Nothing is currently reserved.</p>
      </div>
    `;
  } else {
    reservingEvents.forEach(({ event, reservation }) => {
      html += `
        <div class="card list-card">
          <h3>${escapeHTML(event.name)}</h3>
          <p>${reservation.quantity} reserved · ${formatDate(event.date)}</p>
        </div>
      `;
    });
  }

  html += `
        </section>

        <div class="inline-fields">

          <button class="primary-button"
                  onclick="adjustInventory('${item.id}', 'add')">
            + Add Stock
          </button>

          <button class="secondary-button"
                  onclick="adjustInventory('${item.id}', 'set')">
            Adjust Count
          </button>

        </div>

        <div style="margin-top:12px;">
          <button class="secondary-button full-width"
                  onclick="closeModal()">
            Close
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById("modalRoot").innerHTML = html;
}

function adjustInventory(itemId, mode) {
  const item = getInventoryItem(itemId);
  if (!item) return;

  let value;

  if (mode === "add") {
    value = prompt(`How many ${item.name} are you adding?`);

    if (value === null) return;

    const number = Number(value);

    if (!Number.isFinite(number)) return;

    item.onHand += number;
  } else {
    value = prompt(
      `What is the actual physical count of ${item.name}?`,
      item.onHand
    );

    if (value === null) return;

    const number = Number(value);

    if (!Number.isFinite(number)) return;

    item.onHand = number;
  }

  saveState();
  closeModal();
  renderInventory();
}

/* ATTENTION */

function renderAttention() {
  setHeader("Attention");

  const main = document.getElementById("mainContent");
  const issues = allCurrentIssues();

  let html = `
    <button class="primary-button full-width"
            onclick="addReminder()">
      + Remember Something
    </button>

    <section class="section">
      <div class="section-heading">
        <h2>Needs Attention</h2>
      </div>
  `;

  if (!issues.length) {
    const nextEvent = [...state.events]
      .filter(event => !event.closed)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    html += `
      <div class="card empty-card">
        <strong>✓ You’re all caught up.</strong>

        <p>
          Nothing needs you right now.
          ${
            nextEvent
              ? `Your next event is ${escapeHTML(nextEvent.name)} on ${formatDate(nextEvent.date)}.`
              : ""
          }
        </p>
      </div>
    `;
  } else {
    html += `<div class="card detail-card">`;

    issues.forEach(issue => {
      html += `
        <div class="attention-row">
          <div>
            <strong>${escapeHTML(issue.title)}</strong>

            ${
              issue.eventId
                ? `
                  <div class="muted">
                    ${escapeHTML(state.events.find(e => e.id === issue.eventId)?.name || "")}
                  </div>
                `
                : ""
            }
          </div>

          ${
            issue.type === "generated"
              ? `
                <button class="text-button"
                        onclick="openEvent('${issue.eventId}')">
                  Open
                </button>
              `
              : `
                <button class="text-button"
                        onclick="completeReminder('${issue.id}')">
                  ✓
                </button>
              `
          }

        </div>
      `;
    });

    html += `</div>`;
  }

  html += `</section>`;

  main.innerHTML = html;
}

function addReminder() {
  const title = prompt("What do you want to remember?");

  if (!title?.trim()) return;

  state.attention.push({
    id: makeId("reminder"),
    title: title.trim(),
    type: "manual",
    done: false,
    createdAt: new Date().toISOString()
  });

  saveState();
  renderAttention();
}

function completeReminder(id) {
  const reminder = state.attention.find(item => item.id === id);

  if (!reminder) return;

  reminder.done = true;

  saveState();
  renderAttention();
}

/* ADD EVENT WIZARD */

function createBlankEventDraft() {
  return {
    id: makeId("event"),
    name: "",
    eventType: "Birthday Party",

    date: "",
    time: "",

    hostName: "",
    hostPhone: "",
    hostEmail: "",

    address: "",
    arrivalNotes: "",

    guestCount: 10,

    package: "$30 Package",
    customEvent: false,

    specialGuestName: "",
    specialGuestAge: "",

    plushPlanTotal: 16,

    shirts: false,
    birthdayOutfit: false,
    voiceChips: 0,

    customRequirements: "",

    total: 300,
    depositAmount: 100,
    depositPaid: false,
    balanceDue: 200,

    reservations: [],
    packing: masterPackingList.map(name => ({
      id: makeId("pack"),
      name,
      done: false
    })),

    closed: false,
    createdAt: new Date().toISOString()
  };
}

function openAddEventWizard() {
  wizard = createBlankEventDraft();
  wizardStep = 0;

  renderWizard();
}

function closeWizard() {
  wizard = null;
  wizardStep = 0;
  document.getElementById("modalRoot").innerHTML = "";
}

function renderWizard() {
  syncWizardFromCurrentStep();

  let html = `
    <div class="wizard-shell">

      <div class="wizard-header">

        <div class="wizard-title-row">
          <h2>Add Event</h2>

          <button class="text-button"
                  onclick="closeWizard()">
            Cancel
          </button>
        </div>

        <div class="wizard-steps">
  `;

  wizardSteps.forEach((step, index) => {
    html += `
      <button
        class="wizard-step
          ${index === wizardStep ? "active" : ""}
          ${index < wizardStep ? "done" : ""}"
        onclick="goToWizardStep(${index})"
      >
        ${index < wizardStep ? "✓ " : ""}
        ${step}
      </button>
    `;
  });

  html += `
        </div>
      </div>

      <div id="wizardContent"
           class="wizard-content">
        ${wizardStepHTML()}
      </div>

      <div class="wizard-footer">

        <button
          class="secondary-button"
          onclick="wizardBack()"
          ${wizardStep === 0 ? "disabled" : ""}
        >
          Back
        </button>

        ${
          wizardStep === wizardSteps.length - 1
            ? `
              <button class="primary-button"
                      onclick="confirmEvent()">
                Confirm Event
              </button>
            `
            : `
              <button class="primary-button"
                      onclick="wizardNext()">
                Next
              </button>
            `
        }

      </div>

    </div>
  `;

  document.getElementById("modalRoot").innerHTML = html;
}

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

function basicsStepHTML() {
  return `
    <div class="card form-card">

      <div class="field">
        <label>Event name</label>

        <input
          id="eventName"
          value="${escapeHTML(wizard.name)}"
          placeholder="Mason’s Birthday"
        />
      </div>

      <div class="field">
        <label>Event type</label>

        <select id="eventType">
          ${[
            "Birthday Party",
            "Private Experience",
            "Corporate / Partner",
            "Community Event",
            "Custom"
          ].map(type => `
            <option
              value="${type}"
              ${wizard.eventType === type ? "selected" : ""}
            >
              ${type}
            </option>
          `).join("")}
        </select>
      </div>

      <div class="inline-fields">

        <div class="field">
          <label>Date</label>
          <input
            id="eventDate"
            type="date"
            value="${wizard.date}"
          />
        </div>

        <div class="field">
          <label>Start time</label>
          <input
            id="eventTime"
            type="time"
            value="${wizard.time}"
          />
        </div>

      </div>

      <div class="field">
        <label>Host name</label>

        <input
          id="hostName"
          value="${escapeHTML(wizard.hostName)}"
        />
      </div>

      <div class="inline-fields">

        <div class="field">
          <label>Phone</label>

          <input
            id="hostPhone"
            value="${escapeHTML(wizard.hostPhone)}"
          />
        </div>

        <div class="field">
          <label>Email</label>

          <input
            id="hostEmail"
            type="email"
            value="${escapeHTML(wizard.hostEmail)}"
          />
        </div>

      </div>

    </div>
  `;
}

function locationStepHTML() {
  return `
    <div class="card form-card">

      <div class="field">
        <label>Event address</label>

        <textarea
          id="eventAddress"
          placeholder="Full event address"
        >${escapeHTML(wizard.address)}</textarea>
      </div>

      <div class="field">
        <label>Arrival / setup notes</label>

        <textarea
          id="arrivalNotes"
          placeholder="Use side gate, backyard setup, park in driveway..."
        >${escapeHTML(wizard.arrivalNotes)}</textarea>

        <small>
          Keep this flexible instead of making separate fields for every possible setup situation.
        </small>
      </div>

    </div>
  `;
}

function partyStepHTML() {
  return `
    <div class="card form-card">

      <div class="field">
        <label>Guest count</label>

        <input
          id="guestCount"
          type="number"
          min="1"
          value="${wizard.guestCount}"
        />

        <small>
          Plush planning automatically adds 6 extra for choice.
        </small>
      </div>

      <div class="field">
        <label>Package / booking style</label>

        <div class="choice-grid">

          ${packageChoice("$30 Package", "Stuff, fluff, heart ceremony, certificate + travel bag")}

          ${packageChoice("$35 Package", "Adds custom T-shirt")}

          ${packageChoice("$40 Package", "Full birthday experience + custom extras")}

          ${packageChoice("Custom", "Use for partner, retirement, corporate and unusual bookings")}

        </div>
      </div>

      ${
        wizard.eventType === "Birthday Party"
          ? `
            <div class="inline-fields">

              <div class="field">
                <label>Birthday child</label>

                <input
                  id="specialGuestName"
                  value="${escapeHTML(wizard.specialGuestName)}"
                  placeholder="Name"
                />
              </div>

              <div class="field">
                <label>Age</label>

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
              <label>Guest of honor</label>

              <input
                id="specialGuestName"
                value="${escapeHTML(wizard.specialGuestName)}"
                placeholder="Optional"
              />
            </div>
          `
      }

    </div>
  `;
}

function packageChoice(value, description) {
  return `
    <button
      class="choice-card ${wizard.package === value ? "selected" : ""}"
      onclick="selectPackage('${value}')"
      type="button"
    >
      <strong>${value}</strong>
      <span>${description}</span>
    </button>
  `;
}

function extrasStepHTML() {
  const custom = wizard.package === "Custom";

  return `
    <div class="card form-card">

      ${
        custom
          ? `
            <div class="field">
              <label>Custom requirements</label>

              <textarea
                id="customRequirements"
                placeholder="Example: 2 plush, hiking outfits, retirement embroidery, backyard setup..."
              >${escapeHTML(wizard.customRequirements)}</textarea>
            </div>
          `
          : `
            <label class="toggle-row">
              <span>
                <strong>Custom T-shirts</strong><br>
                <span class="muted">Reserve one white shirt per guest</span>
              </span>

              <input
                id="shirts"
                type="checkbox"
                ${wizard.shirts ? "checked" : ""}
              />
            </label>

            <label class="toggle-row">
              <span>
                <strong>Birthday outfit</strong><br>
                <span class="muted">Reserve one birthday outfit</span>
              </span>

              <input
                id="birthdayOutfit"
                type="checkbox"
                ${wizard.birthdayOutfit ? "checked" : ""}
              />
            </label>

            <div class="field">
              <label>Voice chips</label>

              <input
                id="voiceChips"
                type="number"
                min="0"
                value="${wizard.voiceChips}"
              />
            </div>
          `
      }

      <div class="field">
        <label>Plush planned to bring</label>

        <input
          id="plushPlanTotal"
          type="number"
          min="0"
          value="${wizard.plushPlanTotal}"
        />

        <small>
          Default is guest count + 6. You can adjust it for unusual events.
        </small>
      </div>

    </div>
  `;
}

function paymentStepHTML() {
  return `
    <div class="card form-card">

      <div class="field">
        <label>Total event price</label>

        <input
          id="eventTotal"
          type="number"
          min="0"
          step="0.01"
          value="${wizard.total}"
        />
      </div>

      <div class="field">
        <label>Deposit amount</label>

        <input
          id="depositAmount"
          type="number"
          min="0"
          step="0.01"
          value="${wizard.depositAmount}"
        />
      </div>

      <label class="toggle-row">
        <span>
          <strong>Deposit received</strong><br>
          <span class="muted">Normal paid bookings are $100</span>
        </span>

        <input
          id="depositPaid"
          type="checkbox"
          ${wizard.depositPaid ? "checked" : ""}
        />
      </label>

      <div class="field">
        <label>Remaining balance due on arrival</label>

        <input
          id="balanceDue"
          type="number"
          min="0"
          step="0.01"
          value="${wizard.balanceDue}"
        />
      </div>

    </div>
  `;
}

function reviewStepHTML() {
  buildReservationsForWizard();

  return `
    <div class="card detail-card">

      <div class="card-label">Ready to create</div>

      <h2 style="margin-top:6px;">
        ${escapeHTML(wizard.name || "Untitled Event")}
      </h2>

      <div class="detail-row">
        <span>Date</span>
        <strong>${formatDate(wizard.date)}</strong>
      </div>

      <div class="detail-row">
        <span>Host</span>
        <strong>${escapeHTML(wizard.hostName || "—")}</strong>
      </div>

      <div class="detail-row">
        <span>Guests</span>
        <strong>${wizard.guestCount}</strong>
      </div>

      <div class="detail-row">
        <span>Package</span>
        <strong>${escapeHTML(wizard.package)}</strong>
      </div>

      <div class="detail-row">
        <span>Total</span>
        <strong>${money(wizard.total)}</strong>
      </div>

      <div class="detail-row">
        <span>Due on arrival</span>
        <strong>${money(wizard.balanceDue)}</strong>
      </div>

    </div>

    <section class="section">

      <div class="section-heading">
        <h2>Inventory Reservations</h2>
      </div>

      <div class="card detail-card">

        ${
          wizard.reservations.length
            ? wizard.reservations.map(reservation => {
                const item = getInventoryItem(reservation.itemId);

                return `
                  <div class="requirement-row">
                    <span>${escapeHTML(item?.name || reservation.itemId)}</span>
                    <strong>${reservation.quantity}</strong>
                  </div>
                `;
              }).join("")
            : `<div class="muted">No inventory reservations generated.</div>`
        }

      </div>

    </section>

    <div class="status-banner">
      Confirming this event will immediately reserve its inventory and add it to Home and Events.
    </div>
  `;
}

function syncWizardFromCurrentStep() {
  if (!wizard) return;

  const get = id => document.getElementById(id);

  if (wizardStep === 0) {
    if (get("eventName")) wizard.name = get("eventName").value;
    if (get("eventType")) wizard.eventType = get("eventType").value;
    if (get("eventDate")) wizard.date = get("eventDate").value;
    if (get("eventTime")) wizard.time = get("eventTime").value;
    if (get("hostName")) wizard.hostName = get("hostName").value;
    if (get("hostPhone")) wizard.hostPhone = get("hostPhone").value;
    if (get("hostEmail")) wizard.hostEmail = get("hostEmail").value;
  }

  if (wizardStep === 1) {
    if (get("eventAddress")) wizard.address = get("eventAddress").value;
    if (get("arrivalNotes")) wizard.arrivalNotes = get("arrivalNotes").value;
  }

  if (wizardStep === 2) {
    if (get("guestCount")) {
      wizard.guestCount = Number(get("guestCount").value || 0);
    }

    if (get("specialGuestName")) {
      wizard.specialGuestName = get("specialGuestName").value;
    }

    if (get("specialGuestAge")) {
      wizard.specialGuestAge = get("specialGuestAge").value;
    }
  }

  if (wizardStep === 3) {
    if (get("shirts")) wizard.shirts = get("shirts").checked;

    if (get("birthdayOutfit")) {
      wizard.birthdayOutfit = get("birthdayOutfit").checked;
    }

    if (get("voiceChips")) {
      wizard.voiceChips = Number(get("voiceChips").value || 0);
    }

    if (get("customRequirements")) {
      wizard.customRequirements = get("customRequirements").value;
    }

    if (get("plushPlanTotal")) {
      wizard.plushPlanTotal =
        Number(get("plushPlanTotal").value || 0);
    }
  }

  if (wizardStep === 4) {
    if (get("eventTotal")) {
      wizard.total = Number(get("eventTotal").value || 0);
    }

    if (get("depositAmount")) {
      wizard.depositAmount =
        Number(get("depositAmount").value || 0);
    }

    if (get("depositPaid")) {
      wizard.depositPaid = get("depositPaid").checked;
    }

    if (get("balanceDue")) {
      wizard.balanceDue =
        Number(get("balanceDue").value || 0);
    }
  }
}

function goToWizardStep(index) {
  syncWizardFromCurrentStep();

  wizardStep = index;

  if (wizardStep >= 3 && !wizard.plushPlanTotal) {
    wizard.plushPlanTotal = Number(wizard.guestCount || 0) + 6;
  }

  renderWizard();
}

function wizardNext() {
  syncWizardFromCurrentStep();

  if (wizardStep === 0 && !wizard.name.trim()) {
    alert("Give the event a name first.");
    return;
  }

  if (wizardStep === 2) {
    wizard.plushPlanTotal = Number(wizard.guestCount || 0) + 6;

    if (wizard.package === "$35 Package") {
      wizard.shirts = true;
    }

    if (wizard.package === "$40 Package") {
      wizard.shirts = true;
      wizard.birthdayOutfit = true;
    }
  }

  wizardStep = Math.min(
    wizardSteps.length - 1,
    wizardStep + 1
  );

  renderWizard();
}

function wizardBack() {
  syncWizardFromCurrentStep();

  wizardStep = Math.max(0, wizardStep - 1);

  renderWizard();
}

function selectPackage(packageName) {
  wizard.package = packageName;

  if (packageName === "$30 Package") {
    wizard.shirts = false;
    wizard.birthdayOutfit = false;
  }

  if (packageName === "$35 Package") {
    wizard.shirts = true;
    wizard.birthdayOutfit = false;
  }

  if (packageName === "$40 Package") {
    wizard.shirts = true;
    wizard.birthdayOutfit = true;
  }

  renderWizard();
}

function buildReservationsForWizard() {
  const reservations = [];
  const guestCount = Number(wizard.guestCount || 0);

  /*
    Hearts + travel bags:
    one per participating guest.
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
    White shirts when included.
  */

  if (wizard.shirts && guestCount > 0) {
    reservations.push({
      itemId: "white-shirt",
      quantity: guestCount
    });
  }

  /*
    Voice chips only when selected.
  */

  if (wizard.voiceChips > 0) {
    reservations.push({
      itemId: "sound",
      quantity: Number(wizard.voiceChips)
    });
  }

  /*
    Plush:
    We know how many total plush we want to bring,
    but we don't yet know how those should be split
    between Golden/Bear/Cat/Unicorn/Dino/Frog.

    So V1 does NOT fake a per-style allocation.

    The next refinement will be a very quick plush
    mix selector inside Add Event.
  */

  wizard.reservations = reservations;
}

function confirmEvent() {
  syncWizardFromCurrentStep();
  buildReservationsForWizard();

  if (!wizard.name.trim()) {
    alert("Event name is required.");
    return;
  }

  const event = structuredClone(wizard);

  state.events.push(event);

  saveState();
  closeWizard();

  currentEventId = event.id;
  currentScreen = "event-detail";

  render();
}

/* MODAL */

function closeModal() {
  document.getElementById("modalRoot").innerHTML = "";
}

function closeModalFromBackdrop(event) {
  if (event.target.classList.contains("modal-backdrop")) {
    closeModal();
  }
}

/* GLOBAL EVENTS */

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    navigate(button.dataset.screen);
  });
});

document
  .getElementById("headerAction")
  .addEventListener("click", () => {
    if (currentScreen === "events") {
      openAddEventWizard();
    }
  });

render();
