/* =========================================================
   BUSINESS DATA
========================================================= */

const PLUSH_OPTIONS = [
  {
    id: "golden",
    name: "Golden Retriever",
    image: "/admin/golden-retriever.png"
  },
  {
    id: "bear",
    name: "Classic Teddy",
    image: "/admin/classic-teddy.png"
  },
  {
    id: "cat",
    name: "Orange Kitty",
    image: "/admin/orange-kitty.png"
  },
  {
    id: "unicorn",
    name: "Unicorn",
    image: "/admin/unicorn.png"
  },
  {
    id: "dino",
    name: "Dino",
    image: "/admin/dino.png"
  },
  {
    id: "frog",
    name: "Frog",
    image: "/admin/frog.png"
  }
];

function getPlushMeta(itemId) {
  return PLUSH_OPTIONS.find(
    plush => plush.id === itemId
  ) || null;
}

function inventoryDisplayName(item) {
  return (
    getPlushMeta(item.id)?.name ||
    item.name
  );
}

const PACKAGE_DATA = {
  "$30 Package": {
    pricePerGuest: 30,
    description:
      "Stuffing experience, heart ceremony, adoption certificate + travel bag"
  },

  "$35 Package": {
    pricePerGuest: 35,
    description:
      "Everything in $30 + birthday plush outfit"
  },

  "$40 Package": {
    pricePerGuest: 40,
    description:
      "Full birthday experience with shirt, vinyl, accessories + birthday outfit"
  },

  Custom: {
    pricePerGuest: null,
    description:
      "For private, corporate, partner or unusual events"
  }
};

const ADD_ON_PRICING = {
  outfit: 8,
  voiceChip: 10,
  extraShirt: 5,
  vinyl: 5
};


/* =========================================================
   LITTLE DELIGHT
========================================================= */

const SWL_DAILY_MESSAGES = [
  "Fluff first. Everything else will figure itself out.",
  "Somewhere, a teddy bear is waiting for its big day.",
  "May your bins be packed and your fluff stay fluffy.",
  "Another day at the office. The office has teddy bears.",
  "Tiny shirts. Big responsibilities.",
  "The Friend Hotel is accepting very important guests today.",
  "Wishing hearts make excellent coworkers.",
  "Keep calm and check the plush count.",
  "The fluff-mobile has places to be and friends to deliver.",
  "A little heart goes in every friend. That is just good business.",
  "Today's forecast: partly cloudy with a chance of plush.",
  "There are worse problems than having too many teddy bears.",
  "Pack the hearts. The magic needs supplies.",
  "Stuff, fluff, love, repeat.",
  "The plush friends have requested snacks. Request denied.",
  "A well-packed bin is basically a love letter to event-day you.",
  "Every friend starts out a little flat. Relatable.",
  "The stuffing machine believes in you.",
  "Today's tiny mission: make the next party extra lovable.",
  "One heart, one hug, one very fluffy friend at a time.",
  "The Friend Hotel has no vacancies after a good party.",
  "If found buried in plush, please send fluff.",
  "A pile of plush is just a party waiting to happen.",
  "The bears are ready. Are the travel bags?",
  "Today's dress code: tiny T-shirts and excellent vibes.",
  "Some businesses have spreadsheets. We have wishing hearts.",
  "Keep the fluff-mobile fueled and the plush friends fabulous.",
  "Little hearts. Big memories.",
  "Every packed crate is one step closer to somebody's new best friend.",
  "The golden retriever plush would like to speak to management. Again.",
  "Today's agenda: fluff, friends, and a suspicious number of bins.",
  "The orange kitty has contributed absolutely nothing to prep.",
  "Make room. The plush parade is coming through.",
  "Friend Hotel check-in starts whenever the stuffing stops.",
  "A tiny T-shirt can fix almost anything.",
  "May your vinyl press straight and your plush counts match.",
  "The best kind of inventory has faces.",
  "Somebody's favorite stuffed friend is sitting in one of these bins.",
  "Fluff happens. Pack extra.",
  "Heart ceremony supplies: tiny hearts, big feelings.",
  "The bears asked for a day off. Absolutely not.",
  "Plush math is still math, but at least it is cute.",
  "Today's goal: fewer loose ends, more stuffed friends.",
  "Travel bags ready? Hearts ready? Fluff ready? Cute.",
  "The stuffing machine gets loud when it is excited.",
  "Every event needs a little prep and a lot of fluff.",
  "The plush friends are unionizing for more cuddles.",
  "One more party means one more batch of tiny best friends.",
  "Keep the hearts close and the fluff closer.",
  "SWL Ops: because the bears refuse to manage their own calendar.",
  "The Friend Hotel concierge is wildly underpaid.",
  "Today's important business: deciding which plush gets the cute outfit.",
  "A full fluff box is a beautiful thing.",
  "Somewhere in Green Bay, a kid is about to meet their new best friend.",
  "Nothing says operations like 40 tiny shirts in a tote.",
  "The magic starts before the machine ever turns on.",
  "Pack it with love. Label it so we can find it.",
  "The plush friends appreciate your attention to detail. Probably.",
  "May all your wishing hearts make it into the right bin.",
  "Good morning from the Department of Stuff, Fluff & Love.",
  "The bears have reviewed today's schedule and seem cautiously optimistic.",
  "Today's vibe: soft, fluffy, and weirdly organized.",
  "One tiny heart can carry a whole lot of love.",
  "The machine stuffs the plush. You make the memory.",
  "Friends do not let friends forget the EcoFlow.",
  "The plush lineup is looking ridiculously cute today.",
  "Another event, another chance to make a tiny bit of magic.",
  "Check the bins before the bins check you.",
  "The orange kitty says inventory is somebody else's problem.",
  "Nothing to see here. Just a perfectly normal amount of stuffed animals.",
  "Friend Hotel housekeeping has been notified.",
  "Today's reminder from the plush council: bring the hearts.",
  "Fluff is basically confetti with a job.",
  "The travel bags are ready for their tiny passengers.",
  "May your setup be smooth and your plush stay upright.",
  "The golden retriever is emotionally prepared for today's workload.",
  "One event closer to a whole lot of happy kids.",
  "Stuffed With Love runs on hearts, fluff, and remembering the extension cord.",
  "The tiny wardrobe department is open for business.",
  "Today's plush forecast: extremely huggable.",
  "The Friend Hotel would like to remind you that checkout is adorable.",
  "Every heart ceremony deserves a little extra magic.",
  "Keep the machine humming and the hearts coming.",
  "The frogs are judging the packing list. Politely.",
  "Today's big task might fit in a very small travel bag.",
  "The bears are packed. The chaos is contained. Beautiful.",
  "Somewhere under all that fluff is a very good plan.",
  "The unicorn department has requested more sparkle. Of course it has.",
  "Little friends, little shirts, very big operation.",
  "May your event be full of smiles and free of missing power cords.",
  "The dino has volunteered for quality control.",
  "Every plush deserves a heart. Every bin deserves a label.",
  "The Friend Hotel front desk is ready when you are.",
  "Stuff. Fluff. Love. Try not to lose the scissors.",
  "Today's business plan: make something somebody will hug for years.",
  "Plush friends do not care about perfect. They care about fluffy.",
  "One more checked box means one less bear-related emergency.",
  "The wishing hearts are small. Their job is not.",
  "SWL Ops is awake. The plush friends are pretending not to be.",
  "Let's make today's pile of plush somebody's favorite memory."
];

const SWL_RARE_MESSAGES = [
  "✨ Secret fluff unlocked. The plush council grants you one extremely official wish.",
  "🧸 RARE BEAR SIGHTING: management has approved one unnecessary tiny outfit.",
  "The Friend Hotel penthouse is open. Nobody knows what that means, but congratulations.",
  "A golden retriever, an orange kitty, and a teddy bear walk into Ops. Payroll gets weird.",
  "✨ You found the emergency reserve of magical fluff. Please use irresponsibly.",
  "The plush council met after hours. Their only note was: more hearts.",
  "Achievement unlocked: Supreme Keeper of the Fluff-Mobile Keys.",
  "RARE MESSAGE! A tiny teddy has officially named you Employee of the Forever."
];

function swlDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

function swlHash(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getSWLDailyMessage() {
  const key = swlDateKey();
  const hash = swlHash(`swl-${key}`);
  // Roughly 1 in 40 days gets one of the intentionally rare lines.
  if (hash % 40 === 0) {
    return SWL_RARE_MESSAGES[hash % SWL_RARE_MESSAGES.length];
  }
  return SWL_DAILY_MESSAGES[hash % SWL_DAILY_MESSAGES.length];
}

function showSWLToast(message, options = {}) {
  const existing = document.querySelector(".swl-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `swl-toast ${options.type || "success"}`;
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 220);
  }, options.duration || 1450);
}

function animateInventoryCount(itemId, delta) {
  document.querySelectorAll(`[data-inventory-id="${itemId}"]`).forEach(element => {
    element.querySelectorAll("[data-inventory-on-hand], [data-inventory-stepper]").forEach(number => {
      number.classList.remove("swl-number-pop");
      void number.offsetWidth;
      number.classList.add("swl-number-pop");
    });
  });

  if (Number(delta)) {
    showSWLToast(`${delta > 0 ? "+" : ""}${delta} inventory`);
  }
}


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
  "Pens",
  "Welcome sign",
  "Signage",
  "Trash bags",
  "Felt wall",
  "Felt-wall accessories",
  "Clothes / mini wardrobe rack",
  "Crash kit"
];

const SWL_LOAD_ONLY_GEAR = new Set([
  "Stuffing machine",
  "EcoFlow / power",
  "Tables",
  "Wood crates",
  "Photo-op pieces / photo hearts",
  "Friend Hotel",
  "Welcome sign",
  "Felt wall"
]);

const SWL_LOADOUT_FINALE_LINES = [
  "THE FLUFF-MOBILE IS CLEARED FOR DEPARTURE.",
  "Every friend is accounted for. Go make some magic.",
  "Bins packed. Hearts packed. Tiny best friends ready.",
  "Load-out complete. The plush crew is officially road-ready.",
  "Nothing left behind but an unreasonable amount of confidence."
];


/* =========================================================
   APP STATE
========================================================= */

let state = createInitialState();

let currentScreen = "home";
let calendarMonth = new Date(new Date().getFullYear(),new Date().getMonth(),1);
let calendarSelected = swlDateKey();
let currentEventId = null;
let currentClientKey = null;
let clientSearch = "";
let activeClientListTab = "upcoming";
const clientNotesCache = new Map();
let activeEventTab = "info";
let activeInventoryCategory = "Plush";
let inventorySearch = "";
let wizard = null;
let wizardStep = 0;

let wizardMode = "add";
let editingEventId = null;

const wizardSteps = [
  "Basics",
  "Party",
  "Extras",
  "Payment",
  "Review"
];


/* =========================================================
   STATE / D1 API
========================================================= */

function createInitialState() {
  return {
    events: [],
    appointments: [],
    inventory: structuredClone(inventorySeed),
    attention: [],
    notes: [],
    clients: []
  };
}

async function apiRequest(path, options = {}) {
  const response = await fetch(
    `/admin/api/${path}`,
    {
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Cloudflare or the Worker may occasionally
    // return a non-JSON error page.
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      `Request failed (${response.status})`
    );
  }

  return data;
}

function normalizeLoadedEvent(event) {
  const normalized = {
    ...event
  };

  normalized.selectedPlush ||= [];
  normalized.reservations ||= [];
  normalized.loadOut ||= {};

  normalized.packing =
    normalized.packing?.length
      ? normalized.packing
      : masterPackingList.map(
          name => ({
            id: makeId("pack"),
            name,
            done: false
          })
        );

  return normalized;
}

async function loadStateFromServer() {
  const data =
    await apiRequest("bootstrap");

  state = {
    appointments: data.appointments || [],
    events: (data.events || []).map(
      normalizeLoadedEvent
    ),

    inventory:
      data.inventory || [],

    attention:
      data.attention || [],

    notes: [],

    clients:
      data.clients || []
  };
}

async function saveEventToServer(
  event,
  isNew = false
) {
  return apiRequest(
    isNew
      ? "events"
      : `events/${encodeURIComponent(event.id)}`,
    {
      method: isNew ? "POST" : "PUT",
      body: JSON.stringify(event)
    }
  );
}

async function deleteEventFromServer(id) {
  return apiRequest(
    `events/${encodeURIComponent(id)}`,
    {
      method: "DELETE"
    }
  );
}

async function saveInventoryItemToServer(item) {
  return apiRequest(
    `inventory/${encodeURIComponent(item.id)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        onHand: item.onHand
      })
    }
  );
}
function inventoryImageUrl(item) {
  const plush =
    getPlushMeta(item.id);

  if (item.imageKey) {
    return `/admin/api/inventory/${encodeURIComponent(
      item.id
    )}/image?v=${encodeURIComponent(
      item.imageKey
    )}`;
  }

  return plush?.image || null;
}

function inventorySupportsPhoto(item) {
  return [
    "Plush",
    "Outfits",
    "Shirts"
  ].includes(item?.category);
}

function getEventPlushOptions() {
  return state.inventory
    .filter(
      item =>
        item.category === "Plush"
    )
    .map(item => ({
      id: item.id,
      name:
        inventoryDisplayName(item),
      image:
        inventoryImageUrl(item)
    }));
}

function getEventPlushName(plushId) {
  const item =
    getInventoryItem(plushId);

  if (item) {
    return inventoryDisplayName(item);
  }

  return (
    getPlushMeta(plushId)?.name ||
    plushId
  );
}

function chooseInventoryPhoto(itemId) {
  const input =
    document.createElement("input");

  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {
    const file = input.files?.[0];

    if (!file) return;

    await uploadInventoryPhoto(
      itemId,
      file
    );
  };

  input.click();
}


async function uploadInventoryPhoto(
  itemId,
  file
) {
  const item =
    getInventoryItem(itemId);

  if (!item) return;

  const formData =
    new FormData();

  formData.append(
    "image",
    file
  );

  try {
    const response =
      await fetch(
        `/admin/api/inventory/${encodeURIComponent(itemId)}/image`,
        {
          method: "POST",
          credentials: "same-origin",
          body: formData
        }
      );

    let data = null;

    try {
      data = await response.json();
    } catch {}

    if (!response.ok) {
      throw new Error(
        data?.error ||
        `Upload failed (${response.status})`
      );
    }

    item.imageKey =
      data.imageKey;

    renderInventory();
    openInventoryItem(itemId);

  } catch (err) {
    alert(
      `Could not upload that photo. ${err.message}`
    );
  }
}
async function createReminderOnServer(reminder) {
  return apiRequest(
    "reminders",
    {
      method: "POST",
      body: JSON.stringify(reminder)
    }
  );
}

async function saveReminderToServer(reminder) {
  return apiRequest(
    `reminders/${encodeURIComponent(reminder.id)}`,
    {
      method: "PUT",
      body: JSON.stringify(reminder)
    }
  );
}



/* =========================================================
   PUSH NOTIFICATIONS
========================================================= */

const SWL_VAPID_PUBLIC_KEY = "BOyv9e4JdzUNpAIb8RA877ScMncpw3lRyhdl0QGLjKISC2rXHrM9y2FSncoC5yrgQQJhUNA0guclbB0_GL2tXSQ";

function swlBase64UrlToUint8Array(value) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
}

function pushNotificationsSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function pushNotificationStatus() {
  if (!pushNotificationsSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  if (Notification.permission === "granted") return "enabled";
  return "off";
}

function pushNotificationSettingsLabel() {
  const status = pushNotificationStatus();
  if (status === "enabled") return "Notifications on";
  if (status === "denied") return "Notifications blocked";
  if (status === "unsupported") return "Notifications unavailable";
  return "Set up notifications";
}

function pushNotificationSettingsHTML() {
  if (!pushNotificationsSupported()) {
    return `
      <div class="swl-notification-settings-copy">
        <strong>Notifications unavailable</strong>
        <small>This browser/device does not currently support SWL push notifications.</small>
      </div>
    `;
  }

  const status = pushNotificationStatus();
  if (status === "enabled") {
    return `
      <div class="swl-notification-settings-copy">
        <strong>SWL nudges are on</strong>
        <small>One-week event heads-ups, tomorrow reminders, and dated Attention reminders are enabled on this device.</small>
      </div>
      <div class="swl-notification-settings-actions">
        <button class="primary" type="button" onclick="sendTestPushNotification()">Send test notification</button>
        <button class="quiet" type="button" onclick="disablePushNotifications(); closeModal();">Turn notifications off</button>
      </div>
    `;
  }

  if (status === "denied") {
    return `
      <div class="swl-notification-settings-copy">
        <strong>Notifications are blocked</strong>
        <small>SWL Ops cannot ask again from inside the app. Re-enable notifications for SWL Ops in your iPhone/browser settings, then reopen Ops.</small>
      </div>
    `;
  }

  return `
    <div class="swl-notification-settings-copy">
      <strong>Want a little SWL nudge?</strong>
      <small>Turn on automatic one-week + tomorrow event reminders and your dated Attention reminders.</small>
    </div>
    <div class="swl-notification-settings-actions">
      <button class="primary" type="button" onclick="enablePushNotifications()">Enable notifications</button>
    </div>
  `;
}

function openNotificationSettings() {
  document.getElementById("modalRoot").innerHTML = `
    <div class="modal-backdrop" onclick="closeModalFromBackdrop(event)">
      <section class="swl-notification-settings-sheet" role="dialog" aria-modal="true" aria-label="Notification settings">
        <div class="swl-notification-settings-head">
          <div>
            <span class="swl-notification-settings-kicker">SWL OPS</span>
            <h2>Notifications</h2>
          </div>
          <button class="swl-notification-settings-close" type="button" onclick="closeModal()" aria-label="Close">×</button>
        </div>
        ${pushNotificationSettingsHTML()}
      </section>
    </div>
  `;
}

async function sendTestPushNotification() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      alert("Notifications are not subscribed on this device yet.");
      return;
    }

    const button = document.querySelector(".swl-notification-settings-actions .primary");
    if (button) {
      button.disabled = true;
      button.textContent = "Sending…";
    }

    await apiRequest("push/test", {
      method: "POST",
      body: JSON.stringify({ endpoint: subscription.endpoint })
    });

    showSWLToast("🧸 Test nudge sent");
    closeModal();
  } catch (err) {
    console.error(err);
    alert(`Could not send the test notification. ${err.message}`);
  }
}

async function enablePushNotifications() {
  if (!pushNotificationsSupported()) {
    alert("Push notifications are not supported on this device/browser.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      render();
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: swlBase64UrlToUint8Array(SWL_VAPID_PUBLIC_KEY)
      });
    }

    await apiRequest("push/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription.toJSON())
    });

    showSWLToast("♥ SWL nudges are on");
    render();
  } catch (err) {
    console.error(err);
    alert(`Could not turn on notifications. ${err.message}`);
  }
}

async function disablePushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await apiRequest("push/unsubscribe", {
        method: "POST",
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
      await subscription.unsubscribe();
    }

    showSWLToast("SWL nudges are off");
    render();
  } catch (err) {
    console.error(err);
    alert(`Could not turn off notifications. ${err.message}`);
  }
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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value || 0));
}

function formatDate(dateString) {
  if (!dateString) return "Date not set";

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

function formatTime(timeString) {
  if (!timeString) return "";

  const [hourString, minuteString] =
    timeString.split(":");

  const hour = Number(hourString);
  const minute = Number(minuteString || 0);

  const suffix =
    hour >= 12 ? "PM" : "AM";

  const normalHour =
    hour % 12 || 12;

  return `${normalHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function daysUntil(dateString) {
  if (!dateString) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date =
    new Date(`${dateString}T00:00:00`);

  return Math.ceil(
    (date - today) / 86400000
  );
}
function formatReminderDue(remindBy) {
  if (!remindBy) return "";

  const date = new Date(remindBy);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
  );
}

function reminderSortValue(reminder) {
  if (!reminder.remindBy) {
    return Number.MAX_SAFE_INTEGER;
  }

  const value =
    new Date(reminder.remindBy).getTime();

  return Number.isNaN(value)
    ? Number.MAX_SAFE_INTEGER
    : value;
}

function getEventReminders(
  eventId,
  includeDone = false
) {
  return state.attention
    .filter(reminder => {
      if (
        reminder.type !== "manual" ||
        reminder.eventId !== eventId
      ) {
        return false;
      }

      return includeDone
        ? true
        : !reminder.done;
    })
    .sort(
      (a, b) =>
        reminderSortValue(a) -
        reminderSortValue(b)
    );
}

/* =========================================================
   INVENTORY
========================================================= */

function getInventoryItem(itemId) {
  return state.inventory.find(
    item => item.id === itemId
  );
}

function calculateReserved(itemId) {
  return state.events
    .filter(event => !event.closed)
    .reduce((total, event) => {
      const reservation =
        event.reservations?.find(
          r => r.itemId === itemId
        );

      return (
        total +
        Number(reservation?.quantity || 0)
      );
    }, 0);
}

function inventoryAvailable(itemId) {
  const item =
    getInventoryItem(itemId);

  if (!item) return 0;

  return (
    item.onHand -
    calculateReserved(itemId)
  );
}


/* =========================================================
   INTELLIGENT LOAD OUT
========================================================= */

function loadOutKeyForReservation(itemId) {
  return `inventory:${itemId}`;
}

function loadOutKeyForGear(name) {
  return `gear:${name}`;
}

function normalizeLoadOutStatus(value) {
  return ["packed", "loaded"].includes(value)
    ? value
    : "todo";
}

function ensureEventLoadOut(event) {
  event.loadOut ||= {};

  // Carry forward the old packing checklist so an already-checked
  // piece of equipment does not suddenly look unpacked after upgrade.
  for (const oldItem of event.packing || []) {
    if (!oldItem?.name || !oldItem.done) continue;
    const key = loadOutKeyForGear(oldItem.name);
    if (!event.loadOut[key]) {
      event.loadOut[key] = "loaded";
    }
  }

  return event.loadOut;
}

function buildEventLoadOut(event) {
  ensureEventLoadOut(event);

  const inventoryRows = [];
  const seenInventory = new Set();

  for (const reservation of event.reservations || []) {
    const quantity = Math.max(0, Number(reservation.quantity || 0));
    if (!quantity) continue;

    const item = getInventoryItem(reservation.itemId);
    if (!item) continue;

    const otherReserved =
      calculateReserved(item.id) - quantity;

    const availableForThisEvent =
      Number(item.onHand || 0) - otherReserved;

    const shortage =
      Math.max(0, quantity - availableForThisEvent);

    const key =
      loadOutKeyForReservation(item.id);

    seenInventory.add(item.id);

    inventoryRows.push({
      key,
      kind: "inventory",
      itemId: item.id,
      name: inventoryDisplayName(item),
      quantity,
      unit: item.unit || "item",
      image: inventoryImageUrl(item),
      shortage,
      availableForThisEvent,
      status: normalizeLoadOutStatus(
        event.loadOut[key]
      )
    });
  }

  // Extra inventory added only to this event's packing list. This does
  // not change master inventory or reserve stock for other events.
  for (const extra of event.extraPackInventory || []) {
    const item = getInventoryItem(extra.itemId);
    if (!item || seenInventory.has(item.id)) continue;
    const quantity = Math.max(1, Math.floor(Number(extra.quantity) || 1));
    const key = loadOutKeyForReservation(item.id);
    seenInventory.add(item.id);
    inventoryRows.push({
      key, kind: "inventory", itemId: item.id,
      name: inventoryDisplayName(item), quantity,
      unit: item.unit || "item", image: inventoryImageUrl(item),
      shortage: 0, availableForThisEvent: Number(item.onHand || 0),
      note: "Added to this event only",
      eventOnly: true,
      status: normalizeLoadOutStatus(event.loadOut[key])
    });
  }

  // Fluff is intentionally not auto-reserved, but it absolutely belongs
  // on load-out. Keep it as a visual supply check instead of inventing
  // a per-plush fluff quantity before SWL has real usage data.
  const fluff = getInventoryItem("fluff");
  if (fluff && !seenInventory.has("fluff")) {
    const key = loadOutKeyForReservation("fluff");
    inventoryRows.push({
      key,
      kind: "inventory",
      itemId: "fluff",
      name: inventoryDisplayName(fluff),
      quantity: null,
      unit: fluff.unit || "boxes",
      image: inventoryImageUrl(fluff),
      shortage: 0,
      availableForThisEvent: Number(fluff.onHand || 0),
      note: `${Number(fluff.onHand || 0)} ${fluff.unit || "on hand"} · check supply`,
      status: normalizeLoadOutStatus(
        event.loadOut[key]
      )
    });
  }

  const capacity = plannedSWLCount(event);

  const gearRows = masterPackingList
    .filter(name => name !== "Fluff")
    .map(name => {
      const key = loadOutKeyForGear(name);
      let quantity = null;
      let note = "";

      if (name === "Adoption certificates" && capacity > 0) {
        quantity = capacity;
      }

      if (name === "Stuffing machine") {
        quantity = 1;
      }

      if (name === "EcoFlow / power") {
        quantity = 1;
      }

      return {
        key,
        kind: "gear",
        name,
        quantity,
        note,
        loadOnly: SWL_LOAD_ONLY_GEAR.has(name),
        shortage: 0,
        status: normalizeLoadOutStatus(
          event.loadOut[key]
        )
      };
    });

  return {
    inventoryRows,
    gearRows,
    rows: [...inventoryRows, ...gearRows]
  };
}

function loadOutCounts(event) {
  const rows = buildEventLoadOut(event).rows;
  const packableRows = rows.filter(row => !row.loadOnly);

  return {
    total: rows.length,
    packableTotal: packableRows.length,
    packed: packableRows.filter(
      row => row.status === "packed" || row.status === "loaded"
    ).length,
    loaded: rows.filter(
      row => row.status === "loaded"
    ).length,
    shortages: rows.filter(
      row => Number(row.shortage || 0) > 0
    )
  };
}

function loadOutStatusLabel(status) {
  if (status === "loaded") return "Loaded";
  if (status === "packed") return "Packed";
  return "Not packed";
}

function loadOutRowHTML(row, eventId) {
  const status = normalizeLoadOutStatus(row.status);
  const quantityText =
    row.quantity != null
      ? `${row.quantity}`
      : "";

  const image = row.image
    ? `<img class="loadout-item-image" src="${escapeHTML(row.image)}" alt="" />`
    : `<div class="loadout-item-icon" aria-hidden="true">${row.kind === "gear" ? "✦" : "♥"}</div>`;

  const detail = row.shortage
    ? `<span class="loadout-shortage">Need ${row.quantity} · only ${Math.max(0, row.availableForThisEvent)} available · short ${row.shortage}</span>`
    : row.note
      ? `<span class="loadout-row-note">${escapeHTML(row.note)}</span>`
      : row.quantity != null
        ? `<span class="loadout-row-note">${row.kind === "inventory" ? "Bring" : "Bring"} ${quantityText}</span>`
        : "";

  return `
    <div class="loadout-row ${status}" data-loadout-key="${escapeHTML(row.key)}">
      <div class="loadout-row-main">
        ${image}
        <div class="loadout-row-copy">
          <div class="loadout-row-title-line">
            <strong>${escapeHTML(row.name)}</strong>
            ${row.quantity != null ? `<span class="loadout-quantity">${quantityText}</span>` : ""}
          </div>
          ${detail}
        </div>
      </div>

      ${
        row.loadOnly
          ? `
              <div class="loadout-stepper load-only" aria-label="${escapeHTML(row.name)} load status">
                <button
                  type="button"
                  class="loadout-state-button loaded ${status === "loaded" ? "active" : ""}"
                  onclick="setLoadOutStatus('${eventId}', '${escapeHTML(row.key)}', '${status === "loaded" ? "todo" : "loaded"}')"
                >
                  <span>↗</span>
                  ${status === "loaded" ? "Loaded" : "Load it"}
                </button>
              </div>
            `
          : `
              <div class="loadout-stepper" aria-label="${escapeHTML(row.name)} load status">
                <button
                  type="button"
                  class="loadout-state-button ${status === "packed" || status === "loaded" ? "active" : ""}"
                  onclick="setLoadOutStatus('${eventId}', '${escapeHTML(row.key)}', '${status === "packed" ? "todo" : "packed"}')"
                >
                  <span>✓</span>
                  Packed
                </button>
                <button
                  type="button"
                  class="loadout-state-button loaded ${status === "loaded" ? "active" : ""}"
                  onclick="setLoadOutStatus('${eventId}', '${escapeHTML(row.key)}', '${status === "loaded" ? "packed" : "loaded"}')"
                >
                  <span>↗</span>
                  Loaded
                </button>
              </div>
            `
      }
    </div>
  `;
}

async function setLoadOutStatus(eventId, key, nextStatus) {
  const event =
    state.events.find(
      item => item.id === eventId
    );

  if (!event) return;

  ensureEventLoadOut(event);

  const previous =
    normalizeLoadOutStatus(
      event.loadOut[key]
    );

  const before = loadOutCounts(event);

  event.loadOut[key] =
    normalizeLoadOutStatus(nextStatus);

  const after = loadOutCounts(event);

  renderEventDetail();

  if (
    event.loadOut[key] === "loaded" &&
    after.loaded === after.total &&
    after.total > 0 &&
    after.shortages.length === 0 &&
    before.loaded !== before.total
  ) {
    requestAnimationFrame(() => {
      celebratePackingComplete();
    });
  } else if (
    event.loadOut[key] === "packed" &&
    after.packed === after.packableTotal &&
    after.packableTotal > 0 &&
    before.packed !== before.packableTotal
  ) {
    requestAnimationFrame(() => {
      animateLoadOutTap(key);
      showSWLToast(
        "✨ Everything is packed. Time to load the fluff-mobile.",
        { duration: 2200 }
      );
    });
  } else if (
    event.loadOut[key] === "packed" ||
    event.loadOut[key] === "loaded"
  ) {
    requestAnimationFrame(() => {
      animateLoadOutTap(key);
    });
  }

  try {
    await saveEventToServer(event);
  } catch (err) {
    event.loadOut[key] = previous;
    renderEventDetail();
    alert(
      `Could not save that load-out change. ${err.message}`
    );
  }
}

function animateLoadOutTap(key) {
  const row =
    [...document.querySelectorAll("[data-loadout-key]")]
      .find(element => element.dataset.loadoutKey === key);

  if (!row) return;

  row.classList.remove("just-packed");
  void row.offsetWidth;
  row.classList.add("just-packed");

  setTimeout(() => {
    row.classList.remove("just-packed");
  }, 430);
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

    if (!item) continue;

    const otherReserved =
      calculateReserved(item.id) -
      Number(reservation.quantity || 0);

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
    eventIssues(event).forEach(issue => {
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
   HEADER / NAV
========================================================= */

function updateAttentionBadge() {
  const badge =
    document.getElementById(
      "attentionBadge"
    );

  if (!badge) return;

  const count =
    allCurrentIssues().length;

  badge.textContent = count;

  badge.classList.toggle(
    "hidden",
    count === 0
  );
}

function ensureSWLHeaderBrand() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  const brandCopy = topbar.querySelector(":scope > div");
  if (brandCopy) {
    brandCopy.classList.add("swl-topbar-brand-copy");
  }

  if (!topbar.querySelector(".swl-topbar-logo")) {
    const logo = document.createElement("img");
    logo.className = "swl-topbar-logo";
    logo.src = "swl-logo.png";
    logo.alt = "Stuffed With Love";
    logo.decoding = "async";

    const action = document.getElementById("headerAction");
    topbar.insertBefore(logo, action || null);
  }
}

function setHeader(title) {
  ensureSWLHeaderBrand();

  document.getElementById(
    "pageTitle"
  ).textContent = title;

  // The page-level actions already live inside each screen.
  // Keep the top bar clean: no mystery + button.
  const action =
    document.getElementById(
      "headerAction"
    );

  action.classList.add("hidden");
}

function navigate(screen) {
  currentScreen = screen;
  currentEventId = null;
  currentClientKey = null;

  document
    .querySelectorAll(".nav-item")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.screen === screen
      );
    });

  render();
   window.scrollTo({
  top: 0,
  left: 0,
  behavior: "instant"
});
}

function render() {
  updateAttentionBadge();

  switch (currentScreen) {
    case "calendar":
      renderCalendar();
      break;

    case "events":
      renderEvents();
      break;

    case "inventory":
  renderInventory();
  break;

case "files":
  renderFiles();
  break;

case "clients":
  renderClients();
  break;

case "client-detail":
  renderClientDetail();
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
   CALENDAR — events + lightweight appointments
========================================================= */
function calendarLocalKey(iso) {
  if (!iso) return '';
  const date=new Date(iso);
  return Number.isNaN(date.getTime())?'':swlDateKey(date);
}
function calendarEventDate(event) {
  // Event dates are date-only strings in the existing event wizard.
  const value=String(event.date||'');
  const match=value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  const date=new Date(value);
  return Number.isNaN(date.getTime())?'':swlDateKey(date);
}
function calendarEntries(date) {
  return [
    ...state.events.filter(e=>!e.closed&&calendarEventDate(e)===date)
      .map(e=>({type:'event',id:e.id,title:e.name||e.eventName||e.clientName||'SWL Event',
        time:e.startTime||e.time||'',raw:e})),
    ...(state.appointments||[]).filter(a=>calendarLocalKey(a.startAt)===date)
      .map(a=>({type:'appointment',id:a.id,title:a.title,time:new Date(a.startAt).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}),raw:a}))
  ].sort((a,b)=>a.time.localeCompare(b.time));
}
function calendarShiftMonth(delta) {
  calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+delta,1);
  calendarSelected=swlDateKey(calendarMonth);
  renderCalendar();
}
function calendarSelect(date) {calendarSelected=date;renderCalendar();}
function renderCalendar() {
  setHeader('Calendar');
  const year=calendarMonth.getFullYear(),month=calendarMonth.getMonth();
  const days=new Date(year,month+1,0).getDate();
  const offset=(new Date(year,month,1).getDay()+6)%7;
  const monthLabel=calendarMonth.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const cells=Array.from({length:offset+days},(_,i)=>{
    if(i<offset)return '<div class="swl-cal-empty"></div>';
    const day=i-offset+1,date=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const entries=calendarEntries(date);
    return `<button type="button" class="swl-cal-day ${date===calendarSelected?'selected':''} ${date===swlDateKey()?'today':''}"
      onclick="calendarSelect('${date}')" aria-label="${date}, ${entries.length} items" aria-pressed="${date===calendarSelected}">
      <span>${day}</span><span class="swl-cal-dots">${entries.some(e=>e.type==='event')?'<i class="event"></i>':''}${entries.some(e=>e.type==='appointment')?'<i class="appointment"></i>':''}</span></button>`;
  }).join('');
  const entries=calendarEntries(calendarSelected);
  document.getElementById('mainContent').innerHTML=`
    <section class="swl-calendar card">
      <div class="swl-cal-toolbar"><button type="button" onclick="calendarShiftMonth(-1)" aria-label="Previous month">‹</button>
      <h2>${escapeHTML(monthLabel)}</h2><button type="button" onclick="calendarShiftMonth(1)" aria-label="Next month">›</button></div>
      <div class="swl-cal-weekdays">${['M','T','W','T','F','S','S'].map(d=>`<span>${d}</span>`).join('')}</div>
      <div class="swl-cal-grid">${cells}</div>
      <div class="swl-cal-legend"><span><i class="event"></i> SWL event</span><span><i class="appointment"></i> Appointment</span></div>
    </section>
    <div class="swl-cal-agenda-head"><h2>${escapeHTML(new Date(calendarSelected+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}))}</h2>
      <button class="primary-button" type="button" onclick="openAppointmentForm()">+ Appointment</button></div>
    ${entries.length?entries.map(e=>`<button type="button" class="card swl-cal-entry" onclick="${e.type==='event'?`calendarOpenEvent('${escapeHTML(e.id)}')`:`openAppointmentForm('${escapeHTML(e.id)}')`}">
      <span class="swl-cal-entry-icon ${e.type}">${e.type==='event'?'♥':'◷'}</span><span><strong>${escapeHTML(e.title)}</strong><small>${e.type==='event'?'SWL event':'Appointment'}${e.time?' · '+escapeHTML(e.time):''}</small></span><span>›</span></button>`).join(''):
      '<div class="card empty-card"><strong>Nothing on the calendar yet</strong><p>Enjoy the breathing room, or add an appointment.</p></div>'}`;
}
function calendarOpenEvent(id) {
  currentEventId=id;currentScreen='event-detail';render();
}
function swlLocalDateTime(date, time) {
  if (!date || !time) return null;
  const result = new Date(`${date}T${time}`);
  return Number.isFinite(result.getTime()) ? result : null;
}
function swlDateTimeParts(date) {
  return {
    date: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`,
    time: `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`
  };
}
function swlEventDurationMinutes(type) {
  return type === 'Birthday Party' ? 120 : 240;
}
function swlAppointmentDurationMinutes(kind) {
  return kind === 'call' ? 30 : kind === 'meeting' ? 60 : 240;
}
function swlUpdateAppointmentEnd() {
  const start = document.getElementById('apptStart');
  const end = document.getElementById('apptEnd');
  const kind = document.getElementById('apptKind');
  if (!start?.value || !end || !kind) return;
  const parsed = new Date(start.value);
  if (!Number.isFinite(parsed.getTime())) return;
  const next = new Date(parsed.getTime() + swlAppointmentDurationMinutes(kind.value) * 60000);
  const parts = swlDateTimeParts(next);
  end.value = `${parts.date}T${parts.time}`;
}
function swlUpdateWizardEnd() {
  const startDate = document.getElementById('eventDate');
  const startTime = document.getElementById('eventTime');
  const endDate = document.getElementById('eventEndDate');
  const endTime = document.getElementById('eventEndTime');
  const type = document.getElementById('eventType');
  if (!startDate || !startTime || !endDate || !endTime || !type) return;
  const start = swlLocalDateTime(startDate.value, startTime.value);
  if (!start) return;
  const parts = swlDateTimeParts(new Date(start.getTime() + swlEventDurationMinutes(type.value) * 60000));
  endDate.value = parts.date;
  endTime.value = parts.time;
  wizard.endDate = parts.date;
  wizard.endTime = parts.time;
}
function openAppointmentForm(id='') {
  const a=(state.appointments||[]).find(item=>item.id===id);
  const start=a?new Date(a.startAt):new Date(calendarSelected+'T09:00:00');
  const end=a?new Date(a.endAt):new Date(start.getTime()+swlAppointmentDurationMinutes('meeting')*60000);
  const localInput=d=>`${swlDateKey(d)}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  document.getElementById('modalRoot').innerHTML=`<div class="swl-cal-overlay" onclick="if(event.target===this)closeModal()">
    <form class="swl-cal-form card" onsubmit="saveAppointmentForm(event,'${escapeHTML(id)}')">
      <div class="swl-cal-form-head"><h2>${a?'Edit':'New'} appointment</h2><button type="button" onclick="closeModal()" aria-label="Close">×</button></div>
      <div class="field"><label for="apptTitle">Title</label><input id="apptTitle" name="title" required maxlength="180" value="${escapeHTML(a?.title||'')}" placeholder="Partner meeting"></div>
      <div class="field"><label for="apptKind">Type</label><select id="apptKind" name="kind" onchange="swlUpdateAppointmentEnd()">${[['meeting','Meeting'],['call','Phone call'],['other','Other']].map(([v,t])=>`<option value="${v}" ${a?.kind===v?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="field"><label for="apptStart">Starts</label><input id="apptStart" name="start" type="datetime-local" required oninput="swlUpdateAppointmentEnd()" onchange="swlUpdateAppointmentEnd()" value="${localInput(start)}"></div>
      <div class="field"><label for="apptEnd">Ends</label><input id="apptEnd" name="end" type="datetime-local" required value="${localInput(end)}"></div>
      <div class="field"><label for="apptLocation">Location / call link</label><input id="apptLocation" name="location" maxlength="500" value="${escapeHTML(a?.location||'')}"></div>
      <div class="field"><label for="apptNotes">Notes</label><textarea id="apptNotes" name="notes" maxlength="4000">${escapeHTML(a?.notes||'')}</textarea></div>
      <div class="field"><label for="apptReminder">Push reminder</label><select id="apptReminder" name="reminder">${[[-1,'Off'],[0,'At start'],[5,'5 minutes before'],[10,'10 minutes before'],[15,'15 minutes before'],[30,'30 minutes before'],[60,'1 hour before'],[120,'2 hours before'],[1440,'1 day before']].map(([v,t])=>`<option value="${v}" ${(a?.remindMinutes??30)===v?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="swl-cal-form-actions"><button class="primary-button" type="submit">Save appointment</button>${a?`<button class="danger-button" type="button" onclick="deleteAppointment('${escapeHTML(id)}')">Delete</button>`:''}</div>
    </form></div>`;
}
async function saveAppointmentForm(event,id) {
  event.preventDefault();
  const form=event.currentTarget,submit=form.querySelector('[type="submit"]');
  const start=new Date(form.elements.start.value),end=new Date(form.elements.end.value);
  if (!Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||end<=start) {alert('End time must be after start time.');return;}
  submit.disabled=true;
  try {
    const result=await apiRequest(id?`appointments/${encodeURIComponent(id)}`:'appointments',{
      method:id?'PUT':'POST',body:JSON.stringify({title:form.elements.title.value,kind:form.elements.kind.value,
        startAt:start.toISOString(),endAt:end.toISOString(),location:form.elements.location.value,
        notes:form.elements.notes.value,remindMinutes:Number(form.elements.reminder.value)})});
    const a=result.appointment;
    state.appointments=(state.appointments||[]).filter(item=>item.id!==a.id).concat(a);
    calendarMonth=new Date(start.getFullYear(),start.getMonth(),1);
    calendarSelected=swlDateKey(start);closeModal();renderCalendar();showSWLToast('Appointment saved');
  } catch(err) {alert(err.message);submit.disabled=false;}
}
async function deleteAppointment(id) {
  if (!confirm('Delete this appointment?'))return;
  try {await apiRequest(`appointments/${encodeURIComponent(id)}`,{method:'DELETE'});
    state.appointments=state.appointments.filter(a=>a.id!==id);closeModal();renderCalendar();showSWLToast('Appointment deleted');
  } catch(err) {alert(err.message);}
}

/* =========================================================
   HOME
========================================================= */

function renderHome() {
  setHeader("Ops");

  const main =
    document.getElementById("mainContent");

  const upcoming =
    [...state.events]
      .filter(event => !event.closed)
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );

  const nextEvent = upcoming[0];
  const issues = allCurrentIssues();

  const manualReminders =
    state.attention.filter(
      item =>
        item.type === "manual" &&
        !item.done
    );

  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning!"
      : hour < 17
        ? "Good afternoon!"
        : "Good evening!";

  let html = `

    <section class="swl-home-welcome">

      <div class="swl-home-welcome-copy">

        <div class="swl-home-greeting">
          ${greeting}
        </div>

        <h2 class="swl-daily-message">
          ${escapeHTML(getSWLDailyMessage())}
        </h2>

      </div>

      <div class="swl-home-heart">
        ♥
      </div>

    </section>

    <section class="swl-home-glance">

      <button
        class="swl-glance-card"
        onclick="navigate('events')"
      >
        <strong>${upcoming.length}</strong>
        <span>Upcoming</span>
      </button>

      <button
        class="swl-glance-card ${
          issues.length ? "needs-attention" : ""
        }"
        onclick="navigate('attention')"
      >
        <strong>${issues.length}</strong>
        <span>Attention</span>
      </button>

      <button
        class="swl-glance-card"
        onclick="navigate('attention')"
      >
        <strong>${manualReminders.length}</strong>
        <span>Reminders</span>
      </button>

    </section>


    <section class="swl-home-section">

      <div class="swl-home-section-title">
        <h2>Quick Actions</h2>
      </div>

      <div class="swl-quick-grid">

        <button
          class="swl-quick-action primary"
          onclick="openAddEventWizard()"
        >
          <span class="swl-quick-icon">＋</span>

          <span>
            <strong>Add Event</strong>
            <small>Book something new</small>
          </span>
        </button>

        <button
          class="swl-quick-action"
          onclick="navigate('inventory')"
        >
          <span class="swl-quick-icon">♥</span>

          <span>
            <strong>Inventory</strong>
            <small>Check what’s ready</small>
          </span>
        </button>

        ${
          nextEvent
            ? `
              <button
                class="swl-quick-action"
                onclick="
                  openEvent('${nextEvent.id}');
                  setEventTab('pack');
                "
              >
                <span class="swl-quick-icon">✓</span>

                <span>
                  <strong>Packing List</strong>
                  <small>Prep the next event</small>
                </span>
              </button>
            `
            : `
              <button
                class="swl-quick-action"
                onclick="navigate('events')"
              >
                <span class="swl-quick-icon">✓</span>

                <span>
                  <strong>Packing List</strong>
                  <small>No event selected</small>
                </span>
              </button>
            `
        }

        <button
          class="swl-quick-action"
          onclick="navigate('clients')"
        >
          <span class="swl-quick-icon">☺</span>

          <span>
            <strong>Clients</strong>
            <small>Contacts & event history</small>
          </span>
        </button>

      </div>

    </section>


    <section class="swl-home-section">

      <div class="swl-home-section-title">

        <h2>Next Up</h2>

        ${
          upcoming.length
            ? `
              <button onclick="navigate('events')">
                All events
              </button>
            `
            : ""
        }

      </div>
  `;


  if (!nextEvent) {

    html += `
      <div class="card empty-card">

        <strong>
          No events booked yet.
        </strong>

        <p>
          When you add an event,
          it’ll show up here.
        </p>

      </div>
    `;

  } else {

    const issuesForEvent =
      eventIssues(nextEvent);

    const days =
      daysUntil(nextEvent.date);

    html += `
      <button
        class="swl-next-event-card"
        onclick="openEvent('${nextEvent.id}')"
      >

        <div class="swl-next-date">

          <span>
            ${new Date(
              `${nextEvent.date}T12:00:00`
            )
              .toLocaleDateString(
                "en-US",
                { month: "short" }
              )
              .toUpperCase()}
          </span>

          <strong>
            ${new Date(
              `${nextEvent.date}T12:00:00`
            ).getDate()}
          </strong>

        </div>


        <div class="swl-next-copy">

          <div class="swl-next-topline">

            <span>
              ${
                days === 0
                  ? "Today"
                  : days === 1
                    ? "Tomorrow"
                    : days > 1
                      ? `In ${days} days`
                      : "Upcoming"
              }
            </span>

            ${
              issuesForEvent.length
                ? `
                  <span class="swl-next-warning">
                    ${issuesForEvent.length}
                    need attention
                  </span>
                `
                : `
                  <span class="swl-next-ready">
                    ✓ On track
                  </span>
                `
            }

          </div>

          <strong class="swl-next-name">
            ${escapeHTML(nextEvent.name)}
          </strong>

          <div class="swl-next-meta">

            ${
              nextEvent.time
                ? formatTime(nextEvent.time)
                : "Time not set"
            }

            ${
              nextEvent.guestCount
                ? ` · ${nextEvent.guestCount} guests`
                : ""
            }

          </div>

        </div>

        <span class="swl-next-arrow">›</span>

      </button>
    `;
  }


  html += `
    </section>


    <section class="swl-home-section">

      <div class="swl-home-section-title">

        <h2>Needs Attention</h2>

        ${
          issues.length
            ? `
              <button onclick="navigate('attention')">
                View all
              </button>
            `
            : ""
        }

      </div>
  `;


  if (!issues.length) {

    html += `
      <div class="swl-all-good">

        <span>✓</span>

        <div>
          <strong>
            Everything looks good.
          </strong>

          <p>
            Nothing needs you right now.
          </p>
        </div>

      </div>
    `;

  } else {

    html += `
      <div class="swl-attention-list">
    `;

    issues
      .slice(0, 3)
      .forEach(issue => {

        const event =
          state.events.find(
            e => e.id === issue.eventId
          );

        html += `
          <button
            class="swl-attention-item"
            ${
              issue.eventId
                ? `onclick="openEvent('${issue.eventId}')"`
                : `onclick="navigate('attention')"`
            }
          >

            <span class="swl-attention-mark">
              !
            </span>

            <span class="swl-attention-copy">

              <strong>
                ${escapeHTML(issue.title)}
              </strong>

              <small>
                ${
                  event
                    ? escapeHTML(event.name)
                    : "Reminder"
                }
              </small>

            </span>

            <span class="swl-attention-arrow">
              ›
            </span>

          </button>
        `;
      });

    html += `
      </div>
    `;
  }


  html += `
    </section>
  `;


  if (upcoming.length > 1) {

    html += `
      <section class="swl-home-section">

        <div class="swl-home-section-title">

          <h2>Coming Up</h2>

          <button onclick="navigate('events')">
            View all
          </button>

        </div>

        <div class="swl-coming-list">
    `;

    upcoming
      .slice(1, 4)
      .forEach(event => {

        const issueCount =
          eventIssues(event).length;

        html += `
          <button
            class="swl-coming-event"
            onclick="openEvent('${event.id}')"
          >

            <div>

              <strong>
                ${escapeHTML(event.name)}
              </strong>

              <span>
                ${formatDate(event.date)}
                ${
                  event.time
                    ? ` · ${formatTime(event.time)}`
                    : ""
                }
              </span>

            </div>

            ${
              issueCount
                ? `
                  <span class="swl-coming-status warning">
                    ${issueCount}
                  </span>
                `
                : `
                  <span class="swl-coming-status">
                    ✓
                  </span>
                `
            }

          </button>
        `;
      });

    html += `
        </div>
      </section>
    `;
  }


  html += `
    <div class="swl-home-utility-row">
      <button type="button" class="swl-notification-settings-link" onclick="openNotificationSettings()">
        <span aria-hidden="true">⚙</span>
        <span>${pushNotificationSettingsLabel()}</span>
      </button>
    </div>
  `;

  main.innerHTML = html;
}

/* =========================================================
   CLIENTS
========================================================= */

function normalizeClientText(value = "") {
  return String(value || "").trim();
}

function normalizedClientPhone(value = "") {
  return normalizeClientText(value)
    .replace(/[^\d+]/g, "");
}

function clientKeyForEvent(event) {
  const email =
    normalizeClientText(event.hostEmail).toLowerCase();

  const phone =
    normalizedClientPhone(event.hostPhone);

  if (email) return `email:${email}`;
  if (phone) return `phone:${phone}`;

  return `event:${event.id}`;
}

function eventDerivedClients() {
  const clients = new Map();

  state.events.forEach(event => {
    const name = normalizeClientText(event.hostName);
    const email = normalizeClientText(event.hostEmail);
    const phone = normalizeClientText(event.hostPhone);

    if (!name && !email && !phone) return;

    const key = clientKeyForEvent(event);

    if (!clients.has(key)) {
      clients.set(key, {
        id: null,
        key,
        legacyKey: key,
        name: name || email || phone || "Unnamed client",
        type: "person",
        contacts: [],
        events: [],
        importedFromEvents: true
      });
    }

    const client = clients.get(key);

    if (name) client.name = name;

    if (
      (email || phone) &&
      !client.contacts.some(contact =>
        normalizeClientText(contact.email).toLowerCase() === email &&
        normalizedClientPhone(contact.phone) === normalizedClientPhone(phone)
      )
    ) {
      client.contacts.push({
        id: null,
        name: name || client.name,
        role: "",
        email,
        phone,
        isPrimary: client.contacts.length === 0
      });
    }

    client.events.push(event);
  });

  return [...clients.values()];
}

function getAllClients() {
  const derived = eventDerivedClients();
  const persisted = (state.clients || []).map(client => ({
    ...client,
    key: client.legacyKey || `client:${client.id}`,
    contacts: client.contacts || [],
    events: [],
    importedFromEvents: false
  }));

  const claimedLegacyKeys =
    new Set(
      persisted
        .map(client => client.legacyKey)
        .filter(Boolean)
    );

  persisted.forEach(client => {
    if (!client.legacyKey) return;

    const match =
      derived.find(item =>
        item.key === client.legacyKey
      );

    if (match) {
      client.events.push(...match.events);
    }
  });

  const unclaimed =
    derived.filter(client =>
      !claimedLegacyKeys.has(client.key)
    );

  return [...persisted, ...unclaimed];
}

function clientPrimaryContact(client) {
  return (
    client.contacts?.find(contact => contact.isPrimary) ||
    client.contacts?.[0] ||
    null
  );
}

function clientSearchText(client) {
  return [
    client.name,
    client.type,
    ...(client.contacts || []).flatMap(contact => [
      contact.name,
      contact.address,
      contact.email,
      contact.phone
    ])
  ].join(" ").toLowerCase();
}

function clientEventDateValue(event) {
  if (!event?.date) return Number.POSITIVE_INFINITY;

  return new Date(
    `${event.date}T12:00:00`
  ).getTime();
}

function isClientEventUpcoming(event) {
  if (event.closed) return false;
  if (!event.date) return true;

  const eventDate =
    new Date(`${event.date}T12:00:00`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return eventDate >= today;
}

function clientUpcomingEvents(client) {
  return [...(client.events || [])]
    .filter(isClientEventUpcoming)
    .sort(
      (a, b) =>
        clientEventDateValue(a) -
        clientEventDateValue(b)
    );
}

function clientPastEvents(client) {
  return [...(client.events || [])]
    .filter(event => !isClientEventUpcoming(event))
    .sort(
      (a, b) =>
        clientEventDateValue(b) -
        clientEventDateValue(a)
    );
}

function findClientByKey(key) {
  return getAllClients()
    .find(client => client.key === key) || null;
}

function setClientSearch(value) {
  clientSearch = value || "";
  renderClients();
}

function openClient(encodedKey) {
  currentClientKey =
    decodeURIComponent(encodedKey);

  currentScreen = "client-detail";
  render();

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  });
}

function clientCardHTML(client, showNext = false) {
  const upcoming = clientUpcomingEvents(client);
  const nextEvent = upcoming[0];
  const primary = clientPrimaryContact(client);

  const initial =
    (client.name || "?").charAt(0).toUpperCase();

  let subline =
    primary?.name ||
    primary?.email ||
    primary?.phone ||
    (client.importedFromEvents
      ? "From an existing event"
      : "No contacts yet");

  if (showNext && nextEvent) {
    subline =
      `${formatDate(nextEvent.date)} · ${nextEvent.name || "Event"}`;
  }

  return `
    <button
      class="card swl-client-card tap-card"
      onclick="openClient('${encodeURIComponent(client.key)}')"
    >
      <span class="swl-client-avatar">
        ${escapeHTML(initial)}
      </span>

      <span class="swl-client-card-copy">
        <strong>${escapeHTML(client.name)}</strong>
        <span>${escapeHTML(subline)}</span>
        <small>
          ${(client.contacts || []).length}
          ${(client.contacts || []).length === 1 ? "contact" : "contacts"}
          ·
          ${(client.events || []).length}
          ${(client.events || []).length === 1 ? "event" : "events"}
        </small>
      </span>

      <span class="swl-client-chevron">›</span>
    </button>
  `;
}

function setClientListTab(tab) {
  activeClientListTab = tab === "all" ? "all" : "upcoming";
  renderClients();
}

function renderClients() {
  setHeader("Clients");
  const main = document.getElementById("mainContent");
  const search = normalizeClientText(clientSearch).toLowerCase();
  const allClients = getAllClients().filter(client =>
    !search || clientSearchText(client).includes(search)
  );
  const upcomingClients = allClients
    .filter(client => clientUpcomingEvents(client).length > 0)
    .sort((a, b) =>
      clientEventDateValue(clientUpcomingEvents(a)[0]) -
      clientEventDateValue(clientUpcomingEvents(b)[0])
    );
  const alphabeticClients = [...allClients].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
  const visibleClients = activeClientListTab === "all"
    ? alphabeticClients
    : upcomingClients;

  let html = `
    <div class="swl-clients-toolbar">
      <div class="swl-client-search-wrap">
        <input class="swl-client-search" type="search"
          placeholder="Search clients or contacts"
          value="${escapeHTML(clientSearch)}"
          oninput="setClientSearch(this.value)" autocomplete="off" />
      </div>
      <button class="primary-button swl-add-client-button" type="button" onclick="openAddClientModal()">+ Add Client</button>
    </div>

    <div class="swl-client-tabs" role="tablist" aria-label="Client list">
      <button type="button" class="${activeClientListTab === "upcoming" ? "active" : ""}" onclick="setClientListTab('upcoming')">
        Upcoming <span>${upcomingClients.length}</span>
      </button>
      <button type="button" class="${activeClientListTab === "all" ? "active" : ""}" onclick="setClientListTab('all')">
        All Clients <span>${alphabeticClients.length}</span>
      </button>
    </div>
  `;

  if (!getAllClients().length) {
    html += `<div class="card empty-card"><strong>No clients yet.</strong><p>Add your first client here. Clients can exist even when they do not have an event yet.</p></div>`;
  } else if (!visibleClients.length) {
    html += `<div class="card empty-card"><strong>${search ? "No matches." : activeClientListTab === "upcoming" ? "No upcoming clients." : "No clients yet."}</strong><p>${search ? "Try a client name, contact, phone number, email, or address." : "Switch to All Clients to see everyone."}</p></div>`;
  } else {
    html += `
      <section class="swl-client-section">
        <div class="swl-client-section-heading">
          <h2>${activeClientListTab === "all" ? "All Clients" : "Upcoming Clients"}</h2>
          <span>${visibleClients.length}</span>
        </div>
        <div class="swl-client-list">
          ${visibleClients.map(client => clientCardHTML(client, activeClientListTab === "upcoming")).join("")}
        </div>
      </section>`;
  }
  main.innerHTML = html;
}

function openAddClientModal() {
  const root =
    document.getElementById("modalRoot");

  root.innerHTML = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >
      <div class="modal-sheet swl-client-form-sheet">
        <div class="modal-handle"></div>

        <div class="modal-title-row">
          <div>
            <div class="card-label">CLIENTS</div>
            <h2>Add Client</h2>
          </div>

          <button
            class="modal-close"
            type="button"
            onclick="closeModal()"
          >×</button>
        </div>

        <div class="field">
          <label>Client name</label>
          <input
            id="newClientName"
            type="text"
            placeholder="Smith Family or Discover Green Bay"
            autocomplete="off"
          />
        </div>

        <div class="field">
          <label>Client type</label>
          <select id="newClientType">
            <option value="person">Person / Family</option>
            <option value="organization">Organization / Business</option>
          </select>
        </div>

        <div class="swl-contact-form-heading">
          First contact
          <small>Optional — you can add more after saving.</small>
        </div>

        <div class="field">
          <label>Contact name</label>
          <input id="newClientContactName" type="text" autocomplete="off" />
        </div>

        <div class="field">
          <label>Phone</label>
          <input id="newClientContactPhone" type="tel" autocomplete="tel" />
        </div>

        <div class="field">
          <label>Email</label>
          <input id="newClientContactEmail" type="email" autocomplete="email" />
        </div>

        <div class="field">
          <label>Address</label>
          <input id="newClientContactAddress" type="text" autocomplete="street-address" />
        </div>

        <button
          class="primary-button full-width"
          type="button"
          onclick="saveNewClient()"
        >
          Save Client
        </button>
      </div>
    </div>
  `;
}

async function saveNewClient() {
  const name =
    normalizeClientText(
      document.getElementById("newClientName")?.value
    );

  if (!name) {
    alert("Give the client a name.");
    return;
  }

  const type =
    document.getElementById("newClientType")?.value ||
    "person";

  const contact = {
    name: normalizeClientText(
      document.getElementById("newClientContactName")?.value
    ),
    address: normalizeClientText(
      document.getElementById("newClientContactAddress")?.value
    ),
    phone: normalizeClientText(
      document.getElementById("newClientContactPhone")?.value
    ),
    email: normalizeClientText(
      document.getElementById("newClientContactEmail")?.value
    )
  };

  const hasContact =
    contact.name ||
    contact.address ||
    contact.phone ||
    contact.email;

  try {
    const response =
      await apiRequest("clients", {
        method: "POST",
        body: JSON.stringify({
          name,
          type,
          contacts: hasContact ? [contact] : []
        })
      });

    state.clients.push(response.client);

    closeModal();
    showSWLToast("Client added");

    currentClientKey =
      response.client.legacyKey ||
      `client:${response.client.id}`;

    currentScreen = "client-detail";
    render();
  } catch (err) {
    alert(`Could not add that client. ${err.message}`);
  }
}

async function ensurePersistedClient(client) {
  if (client.id) return client;

  const primary = clientPrimaryContact(client);

  const response =
    await apiRequest("clients", {
      method: "POST",
      body: JSON.stringify({
        name: client.name,
        type: client.type || "person",
        legacyKey: client.key,
        contacts: primary
          ? [{
              name: primary.name || client.name,
              address: primary.address || "",
              phone: primary.phone || "",
              email: primary.email || ""
            }]
          : []
      })
    });

  state.clients.push(response.client);

  return {
    ...response.client,
    key: response.client.legacyKey || `client:${response.client.id}`,
    events: client.events || [],
    importedFromEvents: false
  };
}

function contactFormHTML(client, contact = null) {
  const editing = Boolean(contact?.id);
  return `
    <div class="modal-backdrop" onclick="closeModalFromBackdrop(event)">
      <div class="modal-sheet swl-client-form-sheet">
        <div class="modal-handle"></div>
        <div class="modal-title-row">
          <div><div class="card-label">${escapeHTML(client.name)}</div><h2>${editing ? "Edit Contact" : "Add Contact"}</h2></div>
          <button class="modal-close" type="button" onclick="closeModal()">×</button>
        </div>
        <div class="field"><label>Name</label><input id="contactFormName" type="text" value="${escapeHTML(contact?.name || "")}" autocomplete="off" /></div>
        <div class="field"><label>Phone</label><input id="contactFormPhone" type="tel" value="${escapeHTML(contact?.phone || "")}" autocomplete="tel" /></div>
        <div class="field"><label>Email</label><input id="contactFormEmail" type="email" value="${escapeHTML(contact?.email || "")}" autocomplete="email" /></div>
        <div class="field"><label>Address</label><input id="contactFormAddress" type="text" value="${escapeHTML(contact?.address || "")}" autocomplete="street-address" /></div>
        <label class="swl-primary-contact-toggle">
          <input id="contactFormPrimary" type="checkbox" ${contact?.isPrimary ? "checked" : ""} />
          <span>Make primary contact</span>
        </label>
        <div class="swl-contact-form-actions">
          <button class="primary-button full-width" type="button" onclick="saveContactForm('${encodeURIComponent(client.key)}','${contact?.id ? encodeURIComponent(contact.id) : ""}')">${editing ? "Save Changes" : "Add Contact"}</button>
          ${editing ? `<button class="danger-button full-width" type="button" onclick="deleteContact('${encodeURIComponent(client.key)}','${encodeURIComponent(contact.id)}')">Delete Contact</button>` : ""}
        </div>
      </div>
    </div>`;
}

function openAddContactModal(encodedClientKey) {
  const client = findClientByKey(decodeURIComponent(encodedClientKey));
  if (!client) return;
  document.getElementById("modalRoot").innerHTML = contactFormHTML(client);
}

function openEditContactModal(encodedClientKey, encodedContactId) {
  const client = findClientByKey(decodeURIComponent(encodedClientKey));
  const contact = client?.contacts?.find(item => item.id === decodeURIComponent(encodedContactId));
  if (!client || !contact) return;
  document.getElementById("modalRoot").innerHTML = contactFormHTML(client, contact);
}

async function saveContactForm(encodedClientKey, encodedContactId = "") {
  let client = findClientByKey(decodeURIComponent(encodedClientKey));
  if (!client) return;
  const contactId = encodedContactId ? decodeURIComponent(encodedContactId) : "";
  const contact = {
    name: normalizeClientText(document.getElementById("contactFormName")?.value),
    phone: normalizeClientText(document.getElementById("contactFormPhone")?.value),
    email: normalizeClientText(document.getElementById("contactFormEmail")?.value),
    address: normalizeClientText(document.getElementById("contactFormAddress")?.value),
    isPrimary: Boolean(document.getElementById("contactFormPrimary")?.checked)
  };
  try {
    client = await ensurePersistedClient(client);
    const response = await apiRequest(
      contactId
        ? `clients/${encodeURIComponent(client.id)}/contacts/${encodeURIComponent(contactId)}`
        : `clients/${encodeURIComponent(client.id)}/contacts`,
      { method: contactId ? "PUT" : "POST", body: JSON.stringify(contact) }
    );
    const index = state.clients.findIndex(item => item.id === client.id);
    if (index >= 0) state.clients[index] = response.client;
    closeModal();
    showSWLToast(contactId ? "Contact updated" : "Contact added");
    renderClientDetail();
  } catch (err) {
    alert(`Could not save that contact. ${err.message}`);
  }
}

async function deleteContact(encodedClientKey, encodedContactId) {
  let client = findClientByKey(decodeURIComponent(encodedClientKey));
  if (!client?.id) return;
  const contactId = decodeURIComponent(encodedContactId);
  const contact = client.contacts?.find(item => item.id === contactId);
  if (!confirm(`Delete ${contact?.name || "this contact"}? This cannot be undone.`)) return;
  try {
    const response = await apiRequest(`clients/${encodeURIComponent(client.id)}/contacts/${encodeURIComponent(contactId)}`, { method: "DELETE" });
    const index = state.clients.findIndex(item => item.id === client.id);
    if (index >= 0) state.clients[index] = response.client;
    closeModal();
    showSWLToast("Contact deleted");
    renderClientDetail();
  } catch (err) {
    alert(`Could not delete that contact. ${err.message}`);
  }
}

function clientEventCardHTML(event) {
  return `
    <button
      class="card swl-client-event-card tap-card"
      onclick="openEvent('${event.id}')"
    >
      <span>
        <strong>${escapeHTML(event.name || "Event")}</strong>
        <small>
          ${escapeHTML(formatDate(event.date))}
          ${event.package ? ` · ${escapeHTML(event.package)}` : ""}
        </small>
      </span>

      <span class="swl-client-chevron">›</span>
    </button>
  `;
}

function formatClientPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return local.length === 10 ? `(${local.slice(0,3)}) ${local.slice(3,6)}-${local.slice(6)}` : String(value || "");
}

function clientContactCardHTML(client, contact) {
  const phoneHref = normalizedClientPhone(contact.phone);
  const hasDetails = contact.phone || contact.email || contact.address;
  return `
    <div class="card swl-contact-card">
      <div class="swl-contact-card-top">
        <div class="swl-contact-heading">
          <strong>${escapeHTML(contact.name || "Contact")}</strong>
          ${contact.isPrimary ? `<span class="swl-primary-pill">PRIMARY</span>` : ""}
        </div>
        <button class="swl-contact-edit" type="button" onclick="openEditContactModal('${encodeURIComponent(client.key)}','${encodeURIComponent(contact.id)}')">Edit</button>
      </div>
      ${hasDetails ? `<div class="swl-contact-details">
        ${contact.phone ? `<div><span>Phone</span><strong>${escapeHTML(formatClientPhone(contact.phone))}</strong></div>` : ""}
        ${contact.email ? `<div><span>Email</span><strong>${escapeHTML(contact.email)}</strong></div>` : ""}
        ${contact.address ? `<div><span>Address</span><strong>${escapeHTML(contact.address)}</strong></div>` : ""}
      </div>` : `<div class="swl-contact-empty-detail">No contact details added yet.</div>`}
      ${(phoneHref || contact.email) ? `<div class="swl-client-actions compact">
        ${phoneHref ? `<a href="sms:${escapeHTML(phoneHref)}">Text</a><a href="tel:${escapeHTML(phoneHref)}">Call</a>` : ""}
        ${contact.email ? `<a href="mailto:${escapeHTML(contact.email)}">Email</a>` : ""}
      </div>` : ""}
    </div>`;
}

async function loadClientNotes(clientKey, force = false) {
  if (
    !force &&
    clientNotesCache.has(clientKey)
  ) {
    return clientNotesCache.get(clientKey);
  }

  const response =
    await apiRequest(
      `client-notes/${encodeURIComponent(clientKey)}`
    );

  const notes = response.notes || [];
  clientNotesCache.set(clientKey, notes);
  return notes;
}

function clientNotesHTML(notes) {
  if (!notes.length) {
    return `
      <div class="swl-client-notes-empty">
        No client notes yet.
      </div>
    `;
  }

  return notes
    .map(note => `
      <div class="swl-client-note">
        <div>${escapeHTML(note.text)}</div>

        <div class="swl-client-note-bottom">
          <small>
            ${new Date(note.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric"
              }
            )}
          </small>

          <button
            type="button"
            onclick="deleteClientNote(
              '${encodeURIComponent(note.clientKey)}',
              '${encodeURIComponent(note.id)}'
            )"
          >
            Delete
          </button>
        </div>
      </div>
    `)
    .join("");
}

async function renderClientDetail() {
  const client =
    findClientByKey(currentClientKey);

  if (!client) {
    navigate("clients");
    return;
  }

  setHeader("Client");

  const main =
    document.getElementById("mainContent");

  const upcoming =
    clientUpcomingEvents(client);

  const past =
    clientPastEvents(client);

  const contacts =
    client.contacts || [];

  main.innerHTML = `
    <button
      class="swl-client-back"
      type="button"
      onclick="navigate('clients')"
    >
      ‹ Clients
    </button>

    <section class="card swl-client-profile">
      <div class="swl-client-profile-top">
        <span class="swl-client-avatar large">
          ${escapeHTML(
            client.name.charAt(0).toUpperCase()
          )}
        </span>

        <div>
          <h2>${escapeHTML(client.name)}</h2>
          <p>
            ${client.type === "organization" ? "Organization" : "Client"}
            · ${contacts.length}
            ${contacts.length === 1 ? "contact" : "contacts"}
            · ${(client.events || []).length}
            ${(client.events || []).length === 1 ? "event" : "events"}
          </p>
        </div>
      </div>
    </section>

    <section class="swl-client-section">
      <div class="swl-client-section-heading">
        <h2>Contacts</h2>

        <button
          class="swl-section-action"
          type="button"
          onclick="openAddContactModal('${encodeURIComponent(client.key)}')"
        >
          + Add Contact
        </button>
      </div>

      <div class="swl-client-list">
        ${
          contacts.length
            ? contacts
                .map(contact =>
                  clientContactCardHTML(client, contact)
                )
                .join("")
            : `
              <div class="card empty-card swl-small-empty">
                <strong>No contacts yet.</strong>
                <p>Add anyone you may need to call, text, or email for this client.</p>
              </div>
            `
        }
      </div>
    </section>

    ${upcoming.length
      ? `
        <section class="swl-client-section">
          <div class="swl-client-section-heading">
            <h2>Upcoming Events</h2>
            <span>${upcoming.length}</span>
          </div>

          <div class="swl-client-list">
            ${upcoming.map(clientEventCardHTML).join("")}
          </div>
        </section>
      `
      : ""}

    ${past.length
      ? `
        <section class="swl-client-section">
          <div class="swl-client-section-heading">
            <h2>Past Events</h2>
            <span>${past.length}</span>
          </div>

          <div class="swl-client-list">
            ${past.map(clientEventCardHTML).join("")}
          </div>
        </section>
      `
      : ""}

    <section class="swl-client-section">
      <div class="swl-client-section-heading">
        <h2>Client Notes</h2>
      </div>

      <div class="card swl-client-note-compose">
        <textarea
          id="clientNoteText"
          placeholder="Anything worth remembering about this client?"
        ></textarea>

        <button
          class="primary-button"
          type="button"
          onclick="saveClientNote('${encodeURIComponent(client.key)}')"
        >
          Add Note
        </button>
      </div>

      <div
        id="clientNotesList"
        class="swl-client-notes-list"
      >
        <div class="swl-client-notes-empty">
          Loading notes…
        </div>
      </div>
    </section>
  `;

  try {
    const notes =
      await loadClientNotes(client.key);

    if (
      currentScreen !== "client-detail" ||
      currentClientKey !== client.key
    ) {
      return;
    }

    const list =
      document.getElementById("clientNotesList");

    if (list) {
      list.innerHTML =
        clientNotesHTML(notes);
    }
  } catch (err) {
    const list =
      document.getElementById("clientNotesList");

    if (list) {
      list.innerHTML = `
        <div class="status-banner warning">
          Could not load client notes.
        </div>
      `;
    }
  }
}

async function saveClientNote(encodedClientKey) {
  const clientKey =
    decodeURIComponent(encodedClientKey);

  const input =
    document.getElementById("clientNoteText");

  const text =
    normalizeClientText(input?.value);

  if (!text) return;

  try {
    await apiRequest(
      `client-notes/${encodeURIComponent(clientKey)}`,
      {
        method: "POST",
        body: JSON.stringify({ text })
      }
    );

    if (input) input.value = "";

    await loadClientNotes(clientKey, true);

    showSWLToast("Client note saved");
    renderClientDetail();
  } catch (err) {
    alert(`Could not save that note. ${err.message}`);
  }
}

async function deleteClientNote(
  encodedClientKey,
  encodedNoteId
) {
  const clientKey =
    decodeURIComponent(encodedClientKey);

  const noteId =
    decodeURIComponent(encodedNoteId);

  if (!confirm("Delete this client note?")) {
    return;
  }

  try {
    await apiRequest(
      `client-notes/${encodeURIComponent(clientKey)}/${encodeURIComponent(noteId)}`,
      { method: "DELETE" }
    );

    await loadClientNotes(clientKey, true);
    renderClientDetail();
  } catch (err) {
    alert(`Could not delete that note. ${err.message}`);
  }
}


/* =========================================================
   EVENTS
========================================================= */

function renderEvents() {
  setHeader("Events");

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
        <strong>No events yet.</strong>

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
  activeEventTab = "info";

  render();
   window.scrollTo({
  top: 0,
  left: 0,
  behavior: "instant"
});
}
function setEventTab(tab) {
  activeEventTab = tab;
  renderEventDetail();
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

  const reminders =
    getEventReminders(event.id);

  const days =
    daysUntil(event.date);

  const nonPlushReservations =
  (event.reservations || [])
    .filter(
      reservation => {
        const item =
          getInventoryItem(
            reservation.itemId
          );

        return (
          item &&
          item.category !== "Plush"
        );
      }
    );

  const mapUrl =
    event.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
      : "";

  const phoneHref =
    event.hostPhone
      ? String(event.hostPhone)
          .replace(/[^\d+]/g, "")
      : "";

  event.packing ||=
    masterPackingList.map(
      item => ({
        id: makeId("pack"),
        name: item,
        done: false
      })
    );

  ensureEventLoadOut(event);

  const loadOut =
    buildEventLoadOut(event);

  const loadOutSummary =
    loadOutCounts(event);

  const packingDone =
    loadOutSummary.loaded;

  const packingTotal =
    loadOutSummary.total;

  const packingComplete =
    packingTotal > 0 &&
    packingDone === packingTotal &&
    loadOutSummary.shortages.length === 0;

  let html = `
    <button
      class="back-button"
      onclick="navigate('events')"
    >
      ← Events
    </button>

    <div class="event-top-card">

      <div class="event-top-copy">

        <div class="card-label">
          ${
            event.eventType
              ? escapeHTML(event.eventType)
              : "Event"
          }
        </div>

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

      </div>

      <div class="meta-row">

        ${
          days !== null
            ? `
                <span class="pill">
                  ${
                    days === 0
                      ? "Today"
                      : days < 0
                        ? "Past event"
                        : `${days} days`
                  }
                </span>
              `
            : ""
        }

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


    <div
      class="event-tabs"
      role="tablist"
      aria-label="Event sections"
    >

      <button
        class="
          event-tab
          ${
            activeEventTab === "info"
              ? "active"
              : ""
          }
        "
        onclick="setEventTab('info')"
        role="tab"
        aria-selected="${
          activeEventTab === "info"
        }"
      >

        <span class="event-tab-icon">
          ♥
        </span>

        <span>
          Info
        </span>

      </button>


      <button
        class="
          event-tab
          ${
            activeEventTab === "prep"
              ? "active"
              : ""
          }
        "
        onclick="setEventTab('prep')"
        role="tab"
        aria-selected="${
          activeEventTab === "prep"
        }"
      >

        <span class="event-tab-icon">
          ✦
        </span>

        <span>
          Prep
        </span>

        ${
          issues.length
            ? `
                <span class="event-tab-badge">
                  ${issues.length}
                </span>
              `
            : ""
        }

      </button>


      <button
        class="
          event-tab
          ${
            activeEventTab === "pack"
              ? "active"
              : ""
          }
        "
        onclick="setEventTab('pack')"
        role="tab"
        aria-selected="${
          activeEventTab === "pack"
        }"
      >

        <span class="event-tab-icon">
          ✓
        </span>

        <span>
          Pack
        </span>

        <span class="event-tab-count">
          ${packingDone}/${packingTotal}
        </span>

      </button>

    </div>


    <div class="event-tab-panel">
  `;


  /*
     INFO TAB
  */

  if (activeEventTab === "info") {

    html += `
      <div class="event-section-heading">

        <div>

          <div class="card-label">
            Event details
          </div>

          <h3>
            The basics
          </h3>

        </div>

        <button
          class="secondary-button compact-button"
          onclick="
            openEditEvent(
              '${event.id}'
            )
          "
        >
          Edit
        </button>

      </div>


      <div
        class="
          card
          detail-card
          event-info-card
        "
      >

        <div class="detail-row">

          <span>
            Location
          </span>

          <strong>
            ${escapeHTML(
              event.address ||
              "Not added"
            )}
          </strong>

        </div>


        <div class="detail-row">

          <span>
            Host
          </span>

          <strong>
            ${escapeHTML(
              event.hostName ||
              "Not added"
            )}
          </strong>

        </div>


        <div class="detail-row">

          <span>
            Guests
          </span>

          <strong>
            ${
              event.guestCount ||
              "Not added"
            }
          </strong>

        </div>


        <div class="detail-row">

          <span>
            Package
          </span>

          <strong>
            ${escapeHTML(
              event.package ||
              "Not added"
            )}
          </strong>

        </div>

      </div>
    `;


    if (
      mapUrl ||
      phoneHref ||
      event.hostEmail
    ) {

      html += `
        <div class="event-action-grid">
      `;

      if (mapUrl) {
        html += `
          <a
            class="event-action-button"
            href="${escapeHTML(mapUrl)}"
            target="_blank"
            rel="noopener"
          >
            <span>⌖</span>
            Maps
          </a>
        `;
      }

      if (phoneHref) {
        html += `
          <a
            class="event-action-button"
            href="tel:${escapeHTML(phoneHref)}"
          >
            <span>☎</span>
            Call
          </a>

          <a
            class="event-action-button"
            href="sms:${escapeHTML(phoneHref)}"
          >
            <span>✉</span>
            Text
          </a>
        `;
      }

      if (event.hostEmail) {
        html += `
          <a
            class="event-action-button"
            href="mailto:${escapeHTML(
              event.hostEmail
            )}"
          >
            <span>＠</span>
            Email
          </a>
        `;
      }

      html += `
        </div>
      `;
    }


    html += `
      <div class="event-section-heading">

        <div>

          <div class="card-label">
            Money
          </div>

          <h3>
            Payment
          </h3>

        </div>

      </div>


      <div class="card detail-card">

        <div class="detail-row">

          <span>
            Total
          </span>

          <strong>
            ${money(event.total)}
          </strong>

        </div>


        <div class="detail-row">

          <span>
            Deposit
          </span>

          <strong>

            ${
              event.depositPaid
                ? `
                    ✓
                    ${money(
                      event.depositAmount
                    )}
                    received
                  `
                : "Not received"
            }

          </strong>

        </div>


        <div class="detail-row">

          <span>
            Remaining
          </span>

          <strong>
            ${money(event.balanceDue)}
          </strong>

        </div>

      </div>


      <div class="event-section-heading">

        <div>

          <div class="card-label">
            Don't forget
          </div>

          <h3>
            Reminders
          </h3>

        </div>

        <button
          class="secondary-button compact-button"
          onclick="
            addEventReminder(
              '${event.id}'
            )
          "
        >
          + Add
        </button>

      </div>


      <div class="card detail-card">
    `;


    if (!reminders.length) {

      html += `
        <div class="event-empty-mini">
          Nothing to remember for
          this event yet.
        </div>
      `;

    } else {

      reminders.forEach(
        reminder => {

          html += `
            <div class="attention-row">

              <div>

                <strong>
                  ${escapeHTML(
                    reminder.title
                  )}
                </strong>

                ${
                  reminder.remindBy
                    ? `
                        <div class="muted">
                          Due
                          ${escapeHTML(
                            formatReminderDue(
                              reminder.remindBy
                            )
                          )}
                        </div>
                      `
                    : ""
                }

              </div>

              <button
                class="
                  reminder-done-button
                "
                onclick="
                  completeReminder(
                    '${reminder.id}'
                  )
                "
                aria-label="
                  Complete reminder
                "
              >
                ✓
              </button>

            </div>
          `;
        }
      );
    }


    html += `
      </div>


      <div class="event-section-heading">

        <div>

          <div class="card-label">
            Reference
          </div>

          <h3>
            Notes
          </h3>

        </div>

      </div>


      <div
        class="
          card
          detail-card
          event-notes-card
        "
      >

        ${
          event.eventNotes
            ? `
                <div
                  style="
                    white-space:
                    pre-wrap;
                  "
                >
                  ${escapeHTML(
                    event.eventNotes
                  )}
                </div>
              `
            : `
                <div
                  class="
                    event-empty-mini
                  "
                >
                  No notes added.
                </div>
              `
        }

      </div>


      <div class="event-section-heading">

        <div>

          <div class="card-label">
            After the event
          </div>

          <h3>
            Closeout
          </h3>

        </div>

      </div>


      <div class="card detail-card">

        ${
          event.closed
            ? `
                <div
                  class="
                    event-complete-message
                  "
                >
                  ✓ Event closed out
                </div>
              `
            : `
                <div
                  class="
                    event-empty-mini
                  "
                >
                  Final counts,
                  inventory reconciliation
                  and completion will live
                  here.
                </div>
              `
        }

      </div>


      <button
        class="event-delete-button"
        onclick="
          deleteEvent(
            '${event.id}'
          )
        "
      >
        Delete Event
      </button>
    `;
  }


  /*
     PREP TAB
  */

  if (activeEventTab === "prep") {

    if (issues.length) {

      html += `
        <div class="prep-alert-card">

          <div class="prep-alert-icon">
            !
          </div>

          <div>

            <strong>
              Needs attention
            </strong>

            <div class="muted">
              ${issues.length}
              thing${
                issues.length === 1
                  ? ""
                  : "s"
              }
              to fix before this event.
            </div>

          </div>

        </div>


        <div
          class="
            card
            detail-card
            prep-issues-card
          "
        >
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
      `;

    } else {

      html += `
        <div class="prep-ready-card">

          <div class="prep-ready-icon">
            ♥
          </div>

          <div>

            <strong>
              Prep is looking good.
            </strong>

            <div class="muted">
              Nothing is currently
              blocking this event.
            </div>

          </div>

        </div>
      `;
    }


    html += `
      <div class="event-section-heading">

        <div>

          <div class="card-label">
            Get ready
          </div>

          <h3>
            Plush
          </h3>

        </div>

      </div>


      <div class="card detail-card">
    `;


    if (event.selectedPlush?.length) {

      event.selectedPlush.forEach(
        plushId => {

          const plushName =
  getEventPlushName(plushId);

          const reservation =
            event.reservations?.find(
              r =>
                r.itemId === plushId
            );

          html += `
            <div
              class="
                requirement-row
                prep-requirement-row
              "
            >

              <div>

                <strong>
                  ${escapeHTML(plushName)}
                </strong>

                <div class="muted">
                  Guest count +
                  2 backups
                </div>

              </div>

              <span
                class="
                  prep-quantity
                "
              >
                ${
                  reservation?.quantity ||
                  0
                }
              </span>

            </div>
          `;
        }
      );

    } else {

      html += `
        <div class="event-empty-mini">
          No plush selected yet.
        </div>
      `;
    }


    html += `
      </div>


      <div class="event-section-heading">

        <div>

          <div class="card-label">
            Pull from inventory
          </div>

          <h3>
            Supplies & extras
          </h3>

        </div>

      </div>


      <div class="card detail-card">
    `;


    if (nonPlushReservations.length) {

      nonPlushReservations.forEach(
        reservation => {

          const item =
            getInventoryItem(
              reservation.itemId
            );

          if (!item) return;

          html += `
            <div
              class="
                requirement-row
                prep-requirement-row
              "
            >

              <strong>
                ${escapeHTML(
                  item.name
                )}
              </strong>

              <span
                class="
                  prep-quantity
                "
              >
                ${
                  reservation.quantity
                }
              </span>

            </div>
          `;
        }
      );

    } else {

      html += `
        <div class="event-empty-mini">
          No extra supplies reserved.
        </div>
      `;
    }


    html += `
      </div>


      <div class="event-section-heading">

        <div>

          <div class="card-label">
            Special stuff
          </div>

          <h3>
            Custom requirements
          </h3>

        </div>

      </div>


      <div
        class="
          card
          detail-card
          event-notes-card
        "
      >

        ${
          event.customRequirements
            ? `
                <div
                  style="
                    white-space:
                    pre-wrap;
                  "
                >
                  ${escapeHTML(
                    event.customRequirements
                  )}
                </div>
              `
            : `
                <div
                  class="
                    event-empty-mini
                  "
                >
                  Nothing custom added
                  for this event.
                </div>
              `
        }

      </div>


      <button
        class="
          secondary-button
          full-width
        "
        onclick="
          openEditEvent(
            '${event.id}'
          )
        "
        style="
          margin-top:16px;
        "
      >
        Edit Event Requirements
      </button>
    `;
  }


  /*
     PACK / INTELLIGENT LOAD OUT TAB
  */

  if (activeEventTab === "pack") {

    const total =
      loadOutSummary.total;

    const packed =
      loadOutSummary.packed;

    const packableTotal =
      loadOutSummary.packableTotal;

    const loaded =
      loadOutSummary.loaded;

    const shortages =
      loadOutSummary.shortages;

    const percentLoaded =
      total
        ? Math.round(
            (loaded / total) * 100
          )
        : 0;

    const ready =
      total > 0 &&
      loaded === total &&
      shortages.length === 0;

    const allPacked =
      packableTotal > 0 &&
      packed === packableTotal;

    html += `
      <div class="loadout-hero ${ready ? "ready" : ""}">
        <div class="loadout-hero-top">
          <div>
            <h3>
              ${
                ready
                  ? "Ready to roll 💛"
                  : allPacked
                    ? "Packed. Now load the fluff-mobile."
                    : "Let’s get this event out the door."
              }
            </h3>
          </div>

          <div class="loadout-ring">
            <strong>${percentLoaded}%</strong>
            <span>loaded</span>
          </div>
        </div>

        <div class="loadout-progress-track">
          <div
            class="loadout-progress-packed"
            style="width:${packableTotal ? Math.round((packed / packableTotal) * 100) : 0}%"
          ></div>
          <div
            class="loadout-progress-loaded"
            style="width:${percentLoaded}%"
          ></div>
        </div>

        <div class="loadout-progress-labels">
          <span><strong>${packed}</strong>/${packableTotal} packable items packed</span>
          <span><strong>${loaded}</strong>/${total} loaded</span>
        </div>
      </div>

      ${
        shortages.length
          ? `
              <div class="loadout-readiness warning">
                <div class="loadout-readiness-icon">!</div>
                <div>
                  <strong>${shortages.length} ${shortages.length === 1 ? "thing needs" : "things need"} attention</strong>
                  <span>Ops found ${shortages.length === 1 ? "a shortage" : "shortages"} before you started loading. Very rude of inventory, very helpful of Ops.</span>
                </div>
              </div>
            `
          : `
              <div class="loadout-readiness ${ready ? "ready" : ""}">
                <div class="loadout-readiness-icon">${ready ? "♥" : "✓"}</div>
                <div>
                  <strong>${ready ? "FULLY LOADED" : "Inventory check looks good"}</strong>
                  <span>${ready ? "Every planned item is accounted for and in the fluff-mobile." : "No reservation shortages detected for this event."}</span>
                </div>
              </div>
            `
      }

      <div class="event-section-heading loadout-heading">
        <div>
          <div class="card-label">Event-specific</div>
          <h3>Friends & supplies</h3>
        </div>
        <span class="loadout-section-count">${loadOut.inventoryRows.length}</span>
      </div>

      <form class="event-pack-add" onsubmit="addEventPackInventory(event, '${event.id}')">
        <label for="pack-item-${event.id}">Add inventory to this event only</label>
        <div class="event-pack-add-controls">
          <select id="pack-item-${event.id}" name="itemId" required>
            <option value="">Choose an inventory item…</option>
            ${state.inventory
              .filter(item => !loadOut.inventoryRows.some(row => row.itemId === item.id))
              .map(item => `<option value="${escapeHTML(item.id)}">${escapeHTML(inventoryDisplayName(item))}</option>`)
              .join("")}
          </select>
          <input type="number" name="quantity" min="1" step="1" value="1" aria-label="Quantity" required />
          <button type="submit">Add</button>
        </div>
      </form>

      <div class="card loadout-list-card">
        ${
          loadOut.inventoryRows.length
            ? loadOut.inventoryRows
                .map(row => loadOutRowHTML(row, event.id))
                .join("")
            : `
                <div class="loadout-empty">
                  No inventory quantities are attached to this event yet.
                </div>
              `
        }
      </div>

      <div class="event-section-heading loadout-heading">
        <div>
          <div class="card-label">The actual stuff</div>
          <h3>Equipment & setup</h3>
        </div>
        <span class="loadout-section-count">${loadOut.gearRows.length}</span>
      </div>

      <div class="card loadout-list-card">
        ${loadOut.gearRows
          .map(row => loadOutRowHTML(row, event.id))
          .join("")}
      </div>

      ${
        ready
          ? `
              <div class="loadout-ready-card">
                <div class="loadout-ready-sparkles" aria-hidden="true">✦ ♥ ✦</div>
                <strong>READY TO ROLL!</strong>
                <span>The fluff-mobile is cleared for departure.</span>
                <small>Everything planned for this event is loaded.</small>
              </div>
            `
          : ""
      }
    `;
  }


  html += `
    </div>
  `;

  main.innerHTML = html;
}
async function addEventPackInventory(formEvent, eventId) {
  formEvent.preventDefault();
  const form = formEvent.currentTarget;
  const event = state.events.find(item => item.id === eventId);
  if (!event) return;
  const itemId = form.elements.itemId.value;
  const quantity = Number(form.elements.quantity.value);
  if (!getInventoryItem(itemId) || !Number.isSafeInteger(quantity) || quantity < 1) return;
  const previous = structuredClone(event.extraPackInventory || []);
  event.extraPackInventory ||= [];
  if (buildEventLoadOut(event).inventoryRows.some(row => row.itemId === itemId)) return;
  event.extraPackInventory.push({ itemId, quantity });
  renderEventDetail();
  try {
    await saveEventToServer(event);
  } catch (err) {
    event.extraPackInventory = previous;
    renderEventDetail();
    alert(`Could not add the item. ${err.message}`);
  }
}

async function togglePacking(
  eventId,
  packingId,
  checked
) {
  const event =
    state.events.find(
      e => e.id === eventId
    );

  if (!event) return;

  const item =
    event.packing.find(
      item => item.id === packingId
    );

  if (!item) return;

  const previous = item.done;

  const wasComplete =
    event.packing.length > 0 &&
    event.packing.every(item => item.done);

  item.done = checked;

  const isComplete =
    event.packing.length > 0 &&
    event.packing.every(item => item.done);

  updateAttentionBadge();

  /*
     Immediate feedback.

     iOS PWAs don't give us true native haptics,
     but vibration works where supported.
  */

  if (checked) {

    if (isComplete && !wasComplete) {

      if ("vibrate" in navigator) {
        navigator.vibrate([
          55,
          45,
          90,
          45,
          150
        ]);
      }

    } else {

      if ("vibrate" in navigator) {
        navigator.vibrate(35);
      }

    }
  }


  /*
     Re-render immediately so:
     0/17 → 1/17
     percentage changes
     progress bar moves
     checked row gets its done styling
  */

  renderEventDetail();


  /*
     Completion celebration happens only
     when the LAST unchecked item is checked.
  */

  if (
    checked &&
    isComplete &&
    !wasComplete
  ) {
    requestAnimationFrame(() => {
      celebratePackingComplete();
    });
  } else if (checked) {
    requestAnimationFrame(() => {
      animatePackingTap(packingId);
    });
  }


  try {

    await saveEventToServer(event);

  } catch (err) {

    item.done = previous;

    renderEventDetail();

    alert(
      `Could not save that packing change. ${err.message}`
    );
  }
}
function animatePackingTap(packingId) {
  const row =
    document.querySelector(
      `[data-packing-id="${packingId}"]`
    );

  if (!row) return;

  row.classList.add("just-packed");

  setTimeout(() => {
    row.classList.remove("just-packed");
  }, 420);
}


function celebratePackingComplete() {
  document.querySelectorAll(".swl-pack-finale, .pack-heart-burst").forEach(node => node.remove());

  const card = document.querySelector(".pack-progress-card");
  const list = document.querySelector(".pack-list-card");
  const done = document.querySelector(".pack-done-message");

  [card, list, done].forEach(element => {
    if (!element) return;
    element.classList.remove("pack-celebration", "pack-list-complete-pop", "pack-done-pop");
    void element.offsetWidth;
  });

  if (card) card.classList.add("pack-celebration");
  if (list) list.classList.add("pack-list-complete-pop");
  if (done) done.classList.add("pack-done-pop");

  const finale = document.createElement("div");
  finale.className = "swl-pack-finale";
  finale.setAttribute("role", "status");
  finale.setAttribute("aria-live", "polite");

  const symbols = ["♥", "✦", "●", "♥", "✧", "●", "♥", "★"];
  const particles = Array.from({ length: 58 }, (_, index) => {
    const angle = (index / 58) * Math.PI * 2 + ((index % 7) * 0.13);
    const distance = 150 + ((index * 47) % 330);
    const x = Math.round(Math.cos(angle) * distance);
    const y = Math.round(Math.sin(angle) * distance - 35);
    const delay = (index % 11) * 0.025;
    const spin = -220 + ((index * 83) % 440);
    const size = 10 + ((index * 7) % 19);
    const symbol = symbols[index % symbols.length];
    const fluffClass = symbol === "●" ? " fluff" : "";
    return `<span class="swl-finale-particle${fluffClass}" style="--x:${x}px;--y:${y}px;--delay:${delay}s;--spin:${spin}deg;--size:${size}px">${symbol}</span>`;
  }).join("");

  finale.innerHTML = `
    <div class="swl-finale-glow"></div>
    <div class="swl-finale-particles" aria-hidden="true">${particles}</div>
    <div class="swl-finale-card">
      <div class="swl-finale-kicker">LOAD OUT COMPLETE</div>
      <div class="swl-finale-title">READY TO ROLL!</div>
      <div class="swl-finale-heart">♥</div>
      <div class="swl-finale-copy">${SWL_LOADOUT_FINALE_LINES[swlHash(`${currentEventId || "swl"}-loadout`) % SWL_LOADOUT_FINALE_LINES.length]}</div>
    </div>
  `;

  document.body.appendChild(finale);

  requestAnimationFrame(() => {
    finale.classList.add("show");
  });

  setTimeout(() => {
    finale.classList.add("leaving");
  }, 2350);

  setTimeout(() => {
    finale.remove();
  }, 2850);
}

async function deleteEvent(id) {
  if (
    !confirm(
      "Delete this event?"
    )
  ) {
    return;
  }

  try {
    await deleteEventFromServer(id);
  } catch (err) {
    alert(
      `Could not delete that event. ${err.message}`
    );

    return;
  }

  state.events =
    state.events.filter(
      event => event.id !== id
    );

  state.attention =
    state.attention.filter(
      reminder => reminder.eventId !== id
    );

  navigate("events");
}


/* =========================================================
   INVENTORY
========================================================= */

function renderInventory() {
  setHeader("Inventory");

  const main =
    document.getElementById("mainContent");

  const categories = [
    "Plush",
    "Outfits",
    "Supplies",
    "Shirts",
    "All"
  ];

  const hasShortage =
    state.inventory.some(
      item =>
        inventoryAvailable(item.id) < 0
    );

  let html = `
    ${
      hasShortage
        ? `
          <div class="status-banner warning">
            Some future events need more stock than you currently have.
          </div>
        `
        : ""
    }

    <div class="inventory-toolbar">

      <div class="inventory-search-wrap">
        <span class="inventory-search-icon">⌕</span>

        <input
          id="inventorySearch"
          class="inventory-search"
          type="search"
          value="${escapeHTML(inventorySearch)}"
          placeholder="Search inventory..."
          oninput="
            inventorySearch = this.value;
            filterInventoryRows();
          "
        />
      </div>

      <div class="inventory-category-tabs">
        ${categories
          .map(
            category => `
              <button
                class="inventory-category-tab ${
                  activeInventoryCategory === category
                    ? "active"
                    : ""
                }"
                data-inventory-category="${category}"
                onclick="setInventoryCategory('${category}')"
              >
                ${category}
              </button>
            `
          )
          .join("")}
      </div>

    </div>
  `;

  const actualCategories = [
    ...new Set(
      state.inventory.map(
        item => item.category
      )
    )
  ];

  actualCategories.forEach(category => {
    const categoryItems =
      state.inventory.filter(
        item =>
          item.category === category
      );

    html += `
      <section
        class="inventory-group"
        data-inventory-group="${escapeHTML(category)}"
      >

        <div class="inventory-group-header">

          <div class="inventory-group-title">
            <h2>
              ${
                category === "Plush"
                  ? "Plush Friends"
                  : escapeHTML(category)
              }
            </h2>

            <span>
              ${categoryItems.length}
            </span>
          </div>

          <button
            class="inventory-add-item-button"
            onclick="openAddInventoryItem('${escapeHTML(category)}')"
          >
            ＋ Add Item
          </button>

        </div>

        <div class="inventory-list-card">
    `;

    categoryItems.forEach(item => {
      const reserved =
        calculateReserved(item.id);

      const available =
        item.onHand - reserved;

      const imageUrl =
        inventoryImageUrl(item);

      const isPlush =
        category === "Plush";

      html += `
        <div
          class="inventory-item-row ${
            isPlush
              ? "inventory-plush-card"
              : "inventory-standard-row"
          }"

          data-inventory-item
          data-inventory-id="${item.id}"
          data-category="${escapeHTML(category)}"

          data-search="${escapeHTML(
            `${
              inventoryDisplayName(item)
            } ${item.name} ${category}`
              .toLowerCase()
          )}"

          onclick="openInventoryItem('${item.id}')"
        >

          <div class="inventory-item-left">

            ${
              isPlush
                ? `
                  <div
                    class="inventory-plush-thumb ${
                      imageUrl
                        ? ""
                        : "inventory-plush-thumb-empty"
                    }"
                  >
                    ${
                      imageUrl
                        ? `
                          <img
                            src="${imageUrl}"
                            alt="${escapeHTML(
                              inventoryDisplayName(item)
                            )}"
                          />
                        `
                        : `
                          <button
                            type="button"
                            class="inventory-add-photo-placeholder"
                            onclick="
                              event.stopPropagation();
                              chooseInventoryPhoto('${item.id}');
                            "
                            aria-label="Add photo"
                          >
                            <span class="inventory-add-photo-plus">
                              ＋
                            </span>

                            <span class="inventory-add-photo-text">
                              Add photo
                            </span>
                          </button>
                        `
                    }
                  </div>
                `
                : inventorySupportsPhoto(item)
                  ? `
                    <div
                      class="
                        inventory-generic-icon
                        inventory-photo-thumb
                        ${
                          imageUrl
                            ? "has-photo"
                            : "inventory-photo-thumb-empty"
                        }
                      "
                    >
                      ${
                        imageUrl
                          ? `
                            <img
                              src="${imageUrl}"
                              alt="${escapeHTML(
                                inventoryDisplayName(item)
                              )}"
                            />
                          `
                          : `
                            <button
                              type="button"
                              class="
                                inventory-add-photo-placeholder
                                inventory-add-photo-small
                              "
                              onclick="
                                event.stopPropagation();
                                chooseInventoryPhoto('${item.id}');
                              "
                              aria-label="Add photo"
                            >
                              <span class="inventory-add-photo-plus">
                                ＋
                              </span>
                            </button>
                          `
                      }
                    </div>
                  `
                  : `
                    <div
                      class="
                        inventory-generic-icon
                        inventory-generic-${category
                          .toLowerCase()
                          .replaceAll(" ", "-")}
                      "
                    >
                      ${inventoryCategoryIcon(category)}
                    </div>
                  `
            }

            <div class="inventory-item-copy">

              <strong>
                ${escapeHTML(
                  inventoryDisplayName(item)
                )}
              </strong>

              ${
                !isPlush
                  ? `
                    <div class="inventory-item-meta">

                      <span>
                        <strong data-inventory-on-hand>
                          ${item.onHand}
                        </strong>
                        on hand
                      </span>

                      <span>
                        <strong data-inventory-reserved>
                          ${reserved}
                        </strong>
                        reserved
                      </span>

                    </div>
                  `
                  : ""
              }

            </div>

          </div>

          ${
            isPlush
              ? `
                <div class="inventory-plush-count-grid">

                  <div class="inventory-plush-count">
                    <strong data-inventory-on-hand>
                      ${item.onHand}
                    </strong>

                    <span>On Hand</span>
                  </div>

                  <div class="inventory-plush-count">
                    <strong data-inventory-reserved>
                      ${reserved}
                    </strong>

                    <span>Reserved</span>
                  </div>

                  <div
                    class="inventory-plush-count ${
                      available < 0
                        ? "short"
                        : ""
                    }"
                  >
                    <strong data-inventory-available>
                      ${available}
                    </strong>

                    <span>Available</span>
                  </div>

                </div>
              `
              : ""
          }

          <div class="inventory-item-right">

            ${
              !isPlush
                ? `
                  <div
                    class="inventory-available ${
                      available < 0
                        ? "short"
                        : ""
                    }"
                  >
                    <strong data-inventory-available>
                      ${available}
                    </strong>

                    <span>available</span>
                  </div>
                `
                : ""
            }

            ${
              isPlush
                ? `
                  <button
                    class="inventory-quick-six"
                    onclick="
                      event.stopPropagation();
                      changeInventoryBy(
                        '${item.id}',
                        6,
                        false
                      );
                    "
                    aria-label="Add six ${escapeHTML(
                      inventoryDisplayName(item)
                    )}"
                  >
                    +6
                  </button>
                `
                : ""
            }

            <span class="inventory-chevron">
              ›
            </span>

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

  filterInventoryRows();
}


function inventoryCategoryIcon(category) {
  switch (category) {
    case "Outfits":
      return "★";

    case "Shirts":
      return "T";

    case "Supplies":
      return "♥";

    default:
      return "•";
  }
}


function setInventoryCategory(category) {
  activeInventoryCategory = category;

  document
    .querySelectorAll(".inventory-category-tab")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.inventoryCategory === category
      );
    });

  filterInventoryRows();
}


function filterInventoryRows() {
  const search =
    String(inventorySearch || "")
      .trim()
      .toLowerCase();

  document
    .querySelectorAll("[data-inventory-item]")
    .forEach(row => {
      const category =
        row.dataset.category;

      const searchable =
        row.dataset.search || "";

      const searchMatch =
        !search ||
        searchable.includes(search);

      const categoryMatch =
        activeInventoryCategory === "All" ||
        category === activeInventoryCategory;

      /*
       * If the user is searching,
       * search ALL inventory.
       *
       * If search is empty,
       * respect the selected tab.
       */
      const shouldShow =
        search
          ? searchMatch
          : categoryMatch;

      row.classList.toggle(
        "hidden",
        !shouldShow
      );
    });

  document
    .querySelectorAll("[data-inventory-group]")
    .forEach(group => {
      const visibleItems =
        group.querySelectorAll(
          "[data-inventory-item]:not(.hidden)"
        );

      group.classList.toggle(
        "hidden",
        visibleItems.length === 0
      );
    });
}
  

function openInventoryItem(itemId) {
  const item =
    getInventoryItem(itemId);

  if (!item) return;

  const plush =
    getPlushMeta(item.id);

  const imageUrl =
    inventoryImageUrl(item);

  const reserved =
    calculateReserved(item.id);

  const available =
    item.onHand - reserved;

  const reservingEvents =
    state.events
      .filter(event => !event.closed)
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

      <div class="modal-sheet inventory-sheet">

        <div class="modal-title-row">

          <div class="inventory-modal-title">

            ${
  inventorySupportsPhoto(item)
    ? `
                  <button
                    type="button"
                    class="
                      inventory-modal-plush
                      ${
                        imageUrl
                          ? ""
                          : "inventory-modal-plush-empty"
                      }
                    "
                    onclick="
                      chooseInventoryPhoto(
                        '${item.id}'
                      )
                    "
                    aria-label="${
                      imageUrl
                        ? "Change photo"
                        : "Add photo"
                    }"
                  >

                    ${
                      imageUrl
                        ? `
                          <img
                            src="${imageUrl}"
                            alt="${escapeHTML(
                              inventoryDisplayName(item)
                            )}"
                          />
                        `
                        : `
                          <div
                            class="
                              inventory-add-photo-placeholder
                            "
                          >
                            <span
                              class="
                                inventory-add-photo-plus
                              "
                            >
                              ＋
                            </span>

                            <span
                              class="
                                inventory-add-photo-text
                              "
                            >
                              Add photo
                            </span>
                          </div>
                        `
                    }

                  </button>
                `
                : ""
            }

            <div>

              <div class="card-label">
                ${escapeHTML(item.category)}
              </div>

              <h2>
                ${escapeHTML(
                  inventoryDisplayName(item)
                )}
              </h2>

              ${
                inventorySupportsPhoto(item) &&
imageUrl
                  ? `
                    <button
                      type="button"
                      class="inventory-change-photo"
                      onclick="
                        chooseInventoryPhoto(
                          '${item.id}'
                        )
                      "
                    >
                      Change photo
                    </button>
                  `
                  : ""
              }

            </div>

          </div>

          <button
            class="modal-close-button"
            onclick="closeModal()"
            aria-label="Close"
          >
            ×
          </button>

        </div>


        <div
          class="inventory-count-summary"
          data-inventory-id="${item.id}"
        >

          <div class="inventory-count-stat">

            <strong data-inventory-on-hand>
              ${item.onHand}
            </strong>

            <span>On Hand</span>

          </div>


          <div class="inventory-count-stat">

            <strong data-inventory-reserved>
              ${reserved}
            </strong>

            <span>Reserved</span>

          </div>


          <div
            class="inventory-count-stat ${
              available < 0
                ? "short"
                : "available"
            }"
          >

            <strong data-inventory-available>
              ${available}
            </strong>

            <span>Available</span>

          </div>

        </div>


        <section class="inventory-adjust-section">

          <h3>Adjust Count</h3>

          <div class="inventory-stepper-card">

            <button
              class="inventory-stepper-button"
              onclick="
                changeInventoryBy(
                  '${item.id}',
                  -1
                )
              "
            >
              −
            </button>

            <div
              class="inventory-stepper-number"
              data-inventory-id="${item.id}"
            >

              <span data-inventory-stepper>
                ${item.onHand}
              </span>

            </div>

            <button
              class="inventory-stepper-button add"
              onclick="
                changeInventoryBy(
                  '${item.id}',
                  1
                )
              "
            >
              +
            </button>

          </div>


          ${
            item.category === "Plush"
              ? `
                <button
                  class="
                    primary-button
                    full-width
                    inventory-add-six
                  "
                  onclick="
                    changeInventoryBy(
                      '${item.id}',
                      6
                    )
                  "
                >
                  + Add 6 Plush
                </button>
              `
              : ""
          }


          <button
            class="inventory-set-exact"
            onclick="
              setInventoryCount(
                '${item.id}'
              )
            "
          >
            Set exact count
          </button>

        </section>


        <section class="inventory-reserved-section">

          <div class="section-heading">
            <h2>Reserved For</h2>
          </div>
  `;


  if (!reservingEvents.length) {

    html += `
      <div class="inventory-none-reserved">
        Nothing currently reserved.
      </div>
    `;

  } else {

    reservingEvents.forEach(
      ({
        event,
        reservation
      }) => {

        html += `
          <button
            class="inventory-reservation-card"
            onclick="
              closeModal();
              openEvent('${event.id}');
            "
          >

            <div>

              <strong>
                ${escapeHTML(event.name)}
              </strong>

              <span>
                ${reservation.quantity}
                reserved ·
                ${formatDate(event.date)}
              </span>

            </div>

            <span>›</span>

          </button>
        `;
      }
    );
  }


  html += `
        </section>

        <button
          class="inventory-delete-button"
          onclick="
            confirmDeleteInventoryItem(
              '${item.id}'
            )
          "
        >
          Delete Item
        </button>

      </div>
    </div>
  `;

  document
    .getElementById("modalRoot")
    .innerHTML = html;
}

function openAddInventoryItem(category) {
  const html = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >

      <div class="modal-sheet inventory-add-sheet">

        <div class="modal-title-row">

          <div>
            <div class="card-label">
              ${escapeHTML(category)}
            </div>

            <h2>Add Inventory Item</h2>
          </div>

          <button
            class="modal-close-button"
            onclick="closeModal()"
            aria-label="Close"
          >
            ×
          </button>

        </div>

        <form
          class="inventory-add-form"
          onsubmit="
            event.preventDefault();
            createInventoryItem(
              '${escapeHTML(category)}',
              this
            );
          "
        >

          <label class="field-label">
            Item Name

            <input
              name="itemName"
              type="text"
              placeholder="${
                category === "Plush"
                  ? "Example: Pink Axolotl"
                  : category === "Outfits"
                  ? "Example: Princess Outfit"
                  : category === "Shirts"
                  ? "Example: Black Plush T-Shirts"
                  : "Example: Wishing Stars"
              }"
              required
              autofocus
            />
          </label>

          <label class="field-label">
            Starting Quantity

            <input
              name="onHand"
              type="number"
              min="0"
              step="1"
              value="0"
              required
            />
          </label>

          <button
            type="submit"
            class="primary-button full-width"
          >
            Add to Inventory
          </button>

        </form>

      </div>
    </div>
  `;

  document.getElementById(
    "modalRoot"
  ).innerHTML = html;
}
function confirmDeleteInventoryItem(itemId) {
  const item =
    state.inventory.find(
      item => item.id === itemId
    );

  if (!item) return;

  const confirmed =
    confirm(
      `Delete "${inventoryDisplayName(item)}" from inventory?\n\nThis cannot be undone.`
    );

  if (!confirmed) return;

  deleteInventoryItem(itemId);
}


async function deleteInventoryItem(itemId) {
  const item =
    state.inventory.find(
      item => item.id === itemId
    );

  if (!item) return;

  try {
    await apiRequest(
      `inventory/${encodeURIComponent(itemId)}`,
      {
        method: "DELETE"
      }
    );

    state.inventory =
      state.inventory.filter(
        item => item.id !== itemId
      );

    closeModal();
    updateAttentionBadge();
    renderInventory();

  } catch (err) {
    alert(
      `Could not delete that item. ${err.message}`
    );
  }
}
async function createInventoryItem(
  category,
  form
) {
  const name =
    form.itemName.value.trim();

  const onHand =
    Math.max(
      0,
      Number(form.onHand.value || 0)
    );

  if (!name) return;

  const button =
    form.querySelector(
      'button[type="submit"]'
    );

  button.disabled = true;
  button.textContent = "Adding...";

  try {
    const response =
      await apiRequest(
        "inventory",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            category,
            onHand
          })
        }
      );

    state.inventory.push(
      response.item
    );

    closeModal();

    activeInventoryCategory =
      category;

    renderInventory();

  } catch (err) {
    button.disabled = false;
    button.textContent =
      "Add to Inventory";

    alert(
      `Could not add that item. ${err.message}`
    );
  }
}
async function changeInventoryBy(
  itemId,
  delta,
  reopenModal = true
) {
  const item =
    getInventoryItem(itemId);

  if (!item) return;

  const previousOnHand =
    item.onHand;

  const nextCount =
    Math.max(
      0,
      Number(item.onHand || 0) +
      Number(delta || 0)
    );

  if (nextCount === previousOnHand) {
    return;
  }

  item.onHand = nextCount;

  try {
    await saveInventoryItemToServer(item);
  } catch (err) {
    item.onHand = previousOnHand;

    alert(
      `Could not save that inventory change. ${err.message}`
    );

    return;
  }

  updateAttentionBadge();
  updateInventoryItemNumbers(itemId);
  animateInventoryCount(itemId, Number(delta || 0));
}
function updateInventoryItemNumbers(itemId) {
  const item =
    getInventoryItem(itemId);

  if (!item) return;

  const reserved =
    calculateReserved(item.id);

  const available =
    item.onHand - reserved;

  document
    .querySelectorAll(
      `[data-inventory-id="${itemId}"]`
    )
    .forEach(element => {

      const onHand =
        element.querySelector(
          "[data-inventory-on-hand]"
        );

      const reservedElement =
        element.querySelector(
          "[data-inventory-reserved]"
        );

      const availableElement =
        element.querySelector(
          "[data-inventory-available]"
        );

      const stepper =
        element.querySelector(
          "[data-inventory-stepper]"
        );

      if (onHand) {
        onHand.textContent =
          item.onHand;
      }

      if (reservedElement) {
        reservedElement.textContent =
          reserved;
      }

      if (availableElement) {
        availableElement.textContent =
          available;
      }

      if (stepper) {
        stepper.textContent =
          item.onHand;
      }
    });
}
   

   
async function setInventoryCount(
  itemId
) {
  const item =
    getInventoryItem(itemId);

  if (!item) return;

  const value =
    prompt(
      `What is the actual physical count of ${item.name}?`,
      item.onHand
    );

  if (value === null) return;

  const number =
    Number(value);

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return;
  }

  const previousOnHand =
    item.onHand;

  item.onHand =
    number;

  try {
    await saveInventoryItemToServer(item);
  } catch (err) {
    item.onHand =
      previousOnHand;

    alert(
      `Could not save that inventory change. ${err.message}`
    );

    return;
  }

  updateAttentionBadge();

  renderInventory();

  openInventoryItem(itemId);
  showSWLToast("Inventory count saved");
}
/* =========================================================
   FILES
========================================================= */

let swlFiles = [];
let fileCategories = [];
let fileFolders = [];

let activeFileCategory = "All";
let activeFileFolderId = null;
let fileSearch = "";
let filesLoaded = false;


/* =========================================================
   FILE DATA
========================================================= */

async function loadFilesData(force = false) {
  if (filesLoaded && !force) {
    return;
  }

  const [
    filesResponse,
    categoriesResponse,
    foldersResponse
  ] = await Promise.all([
    apiRequest("files"),
    apiRequest("file-categories"),
    apiRequest("file-folders")
  ]);

  swlFiles =
    filesResponse.files || [];

  fileCategories =
    categoriesResponse.categories || [];

  fileFolders =
    foldersResponse.folders || [];

  filesLoaded = true;
}


async function renderFiles() {
  setHeader("Files");

  const main =
    document.getElementById(
      "mainContent"
    );

  if (!filesLoaded) {
    main.innerHTML = `
      <div class="files-loading-card">
        Loading files…
      </div>
    `;

    try {
      await loadFilesData();
    } catch (err) {
      main.innerHTML = `
        <div class="status-banner warning">
          Could not load Files.
        </div>

        <div class="card empty-card">
          ${escapeHTML(err.message)}
        </div>
      `;

      return;
    }

    if (currentScreen !== "files") {
      return;
    }
  }

  renderFilesContent();
}


function renderFilesContent() {
  const main =
    document.getElementById(
      "mainContent"
    );

  if (!main) return;

  const search =
    String(fileSearch || "")
      .trim()
      .toLowerCase();

  /*
    Search intentionally ignores the
    selected category.

    No search:
      selected category controls results.

    Search:
      search ALL files.
  */
  const visibleFiles =
    swlFiles.filter(file => {
      const folder =
        fileFolders.find(
          folder => folder.id === file.folderId
        );

      const searchable = `
        ${file.name || ""}
        ${file.originalName || ""}
        ${file.category || ""}
        ${folder?.name || ""}
      `.toLowerCase();

      if (search) {
        return searchable.includes(
          search
        );
      }

      if (
        activeFileCategory === "All"
      ) {
        return true;
      }

      if (
        file.category !==
        activeFileCategory
      ) {
        return false;
      }

      if (activeFileFolderId) {
        return file.folderId === activeFileFolderId;
      }

      return !file.folderId;
    });

  const recentFiles =
    [...swlFiles]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 4);

  let html = `
    <div class="files-toolbar">

      <div class="files-search-wrap">
        <span class="files-search-icon">
          ⌕
        </span>

        <input
          id="filesSearch"
          class="files-search"
          type="search"
          value="${escapeHTML(fileSearch)}"
          placeholder="Search files..."
          oninput="
            fileSearch = this.value;
            renderFilesContent();
          "
        />
      </div>

      <div class="files-actions">

        <button
          class="files-upload-button"
          onclick="openFileUpload()"
        >
          <span>＋</span>
          Upload File
        </button>

        <button
          class="files-category-button"
          onclick="openAddFileCategory()"
        >
          <span>＋</span>
          Category
        </button>

        ${
          activeFileCategory !== "All"
            ? `
              <button
                class="files-category-button files-folder-add-button"
                onclick="openAddFileFolder()"
              >
                <span>＋</span>
                Folder
              </button>
            `
            : ""
        }

      </div>

    </div>


    <div class="file-category-tabs">

      <button
        class="file-category-tab ${
          activeFileCategory === "All"
            ? "active"
            : ""
        }"
        onclick="setFileCategory('All')"
      >
        All
      </button>

      ${fileCategories
        .map(category => `
          <button
            class="file-category-tab ${
              activeFileCategory ===
              category.name
                ? "active"
                : ""
            }"
            onclick="setFileCategory(
  decodeURIComponent(
    '${encodeURIComponent(
      category.name
    )}'
  )
)"
          >
            ${escapeHTML(category.name)}
          </button>
        `)
        .join("")}

    </div>
  `;


  /*
    Recently Added only appears on All
    when we're NOT actively searching.
  */
  if (
    activeFileCategory === "All" &&
    !search &&
    recentFiles.length
  ) {
    html += `
      <section class="files-section">

        <div class="files-section-heading">
          <h2>Recently Added</h2>
        </div>

        <div class="recent-files-row">

          ${recentFiles
            .map(file =>
              recentFileCardHTML(file)
            )
            .join("")}

        </div>

      </section>
    `;
  }


  const activeFolder =
    activeFileFolderId
      ? fileFolders.find(folder => folder.id === activeFileFolderId)
      : null;

  const categoryFolders =
    activeFileCategory !== "All"
      ? fileFolders.filter(folder => folder.category === activeFileCategory)
      : [];

  if (
    !search &&
    activeFileCategory !== "All" &&
    !activeFileFolderId
  ) {
    html += `
      <section class="files-section file-folders-section">
        <div class="files-section-heading">
          <div>
            <h2>Folders</h2>
            <span>${categoryFolders.length} ${categoryFolders.length === 1 ? "folder" : "folders"}</span>
          </div>
        </div>

        ${
          categoryFolders.length
            ? `
              <div class="file-folder-grid">
                ${categoryFolders.map(folder => {
                  const count = swlFiles.filter(file => file.folderId === folder.id).length;
                  return `
                    <button
                      class="file-folder-card"
                      onclick="openFileFolder(decodeURIComponent('${encodeURIComponent(folder.id)}'))"
                    >
                      <span class="file-folder-icon">▰</span>
                      <span class="file-folder-copy">
                        <strong>${escapeHTML(folder.name)}</strong>
                        <small>${count} ${count === 1 ? "file" : "files"}</small>
                      </span>
                      <span class="file-folder-chevron">›</span>
                    </button>
                  `;
                }).join("")}
              </div>
            `
            : `
              <button class="file-folder-empty" onclick="openAddFileFolder()">
                <span>＋</span>
                <strong>Make your first folder</strong>
                <small>Keep this category tidy without adding another layer of chaos.</small>
              </button>
            `
        }
      </section>
    `;
  }

  html += `
    <section class="files-section">

      ${
        activeFolder && !search
          ? `
            <button class="file-folder-back" onclick="closeFileFolder()">
              ‹ ${escapeHTML(activeFileCategory)}
            </button>
            <div class="file-folder-hero">
              <div>
                <span class="file-folder-hero-icon">▰</span>
                <div>
                  <div class="card-label">FOLDER</div>
                  <h2>${escapeHTML(activeFolder.name)}</h2>
                </div>
              </div>
              <button
                class="file-category-menu-button"
                onclick="openFileFolderMenu(decodeURIComponent('${encodeURIComponent(activeFolder.id)}'))"
                aria-label="Folder options"
              >•••</button>
            </div>
          `
          : ""
      }

      <div class="files-section-heading">

        <div>
          <h2>
            ${
              search
                ? "Search Results"
                : activeFileCategory ===
                  "All"
                  ? "All Files"
                  : activeFolder
                    ? "Files in this folder"
                    : escapeHTML(
                        activeFileCategory
                      )
            }
          </h2>

          <span>
            ${visibleFiles.length}
            ${
              visibleFiles.length === 1
                ? "file"
                : "files"
            }
          </span>
        </div>

        ${
          !search &&
          activeFileCategory !== "All" &&
          !activeFileFolderId
            ? `
              <button
                class="file-category-menu-button"
                onclick="openFileCategoryMenu(
  decodeURIComponent(
    '${encodeURIComponent(
      activeFileCategory
    )}'
  )
)"
                aria-label="Category options"
              >
                •••
              </button>
            `
            : ""
        }

      </div>
  `;


  if (!visibleFiles.length) {
    html += `
      <div class="files-empty-state">

        <div class="files-empty-icon">
          ${
            search
              ? "⌕"
              : "▤"
          }
        </div>

        <strong>
          ${
            search
              ? "No files found"
              : "Nothing here yet"
          }
        </strong>

        <p>
          ${
            search
              ? "Try another search."
              : "Upload a file and it’ll show up here."
          }
        </p>

        ${
          !search
            ? `
              <button
                class="primary-button"
                onclick="openFileUpload()"
              >
                + Upload File
              </button>
            `
            : ""
        }

      </div>
    `;
  } else {
    html += `
      <div class="files-list">

        ${visibleFiles
          .map(file =>
            fileRowHTML(file)
          )
          .join("")}

      </div>
    `;
  }


  html += `
    </section>
  `;

  main.innerHTML = html;

  /*
    Keep typing pleasant:
    rerenderFilesContent() replaces
    main.innerHTML, so restore focus
    and cursor position.
  */
  if (search) {
    requestAnimationFrame(() => {
      const input =
        document.getElementById(
          "filesSearch"
        );

      if (!input) return;

      input.focus();

      const length =
        input.value.length;

      try {
        input.setSelectionRange(
          length,
          length
        );
      } catch {}
    });
  }
}


/* =========================================================
   FILE CARDS
========================================================= */

function fileRowHTML(file) {
  const type =
    getFileTypeInfo(file);

  return `
    <button
      class="file-row"
      onclick="openFileDetail(
  decodeURIComponent(
    '${encodeURIComponent(file.id)}'
  )
)"
    >

      ${filePreviewHTML(
        file,
        "row"
      )}

      <div class="file-row-copy">

        <strong>
          ${escapeHTML(file.name)}
        </strong>

        <div class="file-row-meta">

          <span class="file-type-label">
            ${escapeHTML(type.label)}
          </span>

          <span>·</span>

          <span>
            ${formatFileSize(
              file.sizeBytes
            )}
          </span>

        </div>

        <div class="file-row-bottom">

          <span class="file-category-pill">
            ${escapeHTML(
              (
                file.folderId
                  ? fileFolders.find(folder => folder.id === file.folderId)?.name
                  : file.category
              ) || "Other"
            )}
          </span>

          <span class="file-date">
            ${formatFileDate(
              file.createdAt
            )}
          </span>

        </div>

      </div>

      <span class="file-row-chevron">
        ›
      </span>

    </button>
  `;
}


function recentFileCardHTML(file) {
  const type =
    getFileTypeInfo(file);

  return `
    <button
      class="recent-file-card"
      onclick="openFileDetail(
  decodeURIComponent(
    '${encodeURIComponent(file.id)}'
  )
)"
    >

      ${filePreviewHTML(
        file,
        "recent"
      )}

      <strong>
        ${escapeHTML(file.name)}
      </strong>

      <span>
        ${escapeHTML(type.label)}
        ·
        ${formatFileSize(
          file.sizeBytes
        )}
      </span>

    </button>
  `;
}


function filePreviewHTML(
  file,
  context = "row"
) {
  const type =
    getFileTypeInfo(file);

  if (type.isImage) {
    return `
      <div
        class="
          file-preview
          file-preview-${context}
          has-image
        "
      >
        <img
          src="/admin/api/files/${encodeURIComponent(
            file.id
          )}/download"
          alt=""
          loading="lazy"
        />
      </div>
    `;
  }

  return `
    <div
      class="
        file-preview
        file-preview-${context}
        file-preview-${type.className}
      "
    >
      <span>
        ${type.icon}
      </span>

      ${
        type.short
          ? `
            <small>
              ${escapeHTML(type.short)}
            </small>
          `
          : ""
      }

    </div>
  `;
}


function getFileTypeInfo(file) {
  const name =
    String(
      file.originalName ||
      file.name ||
      ""
    ).toLowerCase();

  const contentType =
    String(
      file.contentType || ""
    ).toLowerCase();

  const extension =
    name.includes(".")
      ? name.split(".").pop()
      : "";


  if (
    contentType.startsWith("image/") ||
    [
      "png",
      "jpg",
      "jpeg",
      "gif",
      "webp",
      "heic"
    ].includes(extension)
  ) {
    return {
      label:
        extension
          ? extension.toUpperCase()
          : "Image",
      short: "",
      icon: "▧",
      className: "image",
      isImage: true
    };
  }


  if (extension === "svg") {
    return {
      label: "SVG",
      short: "SVG",
      icon: "✂",
      className: "svg",
      isImage: false
    };
  }


  if (extension === "pdf") {
    return {
      label: "PDF",
      short: "PDF",
      icon: "▤",
      className: "pdf",
      isImage: false
    };
  }


  if (
    [
      "zip",
      "rar",
      "7z"
    ].includes(extension)
  ) {
    return {
      label:
        extension.toUpperCase(),
      short:
        extension.toUpperCase(),
      icon: "▥",
      className: "archive",
      isImage: false
    };
  }


  if (
    [
      "ppt",
      "pptx"
    ].includes(extension)
  ) {
    return {
      label: "PowerPoint",
      short: "PPT",
      icon: "▤",
      className: "presentation",
      isImage: false
    };
  }


  if (
    [
      "doc",
      "docx"
    ].includes(extension)
  ) {
    return {
      label: "Word",
      short: "DOC",
      icon: "▤",
      className: "document",
      isImage: false
    };
  }


  if (
    [
      "xls",
      "xlsx",
      "csv"
    ].includes(extension)
  ) {
    return {
      label: "Spreadsheet",
      short: "XLS",
      icon: "▦",
      className: "sheet",
      isImage: false
    };
  }


  return {
    label:
      extension
        ? extension.toUpperCase()
        : "File",
    short:
      extension
        ? extension
            .slice(0, 4)
            .toUpperCase()
        : "FILE",
    icon: "▤",
    className: "generic",
    isImage: false
  };
}


/* =========================================================
   FILE FILTERING
========================================================= */

function setFileCategory(category) {
  activeFileCategory =
    category;

  activeFileFolderId = null;
  fileSearch = "";

  renderFilesContent();
}


/* =========================================================
   FILE FOLDERS
========================================================= */

function openFileFolder(folderId) {
  const folder = fileFolders.find(folder => folder.id === folderId);
  if (!folder) return;

  activeFileCategory = folder.category;
  activeFileFolderId = folder.id;
  fileSearch = "";
  renderFilesContent();
}

function closeFileFolder() {
  activeFileFolderId = null;
  fileSearch = "";
  renderFilesContent();
}

function refreshUploadFolderOptions(form) {
  if (!form?.elements?.category || !form?.elements?.folderId) return;

  const category = form.elements.category.value;
  const select = form.elements.folderId;
  const folders = fileFolders.filter(folder => folder.category === category);

  select.innerHTML = `
    <option value="">No folder — category root</option>
    ${folders.map(folder => `
      <option
        value="${escapeHTML(folder.id)}"
        ${activeFileFolderId === folder.id ? "selected" : ""}
      >
        ${escapeHTML(folder.name)}
      </option>
    `).join("")}
  `;
}

function refreshEditFolderOptions(form) {
  if (!form?.elements?.category || !form?.elements?.folderId) return;

  const category = form.elements.category.value;
  const select = form.elements.folderId;
  const current = select.value;
  const folders = fileFolders.filter(folder => folder.category === category);

  select.innerHTML = `
    <option value="">No folder</option>
    ${folders.map(folder => `
      <option value="${escapeHTML(folder.id)}">${escapeHTML(folder.name)}</option>
    `).join("")}
  `;

  if (folders.some(folder => folder.id === current)) {
    select.value = current;
  }
}

function openAddFileFolder() {
  if (activeFileCategory === "All") {
    alert("Open a category first, then add a folder inside it.");
    return;
  }

  document.getElementById("modalRoot").innerHTML = `
    <div class="modal-backdrop" onclick="closeModalFromBackdrop(event)">
      <div class="modal-sheet files-modal-sheet file-folder-sheet">
        <div class="modal-title-row">
          <div>
            <div class="card-label">${escapeHTML(activeFileCategory)}</div>
            <h2>New Folder</h2>
            <div class="file-batch-subtitle">A tidy little home for related files.</div>
          </div>
          <button class="modal-close-button" onclick="closeModal()" aria-label="Close">×</button>
        </div>

        <form onsubmit="event.preventDefault(); createFileFolder(this);">
          <label class="field-label">
            Folder Name
            <input name="name" type="text" placeholder="Insurance, Contracts, Taxes…" required autofocus />
          </label>
          <button type="submit" class="primary-button full-width">Create Folder</button>
        </form>
      </div>
    </div>
  `;
}

async function createFileFolder(form) {
  const name = form.elements.name.value.trim();
  if (!name || activeFileCategory === "All") return;

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Making folder…";

  try {
    const response = await apiRequest("file-folders", {
      method: "POST",
      body: JSON.stringify({
        name,
        category: activeFileCategory
      })
    });

    fileFolders.push(response.folder);
    fileFolders.sort((a, b) => a.name.localeCompare(b.name));

    closeModal();
    renderFilesContent();
    showSWLToast("✨ Folder ready");
  } catch (err) {
    button.disabled = false;
    button.textContent = "Create Folder";
    alert(`Could not create that folder. ${err.message}`);
  }
}

function openFileFolderMenu(folderId) {
  const folder = fileFolders.find(folder => folder.id === folderId);
  if (!folder) return;

  document.getElementById("modalRoot").innerHTML = `
    <div class="modal-backdrop" onclick="closeModalFromBackdrop(event)">
      <div class="modal-sheet files-modal-sheet">
        <div class="modal-title-row">
          <div>
            <div class="card-label">FOLDER</div>
            <h2>${escapeHTML(folder.name)}</h2>
          </div>
          <button class="modal-close-button" onclick="closeModal()">×</button>
        </div>

        <button class="file-category-action" onclick="openRenameFileFolder(decodeURIComponent('${encodeURIComponent(folder.id)}'))">
          <span>✎</span>
          <div><strong>Rename Folder</strong><small>Give this folder a new label</small></div>
          <span>›</span>
        </button>

        <button class="file-category-action danger" onclick="deleteFileFolder(decodeURIComponent('${encodeURIComponent(folder.id)}'))">
          <span>×</span>
          <div><strong>Delete Folder</strong><small>Files move back to ${escapeHTML(folder.category)}</small></div>
          <span>›</span>
        </button>
      </div>
    </div>
  `;
}

function openRenameFileFolder(folderId) {
  const folder = fileFolders.find(folder => folder.id === folderId);
  if (!folder) return;

  document.getElementById("modalRoot").innerHTML = `
    <div class="modal-backdrop" onclick="closeModalFromBackdrop(event)">
      <div class="modal-sheet files-modal-sheet">
        <div class="modal-title-row">
          <div><div class="card-label">FOLDER</div><h2>Rename</h2></div>
          <button class="modal-close-button" onclick="closeModal()">×</button>
        </div>
        <form onsubmit="event.preventDefault(); renameFileFolder(decodeURIComponent('${encodeURIComponent(folder.id)}'), this);">
          <label class="field-label">
            Folder Name
            <input name="name" type="text" value="${escapeHTML(folder.name)}" required autofocus />
          </label>
          <button type="submit" class="primary-button full-width">Save Name</button>
        </form>
      </div>
    </div>
  `;
}

async function renameFileFolder(folderId, form) {
  const folder = fileFolders.find(folder => folder.id === folderId);
  if (!folder) return;

  const name = form.elements.name.value.trim();
  if (!name) return;

  try {
    const response = await apiRequest(`file-folders/${encodeURIComponent(folderId)}`, {
      method: "PUT",
      body: JSON.stringify({ name })
    });

    Object.assign(folder, response.folder || { name });
    closeModal();
    renderFilesContent();
    showSWLToast("Folder renamed");
  } catch (err) {
    alert(`Could not rename that folder. ${err.message}`);
  }
}

async function deleteFileFolder(folderId) {
  const folder = fileFolders.find(folder => folder.id === folderId);
  if (!folder) return;

  const count = swlFiles.filter(file => file.folderId === folderId).length;
  const confirmed = confirm(
    `Delete "${folder.name}"?\n\n${count ? `${count} ${count === 1 ? "file" : "files"} will move back to ${folder.category}.` : "The folder is empty."}\nNo files will be deleted.`
  );

  if (!confirmed) return;

  try {
    await apiRequest(`file-folders/${encodeURIComponent(folderId)}`, {
      method: "DELETE"
    });

    swlFiles.forEach(file => {
      if (file.folderId === folderId) file.folderId = null;
    });

    fileFolders = fileFolders.filter(folder => folder.id !== folderId);
    activeFileFolderId = null;
    closeModal();
    renderFilesContent();
    showSWLToast("Folder removed · files kept safe");
  } catch (err) {
    alert(`Could not delete that folder. ${err.message}`);
  }
}

/* =========================================================
   FILE FORMATTING
========================================================= */

function formatFileSize(bytes) {
  const size =
    Number(bytes || 0);

  if (size < 1024) {
    return `${size} B`;
  }

  if (
    size <
    1024 * 1024
  ) {
    return `${
      Math.round(
        size / 1024
      )
    } KB`;
  }

  return `${
    (
      size /
      (1024 * 1024)
    ).toFixed(1)
  } MB`;
}


function formatFileDate(value) {
  if (!value) return "";

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );
}


/* =========================================================
   UPLOAD FILE
========================================================= */

function openFileUpload() {
  if (!fileCategories.length) {
    alert(
      "Create a category first."
    );

    openAddFileCategory();
    return;
  }

  const categoryOptions =
    fileCategories
      .map(category => `
        <option
          value="${escapeHTML(
            category.name
          )}"
          ${
            activeFileCategory ===
            category.name
              ? "selected"
              : ""
          }
        >
          ${escapeHTML(category.name)}
        </option>
      `)
      .join("");

  const html = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >

      <div
        class="
          modal-sheet
          files-modal-sheet
          file-batch-sheet
        "
      >

        <div class="modal-title-row">

          <div>
            <div class="card-label">
              FILES
            </div>

            <h2>Upload Files</h2>
            <div class="file-batch-subtitle">
              Pick one or a whole handful. Ops will file them away one at a time.
            </div>
          </div>

          <button
            class="modal-close-button"
            onclick="closeModal()"
            aria-label="Close"
          >
            ×
          </button>

        </div>


        <form
          class="file-upload-form"
          onsubmit="
            event.preventDefault();
            uploadSWLFiles(this);
          "
        >

          <label
            class="file-picker"
            id="filePickerLabel"
          >

            <input
              name="files"
              type="file"
              multiple
              required
              onchange="
                filesChosenForUpload(this);
              "
            />

            <span class="file-picker-icon">
              ＋
            </span>

            <strong id="filePickerTitle">
              Choose files
            </strong>

            <span id="filePickerMeta">
              Select one or multiple · 25 MB max each
            </span>

          </label>

          <div
            id="fileBatchList"
            class="file-batch-list"
            hidden
          ></div>

          <label class="field-label">
            Category for this batch

            <select
              name="category"
              required
              onchange="refreshUploadFolderOptions(this.form)"
            >
              ${categoryOptions}
            </select>
          </label>

          <label class="field-label">
            Folder

            <select name="folderId" id="fileUploadFolderSelect">
            </select>
          </label>

          <div
            id="fileUploadProgress"
            class="file-upload-progress"
            hidden
          >
            <div class="file-upload-progress-copy">
              <strong id="fileUploadProgressTitle">
                Packing files into the cabinet…
              </strong>
              <span id="fileUploadProgressCount">
                0 of 0 uploaded
              </span>
            </div>

            <div class="file-upload-progress-track">
              <div
                id="fileUploadProgressBar"
                class="file-upload-progress-bar"
              ></div>
            </div>
          </div>

          <button
            type="submit"
            class="
              primary-button
              full-width
              file-save-button
            "
            id="fileBatchUploadButton"
          >
            Choose Files First
          </button>

        </form>

      </div>

    </div>
  `;

  document
    .getElementById(
      "modalRoot"
    )
    .innerHTML = html;

  refreshUploadFolderOptions(
    document.querySelector(".file-upload-form")
  );

}


function filesChosenForUpload(input) {
  const files =
    Array.from(
      input.files || []
    );

  const title =
    document.getElementById(
      "filePickerTitle"
    );

  const meta =
    document.getElementById(
      "filePickerMeta"
    );

  const label =
    document.getElementById(
      "filePickerLabel"
    );

  const list =
    document.getElementById(
      "fileBatchList"
    );

  const button =
    document.getElementById(
      "fileBatchUploadButton"
    );

  if (!files.length) {
    if (title) title.textContent = "Choose files";
    if (meta) {
      meta.textContent =
        "Select one or multiple · 25 MB max each";
    }
    if (label) {
      label.classList.remove(
        "has-file"
      );
    }
    if (list) {
      list.hidden = true;
      list.innerHTML = "";
    }
    if (button) {
      button.textContent =
        "Choose Files First";
      button.disabled = true;
    }
    return;
  }

  if (title) {
    title.textContent =
      files.length === 1
        ? files[0].name
        : `${files.length} files selected`;
  }

  if (meta) {
    const totalBytes =
      files.reduce(
        (sum, file) =>
          sum + file.size,
        0
      );

    meta.textContent =
      `${formatFileSize(totalBytes)} total`;
  }

  if (label) {
    label.classList.add(
      "has-file"
    );
  }

  if (list) {
    list.hidden = false;
    list.innerHTML = `
      <div class="file-batch-heading">
        <strong>${files.length === 1 ? "Ready to file" : `${files.length} files ready`}</strong>
        <span>Names can be cleaned up before uploading.</span>
      </div>

      ${files
        .map((file, index) => `
          <div class="file-batch-item">
            <div class="file-batch-file-icon">📄</div>
            <div class="file-batch-file-copy">
              <input
                class="file-batch-name-input"
                name="displayName_${index}"
                type="text"
                value="${escapeHTML(
                  removeFileExtension(
                    file.name
                  )
                )}"
                aria-label="Display name for ${escapeHTML(file.name)}"
              />
              <span>
                ${escapeHTML(file.name)} · ${formatFileSize(file.size)}
              </span>
            </div>
          </div>
        `)
        .join("")}
    `;
  }

  if (button) {
    button.disabled = false;
    button.textContent =
      files.length === 1
        ? "Upload File"
        : `Upload ${files.length} Files`;
  }
}


function removeFileExtension(name) {
  const value =
    String(name || "");

  const lastDot =
    value.lastIndexOf(".");

  if (lastDot <= 0) {
    return value;
  }

  return value.slice(
    0,
    lastDot
  );
}


async function uploadSWLFiles(form) {
  const files =
    Array.from(
      form.elements
        .files
        .files || []
    );

  if (!files.length) return;

  const category =
    form.elements
      .category
      .value;

  const folderId =
    form.elements
      .folderId
      ?.value || "";

  const button =
    form.querySelector(
      'button[type="submit"]'
    );

  const pickerInput =
    form.elements.files;

  const categorySelect =
    form.elements.category;

  const folderSelect =
    form.elements.folderId;

  const progress =
    document.getElementById(
      "fileUploadProgress"
    );

  const progressTitle =
    document.getElementById(
      "fileUploadProgressTitle"
    );

  const progressCount =
    document.getElementById(
      "fileUploadProgressCount"
    );

  const progressBar =
    document.getElementById(
      "fileUploadProgressBar"
    );

  button.disabled = true;
  pickerInput.disabled = true;
  categorySelect.disabled = true;
  if (folderSelect) folderSelect.disabled = true;

  if (progress) {
    progress.hidden = false;
  }

  if (progressTitle) {
    progressTitle.textContent =
      files.length === 1
        ? "Packing this file into the cabinet…"
        : `Packing ${files.length} files into the cabinet…`;
  }

  const uploaded = [];
  const failed = [];
  const maxBytes =
    25 * 1024 * 1024;

  for (
    let index = 0;
    index < files.length;
    index++
  ) {
    const file = files[index];
    const nameInput =
      form.elements[
        `displayName_${index}`
      ];

    const name =
      String(
        nameInput?.value ||
        removeFileExtension(file.name)
      ).trim() ||
      removeFileExtension(file.name) ||
      file.name;

    if (file.size > maxBytes) {
      failed.push({
        file,
        reason: "Over the 25 MB limit"
      });
    } else {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "name",
        name
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "folderId",
        folderId
      );

      try {
        const response =
          await fetch(
            "/admin/api/files",
            {
              method: "POST",
              credentials:
                "same-origin",
              body: formData
            }
          );

        let data = null;

        try {
          data =
            await response.json();
        } catch {}

        if (!response.ok) {
          throw new Error(
            data?.error ||
            `Upload failed (${response.status})`
          );
        }

        uploaded.push(
          data.file
        );

      } catch (err) {
        failed.push({
          file,
          reason:
            err?.message ||
            "Upload failed"
        });
      }
    }

    const completed =
      index + 1;

    if (progressCount) {
      progressCount.textContent =
        `${uploaded.length} of ${files.length} uploaded`;
    }

    if (progressBar) {
      progressBar.style.width =
        `${Math.round(
          (completed / files.length) * 100
        )}%`;
    }
  }

  if (uploaded.length) {
    swlFiles.unshift(
      ...uploaded.reverse()
    );
  }

  renderFilesContent();

  if (!failed.length) {
    if (progressTitle) {
      progressTitle.textContent =
        "✨ Filed away!";
    }

    if (progressCount) {
      progressCount.textContent =
        files.length === 1
          ? "1 file safely in the cabinet"
          : `${files.length} files safely in the cabinet`;
    }

    button.textContent =
      "✨ Filed Away!";

    showSWLToast(
      files.length === 1
        ? "✨ File filed away!"
        : `✨ ${files.length} files filed away!`
    );

    window.setTimeout(
      () => closeModal(),
      650
    );

    return;
  }

  if (progressTitle) {
    progressTitle.textContent =
      uploaded.length
        ? "Most made it safely 💛"
        : "These files need another try";
  }

  if (progressCount) {
    progressCount.textContent =
      `${uploaded.length} uploaded · ${failed.length} failed`;
  }

  const list =
    document.getElementById(
      "fileBatchList"
    );

  if (list) {
    list.hidden = false;
    list.innerHTML = `
      <div class="file-batch-heading file-batch-failed-heading">
        <strong>${failed.length} ${failed.length === 1 ? "file needs" : "files need"} another try</strong>
        <span>The successful uploads are already safe. Nothing was rolled back.</span>
      </div>

      ${failed
        .map(item => `
          <div class="file-batch-item file-batch-item-failed">
            <div class="file-batch-file-icon">!</div>
            <div class="file-batch-file-copy">
              <strong>${escapeHTML(item.file.name)}</strong>
              <span>${escapeHTML(item.reason)}</span>
            </div>
          </div>
        `)
        .join("")}
    `;
  }

  button.disabled = false;
  button.textContent =
    "Choose Files to Try Again";
  button.type = "button";
  button.onclick = () => {
    closeModal();
    openFileUpload();
  };

  showSWLToast(
    `${uploaded.length} saved · ${failed.length} need another try`
  );
}


/* =========================================================
   FILE DETAIL
========================================================= */

function openFileDetail(fileId) {
  const file =
    swlFiles.find(
      file =>
        file.id === fileId
    );

  if (!file) return;

  const type =
    getFileTypeInfo(file);

  const categoryOptions =
    fileCategories
      .map(category => `
        <option
          value="${escapeHTML(
            category.name
          )}"
          ${
            file.category ===
            category.name
              ? "selected"
              : ""
          }
        >
          ${escapeHTML(category.name)}
        </option>
      `)
      .join("");

  const folderOptions =
    fileFolders
      .filter(folder => folder.category === file.category)
      .map(folder => `
        <option
          value="${escapeHTML(folder.id)}"
          ${file.folderId === folder.id ? "selected" : ""}
        >
          ${escapeHTML(folder.name)}
        </option>
      `)
      .join("");

  const canPreview =
    type.isImage ||
    type.label === "SVG" ||
    type.label === "PDF";

  const html = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >

      <div
        class="
          modal-sheet
          files-modal-sheet
          file-detail-sheet
        "
      >

        <div class="modal-title-row">

          <div>
            <div class="card-label">
              ${escapeHTML(
                file.category ||
                "FILE"
              )}
            </div>

            <h2>
              ${escapeHTML(
                file.name
              )}
            </h2>
          </div>

          <button
            class="modal-close-button"
            onclick="closeModal()"
            aria-label="Close"
          >
            ×
          </button>

        </div>


        <div class="file-detail-preview">
          ${filePreviewHTML(
            file,
            "detail"
          )}
        </div>


        <div class="file-detail-meta">

          <span>
            ${escapeHTML(type.label)}
          </span>

          <span>·</span>

          <span>
            ${formatFileSize(
              file.sizeBytes
            )}
          </span>

          ${
            file.createdAt
              ? `
                <span>·</span>

                <span>
                  ${formatFileDate(
                    file.createdAt
                  )}
                </span>
              `
              : ""
          }

        </div>


        <div class="file-detail-actions">

          ${
            canPreview
              ? `
                <button
                  type="button"
                  class="
                    primary-button
                    full-width
                  "
                  onclick="previewSWLFile(
                    decodeURIComponent(
                      '${encodeURIComponent(
                        file.id
                      )}'
                    )
                  )"
                >
                  Preview
                </button>
              `
              : ""
          }

          <button
            type="button"
            class="
              secondary-button
              full-width
            "
            onclick="saveSWLFile(
              decodeURIComponent(
                '${encodeURIComponent(
                  file.id
                )}'
              )
            )"
          >
            Save / Download
          </button>

        </div>


        <form
          class="file-edit-form"
          onsubmit="
            event.preventDefault();
            saveFileChanges(
              decodeURIComponent(
                '${encodeURIComponent(
                  file.id
                )}'
              ),
              this
            );
          "
        >

          <label class="field-label">
            Name

            <input
              name="name"
              type="text"
              value="${escapeHTML(
                file.name
              )}"
              required
            />
          </label>


          <label class="field-label">
            Category

            <select
              name="category"
              required
              onchange="refreshEditFolderOptions(this.form)"
            >
              ${categoryOptions}
            </select>
          </label>

          <label class="field-label">
            Folder

            <select name="folderId">
              <option value="">No folder</option>
              ${folderOptions}
            </select>
          </label>


          <button
            type="submit"
            class="
              secondary-button
              full-width
            "
          >
            Save Changes
          </button>

        </form>


        <button
          class="file-delete-button"
          onclick="confirmDeleteSWLFile(
            decodeURIComponent(
              '${encodeURIComponent(
                file.id
              )}'
            )
          )"
        >
          Delete File
        </button>

      </div>

    </div>
  `;

  document
    .getElementById(
      "modalRoot"
    )
    .innerHTML = html;
}

function previewSWLFile(fileId) {
  const file =
    swlFiles.find(
      file =>
        file.id === fileId
    );

  if (!file) return;

  const type =
    getFileTypeInfo(file);

  const url =
    `/admin/api/files/${
      encodeURIComponent(file.id)
    }/download`;

  let previewHTML = "";

  if (
    type.isImage ||
    type.label === "SVG"
  ) {
    previewHTML = `
      <div class="swl-file-viewer-body">
        <img
          src="${url}"
          alt="${escapeHTML(
            file.name
          )}"
        />
      </div>
    `;
  } else if (
    type.label === "PDF"
  ) {
    previewHTML = `
      <div
        class="
          swl-file-viewer-body
          swl-pdf-viewer
        "
      >
        <iframe
          src="${url}"
          title="${escapeHTML(
            file.name
          )}"
        ></iframe>
      </div>
    `;
  } else {
    return;
  }

  document
    .getElementById(
      "modalRoot"
    )
    .innerHTML = `
      <div class="swl-file-viewer">

        <div class="swl-file-viewer-header">

          <button
            type="button"
            class="swl-file-viewer-back"
            onclick="openFileDetail(
              decodeURIComponent(
                '${encodeURIComponent(
                  file.id
                )}'
              )
            )"
          >
            ‹ Back
          </button>

          <strong>
            ${escapeHTML(
              file.name
            )}
          </strong>

          <button
            type="button"
            class="swl-file-viewer-close"
            onclick="closeModal()"
            aria-label="Close preview"
          >
            ×
          </button>

        </div>

        ${previewHTML}

      </div>
    `;
}


async function saveSWLFile(fileId) {
  const file =
    swlFiles.find(
      file =>
        file.id === fileId
    );

  if (!file) return;

  const url =
    `/admin/api/files/${
      encodeURIComponent(file.id)
    }/download`;

  try {
    const response =
      await fetch(
        url,
        {
          credentials:
            "same-origin"
        }
      );

    if (!response.ok) {
      throw new Error(
        `Could not load file (${response.status})`
      );
    }

    const blob =
      await response.blob();

    const downloadName =
      file.originalName ||
      file.name ||
      "file";

    /*
      iPhone/iPad:
      Use the native share sheet whenever
      the browser supports sharing files.

      This gives you Save to Files,
      AirDrop, Messages, etc.
    */
    if (
      navigator.share &&
      navigator.canShare
    ) {
      try {
        const shareFile =
          new File(
            [blob],
            downloadName,
            {
              type:
                file.contentType ||
                blob.type ||
                "application/octet-stream"
            }
          );

        if (
          navigator.canShare({
            files: [shareFile]
          })
        ) {
          await navigator.share({
            files: [shareFile],
            title: file.name
          });

          return;
        }
      } catch (err) {
        /*
          AbortError just means the user
          closed the share sheet.
        */
        if (
          err?.name ===
          "AbortError"
        ) {
          return;
        }
      }
    }

    /*
      Desktop / browsers without
      file sharing:
      trigger a normal download.
    */
    const blobUrl =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href =
      blobUrl;

    anchor.download =
      downloadName;

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();

    setTimeout(() => {
      URL.revokeObjectURL(
        blobUrl
      );
    }, 1000);

  } catch (err) {
    alert(
      `Could not save that file. ${err.message}`
    );
  }
}

async function saveFileChanges(
  fileId,
  form
) {
  const file =
    swlFiles.find(
      file =>
        file.id === fileId
    );

  if (!file) return;

  const name =
    form.elements
      .name
      .value
      .trim();

  const category =
    form.elements
      .category
      .value;

  const folderId =
    form.elements
      .folderId
      ?.value || "";

  if (!name) return;

  const button =
    form.querySelector(
      'button[type="submit"]'
    );

  button.disabled = true;
  button.textContent =
    "Saving…";

  try {
    const response =
      await apiRequest(
        `files/${encodeURIComponent(
          fileId
        )}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name,
            category,
            folderId
          })
        }
      );

    Object.assign(
      file,
      response.file || {
        name,
        category,
        folderId: folderId || null
      }
    );

    closeModal();

    renderFilesContent();

  } catch (err) {
    button.disabled = false;
    button.textContent =
      "Save Changes";

    alert(
      `Could not save that file. ${err.message}`
    );
  }
}


function confirmDeleteSWLFile(fileId) {
  const file =
    swlFiles.find(
      file =>
        file.id === fileId
    );

  if (!file) return;

  const confirmed =
    confirm(
      `Delete "${file.name}"?\n\nThis cannot be undone.`
    );

  if (!confirmed) return;

  deleteSWLFile(fileId);
}


async function deleteSWLFile(fileId) {
  try {
    await apiRequest(
      `files/${encodeURIComponent(
        fileId
      )}`,
      {
        method: "DELETE"
      }
    );

    swlFiles =
      swlFiles.filter(
        file =>
          file.id !== fileId
      );

    closeModal();

    renderFilesContent();

  } catch (err) {
    alert(
      `Could not delete that file. ${err.message}`
    );
  }
}


/* =========================================================
   FILE CATEGORIES
========================================================= */

function openAddFileCategory() {
  const html = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >

      <div
        class="
          modal-sheet
          files-modal-sheet
          file-category-sheet
        "
      >

        <div class="modal-title-row">

          <div>
            <div class="card-label">
              FILES
            </div>

            <h2>New Category</h2>
          </div>

          <button
            class="modal-close-button"
            onclick="closeModal()"
            aria-label="Close"
          >
            ×
          </button>

        </div>


        <form
          onsubmit="
            event.preventDefault();
            createFileCategory(this);
          "
        >

          <label class="field-label">
            Category Name

            <input
              name="name"
              type="text"
              placeholder="Example: Logos"
              required
              autofocus
            />
          </label>

          <button
            type="submit"
            class="
              primary-button
              full-width
            "
          >
            Add Category
          </button>

        </form>

      </div>

    </div>
  `;

  document
    .getElementById(
      "modalRoot"
    )
    .innerHTML = html;
}


async function createFileCategory(form) {
  const name =
    form.elements
      .name
      .value
      .trim();

  if (!name) return;

  const button =
    form.querySelector(
      'button[type="submit"]'
    );

  button.disabled = true;
  button.textContent =
    "Adding…";

  try {
    const response =
      await apiRequest(
        "file-categories",
        {
          method: "POST",
          body: JSON.stringify({
            name
          })
        }
      );

    fileCategories.push(
      response.category
    );

    fileCategories.sort(
      (a, b) =>
        Number(
          a.sortOrder || 0
        ) -
        Number(
          b.sortOrder || 0
        )
    );

    activeFileCategory =
      response.category.name;

    fileSearch = "";

    closeModal();

    renderFilesContent();

  } catch (err) {
    button.disabled = false;
    button.textContent =
      "Add Category";

    alert(
      `Could not create that category. ${err.message}`
    );
  }
}


function openFileCategoryMenu(
  categoryName
) {
  const category =
    fileCategories.find(
      category =>
        category.name ===
        categoryName
    );

  if (!category) return;

  const html = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >

      <div
        class="
          modal-sheet
          files-modal-sheet
          file-category-menu-sheet
        "
      >

        <div class="modal-title-row">

          <div>
            <div class="card-label">
              CATEGORY
            </div>

            <h2>
              ${escapeHTML(
                category.name
              )}
            </h2>
          </div>

          <button
            class="modal-close-button"
            onclick="closeModal()"
            aria-label="Close"
          >
            ×
          </button>

        </div>


        <button
          class="
            file-category-action
          "
          onclick="openRenameFileCategory(
  decodeURIComponent(
    '${encodeURIComponent(
      category.id
    )}'
  )
)"
        >
          <span>✎</span>

          <div>
            <strong>
              Rename Category
            </strong>

            <small>
              Change this category’s name
            </small>
          </div>

          <span>›</span>
        </button>


        <button
          class="
            file-category-action
            danger
          "
          onclick="openDeleteFileCategory(
  decodeURIComponent(
    '${encodeURIComponent(
      category.id
    )}'
  )
)"
        >
          <span>×</span>

          <div>
            <strong>
              Delete Category
            </strong>

            <small>
              Files will be moved first
            </small>
          </div>

          <span>›</span>
        </button>

      </div>

    </div>
  `;

  document
    .getElementById(
      "modalRoot"
    )
    .innerHTML = html;
}


function openRenameFileCategory(
  categoryId
) {
  const category =
    fileCategories.find(
      category =>
        category.id ===
        categoryId
    );

  if (!category) return;

  const html = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >

      <div
        class="
          modal-sheet
          files-modal-sheet
        "
      >

        <div class="modal-title-row">

          <div>
            <div class="card-label">
              CATEGORY
            </div>

            <h2>Rename</h2>
          </div>

          <button
            class="modal-close-button"
            onclick="closeModal()"
          >
            ×
          </button>

        </div>


        <form
          onsubmit="
            event.preventDefault();
            renameFileCategory(
              decodeURIComponent(
  '${encodeURIComponent(
    category.id
  )}'
),
              this
            );
          "
        >

          <label class="field-label">
            Category Name

            <input
              name="name"
              type="text"
              value="${escapeHTML(
                category.name
              )}"
              required
              autofocus
            />
          </label>

          <button
            type="submit"
            class="
              primary-button
              full-width
            "
          >
            Save Name
          </button>

        </form>

      </div>

    </div>
  `;

  document
    .getElementById(
      "modalRoot"
    )
    .innerHTML = html;
}


async function renameFileCategory(
  categoryId,
  form
) {
  const category =
    fileCategories.find(
      category =>
        category.id ===
        categoryId
    );

  if (!category) return;

  const oldName =
    category.name;

  const name =
    form.elements
      .name
      .value
      .trim();

  if (!name) return;

  try {
    await apiRequest(
      `file-categories/${encodeURIComponent(
        categoryId
      )}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name
        })
      }
    );

    category.name =
      name;

    swlFiles.forEach(file => {
      if (
        file.category === oldName
      ) {
        file.category = name;
      }
    });

    fileFolders.forEach(folder => {
      if (folder.category === oldName) {
        folder.category = name;
      }
    });

    if (
      activeFileCategory ===
      oldName
    ) {
      activeFileCategory =
        name;
    }

    closeModal();

    renderFilesContent();

  } catch (err) {
    alert(
      `Could not rename that category. ${err.message}`
    );
  }
}


function openDeleteFileCategory(
  categoryId
) {
  const category =
    fileCategories.find(
      category =>
        category.id ===
        categoryId
    );

  if (!category) return;

  const destinations =
    fileCategories.filter(
      item =>
        item.id !== categoryId
    );

  if (!destinations.length) {
    alert(
      "You need another category before deleting this one."
    );

    return;
  }

  const html = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >

      <div
        class="
          modal-sheet
          files-modal-sheet
        "
      >

        <div class="modal-title-row">

          <div>
            <div class="card-label">
              DELETE CATEGORY
            </div>

            <h2>
              ${escapeHTML(
                category.name
              )}
            </h2>
          </div>

          <button
            class="modal-close-button"
            onclick="closeModal()"
          >
            ×
          </button>

        </div>


        <p class="file-delete-category-copy">
          Choose where anything in this
          category should go.
        </p>


        <form
          onsubmit="
            event.preventDefault();
            deleteFileCategory(
              decodeURIComponent(
  '${encodeURIComponent(
    category.id
  )}'
),
              this
            );
          "
        >

          <label class="field-label">
            Move Files To

            <select
              name="destination"
              required
            >
              ${destinations
                .map(destination => `
                  <option
                    value="${escapeHTML(
                      destination.id
                    )}"
                  >
                    ${escapeHTML(
                      destination.name
                    )}
                  </option>
                `)
                .join("")}
            </select>
          </label>


          <button
            type="submit"
            class="
              file-delete-category-button
              full-width
            "
          >
            Move Files & Delete Category
          </button>

        </form>

      </div>

    </div>
  `;

  document
    .getElementById(
      "modalRoot"
    )
    .innerHTML = html;
}


async function deleteFileCategory(
  categoryId,
  form
) {
  const category =
    fileCategories.find(
      category =>
        category.id ===
        categoryId
    );

  const destinationId =
    form.elements
      .destination
      .value;

  const destination =
    fileCategories.find(
      category =>
        category.id ===
        destinationId
    );

  if (
    !category ||
    !destination
  ) {
    return;
  }

  const confirmed =
    confirm(
      `Delete "${category.name}" and move its files to "${destination.name}"?`
    );

  if (!confirmed) return;

  try {
    await apiRequest(
      `file-categories/${encodeURIComponent(
        categoryId
      )}?moveTo=${encodeURIComponent(
        destinationId
      )}`,
      {
        method: "DELETE"
      }
    );

    swlFiles.forEach(file => {
      if (
        file.category ===
        category.name
      ) {
        file.category =
          destination.name;
        file.folderId = null;
      }
    });

    fileFolders =
      fileFolders.filter(
        folder => folder.category !== category.name
      );

    activeFileFolderId = null;

    fileCategories =
      fileCategories.filter(
        item =>
          item.id !== categoryId
      );

    if (
      activeFileCategory ===
      category.name
    ) {
      activeFileCategory =
        destination.name;
    }

    closeModal();

    renderFilesContent();

  } catch (err) {
    alert(
      `Could not delete that category. ${err.message}`
    );
  }
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
    allCurrentIssues()
      .sort((a, b) => {
        if (
          a.type === "manual" &&
          b.type === "manual"
        ) {
          return (
            reminderSortValue(a) -
            reminderSortValue(b)
          );
        }

        if (a.type === "manual") {
          return -1;
        }

        if (b.type === "manual") {
          return 1;
        }

        return 0;
      });

  let html = `
    <button
      class="primary-button full-width"
      onclick="addReminder()"
    >
      + Add Reminder
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
      const attachedEvent =
        issue.eventId
          ? state.events.find(
              event =>
                event.id ===
                issue.eventId
            )
          : null;

      html += `
        <div class="attention-row">

          <div>

            <strong>
              ${escapeHTML(issue.title)}
            </strong>

            ${
              attachedEvent
                ? `
                    <div class="muted">
                      ${escapeHTML(attachedEvent.name)}
                    </div>
                  `
                : issue.type === "manual"
                  ? `
                      <div class="muted">
                        General SWL reminder
                      </div>
                    `
                  : ""
            }

            ${
              issue.type === "manual" &&
              issue.remindBy
                ? `
                    <div class="muted">
                      Due ${escapeHTML(
                        formatReminderDue(
                          issue.remindBy
                        )
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
                    aria-label="Complete reminder"
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
  openReminderModal();
}

function addEventReminder(eventId) {
  openReminderModal(eventId);
}

function openReminderModal(
  eventId = null
) {
  const attachedEvent =
    eventId
      ? state.events.find(
          event =>
            event.id === eventId
        )
      : null;

  const eventOptions =
    [...state.events]
      .filter(event => !event.closed)
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      )
      .map(
        event => `
          <option
            value="${escapeHTML(event.id)}"
            ${
              event.id === eventId
                ? "selected"
                : ""
            }
          >
            ${escapeHTML(event.name)}
          </option>
        `
      )
      .join("");

  const html = `
    <div
      class="modal-backdrop"
      onclick="closeModalFromBackdrop(event)"
    >

      <div class="modal-sheet">

        <h2>Add Reminder</h2>

        <div class="card form-card">

          <div class="field">

            <label>
              What do you need to remember?
            </label>

            <input
              id="reminderTitle"
              placeholder="Order hiking outfits"
              autofocus
            />

          </div>

          ${
            attachedEvent
              ? `
                  <div class="field">

                    <label>
                      Event
                    </label>

                    <div class="card detail-card">
                      <strong>
                        ${escapeHTML(attachedEvent.name)}
                      </strong>
                    </div>

                    <input
                      id="reminderEventId"
                      type="hidden"
                      value="${escapeHTML(attachedEvent.id)}"
                    />

                  </div>
                `
              : `
                  <div class="field">

                    <label>
                      Event
                    </label>

                    <select id="reminderEventId">
                      <option value="">
                        No event — general reminder
                      </option>
                      ${eventOptions}
                    </select>

                  </div>
                `
          }

          <div class="field">

            <label>
              Due date & time
            </label>

            <input
              id="reminderDue"
              type="datetime-local"
            />

            <div class="muted">
              Optional
            </div>

          </div>

        </div>

        <div class="inline-fields">

          <button
            class="secondary-button"
            onclick="closeModal()"
          >
            Cancel
          </button>

          <button
            class="primary-button"
            onclick="saveReminderFromModal()"
          >
            Save Reminder
          </button>

        </div>

      </div>
    </div>
  `;

  document.getElementById(
    "modalRoot"
  ).innerHTML = html;

  setTimeout(
    () =>
      document
        .getElementById(
          "reminderTitle"
        )
        ?.focus(),
    0
  );
}

async function saveReminderFromModal() {
  const title =
    document
      .getElementById(
        "reminderTitle"
      )
      ?.value
      .trim();

  if (!title) {
    alert(
      "Add a reminder first."
    );
    return;
  }

  const eventId =
    document
      .getElementById(
        "reminderEventId"
      )
      ?.value || null;

  const dueValue =
    document
      .getElementById(
        "reminderDue"
      )
      ?.value || "";

  const reminder = {
    id: makeId("reminder"),
    title,
    eventId,
    remindBy:
      dueValue
        ? new Date(
            dueValue
          ).toISOString()
        : null,
    type: "manual",
    done: false,
    createdAt:
      new Date().toISOString()
  };

  try {
    await createReminderOnServer(
      reminder
    );
  } catch (err) {
    alert(
      `Could not save that reminder. ${err.message}`
    );

    return;
  }

  state.attention.push(
    reminder
  );

  closeModal();

  updateAttentionBadge();

  render();
}

async function completeReminder(id) {
  const reminder =
    state.attention.find(
      item => item.id === id
    );

  if (!reminder) return;

  const previous =
    reminder.done;

  reminder.done = true;

  try {
    await saveReminderToServer(
      reminder
    );
  } catch (err) {
    reminder.done = previous;

    alert(
      `Could not save that reminder. ${err.message}`
    );

    return;
  }

  updateAttentionBadge();

  render();
}


/* =========================================================
   ADD / EDIT EVENT
========================================================= */

function createBlankEventDraft() {
  return {
    id: makeId("event"),

    name: "",

    eventType:
      "Birthday Party",

    date: "",
    time: "",
    endDate: "",
    endTime: "",

    hostName: "",
    hostPhone: "",
    hostEmail: "",

    address: "",

    guestCount: "", // legacy alias for SWL capacity
    eventAttendance: "",
    swlCapacity: "",
    heartQuantity: "",
    bagQuantity: "",
    plushQuantities: {},

    package: "",

    specialGuestName: "",
    specialGuestAge: "",

    selectedPlush: [],

    extraOutfits: 0,
    voiceChips: 0,
    extraShirts: 0,
    extraVinyl: 0,

    customRequirements: "",

    eventNotes: "",

    customTotal: "",

    depositAmount: 100,
    depositPaid: false,

    total: 0,
    balanceDue: 0,

    reservations: [],

    loadOut: {},
    extraPackInventory: [],

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

function normalizeEventDraft(event) {
  const blank =
    createBlankEventDraft();

  const merged = {
    ...blank,
    ...structuredClone(event)
  };

  merged.selectedPlush ||=
    [];

  merged.reservations ||=
    [];

  merged.loadOut ||= {};
  merged.extraPackInventory ||= [];

  merged.plushQuantities ||= {};
  // Existing events used guestCount for both attendance and inventory planning.
  // Preserve that value as SWL capacity until the event is edited.
  if (merged.swlCapacity === "" || merged.swlCapacity == null) merged.swlCapacity = merged.guestCount || "";
  if (merged.eventAttendance === "" || merged.eventAttendance == null) merged.eventAttendance = merged.guestCount || "";
  if (merged.heartQuantity === "" || merged.heartQuantity == null) merged.heartQuantity = merged.swlCapacity || "";
  if (merged.bagQuantity === "" || merged.bagQuantity == null) merged.bagQuantity = isVendorEventType(merged.eventType) ? 0 : (merged.swlCapacity || "");

  merged.eventNotes ||=
    merged.arrivalNotes || "";

  merged.extraOutfits ||=
    0;

  merged.voiceChips ||=
    0;

  merged.extraShirts ||=
    0;

  merged.extraVinyl ||=
    0;

  merged.depositAmount =
    merged.depositAmount ?? 100;

  merged.depositPaid =
    Boolean(merged.depositPaid);

  merged.packing =
    event.packing?.length
      ? structuredClone(event.packing)
      : blank.packing;

  return merged;
}

function openAddEventWizard() {
  wizardMode = "add";
  editingEventId = null;

  wizard =
    createBlankEventDraft();

  wizardStep = 0;

  renderWizard();
}

function openEditEvent(eventId) {
  const event =
    state.events.find(
      event => event.id === eventId
    );

  if (!event) return;

  wizardMode = "edit";
  editingEventId = eventId;

  wizard =
    normalizeEventDraft(event);

  wizardStep = 0;

  renderWizard();
}

function closeWizard() {
  wizard = null;
  wizardStep = 0;

  wizardMode = "add";
  editingEventId = null;

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
  if (!event) return 0;

  if (event.package === "Custom") {
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
      event.swlCapacity ?? event.guestCount ?? 0
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
  if (!wizard) return;

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

function isVendorEventType(type) {
  return type === "Community Event";
}

function isContractedEventType(type) {
  return type === "Corporate / Partner";
}

function isCustomEventType(type) {
  return type === "Custom";
}

function plannedSWLCount(event = wizard) {
  return Math.max(0, Number(event?.swlCapacity ?? event?.guestCount ?? 0));
}

function applyEventTypeDefaults(event = wizard, force = false) {
  if (!event) return;
  const capacity = plannedSWLCount(event);
  if (force || event.heartQuantity === "" || event.heartQuantity == null) event.heartQuantity = capacity || "";
  if (force || event.bagQuantity === "" || event.bagQuantity == null) event.bagQuantity = isVendorEventType(event.eventType) ? 0 : (capacity || "");
  event.guestCount = capacity || ""; // keep older screens/data compatible
}

function buildReservationsForWizard() {
  if (!wizard) return;
  const reservations = [];
  const capacity = plannedSWLCount(wizard);
  const manualPlush = isVendorEventType(wizard.eventType) || isContractedEventType(wizard.eventType) || isCustomEventType(wizard.eventType);

  wizard.selectedPlush.forEach(plushId => {
    const quantity = manualPlush
      ? Math.max(0, Number(wizard.plushQuantities?.[plushId] || 0))
      : capacity + (capacity > 0 ? 2 : 0);
    if (quantity > 0) reservations.push({ itemId: plushId, quantity });
  });

  const hearts = Math.max(0, Number(wizard.heartQuantity || 0));
  const bags = Math.max(0, Number(wizard.bagQuantity || 0));
  if (hearts > 0) reservations.push({ itemId: "hearts", quantity: hearts });
  if (bags > 0) reservations.push({ itemId: "travel-bags", quantity: bags });

  if (wizard.package === "$40 Package") {
    reservations.push({ itemId: "white-shirt", quantity: capacity + Number(wizard.extraShirts || 0) });
  } else if (Number(wizard.extraShirts || 0) > 0) {
    reservations.push({ itemId: "white-shirt", quantity: Number(wizard.extraShirts || 0) });
  }
  if (Number(wizard.voiceChips || 0) > 0) reservations.push({ itemId: "sound", quantity: Number(wizard.voiceChips || 0) });
  wizard.reservations = reservations;
}


/* =========================================================
   WIZARD
========================================================= */

function renderWizard() {
  // Existing events may predate end-date fields; derive a default without
  // overwriting a previously customized end.
  if (wizard?.date && wizard?.time && (!wizard.endDate || !wizard.endTime)) {
    const start = swlLocalDateTime(wizard.date, wizard.time);
    if (start) {
      const parts = swlDateTimeParts(new Date(start.getTime() + swlEventDurationMinutes(wizard.eventType) * 60000));
      wizard.endDate = parts.date;
      wizard.endTime = parts.time;
    }
  }
  recalculatePayment();

  let html = `
    <div class="wizard-shell">

      <div class="wizard-header">

        <div class="wizard-title-row">

          <h2>
            ${
              wizardMode === "edit"
                ? "Edit Event"
                : "Add Event"
            }
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
                onclick="saveEventFromWizard()"
              >
                ${
                  wizardMode === "edit"
                    ? "Save Changes"
                    : "Confirm Event"
                }
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

function wizardStepHTML() {
  switch (wizardStep) {
    case 0:
      return basicsStepHTML();

    case 1:
      return partyStepHTML();

    case 2:
      return extrasStepHTML();

    case 3:
      return paymentStepHTML();

    default:
      return reviewStepHTML();
  }
}


/* =========================================================
   BASICS
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

        <select id="eventType" onchange="changeWizardEventType(this.value)">

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
            oninput="swlUpdateWizardEnd()" onchange="swlUpdateWizardEnd()"
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
            oninput="swlUpdateWizardEnd()" onchange="swlUpdateWizardEnd()"
            value="${wizard.time}"
          />

        </div>

      </div>

      <div class="inline-fields">
        <div class="field"><label>End date</label><input id="eventEndDate" type="date" value="${wizard.endDate || ''}" /></div>
        <div class="field"><label>End time</label><input id="eventEndTime" type="time" value="${wizard.endTime || ''}" /></div>
      </div>

      <div class="field">

        <label>
          Address
        </label>

        <input
          id="eventAddress"
          value="${escapeHTML(wizard.address)}"
          placeholder="123 Main St, Green Bay"
        />

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
   PARTY
========================================================= */

function partyStepHTML() {
  const vendor = isVendorEventType(wizard.eventType);
  const contracted = isContractedEventType(wizard.eventType);
  const custom = isCustomEventType(wizard.eventType);
  const manualPlush = vendor || contracted || custom;
  return `
    <div class="card form-card">
      ${(vendor || contracted) ? `
        <div class="inline-fields swl-capacity-fields">
          <div class="field"><label>Event attendance</label><input id="eventAttendance" type="number" min="0" value="${wizard.eventAttendance || ""}" placeholder="5000" /><small>Informational only. Never reserves inventory.</small></div>
          <div class="field"><label>SWL capacity</label><input id="swlCapacity" type="number" min="0" value="${wizard.swlCapacity || ""}" placeholder="120" oninput="updateCapacityDefaults(this.value)" /><small>How many experiences we are actually preparing for.</small></div>
        </div>` : `
        <div class="field"><label>${wizard.eventType === "Birthday Party" ? "Participating kids" : "SWL planned guests"}</label><input id="swlCapacity" type="number" min="0" value="${wizard.swlCapacity || wizard.guestCount || ""}" placeholder="15" oninput="updateCapacityDefaults(this.value)" /></div>`}

      ${!vendor && !contracted ? `<div class="field"><label>Package</label><div class="choice-grid">${packageChoice("$30 Package")}${packageChoice("$35 Package")}${packageChoice("$40 Package")}${packageChoice("Custom")}</div></div>` : `<div class="status-banner">${vendor ? "Vendor / community planning mode" : "Contracted event planning mode"}: inventory is based on the exact quantities below, not total event attendance.</div>`}

      ${wizard.eventType === "Birthday Party" ? `<div class="inline-fields"><div class="field"><label>Birthday child</label><input id="specialGuestName" value="${escapeHTML(wizard.specialGuestName)}" placeholder="Name" /></div><div class="field"><label>Age</label><input id="specialGuestAge" type="number" min="1" value="${escapeHTML(wizard.specialGuestAge)}" /></div></div>` : `<div class="field"><label>Guest of honor</label><input id="specialGuestName" value="${escapeHTML(wizard.specialGuestName)}" placeholder="Optional" /></div>`}

      <div class="field">
        <label>${manualPlush ? "Plush we're bringing" : "Plush options being offered"}</label>
        <small>${manualPlush ? "Choose the styles, then set the exact quantity of each one." : "Select every plush guests can choose from. Birthday/private events keep the existing capacity + 2 backup reservation behavior."}</small>
        <div class="plush-choice-grid" style="margin-top:12px;">${getEventPlushOptions().map(plush => plushChoice(plush)).join("")}</div>
      </div>
    </div>`;
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
      data-package="${packageName}"
      class="
        choice-card
        package-choice
        ${
          wizard.package === packageName
            ? "selected"
            : ""
        }
      "
      onclick="
        selectPackageWithoutJump(
          this,
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
  const selected = wizard.selectedPlush.includes(plush.id);
  const manual = isVendorEventType(wizard.eventType) || isContractedEventType(wizard.eventType) || isCustomEventType(wizard.eventType);
  const capacity = plannedSWLCount(wizard);
  const quantity = manual ? Number(wizard.plushQuantities?.[plush.id] || 0) : (capacity > 0 ? capacity + 2 : 0);
  return `
    <div class="plush-choice-card ${selected ? "selected" : ""}" data-plush="${plush.id}">
      <button type="button" class="swl-plush-select-button" onclick="togglePlushWithoutJump(this.closest('.plush-choice-card'),'${plush.id}')">
        <div class="plush-choice-image">${plush.image ? `<img src="${plush.image}" alt="${escapeHTML(plush.name)}" />` : `<div class="plush-choice-no-photo"><span>♥</span><small>No photo</small></div>`}<span class="plush-choice-check">✓</span></div>
        <div class="plush-choice-copy"><strong>${escapeHTML(plush.name)}</strong><span class="plush-reservation-label">${selected ? (manual ? `${quantity} planned` : `${quantity} reserved`) : "Not selected"}</span></div>
      </button>
      ${manual ? `<div class="swl-plush-qty"><button type="button" onclick="adjustWizardPlushQuantity('${plush.id}',-1)">−</button><input id="plushQty-${plush.id}" type="number" min="0" value="${quantity}" oninput="setWizardPlushQuantity('${plush.id}',this.value)" /><button type="button" onclick="adjustWizardPlushQuantity('${plush.id}',1)">+</button></div>` : ""}
    </div>`;
}

/* =========================================================
   EXTRAS
========================================================= */

function extrasStepHTML() {
  const vendor = isVendorEventType(wizard.eventType);
  const capacity = plannedSWLCount(wizard);
  applyEventTypeDefaults(wizard, false);
  return `
    <div class="card form-card">
      <div class="status-banner">Inventory uses these actual event quantities. Change any default whenever the event needs something different.</div>
      <div class="inline-fields swl-consumable-fields">
        <div class="field"><label>Wishing hearts</label><input id="heartQuantity" type="number" min="0" value="${wizard.heartQuantity ?? capacity}" /><small>Defaults to one per SWL planned guest.</small></div>
        <div class="field"><label>Travel bags</label><input id="bagQuantity" type="number" min="0" value="${wizard.bagQuantity ?? (vendor ? 0 : capacity)}" /><small>${vendor ? "Vendor events default to 0." : "Defaults to one per planned guest."}</small></div>
      </div>
      ${wizard.package === "Custom" || vendor || isContractedEventType(wizard.eventType) ? `<div class="field"><label>Custom requirements</label><textarea id="customRequirements" placeholder="Anything special for this event…">${escapeHTML(wizard.customRequirements)}</textarea></div>` : ""}
      ${!vendor && !isContractedEventType(wizard.eventType) && (wizard.package === "$35 Package" || wizard.package === "$40 Package") ? `<div class="status-banner">✓ Birthday plush outfit is included in this package.</div>` : ""}
      <div class="field"><label>Extra outfits</label><input id="extraOutfits" type="number" min="0" value="${wizard.extraOutfits}" /></div>
      <div class="field"><label>Voice chips</label><input id="voiceChips" type="number" min="0" value="${wizard.voiceChips}" /></div>
      <div class="field"><label>Extra T-shirts</label><input id="extraShirts" type="number" min="0" value="${wizard.extraShirts}" /></div>
      <div class="field"><label>Extra vinyl designs</label><input id="extraVinyl" type="number" min="0" value="${wizard.extraVinyl}" /></div>
    </div>`;
}


/* =========================================================
   PAYMENT
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
              <span>Extra outfits</span>

              <strong>
                ${wizard.extraOutfits}
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
              <span>Voice chips</span>

              <strong>
                ${wizard.voiceChips}
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
              <span>Extra shirts</span>

              <strong>
                ${wizard.extraShirts}
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
              <span>Extra vinyl</span>

              <strong>
                ${wizard.extraVinyl}
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
        <span>Event total</span>

        <strong id="paymentTotal">
          ${money(wizard.total)}
        </strong>
      </div>

      <div style="margin-top:24px;">

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
        style="font-size:1.1rem;"
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
   REVIEW
========================================================= */

function reviewStepHTML() {
  recalculatePayment();

  buildReservationsForWizard();

  return `
    <div class="card detail-card">

      <div class="card-label">
        ${
          wizardMode === "edit"
            ? "Review changes"
            : "Ready to create"
        }
      </div>

      <h2 style="margin-top:6px;">
        ${escapeHTML(
          wizard.name ||
          "Untitled Event"
        )}
      </h2>

      <div class="detail-row">

        <span>Date</span>

        <strong>
          ${formatDate(wizard.date)}
        </strong>

      </div>

      <div class="detail-row">

        <span>Time</span>

        <strong>
          ${
            wizard.time
              ? formatTime(wizard.time)
              : "—"
          }
        </strong>

      </div>

      <div class="detail-row">

        <span>Address</span>

        <strong>
          ${escapeHTML(
            wizard.address || "—"
          )}
        </strong>

      </div>

      <div class="detail-row">

        <span>Host</span>

        <strong>
          ${escapeHTML(
            wizard.hostName || "—"
          )}
        </strong>

      </div>

      <div class="detail-row">

        <span>SWL capacity</span>

        <strong>
          ${wizard.swlCapacity || wizard.guestCount || "—"}
        </strong>

      </div>

      <div class="detail-row">

        <span>Package</span>

        <strong>
          ${escapeHTML(
            wizard.package || "—"
          )}
        </strong>

      </div>

      <div class="detail-row">

        <span>Event total</span>

        <strong>
          ${money(wizard.total)}
        </strong>

      </div>

      <div class="detail-row">

        <span>Deposit</span>

        <strong>
          ${
            wizard.depositPaid
              ? `✓ ${money(wizard.depositAmount)} received`
              : "Not received"
          }
        </strong>

      </div>

      <div class="detail-row">

        <span>Remaining</span>

        <strong>
          ${money(wizard.balanceDue)}
        </strong>

      </div>

    </div>

    <section class="section">

      <div class="section-heading">
        <h2>Plush</h2>
      </div>

      <div class="card detail-card">

        ${
          wizard.selectedPlush.length

            ? wizard.selectedPlush
                .map(plushId => {
                  const plushName =
  getEventPlushName(plushId);

                  return `
                    <div class="requirement-row">

                      <span>
${escapeHTML(plushName)}                      </span>

                      <strong>
                        ${
                          (isVendorEventType(wizard.eventType) || isContractedEventType(wizard.eventType) || isCustomEventType(wizard.eventType))
                            ? Number(wizard.plushQuantities?.[plushId] || 0)
                            : plannedSWLCount(wizard) + 2
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
        <h2>Inventory Reservations</h2>
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

    <section class="section">

      <div class="section-heading">
        <h2>Notes</h2>
      </div>

      <div class="card form-card">

        <div class="field">

          <label>
            Event notes
          </label>

          <textarea
            id="eventNotes"
            placeholder="Setup details, special requests, things to remember..."
          >${escapeHTML(wizard.eventNotes || "")}</textarea>

        </div>

      </div>

    </section>

    <div class="status-banner">

      ${
        wizardMode === "edit"
          ? `
            Saving will automatically update the
            event total and inventory reservations.
          `
          : `
            Confirming this event will add it
            to Home and Events and immediately
            reserve the inventory shown above.
          `
      }

    </div>
  `;
}
/* =========================================================
   FORM SYNC
========================================================= */

function syncWizardFromCurrentStep() {
  if (!wizard) return;

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

    if (get("eventEndDate")) wizard.endDate = get("eventEndDate").value;
    if (get("eventEndTime")) wizard.endTime = get("eventEndTime").value;

    if (get("eventAddress")) {
      wizard.address =
        get("eventAddress").value;
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
    syncPartyFields();
  }

  if (wizardStep === 2) {
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

    if (get("heartQuantity")) wizard.heartQuantity = Number(get("heartQuantity").value || 0);
    if (get("bagQuantity")) wizard.bagQuantity = Number(get("bagQuantity").value || 0);
  }

  if (wizardStep === 3) {
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

  if (wizardStep === 4) {
    if (get("eventNotes")) {
      wizard.eventNotes =
        get("eventNotes").value;
    }
  }

  recalculatePayment();
}

function syncPartyFields() {
  const capacityField = document.getElementById("swlCapacity");
  const attendanceField = document.getElementById("eventAttendance");
  const specialGuestName = document.getElementById("specialGuestName");
  const specialGuestAge = document.getElementById("specialGuestAge");
  if (capacityField) {
    wizard.swlCapacity = Number(capacityField.value || 0);
    wizard.guestCount = wizard.swlCapacity;
  }
  if (attendanceField) wizard.eventAttendance = Number(attendanceField.value || 0);
  if (specialGuestName) wizard.specialGuestName = specialGuestName.value;
  if (specialGuestAge) wizard.specialGuestAge = specialGuestAge.value;
  document.querySelectorAll('[id^="plushQty-"]').forEach(input => {
    wizard.plushQuantities[input.id.replace("plushQty-", "")] = Math.max(0, Number(input.value || 0));
  });
}

function changeWizardEventType(value) {
  wizard.eventType = value;
  swlUpdateWizardEnd();
  if (isVendorEventType(value) || isContractedEventType(value)) wizard.package = "Custom";
  applyEventTypeDefaults(wizard, true);
}

function updateCapacityDefaults(value) {
  const previous = plannedSWLCount(wizard);
  wizard.swlCapacity = Math.max(0, Number(value || 0));
  wizard.guestCount = wizard.swlCapacity;
  if (wizard.heartQuantity === "" || Number(wizard.heartQuantity) === previous) wizard.heartQuantity = wizard.swlCapacity;
  if (!isVendorEventType(wizard.eventType) && (wizard.bagQuantity === "" || Number(wizard.bagQuantity) === previous)) wizard.bagQuantity = wizard.swlCapacity;
  updatePlushReservationLabels();
}

function setWizardPlushQuantity(plushId, value) {
  wizard.plushQuantities ||= {};
  wizard.plushQuantities[plushId] = Math.max(0, Number(value || 0));
  const card = document.querySelector(`[data-plush="${plushId}"]`);
  const label = card?.querySelector(".plush-reservation-label");
  if (label) label.textContent = `${wizard.plushQuantities[plushId]} planned`;
}

function adjustWizardPlushQuantity(plushId, delta) {
  const input = document.getElementById(`plushQty-${plushId}`);
  const next = Math.max(0, Number(input?.value || wizard.plushQuantities?.[plushId] || 0) + delta);
  if (input) input.value = next;
  setWizardPlushQuantity(plushId, next);
}


/* =========================================================
   NO-JUMP PACKAGE + PLUSH CONTROLS
========================================================= */

function selectPackageWithoutJump(
  button,
  packageName
) {
  syncPartyFields();

  wizard.package =
    packageName;

  document
    .querySelectorAll(
      ".package-choice"
    )
    .forEach(packageButton => {
      packageButton.classList.remove(
        "selected"
      );
    });

  button.classList.add(
    "selected"
  );

  /*
    $40 defaults to all 6 plush.
    Do this without rerendering the page.
  */

  if (
    packageName === "$40 Package"
  ) {
    wizard.selectedPlush =
  getEventPlushOptions().map(
    plush => plush.id
  );

    document
      .querySelectorAll(
        ".plush-choice"
      )
      .forEach(plushButton => {
        plushButton.classList.add(
          "selected"
        );

        const check =
          plushButton.querySelector(
            ".plush-check"
          );

        if (check) {
          check.textContent = "✓ ";
        }
      });

    updatePlushReservationLabels();
  }
}

function togglePlushWithoutJump(
  button,
  plushId
) {
  syncPartyFields();

  const currentlySelected =
    wizard.selectedPlush.includes(
      plushId
    );

  if (currentlySelected) {
    wizard.selectedPlush =
      wizard.selectedPlush.filter(
        id => id !== plushId
      );

    button.classList.remove(
      "selected"
    );
  } else {
    wizard.selectedPlush.push(
      plushId
    );
    wizard.plushQuantities ||= {};
    if ((isVendorEventType(wizard.eventType) || isContractedEventType(wizard.eventType) || isCustomEventType(wizard.eventType)) && wizard.plushQuantities[plushId] == null) {
      wizard.plushQuantities[plushId] = 0;
    }

    button.classList.add(
      "selected"
    );
  }

  const check =
    button.querySelector(
      ".plush-check"
    );

  if (check) {
    check.textContent =
      currentlySelected
        ? ""
        : "✓ ";
  }

  updatePlushReservationLabels();
}

function updatePlushReservationLabels() {
  const capacity = plannedSWLCount(wizard);
  const manual = isVendorEventType(wizard.eventType) || isContractedEventType(wizard.eventType) || isCustomEventType(wizard.eventType);
  document.querySelectorAll(".plush-choice-card").forEach(card => {
    const plushId = card.dataset.plush;
    const label = card.querySelector(".plush-reservation-label");
    if (!label) return;
    if (!wizard.selectedPlush.includes(plushId)) label.textContent = "Not selected";
    else if (manual) label.textContent = `${Number(wizard.plushQuantities?.[plushId] || 0)} planned`;
    else label.textContent = capacity > 0 ? `${capacity + 2} will be reserved` : "Enter planned guests above";
  });
}


/* =========================================================
   WIZARD NAVIGATION
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

  if (wizardStep === 1) {
    if (
      !plannedSWLCount(wizard)
    ) {
      alert(
        "Enter the guest count."
      );

      return;
    }

    if (!wizard.package && !isVendorEventType(wizard.eventType) && !isContractedEventType(wizard.eventType)) {
      alert("Choose a package or Custom.");
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
   SAVE EVENT
========================================================= */

async function saveEventFromWizard() {
  syncWizardFromCurrentStep();

  recalculatePayment();

  buildReservationsForWizard();

  if (!wizard.name.trim()) {
    alert(
      "Event name is required."
    );

    return;
  }

  if (!wizard.selectedPlush.length) {
    const continueWithoutPlush =
      confirm(
        "No plush options are selected. Save the event anyway?"
      );

    if (!continueWithoutPlush) {
      return;
    }
  }

  if (wizard.date && wizard.time) {
    const start = swlLocalDateTime(wizard.date, wizard.time);
    if (!start) { alert('Enter a valid event start date and time.'); return; }
    if (!wizard.endDate || !wizard.endTime) {
      const parts = swlDateTimeParts(new Date(start.getTime() + swlEventDurationMinutes(wizard.eventType) * 60000));
      wizard.endDate = parts.date;
      wizard.endTime = parts.time;
    }
    const end = swlLocalDateTime(wizard.endDate, wizard.endTime);
    if (!end || end <= start) { alert('Event end must be after the start.'); return; }
  }

  const savedEvent =
    structuredClone(wizard);

  const isEdit =
    wizardMode === "edit" &&
    editingEventId;

  let existingIndex = -1;

  if (isEdit) {
    existingIndex =
      state.events.findIndex(
        event =>
          event.id ===
          editingEventId
      );

    if (existingIndex === -1) {
      alert(
        "That event could not be found."
      );

      return;
    }
  }

  try {
    await saveEventToServer(
      savedEvent,
      !isEdit
    );
  } catch (err) {
    alert(
      `Could not save that event. ${err.message}`
    );
    return;
  }

  if (isEdit) {
    /*
      Replace the event with the newly
      calculated version.

      Existing packing checkmarks stay
      because the wizard was created
      from the existing event.
    */

    state.events[existingIndex] =
      savedEvent;
  } else {
    state.events.push(
      savedEvent
    );
  }

  updateAttentionBadge();

  const savedId =
    savedEvent.id;

  closeWizard();

  currentEventId =
    savedId;

  currentScreen =
    "event-detail";

  render();
  showSWLToast(isEdit ? "Event updated" : "Event booked ♥");
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
  return;
}

if (
  currentScreen === "files"
) {
  openFileUpload();
}
    }
  );

document.addEventListener("pointerdown", event => {
  const target = event.target.closest("button, .tap-card, .file-row, .recent-file-card");
  if (!target || target.disabled) return;
  target.classList.add("swl-pressed");
});

document.addEventListener("pointerup", event => {
  const target = event.target.closest("button, .tap-card, .file-row, .recent-file-card");
  if (!target) return;
  setTimeout(() => target.classList.remove("swl-pressed"), 90);
});

document.addEventListener("pointercancel", () => {
  document.querySelectorAll(".swl-pressed").forEach(node => node.classList.remove("swl-pressed"));
});

async function initializeApp() {
  const main =
    document.getElementById(
      "mainContent"
    );

  if (main) {
    main.innerHTML = `
      <div class="card empty-card">
        <strong>Loading SWL Ops…</strong>
      </div>
    `;
  }

  try {
    await loadStateFromServer();
    if (new URLSearchParams(location.search).get("screen")==="calendar") navigate("calendar");
    else render();
  } catch (err) {
    console.error(err);

    if (main) {
      main.innerHTML = `
        <div class="status-banner warning">
          SWL Ops couldn’t load its data.
        </div>

        <div class="card empty-card">
          <strong>${escapeHTML(err.message)}</strong>
          <p>
            Refresh the page and try again.
          </p>
        </div>
      `;
    }
  }
}

initializeApp();
