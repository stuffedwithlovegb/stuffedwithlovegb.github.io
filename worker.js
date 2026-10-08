export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Public storefront checkout; existing Ops routes are preserved.
    if (url.pathname.startsWith("/shop/api/")) {
      return handleShopApi(request, env, url);
    }

    // SWL Ops API
    if (url.pathname.startsWith("/admin/api/")) {
      return handleApi(request, env, url);
    }

    // Everything else = normal website files
    return env.ASSETS.fetch(request);
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(processPushNotifications(env));
  }
};


/* =========================================================
   HELPERS
========================================================= */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function error(message, status = 400) {
  return json(
    {
      ok: false,
      error: message
    },
    status
  );
}

function safeFileName(name) {
  const cleaned = String(name || "file")
    .trim()
    .replace(/[\/\\]/g, "-")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ");

  return cleaned || "file";
}

function fileExtension(name) {
  const safeName = safeFileName(name);

  const dotIndex =
    safeName.lastIndexOf(".");

  if (
    dotIndex <= 0 ||
    dotIndex === safeName.length - 1
  ) {
    return "";
  }

  return safeName
    .slice(dotIndex)
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "");
}

function mapFileRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    folderId: row.folder_id || null,
    originalName:
      row.original_name || row.name,
    contentType:
      row.content_type ||
      "application/octet-stream",
    sizeBytes:
      Number(row.size_bytes || 0),
    createdAt: row.created_at
  };
}


/* =========================================================
   API ROUTER
========================================================= */

async function handleApi(request, env, url) {
  try {
    const path = url.pathname.replace(
      "/admin/api/",
      ""
    );

    const parts = path
      .split("/")
      .filter(Boolean);

    const resource = parts[0];
    const id = parts[1];
    const action = parts[2];

    if (resource === "events") {
      return handleEvents(
        request,
        env,
        id,
        action
      );
    }

    if (resource === "appointments") return handleAppointments(request, env, id);

    if (resource === "inventory") {
      return handleInventory(
        request,
        env,
        id,
        action
      );
    }

    if (resource === "reminders") {
      return handleReminders(
        request,
        env,
        id
      );
    }

    if (resource === "push") {
      return handlePush(request, env, id);
    }

    if (resource === "notes") {
      return handleNotes(
        request,
        env,
        id
      );
    }
    if (resource === "client-notes") {
      return handleClientNotes(
        request,
        env,
        id,
        action
      );
    }

    if (resource === "clients") {
      return handleClients(
        request,
        env,
        id,
        action,
        parts[3]
      );
    }

if (resource === "file-categories") {
  return handleFileCategories(
    request,
    env,
    id
  );
}

    if (resource === "file-folders") {
      return handleFileFolders(
        request,
        env,
        id
      );
    }

    if (resource === "files") {
      return handleFiles(
        request,
        env,
        id,
        action
      );
    }

    if (
      resource === "bootstrap" &&
      request.method === "GET"
    ) {
      return handleBootstrap(env);
    }

    return error(
      "API route not found.",
      404
    );

  } catch (err) {
    console.error(err);

    return error(
      "Something went wrong.",
      500
    );
  }
}


/* =========================================================
   BOOTSTRAP
========================================================= */

async function handleBootstrap(env) {
  await ensureAppointmentsTable(env);
  await ensureClientsTables(env);
  await ensurePushTables(env);
  await ensureFileFolders(env);
  const appointmentRows = await env.DB.prepare("SELECT * FROM appointments ORDER BY starts_at ASC").all();
  const appointments = appointmentRows.results.map(mapAppointment);
  const eventsResult = await env.DB
    .prepare(`
      SELECT data
      FROM events
      ORDER BY created_at ASC
    `)
    .all();

  const inventoryResult = await env.DB
    .prepare(`
      SELECT
        id,
        name,
        category,
        on_hand,
        unit,
        auto_reserve,
        image_key
      FROM inventory
      ORDER BY category, name
    `)
    .all();

  const remindersResult = await env.DB
    .prepare(`
      SELECT
        id,
        title,
        event_id,
        remind_by,
        done,
        created_at
      FROM reminders
      ORDER BY created_at ASC
    `)
    .all();

  const events = eventsResult.results.map(
    row => JSON.parse(row.data)
  );

  const inventory =
    inventoryResult.results.map(
      row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        onHand: row.on_hand,
        unit: row.unit,
        autoReserve:
          Boolean(row.auto_reserve),
        imageKey:
          row.image_key || null
      })
    );

  const reminders =
    remindersResult.results.map(
      row => ({
        id: row.id,
        title: row.title,
        eventId: row.event_id,
        remindBy: row.remind_by,
        done: Boolean(row.done),
        createdAt: row.created_at,
        type: "manual"
      })
    );

  const clientsResult =
    await env.DB
      .prepare(`
        SELECT
          id,
          name,
          type,
          legacy_key,
          created_at,
          updated_at
        FROM clients
        ORDER BY name COLLATE NOCASE ASC
      `)
      .all();

  const contactsResult =
    await env.DB
      .prepare(`
        SELECT
          id,
          client_id,
          name,
          role,
          address,
          phone,
          email,
          is_primary,
          created_at
        FROM client_contacts
        ORDER BY is_primary DESC, created_at ASC
      `)
      .all();

  const contactsByClient = new Map();

  for (const row of contactsResult.results) {
    if (!contactsByClient.has(row.client_id)) {
      contactsByClient.set(row.client_id, []);
    }

    contactsByClient.get(row.client_id).push({
      id: row.id,
      clientId: row.client_id,
      name: row.name || "",
      role: row.role || "",
      address: row.address || "",
      phone: row.phone || "",
      email: row.email || "",
      isPrimary: Boolean(row.is_primary),
      createdAt: row.created_at
    });
  }

  const clients =
    clientsResult.results.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type || "person",
      legacyKey: row.legacy_key || null,
      contacts: contactsByClient.get(row.id) || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

  return json({
    ok: true,
    events,
    appointments,
    inventory,
    attention: reminders,
    clients
  });
}


/* =========================================================
   EVENTS
========================================================= */

async function handleEvents(
  request,
  env,
  id,
  action
) {
  if (
    request.method === "GET" &&
    !id
  ) {
    const result = await env.DB
      .prepare(`
        SELECT data
        FROM events
        ORDER BY created_at ASC
      `)
      .all();

    return json({
      ok: true,
      events: result.results.map(
        row => JSON.parse(row.data)
      )
    });
  }

  if (
    request.method === "POST" &&
    !id
  ) {
    const event =
      await request.json();

    if (!event.id) {
      return error(
        "Event ID is required."
      );
    }

    const now =
      new Date().toISOString();

    await env.DB
      .prepare(`
        INSERT INTO events (
          id,
          data,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?)
      `)
      .bind(
        event.id,
        JSON.stringify(event),
        event.createdAt || now,
        now
      )
      .run();

    return json({
      ok: true,
      event
    });
  }

  if (
    request.method === "POST" &&
    id &&
    action === "reconcile"
  ) {
    const row = await env.DB.prepare(`
      SELECT data FROM events WHERE id = ?
    `).bind(id).first();

    if (!row) return error("Event not found.", 404);

    let event;
    try {
      event = JSON.parse(row.data);
    } catch {
      return error("This event's saved data could not be read.", 500);
    }

    const body = await request.json();
    const requestId = String(body.requestId || "").trim();
    const correction = Boolean(body.correction);

    if (!requestId) return error("A reconciliation request ID is required.");

    if (event.reconciliation?.requestId === requestId) {
      return json({ ok: true, event, alreadyApplied: true });
    }

    if (event.closed && !correction) {
      return error("This event has already been reconciled.", 409);
    }

    if (event.closed && !event.reconciliation) {
      return error("This completed event does not have an editable reconciliation.", 409);
    }

    const reservationMap = new Map(
      (event.reservations || []).map(item => [String(item.itemId), Math.max(0, Number(item.quantity || 0))])
    );
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const items = [];
    const seen = new Set();
    const allowedFields = ["brought", "returned", "sold", "used", "giveaway", "damaged", "missing"];

    for (const raw of rawItems) {
      const itemId = String(raw?.itemId || "");
      if (!itemId || seen.has(itemId) || !reservationMap.has(itemId)) {
        return error("Reconciliation contains an item that is not reserved for this event.");
      }
      seen.add(itemId);
      const item = { itemId };
      for (const field of allowedFields) {
        const value = Number(raw?.[field] || 0);
        if (!Number.isSafeInteger(value) || value < 0 || value > 100000) {
          return error(`Invalid ${field} quantity for ${itemId}.`);
        }
        item[field] = value;
      }
      const accounted = item.returned + item.sold + item.used + item.giveaway + item.damaged + item.missing;
      if (accounted !== item.brought) {
        return error(`The counts for ${itemId} do not add up to the amount brought.`);
      }
      item.deducted = item.sold + item.used + item.giveaway + item.damaged + item.missing;
      items.push(item);
    }

    if (items.length !== reservationMap.size) {
      return error("Every reserved inventory item must be reconciled.");
    }

    const equipment = {};
    const allowedEquipment = new Set(["returned", "not-brought", "left-behind"]);
    for (const [key, value] of Object.entries(body.equipment || {})) {
      const status = String(value || "");
      if (!allowedEquipment.has(status)) return error("Choose a valid status for every equipment item.");
      equipment[String(key)] = status;
    }

    const now = new Date().toISOString();
    const previous = event.reconciliation || null;
    const previousDeductions = new Map(
      (previous?.items || []).map(item => [String(item.itemId), Number(item.deducted || 0)])
    );
    const statements = [];
    const inventoryRows = (await env.DB.prepare(`SELECT id, on_hand FROM inventory`).all()).results || [];
    const inventoryCounts = new Map(inventoryRows.map(item => [String(item.id), Number(item.on_hand || 0)]));

    for (const item of items) {
      const delta = item.deducted - (correction ? Number(previousDeductions.get(item.itemId) || 0) : 0);
      if (delta !== 0) {
        if (!inventoryCounts.has(item.itemId)) return error(`Inventory item ${item.itemId} no longer exists.`, 409);
        const nextOnHand = inventoryCounts.get(item.itemId) - delta;
        if (nextOnHand < 0) return error(`Not enough ${item.itemId} inventory to apply this closeout.`, 409);
        statements.push(env.DB.prepare(`
          UPDATE inventory
          SET on_hand = ?
          WHERE id = ?
        `).bind(nextOnHand, item.itemId));
      }
    }

    const revenue = Number(body.revenue || 0);
    const actualGuests = Number(body.actualGuests || 0);
    const revision = Math.max(1, Number(previous?.revision || 0) + 1);
    const reconciliation = {
      requestId,
      revision,
      corrected: correction,
      items,
      equipment,
      revenue: Number.isFinite(revenue) && revenue >= 0 ? revenue : 0,
      actualGuests: Number.isSafeInteger(actualGuests) && actualGuests >= 0 ? actualGuests : 0,
      notes: String(body.notes || "").trim().slice(0, 5000),
      closedAt: previous?.closedAt || now,
      updatedAt: now
    };

    event.reconciliation = reconciliation;
    event.reconciliationDraft = null;
    event.closed = true;
    event.status = "completed";
    event.closedAt = reconciliation.closedAt;

    statements.push(env.DB.prepare(`
      UPDATE events SET data = ?, updated_at = ? WHERE id = ?
    `).bind(JSON.stringify(event), now, id));
    statements.push(env.DB.prepare(`DELETE FROM reminders WHERE event_id = ?`).bind(id));

    await env.DB.batch(statements);
    return json({ ok: true, event });
  }

  if (
    request.method === "PUT" &&
    id
  ) {
    const event =
      await request.json();

    event.id = id;

    const result = await env.DB
      .prepare(`
        UPDATE events
        SET
          data = ?,
          updated_at = ?
        WHERE id = ?
      `)
      .bind(
        JSON.stringify(event),
        new Date().toISOString(),
        id
      )
      .run();

    if (!result.meta.changes) {
      return error(
        "Event not found.",
        404
      );
    }

    return json({
      ok: true,
      event
    });
  }

  if (
    request.method === "DELETE" &&
    id
  ) {
    await env.DB
      .prepare(`
        DELETE FROM events
        WHERE id = ?
      `)
      .bind(id)
      .run();

    await env.DB
      .prepare(`
        DELETE FROM notes
        WHERE event_id = ?
      `)
      .bind(id)
      .run();

    await env.DB
      .prepare(`
        DELETE FROM reminders
        WHERE event_id = ?
      `)
      .bind(id)
      .run();

    return json({
      ok: true
    });
  }

  return error(
    "Unsupported event request.",
    405
  );
}



/* CALENDAR APPOINTMENTS — separate from inventory-bearing events */
async function ensureAppointmentsTable(env) {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, kind TEXT NOT NULL,
    starts_at TEXT NOT NULL, ends_at TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
    remind_minutes INTEGER NOT NULL DEFAULT 30,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`).run();
}
function mapAppointment(row) {
  return {id:row.id,title:row.title,kind:row.kind,startAt:row.starts_at,
    endAt:row.ends_at,location:row.location,notes:row.notes,
    remindMinutes:row.remind_minutes,createdAt:row.created_at,updatedAt:row.updated_at};
}
function appointmentInput(body) {
  const title=String(body.title||'').trim().slice(0,180);
  const kind=['meeting','call','other'].includes(body.kind)?body.kind:'meeting';
  const start=new Date(body.startAt), end=new Date(body.endAt);
  const minutes=Number(body.remindMinutes);
  if (!title) throw new Error('Appointment title is required.');
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end<=start)
    throw new Error('Choose a valid start and end time.');
  if (end-start>7*86400000) throw new Error('Appointment is too long.');
  if (![-1,0,5,10,15,30,60,120,1440].includes(minutes)) throw new Error('Invalid reminder setting.');
  return {title,kind,startAt:start.toISOString(),endAt:end.toISOString(),
    location:String(body.location||'').trim().slice(0,500),
    notes:String(body.notes||'').trim().slice(0,4000),remindMinutes:minutes};
}
async function handleAppointments(request,env,id) {
  await ensureAppointmentsTable(env);
  if (request.method==='GET'&&!id) {
    const rows=await env.DB.prepare('SELECT * FROM appointments ORDER BY starts_at ASC').all();
    return json({ok:true,appointments:rows.results.map(mapAppointment)});
  }
  if (request.method==='POST'&&!id || request.method==='PUT'&&id) {
    let item;
    try {item=appointmentInput(await request.json());} catch(e) {return error(e.message);}
    const now=new Date().toISOString();
    if (!id) {
      id='appt_'+crypto.randomUUID();
      await env.DB.prepare(`INSERT INTO appointments
        (id,title,kind,starts_at,ends_at,location,notes,remind_minutes,created_at,updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?)`).bind(id,item.title,item.kind,item.startAt,item.endAt,
          item.location,item.notes,item.remindMinutes,now,now).run();
    } else {
      const result=await env.DB.prepare(`UPDATE appointments SET title=?,kind=?,starts_at=?,ends_at=?,
        location=?,notes=?,remind_minutes=?,updated_at=? WHERE id=?`).bind(item.title,item.kind,
        item.startAt,item.endAt,item.location,item.notes,item.remindMinutes,now,id).run();
      if (!result.meta.changes) return error('Appointment not found.',404);
    }
    const row=await env.DB.prepare('SELECT * FROM appointments WHERE id=?').bind(id).first();
    return json({ok:true,appointment:mapAppointment(row)});
  }
  if (request.method==='DELETE'&&id) {
    const result=await env.DB.prepare('DELETE FROM appointments WHERE id=?').bind(id).run();
    if (!result.meta.changes) return error('Appointment not found.',404);
    return json({ok:true});
  }
  return error('Unsupported appointment request.',405);
}

/* =========================================================
   INVENTORY
========================================================= */

async function handleInventory(
  request,
  env,
  id,
  action
) {

  // GET ALL INVENTORY
  if (
    request.method === "GET" &&
    !id
  ) {
    const result = await env.DB
      .prepare(`
        SELECT
          id,
          name,
          category,
          on_hand,
          unit,
          auto_reserve,
          image_key
        FROM inventory
        ORDER BY category, name
      `)
      .all();

    return json({
      ok: true,

      inventory:
        result.results.map(
          row => ({
            id: row.id,
            name: row.name,
            category: row.category,
            onHand: row.on_hand,
            unit: row.unit,
            autoReserve:
              Boolean(row.auto_reserve),
            imageKey:
              row.image_key || null
          })
        )
    });
  }


  // CREATE INVENTORY ITEM
  if (
    request.method === "POST" &&
    !id
  ) {
    const body =
      await request.json();

    const name =
      String(body.name || "").trim();

    const category =
      String(body.category || "").trim();

    const rawOnHand =
      Number(body.onHand ?? 0);

    const allowedCategories = [
      "Plush",
      "Outfits",
      "Supplies",
      "Shirts"
    ];

    if (!name) {
      return error(
        "Item name is required."
      );
    }

    if (
      !allowedCategories.includes(category)
    ) {
      return error(
        "Valid inventory category is required."
      );
    }

    if (
      !Number.isFinite(rawOnHand) ||
      rawOnHand < 0
    ) {
      return error(
        "Valid starting quantity is required."
      );
    }

    const onHand =
      Math.floor(rawOnHand);

    const itemId =
      "inv_" +
      crypto.randomUUID();

    const unit =
      category === "Plush"
        ? "plush"
        : "item";

    const autoReserve =
      category === "Plush"
        ? 1
        : 0;

    await env.DB
      .prepare(`
        INSERT INTO inventory (
          id,
          name,
          category,
          on_hand,
          unit,
          auto_reserve
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        itemId,
        name,
        category,
        onHand,
        unit,
        autoReserve
      )
      .run();

    const item = {
      id: itemId,
      name,
      category,
      onHand,
      unit,
      autoReserve:
        Boolean(autoReserve),
      imageKey: null
    };

    return json({
      ok: true,
      item
    });
  }


  // UPLOAD INVENTORY IMAGE
  if (
    request.method === "POST" &&
    id &&
    action === "image"
  ) {
    const item = await env.DB
      .prepare(`
        SELECT
          id,
          image_key
        FROM inventory
        WHERE id = ?
      `)
      .bind(id)
      .first();

    if (!item) {
      return error(
        "Inventory item not found.",
        404
      );
    }

    const formData =
      await request.formData();

    const file =
      formData.get("image");

    if (
      !file ||
      typeof file === "string"
    ) {
      return error(
        "Image file is required."
      );
    }

    if (
      !file.type ||
      !file.type.startsWith("image/")
    ) {
      return error(
        "File must be an image."
      );
    }

    const maxBytes =
      10 * 1024 * 1024;

    if (file.size > maxBytes) {
      return error(
        "Image must be 10 MB or smaller."
      );
    }

    const rawExtension =
      file.name
        ?.split(".")
        .pop()
        ?.toLowerCase()
        .replace(
          /[^a-z0-9]/g,
          ""
        );

    const extension =
      rawExtension || "jpg";

    const imageKey =
      `inventory/${id}/${crypto.randomUUID()}.${extension}`;

    const imageBytes =
      await file.arrayBuffer();

    await env.IMAGES.put(
      imageKey,
      imageBytes,
      {
        httpMetadata: {
          contentType:
            file.type ||
            "image/jpeg"
        }
      }
    );

    await env.DB
      .prepare(`
        UPDATE inventory
        SET image_key = ?
        WHERE id = ?
      `)
      .bind(
        imageKey,
        id
      )
      .run();

    // Remove previous uploaded image
    // after new image has saved successfully.
    if (item.image_key) {
      await env.IMAGES.delete(
        item.image_key
      );
    }

    return json({
      ok: true,
      imageKey,
      imageUrl:
        `/admin/api/inventory/${encodeURIComponent(id)}/image`
    });
  }


  // SERVE INVENTORY IMAGE
  if (
    request.method === "GET" &&
    id &&
    action === "image"
  ) {
    const item = await env.DB
      .prepare(`
        SELECT image_key
        FROM inventory
        WHERE id = ?
      `)
      .bind(id)
      .first();

    if (
      !item ||
      !item.image_key
    ) {
      return error(
        "Image not found.",
        404
      );
    }

    const object =
      await env.IMAGES.get(
        item.image_key
      );

    if (!object) {
      return error(
        "Image not found.",
        404
      );
    }

    const headers =
      new Headers();

    object.writeHttpMetadata(
      headers
    );

    headers.set(
      "Cache-Control",
      "private, max-age=3600"
    );

    return new Response(
      object.body,
      {
        headers
      }
    );
  }


  // UPDATE INVENTORY COUNT
  if (
    request.method === "PUT" &&
    id &&
    !action
  ) {
    const body =
      await request.json();

    const onHand =
      Number(body.onHand);

    if (
      !Number.isFinite(onHand)
    ) {
      return error(
        "Valid onHand count required."
      );
    }

    const result = await env.DB
      .prepare(`
        UPDATE inventory
        SET on_hand = ?
        WHERE id = ?
      `)
      .bind(
        onHand,
        id
      )
      .run();

    if (!result.meta.changes) {
      return error(
        "Inventory item not found.",
        404
      );
    }

    return json({
      ok: true,
      id,
      onHand
    });
  }


  // DELETE INVENTORY ITEM
  if (
    request.method === "DELETE" &&
    id &&
    !action
  ) {
    const item = await env.DB
      .prepare(`
        SELECT image_key
        FROM inventory
        WHERE id = ?
      `)
      .bind(id)
      .first();

    if (!item) {
      return error(
        "Inventory item not found.",
        404
      );
    }

    const result = await env.DB
      .prepare(`
        DELETE FROM inventory
        WHERE id = ?
      `)
      .bind(id)
      .run();

    if (!result.meta.changes) {
      return error(
        "Inventory item not found.",
        404
      );
    }

    // Don't leave abandoned uploaded
    // images sitting in R2.
    if (item.image_key) {
      await env.IMAGES.delete(
        item.image_key
      );
    }

    return json({
      ok: true
    });
  }


  return error(
    "Unsupported inventory request.",
    405
  );
}



/* =========================================================
   CLIENTS
========================================================= */

async function ensureClientsTables(env) {
  await env.DB
    .prepare(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'person',
        legacy_key TEXT UNIQUE,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)
    .run();

  await env.DB
    .prepare(`
      CREATE TABLE IF NOT EXISTS client_contacts (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        name TEXT,
        role TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        is_primary INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
      )
    `)
    .run();

  // Safe migration for databases created before contact addresses existed.
  try {
    await env.DB.prepare(`ALTER TABLE client_contacts ADD COLUMN address TEXT`).run();
  } catch (err) {
    // Duplicate-column errors are expected after the first successful migration.
    if (!String(err?.message || err).toLowerCase().includes("duplicate column")) {
      console.warn("client_contacts address migration:", err);
    }
  }

  await env.DB
    .prepare(`
      CREATE INDEX IF NOT EXISTS idx_client_contacts_client
      ON client_contacts (client_id, is_primary, created_at)
    `)
    .run();
}

async function getClientRecord(env, clientId) {
  const row =
    await env.DB
      .prepare(`
        SELECT
          id,
          name,
          type,
          legacy_key,
          created_at,
          updated_at
        FROM clients
        WHERE id = ?
      `)
      .bind(clientId)
      .first();

  if (!row) return null;

  const contacts =
    await env.DB
      .prepare(`
        SELECT
          id,
          client_id,
          name,
          role,
          address,
          phone,
          email,
          is_primary,
          created_at
        FROM client_contacts
        WHERE client_id = ?
        ORDER BY is_primary DESC, created_at ASC
      `)
      .bind(clientId)
      .all();

  return {
    id: row.id,
    name: row.name,
    type: row.type || "person",
    legacyKey: row.legacy_key || null,
    contacts: contacts.results.map(contact => ({
      id: contact.id,
      clientId: contact.client_id,
      name: contact.name || "",
      role: contact.role || "",
      address: contact.address || "",
      phone: contact.phone || "",
      email: contact.email || "",
      isPrimary: Boolean(contact.is_primary),
      createdAt: contact.created_at
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function handleClients(
  request,
  env,
  id,
  action,
  childId
) {
  await ensureClientsTables(env);

  if (
    request.method === "GET" &&
    !id
  ) {
    const result =
      await env.DB
        .prepare(`
          SELECT id
          FROM clients
          ORDER BY name COLLATE NOCASE ASC
        `)
        .all();

    const clients = [];

    for (const row of result.results) {
      const client =
        await getClientRecord(env, row.id);

      if (client) clients.push(client);
    }

    return json({
      ok: true,
      clients
    });
  }

  if (
    request.method === "POST" &&
    !id
  ) {
    const body =
      await request.json();

    const name =
      String(body.name || "").trim();

    const type =
      body.type === "organization"
        ? "organization"
        : "person";

    const legacyKey =
      String(body.legacyKey || "").trim() ||
      null;

    if (!name) {
      return error("Client name is required.");
    }

    if (legacyKey) {
      const existing =
        await env.DB
          .prepare(`
            SELECT id
            FROM clients
            WHERE legacy_key = ?
          `)
          .bind(legacyKey)
          .first();

      if (existing) {
        return json({
          ok: true,
          client:
            await getClientRecord(
              env,
              existing.id
            )
        });
      }
    }

    const now =
      new Date().toISOString();

    const clientId =
      "client_" + crypto.randomUUID();

    await env.DB
      .prepare(`
        INSERT INTO clients (
          id,
          name,
          type,
          legacy_key,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        clientId,
        name,
        type,
        legacyKey,
        now,
        now
      )
      .run();

    const contacts =
      Array.isArray(body.contacts)
        ? body.contacts
        : [];

    for (let index = 0; index < contacts.length; index++) {
      const contact = contacts[index];

      const contactName =
        String(contact.name || "").trim();

      const role =
        String(contact.role || "").trim();

      const address =
        String(contact.address || "").trim();

      const phone =
        String(contact.phone || "").trim();

      const email =
        String(contact.email || "").trim();

      if (
        !contactName &&
        !phone &&
        !email &&
        !address
      ) {
        continue;
      }

      await env.DB
        .prepare(`
          INSERT INTO client_contacts (
            id,
            client_id,
            name,
            role,
            address,
            phone,
            email,
            is_primary,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          "contact_" + crypto.randomUUID(),
          clientId,
          contactName,
          role,
          address,
          phone,
          email,
          index === 0 ? 1 : 0,
          now
        )
        .run();
    }

    return json({
      ok: true,
      client:
        await getClientRecord(
          env,
          clientId
        )
    });
  }

  if (
    request.method === "PUT" &&
    id &&
    !action
  ) {
    const body =
      await request.json();

    const name =
      String(body.name || "").trim();

    const type =
      body.type === "organization"
        ? "organization"
        : "person";

    if (!name) {
      return error("Client name is required.");
    }

    const result =
      await env.DB
        .prepare(`
          UPDATE clients
          SET
            name = ?,
            type = ?,
            updated_at = ?
          WHERE id = ?
        `)
        .bind(
          name,
          type,
          new Date().toISOString(),
          id
        )
        .run();

    if (!result.meta.changes) {
      return error("Client not found.", 404);
    }

    return json({
      ok: true,
      client:
        await getClientRecord(env, id)
    });
  }

  if (
    request.method === "POST" &&
    id &&
    action === "contacts"
  ) {
    const client =
      await getClientRecord(env, id);

    if (!client) {
      return error("Client not found.", 404);
    }

    const body =
      await request.json();

    const name =
      String(body.name || "").trim();

    const role =
      String(body.role || "").trim();

    const address =
      String(body.address || "").trim();

    const phone =
      String(body.phone || "").trim();

    const email =
      String(body.email || "").trim();

    const isPrimary =
      Boolean(body.isPrimary);

    // All contact fields are optional. An empty contact is allowed intentionally.


    if (
      isPrimary ||
      !client.contacts.length
    ) {
      await env.DB
        .prepare(`
          UPDATE client_contacts
          SET is_primary = 0
          WHERE client_id = ?
        `)
        .bind(id)
        .run();
    }

    const now =
      new Date().toISOString();

    await env.DB
      .prepare(`
        INSERT INTO client_contacts (
          id,
          client_id,
          name,
          role,
          address,
          phone,
          email,
          is_primary,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        "contact_" + crypto.randomUUID(),
        id,
        name,
        role,
        address,
        phone,
        email,
        (isPrimary || !client.contacts.length) ? 1 : 0,
        now
      )
      .run();

    await env.DB
      .prepare(`
        UPDATE clients
        SET updated_at = ?
        WHERE id = ?
      `)
      .bind(now, id)
      .run();

    return json({
      ok: true,
      client:
        await getClientRecord(env, id)
    });
  }

  if (
    request.method === "PUT" &&
    id &&
    action === "contacts" &&
    childId
  ) {
    const client = await getClientRecord(env, id);
    if (!client) return error("Client not found.", 404);

    const existing = client.contacts.find(contact => contact.id === childId);
    if (!existing) return error("Contact not found.", 404);

    const body = await request.json();
    const name = String(body.name || "").trim();
    const address = String(body.address || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const isPrimary = Boolean(body.isPrimary);

    if (isPrimary) {
      await env.DB.prepare(`UPDATE client_contacts SET is_primary = 0 WHERE client_id = ?`).bind(id).run();
    }

    await env.DB.prepare(`
      UPDATE client_contacts
      SET name = ?, role = '', address = ?, phone = ?, email = ?, is_primary = ?
      WHERE id = ? AND client_id = ?
    `).bind(name, address, phone, email, isPrimary ? 1 : 0, childId, id).run();

    const refreshed = await getClientRecord(env, id);
    if (refreshed.contacts.length && !refreshed.contacts.some(contact => contact.isPrimary)) {
      await env.DB.prepare(`UPDATE client_contacts SET is_primary = 1 WHERE id = ?`).bind(refreshed.contacts[0].id).run();
    }

    await env.DB.prepare(`UPDATE clients SET updated_at = ? WHERE id = ?`).bind(new Date().toISOString(), id).run();
    return json({ ok: true, client: await getClientRecord(env, id) });
  }

  if (
    request.method === "DELETE" &&
    id &&
    action === "contacts" &&
    childId
  ) {
    const client = await getClientRecord(env, id);
    if (!client) return error("Client not found.", 404);

    const existing = client.contacts.find(contact => contact.id === childId);
    if (!existing) return error("Contact not found.", 404);

    await env.DB.prepare(`DELETE FROM client_contacts WHERE id = ? AND client_id = ?`).bind(childId, id).run();

    const refreshed = await getClientRecord(env, id);
    if (refreshed.contacts.length && !refreshed.contacts.some(contact => contact.isPrimary)) {
      await env.DB.prepare(`UPDATE client_contacts SET is_primary = 1 WHERE id = ?`).bind(refreshed.contacts[0].id).run();
    }

    await env.DB.prepare(`UPDATE clients SET updated_at = ? WHERE id = ?`).bind(new Date().toISOString(), id).run();
    return json({ ok: true, client: await getClientRecord(env, id) });
  }

  return error(
    "Unsupported client request.",
    405
  );
}


/* =========================================================
   CLIENT NOTES
========================================================= */

async function ensureClientNotesTable(env) {
  await env.DB
    .prepare(`
      CREATE TABLE IF NOT EXISTS client_notes (
        id TEXT PRIMARY KEY,
        client_key TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `)
    .run();

  await env.DB
    .prepare(`
      CREATE INDEX IF NOT EXISTS idx_client_notes_client_key
      ON client_notes (client_key, created_at)
    `)
    .run();
}

async function handleClientNotes(
  request,
  env,
  id,
  action
) {
  if (!id) {
    return error(
      "Client key is required.",
      400
    );
  }

  await ensureClientNotesTable(env);

  let clientKey = "";

  try {
    clientKey =
      decodeURIComponent(id);
  } catch {
    clientKey = id;
  }

  if (
    request.method === "GET" &&
    !action
  ) {
    const result =
      await env.DB
        .prepare(`
          SELECT
            id,
            client_key,
            text,
            created_at
          FROM client_notes
          WHERE client_key = ?
          ORDER BY created_at DESC
        `)
        .bind(clientKey)
        .all();

    return json({
      ok: true,
      notes:
        result.results.map(row => ({
          id: row.id,
          clientKey: row.client_key,
          text: row.text,
          createdAt: row.created_at
        }))
    });
  }

  if (
    request.method === "POST" &&
    !action
  ) {
    const body =
      await request.json();

    const text =
      String(body.text || "")
        .trim();

    if (!text) {
      return error(
        "Note text is required."
      );
    }

    const note = {
      id:
        "client_note_" +
        crypto.randomUUID(),
      clientKey,
      text,
      createdAt:
        new Date().toISOString()
    };

    await env.DB
      .prepare(`
        INSERT INTO client_notes (
          id,
          client_key,
          text,
          created_at
        )
        VALUES (?, ?, ?, ?)
      `)
      .bind(
        note.id,
        note.clientKey,
        note.text,
        note.createdAt
      )
      .run();

    return json({
      ok: true,
      note
    });
  }

  if (
    request.method === "DELETE" &&
    action
  ) {
    let noteId = "";

    try {
      noteId =
        decodeURIComponent(action);
    } catch {
      noteId = action;
    }

    const result =
      await env.DB
        .prepare(`
          DELETE FROM client_notes
          WHERE id = ?
            AND client_key = ?
        `)
        .bind(
          noteId,
          clientKey
        )
        .run();

    if (!result.meta.changes) {
      return error(
        "Client note not found.",
        404
      );
    }

    return json({
      ok: true
    });
  }

  return error(
    "Unsupported client note request.",
    405
  );
}


/* =========================================================
   FILES
========================================================= */
/* =========================================================
   FILE FOLDERS
========================================================= */

async function ensureFileFolders(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS file_folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_file_folders_category
    ON file_folders (category, name)
  `).run();

  // Existing SWL databases predate folders. This is intentionally
  // additive: every existing file simply starts at the category root.
  try {
    await env.DB.prepare(`
      ALTER TABLE files ADD COLUMN folder_id TEXT
    `).run();
  } catch (err) {
    if (!String(err?.message || err).toLowerCase().includes("duplicate column")) {
      console.warn("files folder_id migration:", err);
    }
  }
}

async function handleFileFolders(request, env, id) {
  await ensureFileFolders(env);

  if (request.method === "GET" && !id) {
    const result = await env.DB.prepare(`
      SELECT id, name, category, created_at
      FROM file_folders
      ORDER BY category COLLATE NOCASE, name COLLATE NOCASE
    `).all();

    return json({
      ok: true,
      folders: result.results.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        createdAt: row.created_at
      }))
    });
  }

  if (request.method === "POST" && !id) {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const category = String(body.category || "").trim();

    if (!name) return error("Folder name is required.");
    if (!category) return error("Category is required.");

    const categoryRecord = await env.DB.prepare(`
      SELECT name FROM file_categories WHERE name = ?
    `).bind(category).first();

    if (!categoryRecord) return error("Valid file category is required.");

    const duplicate = await env.DB.prepare(`
      SELECT id FROM file_folders
      WHERE category = ? AND LOWER(name) = LOWER(?)
    `).bind(category, name).first();

    if (duplicate) return error("That folder already exists in this category.");

    const folder = {
      id: "folder_" + crypto.randomUUID(),
      name,
      category,
      createdAt: new Date().toISOString()
    };

    await env.DB.prepare(`
      INSERT INTO file_folders (id, name, category, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(folder.id, folder.name, folder.category, folder.createdAt).run();

    return json({ ok: true, folder });
  }

  if (request.method === "PUT" && id) {
    const existing = await env.DB.prepare(`
      SELECT id, name, category, created_at
      FROM file_folders WHERE id = ?
    `).bind(id).first();

    if (!existing) return error("Folder not found.", 404);

    const body = await request.json();
    const name = String(body.name ?? existing.name).trim();
    if (!name) return error("Folder name is required.");

    const duplicate = await env.DB.prepare(`
      SELECT id FROM file_folders
      WHERE category = ? AND LOWER(name) = LOWER(?) AND id != ?
    `).bind(existing.category, name, id).first();

    if (duplicate) return error("That folder already exists in this category.");

    await env.DB.prepare(`
      UPDATE file_folders SET name = ? WHERE id = ?
    `).bind(name, id).run();

    return json({
      ok: true,
      folder: {
        id,
        name,
        category: existing.category,
        createdAt: existing.created_at
      }
    });
  }

  if (request.method === "DELETE" && id) {
    const existing = await env.DB.prepare(`
      SELECT id FROM file_folders WHERE id = ?
    `).bind(id).first();

    if (!existing) return error("Folder not found.", 404);

    // Deleting a folder never deletes its files. They move back to
    // the category root so there is no destructive surprise.
    await env.DB.batch([
      env.DB.prepare(`
        UPDATE files SET folder_id = NULL WHERE folder_id = ?
      `).bind(id),
      env.DB.prepare(`
        DELETE FROM file_folders WHERE id = ?
      `).bind(id)
    ]);

    return json({ ok: true });
  }

  return error("Unsupported file folder request.", 405);
}

/* =========================================================
   FILE CATEGORIES
========================================================= */

async function handleFileCategories(
  request,
  env,
  id
) {
  await ensureFileFolders(env);

  // GET ALL CATEGORIES
  if (
    request.method === "GET" &&
    !id
  ) {
    const result = await env.DB
      .prepare(`
        SELECT
          id,
          name,
          sort_order,
          created_at
        FROM file_categories
        ORDER BY sort_order ASC, name ASC
      `)
      .all();

    return json({
      ok: true,
      categories:
        result.results.map(row => ({
          id: row.id,
          name: row.name,
          sortOrder: row.sort_order,
          createdAt: row.created_at
        }))
    });
  }


  // CREATE CATEGORY
  if (
    request.method === "POST" &&
    !id
  ) {
    const body =
      await request.json();

    const name =
      String(body.name || "")
        .trim();

    if (!name) {
      return error(
        "Category name is required."
      );
    }

    const existing =
      await env.DB
        .prepare(`
          SELECT id
          FROM file_categories
          WHERE LOWER(name) = LOWER(?)
        `)
        .bind(name)
        .first();

    if (existing) {
      return error(
        "That category already exists."
      );
    }

    const maxOrder =
      await env.DB
        .prepare(`
          SELECT MAX(sort_order) AS max_order
          FROM file_categories
        `)
        .first();

    const sortOrder =
      Number(maxOrder?.max_order || 0) + 10;

    const category = {
      id:
        "cat_" +
        crypto.randomUUID(),
      name,
      sortOrder,
      createdAt:
        new Date().toISOString()
    };

    await env.DB
      .prepare(`
        INSERT INTO file_categories (
          id,
          name,
          sort_order,
          created_at
        )
        VALUES (?, ?, ?, ?)
      `)
      .bind(
        category.id,
        category.name,
        category.sortOrder,
        category.createdAt
      )
      .run();

    return json({
      ok: true,
      category
    });
  }


  // RENAME CATEGORY
  if (
    request.method === "PUT" &&
    id
  ) {
    const body =
      await request.json();

    const name =
      String(body.name || "")
        .trim();

    if (!name) {
      return error(
        "Category name is required."
      );
    }

    const category =
      await env.DB
        .prepare(`
          SELECT
            id,
            name
          FROM file_categories
          WHERE id = ?
        `)
        .bind(id)
        .first();

    if (!category) {
      return error(
        "Category not found.",
        404
      );
    }

    const duplicate =
      await env.DB
        .prepare(`
          SELECT id
          FROM file_categories
          WHERE
            LOWER(name) = LOWER(?)
            AND id != ?
        `)
        .bind(
          name,
          id
        )
        .first();

    if (duplicate) {
      return error(
        "That category already exists."
      );
    }

    /*
      Files currently store the category name,
      so rename both the category and every file
      using it.
    */
    await env.DB.batch([
      env.DB
        .prepare(`
          UPDATE files
          SET category = ?
          WHERE category = ?
        `)
        .bind(
          name,
          category.name
        ),

      env.DB
        .prepare(`
          UPDATE file_categories
          SET name = ?
          WHERE id = ?
        `)
        .bind(
          name,
          id
        ),

      env.DB
        .prepare(`
          UPDATE file_folders
          SET category = ?
          WHERE category = ?
        `)
        .bind(
          name,
          category.name
        )
    ]);

    return json({
      ok: true,
      category: {
        id,
        name
      }
    });
  }


  // DELETE CATEGORY
  if (
    request.method === "DELETE" &&
    id
  ) {
    const url =
      new URL(request.url);

    const moveTo =
      String(
        url.searchParams.get("moveTo") ||
        ""
      ).trim();

    if (!moveTo) {
      return error(
        "Choose a category to move the files into before deleting this category."
      );
    }

    const category =
      await env.DB
        .prepare(`
          SELECT
            id,
            name
          FROM file_categories
          WHERE id = ?
        `)
        .bind(id)
        .first();

    if (!category) {
      return error(
        "Category not found.",
        404
      );
    }

    const destination =
      await env.DB
        .prepare(`
          SELECT
            id,
            name
          FROM file_categories
          WHERE id = ?
        `)
        .bind(moveTo)
        .first();

    if (!destination) {
      return error(
        "Destination category not found.",
        404
      );
    }

    if (
      destination.id === category.id
    ) {
      return error(
        "Choose a different destination category."
      );
    }

    /*
      Move the files first, then remove
      the category itself.
    */
    await env.DB.batch([
      env.DB
        .prepare(`
          UPDATE files
          SET category = ?, folder_id = NULL
          WHERE category = ?
        `)
        .bind(
          destination.name,
          category.name
        ),

      env.DB
        .prepare(`
          DELETE FROM file_folders
          WHERE category = ?
        `)
        .bind(category.name),

      env.DB
        .prepare(`
          DELETE FROM file_categories
          WHERE id = ?
        `)
        .bind(id)
    ]);

    return json({
      ok: true
    });
  }


  return error(
    "Unsupported file category request.",
    405
  );
}
async function handleFiles(
  request,
  env,
  id,
  action
) {
  await ensureFileFolders(env);

  // GET ALL FILES
  if (
    request.method === "GET" &&
    !id
  ) {
    const result = await env.DB
      .prepare(`
        SELECT
          id,
          name,
          category,
          folder_id,
          original_name,
          content_type,
          size_bytes,
          created_at
        FROM files
        ORDER BY created_at DESC
      `)
      .all();

    return json({
      ok: true,
      files:
        result.results.map(
          row => mapFileRow(row)
        )
    });
  }


  // UPLOAD FILE
  if (
    request.method === "POST" &&
    !id
  ) {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (
      !file ||
      typeof file === "string"
    ) {
      return error(
        "File is required."
      );
    }

    const originalName =
      safeFileName(
        file.name || "file"
      );

    const requestedName =
      String(
        formData.get("name") || ""
      ).trim();

    const name =
      requestedName ||
      originalName;

    const requestedCategory =
      String(
        formData.get("category") ||
        "Other"
      ).trim();

   const categoryRecord =
  await env.DB
    .prepare(`
      SELECT name
      FROM file_categories
      WHERE name = ?
    `)
    .bind(requestedCategory)
    .first();

if (!categoryRecord) {
  return error(
    "Valid file category is required."
  );
}

const category =
  categoryRecord.name;

const requestedFolderId =
  String(formData.get("folderId") || "").trim() || null;

let folderId = null;

if (requestedFolderId) {
  const folderRecord = await env.DB
    .prepare(`
      SELECT id
      FROM file_folders
      WHERE id = ? AND category = ?
    `)
    .bind(requestedFolderId, category)
    .first();

  if (!folderRecord) {
    return error("Valid folder is required.");
  }

  folderId = folderRecord.id;
}

    /*
      Keep this intentionally larger than
      inventory-photo uploads because Files
      can contain PDFs, ZIPs, PPTX, etc.

      25 MB is plenty for the internal SWL
      file cabinet without letting one upload
      get ridiculous.
    */
    const maxBytes =
      25 * 1024 * 1024;

    if (file.size > maxBytes) {
      return error(
        "File must be 25 MB or smaller."
      );
    }

    const fileId =
      "file_" +
      crypto.randomUUID();

    const extension =
      fileExtension(originalName);

    const r2Key =
      `files/${fileId}/${crypto.randomUUID()}${extension}`;

    const contentType =
      file.type ||
      "application/octet-stream";

    const createdAt =
      new Date().toISOString();

    const bytes =
      await file.arrayBuffer();

    await env.IMAGES.put(
      r2Key,
      bytes,
      {
        httpMetadata: {
          contentType
        },
        customMetadata: {
          originalName
        }
      }
    );

    try {
      await env.DB
        .prepare(`
          INSERT INTO files (
            id,
            name,
            category,
            folder_id,
            r2_key,
            original_name,
            content_type,
            size_bytes,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          fileId,
          name,
          category,
          folderId,
          r2Key,
          originalName,
          contentType,
          file.size,
          createdAt
        )
        .run();

    } catch (err) {
      // If D1 fails, don't leave an
      // orphaned object sitting in R2.
      await env.IMAGES.delete(r2Key);
      throw err;
    }

    return json({
      ok: true,
      file: {
        id: fileId,
        name,
        category,
        folderId,
        originalName,
        contentType,
        sizeBytes: file.size,
        createdAt
      }
    });
  }


  // DOWNLOAD / OPEN FILE
  if (
    request.method === "GET" &&
    id &&
    action === "download"
  ) {
    const fileRecord =
      await env.DB
        .prepare(`
          SELECT
            id,
            name,
            r2_key,
            original_name,
            content_type
          FROM files
          WHERE id = ?
        `)
        .bind(id)
        .first();

    if (!fileRecord) {
      return error(
        "File not found.",
        404
      );
    }

    const object =
      await env.IMAGES.get(
        fileRecord.r2_key
      );

    if (!object) {
      return error(
        "Stored file not found.",
        404
      );
    }

    const headers =
      new Headers();

    object.writeHttpMetadata(
      headers
    );

    headers.set(
      "Content-Type",
      fileRecord.content_type ||
      headers.get("Content-Type") ||
      "application/octet-stream"
    );

    const downloadName =
      safeFileName(
        fileRecord.original_name ||
        fileRecord.name ||
        "file"
      )
        .replace(/"/g, "");

    /*
      inline lets images/PDFs open directly
      in the browser when supported, while
      other file types still download/open
      according to the device.
    */
    headers.set(
      "Content-Disposition",
      `inline; filename="${downloadName}"`
    );

    headers.set(
      "Cache-Control",
      "private, max-age=300"
    );

    return new Response(
      object.body,
      {
        headers
      }
    );
  }


  // UPDATE FILE NAME / CATEGORY
  if (
    request.method === "PUT" &&
    id &&
    !action
  ) {
    const existing =
      await env.DB
        .prepare(`
          SELECT
            id,
            name,
            category,
            original_name,
            content_type,
            size_bytes,
            created_at
          FROM files
          WHERE id = ?
        `)
        .bind(id)
        .first();

    if (!existing) {
      return error(
        "File not found.",
        404
      );
    }

    const body =
      await request.json();

    const name =
      String(
        body.name ??
        existing.name
      ).trim();

    if (!name) {
      return error(
        "File name is required."
      );
    }

    const requestedCategory =
  String(
    body.category ??
    existing.category
  ).trim();

const categoryRecord =
  await env.DB
    .prepare(`
      SELECT name
      FROM file_categories
      WHERE name = ?
    `)
    .bind(requestedCategory)
    .first();

if (!categoryRecord) {
  return error(
    "Valid file category is required."
  );
}

const requestedFolderId =
  String(body.folderId || "").trim() || null;

let folderId = null;

if (requestedFolderId) {
  const folderRecord = await env.DB.prepare(`
    SELECT id FROM file_folders
    WHERE id = ? AND category = ?
  `).bind(requestedFolderId, requestedCategory).first();

  if (!folderRecord) {
    return error("Valid folder is required.");
  }

  folderId = folderRecord.id;
}

    const result =
      await env.DB
        .prepare(`
          UPDATE files
          SET
            name = ?,
            category = ?,
            folder_id = ?
          WHERE id = ?
        `)
        .bind(
          name,
          requestedCategory,
          folderId,
          id
        )
        .run();

    if (!result.meta.changes) {
      return error(
        "File not found.",
        404
      );
    }

    return json({
      ok: true,
      file: {
        id,
        name,
        category:
          requestedCategory,
        folderId,
        originalName:
          existing.original_name ||
          existing.name,
        contentType:
          existing.content_type ||
          "application/octet-stream",
        sizeBytes:
          Number(
            existing.size_bytes || 0
          ),
        createdAt:
          existing.created_at
      }
    });
  }


  // DELETE FILE
  if (
    request.method === "DELETE" &&
    id &&
    !action
  ) {
    const fileRecord =
      await env.DB
        .prepare(`
          SELECT
            id,
            r2_key
          FROM files
          WHERE id = ?
        `)
        .bind(id)
        .first();

    if (!fileRecord) {
      return error(
        "File not found.",
        404
      );
    }

    /*
      Delete from R2 first.

      If R2 deletion throws, D1 remains intact,
      so the user still has a valid file record
      instead of silently losing track of it.
    */
    if (fileRecord.r2_key) {
      await env.IMAGES.delete(
        fileRecord.r2_key
      );
    }

    await env.DB
      .prepare(`
        DELETE FROM files
        WHERE id = ?
      `)
      .bind(id)
      .run();

    return json({
      ok: true
    });
  }


  return error(
    "Unsupported file request.",
    405
  );
}


/* =========================================================
   REMINDERS
========================================================= */

async function handleReminders(
  request,
  env,
  id
) {
  if (
    request.method === "GET" &&
    !id
  ) {
    const result = await env.DB
      .prepare(`
        SELECT
          id,
          title,
          event_id,
          remind_by,
          done,
          created_at
        FROM reminders
        ORDER BY created_at ASC
      `)
      .all();

    return json({
      ok: true,

      reminders:
        result.results.map(
          row => ({
            id: row.id,
            title: row.title,
            eventId: row.event_id,
            remindBy: row.remind_by,
            done: Boolean(row.done),
            createdAt: row.created_at,
            type: "manual"
          })
        )
    });
  }

  if (
    request.method === "POST" &&
    !id
  ) {
    const reminder =
      await request.json();

    if (
      !reminder.id ||
      !reminder.title
    ) {
      return error(
        "Reminder ID and title are required."
      );
    }

    await env.DB
      .prepare(`
        INSERT INTO reminders (
          id,
          title,
          event_id,
          remind_by,
          done,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        reminder.id,
        reminder.title,
        reminder.eventId || null,
        reminder.remindBy || null,
        reminder.done ? 1 : 0,
        reminder.createdAt ||
          new Date().toISOString()
      )
      .run();

    return json({
      ok: true,
      reminder
    });
  }

  if (
    request.method === "PUT" &&
    id
  ) {
    const reminder =
      await request.json();

    const result = await env.DB
      .prepare(`
        UPDATE reminders
        SET
          title = ?,
          event_id = ?,
          remind_by = ?,
          done = ?
        WHERE id = ?
      `)
      .bind(
        reminder.title,
        reminder.eventId || null,
        reminder.remindBy || null,
        reminder.done ? 1 : 0,
        id
      )
      .run();

    if (!result.meta.changes) {
      return error(
        "Reminder not found.",
        404
      );
    }

    return json({
      ok: true
    });
  }

  if (
    request.method === "DELETE" &&
    id
  ) {
    await env.DB
      .prepare(`
        DELETE FROM reminders
        WHERE id = ?
      `)
      .bind(id)
      .run();

    return json({
      ok: true
    });
  }

  return error(
    "Unsupported reminder request.",
    405
  );
}



/* =========================================================
   PUSH NOTIFICATIONS
========================================================= */

async function ensurePushTables(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      endpoint TEXT PRIMARY KEY,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_seen TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS push_pending (
      id TEXT PRIMARY KEY,
      endpoint TEXT NOT NULL,
      notification_key TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      url TEXT NOT NULL DEFAULT '/admin/',
      created_at TEXT NOT NULL,
      UNIQUE(endpoint, notification_key)
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS push_deliveries (
      endpoint TEXT NOT NULL,
      notification_key TEXT NOT NULL,
      sent_at TEXT NOT NULL,
      PRIMARY KEY(endpoint, notification_key)
    )
  `).run();
}

async function handlePush(request, env, action) {
  await ensurePushTables(env);

  if (request.method === "POST" && action === "subscribe") {
    const body = await request.json();
    const endpoint = String(body?.endpoint || "").trim();
    const p256dh = String(body?.keys?.p256dh || "").trim();
    const auth = String(body?.keys?.auth || "").trim();
    if (!endpoint || !p256dh || !auth) return error("Valid push subscription required.");

    const now = new Date().toISOString();
    await env.DB.prepare(`
      INSERT INTO push_subscriptions (endpoint, p256dh, auth, created_at, last_seen)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(endpoint) DO UPDATE SET
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        last_seen = excluded.last_seen
    `).bind(endpoint, p256dh, auth, now, now).run();

    return json({ ok: true });
  }

  if (request.method === "POST" && action === "unsubscribe") {
    const body = await request.json();
    const endpoint = String(body?.endpoint || "").trim();
    if (endpoint) {
      await env.DB.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`).bind(endpoint).run();
      await env.DB.prepare(`DELETE FROM push_pending WHERE endpoint = ?`).bind(endpoint).run();
    }
    return json({ ok: true });
  }

  if (request.method === "POST" && action === "test") {
    if (!env.VAPID_PRIVATE_JWK) return error("VAPID private key is not configured.", 500);

    const body = await request.json();
    const endpoint = String(body?.endpoint || "").trim();
    if (!endpoint) return error("Push endpoint required.");

    const subscription = await env.DB.prepare(`
      SELECT endpoint FROM push_subscriptions WHERE endpoint = ?
    `).bind(endpoint).first();
    if (!subscription) return error("This device is not registered for SWL notifications.", 404);

    const notificationKey = `test:${crypto.randomUUID()}`;
    const pendingId = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO push_pending (id, endpoint, notification_key, title, body, url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      pendingId,
      endpoint,
      notificationKey,
      "🧸 SWL Ops is officially on fluff duty!",
      "Notifications are working. We’ll nudge you when something needs your attention.",
      "/admin/",
      now
    ).run();

    const response = await sendEmptyWebPush(env, endpoint);
    if (response.status === 404 || response.status === 410) {
      await env.DB.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`).bind(endpoint).run();
      await env.DB.prepare(`DELETE FROM push_pending WHERE endpoint = ?`).bind(endpoint).run();
      return error("This device's push subscription expired. Turn notifications off and back on, then try again.", 410);
    }
    if (!response.ok) {
      await env.DB.prepare(`DELETE FROM push_pending WHERE id = ?`).bind(pendingId).run();
      return error(`Push service returned ${response.status}.`, 502);
    }

    return json({ ok: true });
  }

  if (request.method === "POST" && action === "pending") {
    const body = await request.json();
    const endpoint = String(body?.endpoint || "").trim();
    if (!endpoint) return error("Push endpoint required.");
    const row = await env.DB.prepare(`
      SELECT id, notification_key, title, body, url FROM push_pending
      WHERE endpoint = ? ORDER BY created_at ASC LIMIT 1
    `).bind(endpoint).first();
    return json({ ok: true, notification: row || null });
  }

  if (request.method === "POST" && action === "ack") {
    const body = await request.json();
    const endpoint = String(body?.endpoint || "").trim();
    const id = String(body?.id || "").trim();
    if (!endpoint || !id) return error("Push endpoint and notification ID required.");
    const row = await env.DB.prepare(`
      SELECT notification_key FROM push_pending WHERE id = ? AND endpoint = ?
    `).bind(id, endpoint).first();
    if (!row) return json({ ok: true }); // Already acknowledged.
    await env.DB.prepare(`
      INSERT OR IGNORE INTO push_deliveries (endpoint, notification_key, sent_at)
      VALUES (?, ?, ?)
    `).bind(endpoint, row.notification_key, new Date().toISOString()).run();
    await env.DB.prepare(`DELETE FROM push_pending WHERE id = ? AND endpoint = ?`)
      .bind(id, endpoint).run();
    return json({ ok: true });
  }

  return error("Unsupported push request.", 405);
}

function swlLocalParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(date);
  const get = type => Number(parts.find(part => part.type === type)?.value || 0);
  return { year:get("year"), month:get("month"), day:get("day"), hour:get("hour"), minute:get("minute") };
}

function swlDateOnlyValue(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return Date.UTC(Number(match[1]), Number(match[2])-1, Number(match[3]));
}

function swlTodayValue() {
  const p = swlLocalParts();
  return Date.UTC(p.year, p.month-1, p.day);
}

function swlPick(list, key) {
  let hash = 2166136261;
  for (const char of String(key)) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return list[(hash >>> 0) % list.length];
}

function eventPushCopy(event, days) {
  const name = event.name || "Your SWL event";
  const capacity = Number(event.swlCapacity || event.guestCount || 0);
  if (days === 7) {
    return {
      title: swlPick(["🧸 One week to go!", "💛 Seven days until the fluff flies", "✨ One week until event magic"], event.id + "-7"),
      body: swlPick([
        `${name} is one week away — time to give prep a little love.`,
        `${name} is coming up next week${capacity ? ` · ${capacity} SWL guests planned` : ""}.`,
        `The plush countdown is on: one week until ${name}.`
      ], event.id + "-7-body")
    };
  }
  return {
    title: swlPick(["💛 Tomorrow’s the day!", "🧸 Plush friends, report for duty", "✨ Event magic tomorrow"], event.id + "-1"),
    body: swlPick([
      `${name} is tomorrow${capacity ? ` · ${capacity} SWL guests planned` : ""}.`,
      `One sleep until ${name}. Time for the final fluff check.`,
      `${name} is tomorrow — hearts, fluff, and tiny friends at the ready.`
    ], event.id + "-1-body")
  };
}

function reminderPushCopy(reminder, now) {
  const due = reminder.remind_by ? new Date(reminder.remind_by) : null;
  const lateMinutes = due ? Math.max(0, (now - due) / 60000) : 0;
  if (lateMinutes > 60) {
    return {
      title: swlPick(["👀 This one still needs some love", "🧸 Tiny nudge from Ops", "💛 One loose end is waving"], reminder.id),
      body: `${reminder.title} is overdue.`
    };
  }
  return {
    title: swlPick(["✨ A little SWL nudge", "💛 Friendly fluff reminder", "🧸 Ops remembered for you"], reminder.id),
    body: `${reminder.title} is due now.`
  };
}

// All scheduled notification times below use America/Chicago. The daily key
// prevents repeats across 15-minute Cron runs and across registered devices.
const SWL_GEAR_CHECKLIST = [
  "Stuffing machine", "Fluff", "EcoFlow / power", "Rugs", "Tablecloths",
  "Tables", "Wood crates", "Photo-op pieces / photo hearts", "Friend Hotel",
  "Adoption certificates", "Pens", "Welcome sign", "Signage", "Trash bags",
  "Felt wall", "Felt-wall accessories", "Clothes / mini wardrobe rack", "Crash kit"
];

function swlDateKey(parts) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function swlEventEndKey(event) {
  const date = String(event.endDate || event.date || "").slice(0, 10);
  if (!date) return "";
  if (!event.endTime && event.date && event.time) {
    const match = `${String(event.date).slice(0, 10)}T${String(event.time).slice(0, 5)}`
      .match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (match) {
      const duration = event.eventType === "Birthday Party" ? 120 : 240;
      const end = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5])) + duration * 60000);
      return `${end.getUTCFullYear()}-${String(end.getUTCMonth() + 1).padStart(2, "0")}-${String(end.getUTCDate()).padStart(2, "0")}T${String(end.getUTCHours()).padStart(2, "0")}:${String(end.getUTCMinutes()).padStart(2, "0")}`;
    }
  }
  const time = String(event.endTime || "23:59").slice(0, 5);
  return `${date}T${time}`;
}

function swlEventMissing(event) {
  const statuses = event.loadOut || {};
  const oldPacked = new Set((event.packing || []).filter(x => x?.done).map(x => x.name));
  const gear = SWL_GEAR_CHECKLIST.filter(name => {
    const status = statuses[`gear:${name}`];
    return status !== "packed" && status !== "loaded" && !oldPacked.has(name);
  });
  const inventory = (event.reservations || []).filter(item =>
    Number(item?.quantity || 0) > 0 &&
    !["packed", "loaded"].includes(statuses[`inventory:${item.itemId}`])
  ).map(item => String(item.name || item.itemId || "reserved supplies"));
  return [...new Set([...gear, ...inventory])];
}

async function processPushNotifications(env) {
  if (!env.VAPID_PRIVATE_JWK) {
    console.warn("Push skipped: VAPID_PRIVATE_JWK is not configured.");
    return;
  }

  await ensurePushTables(env);
  const subscriptions = (await env.DB.prepare(`SELECT endpoint FROM push_subscriptions`).all()).results || [];
  if (!subscriptions.length) return;

  const candidates = [];
  const local = swlLocalParts();
  const today = swlTodayValue();
  const dayKey = swlDateKey(local);
  const now = new Date();
  // The first Cron execution in/after the hour sends the daily batch.
  // No minute-specific cutoff: a delayed Cron won't silently skip the day.
  const morning = local.hour >= 9;
  const afternoon = local.hour >= 16;
  const evening = local.hour >= 18;
  const nightly = local.hour >= 20;
  const eventRows = (await env.DB.prepare(`SELECT id, data FROM events`).all()).results || [];
  const events = [];
  for (const row of eventRows) {
    let event;
    try { event = JSON.parse(row.data); } catch { continue; }
    if (!event || event.closed || !event.date) continue;
    const dateValue = swlDateOnlyValue(event.date);
    if (dateValue == null) continue;
    events.push({ ...event, id: event.id || row.id, days: Math.round((dateValue - today) / 86400000) });
  }

  const localNowKey = `${dayKey}T${String(local.hour).padStart(2, "0")}:${String(local.minute).padStart(2, "0")}`;
  for (const event of events) {
    const endKey = swlEventEndKey(event);
    if (!endKey || endKey > localNowKey) continue;
    candidates.push({
      key: `event-closeout:${event.id}:${endKey}`,
      title: `📋 Close out ${event.name || "SWL event"}`,
      body: "The event has ended. Reconcile what came back so inventory stays accurate.",
      url: "/admin/?screen=events"
    });
    const endDay = swlDateOnlyValue(endKey.slice(0, 10));
    if (morning && endDay != null && endDay < today) {
      candidates.push({
        key: `event-closeout-followup:${event.id}:${dayKey}`,
        title: "🧸 Event closeout is still waiting",
        body: `${event.name || "An SWL event"} still needs inventory reconciliation.`,
        url: "/admin/?screen=events"
      });
    }
  }

  const reminders = (await env.DB.prepare(`
    SELECT id, title, event_id, remind_by, done FROM reminders WHERE done = 0
  `).all()).results || [];
  const outstanding = reminders.filter(r => r.remind_by &&
    !Number.isNaN(new Date(r.remind_by).getTime()) && new Date(r.remind_by) <= now);

  if (morning) {
    for (const event of events) {
      if (event.days === 7 || event.days === 1) {
        candidates.push({key:`event:${event.id}:${event.date}:${event.days}`,
          ...eventPushCopy(event, event.days), url:"/admin/?screen=events"});
      }
      if (event.days === 0) {
        candidates.push({key:`event-today:${event.id}:${dayKey}`,
          title:`🧸 Event day: ${event.name || "SWL event"}`,
          body:"Today's the day! Check your supplies, setup and arrival details.",
          url:"/admin/?screen=events"});
      }
    }
  }

  // A second, distinct reminder on the evening BEFORE every event.
  if (evening) for (const event of events) {
    if (event.days !== 1) continue;
    const missing = swlEventMissing(event);
    candidates.push({key:`event-eve:${event.id}:${dayKey}`,
      title:`🌙 Tomorrow: ${event.name || "SWL event"}`,
      body:missing.length ? `${missing.length} load-out items still unchecked: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "…" : ""}`
        : "Load-out looks checked off. Confirm arrival and setup details.",
      url:"/admin/?screen=events"});
  }

  // Daily per-event nudge for unchecked load-out items in the coming week.
  // This is based on actual saved loadOut/packing data, not a fabricated shortage.
  if (afternoon) for (const event of events) {
    if (event.days < 0 || event.days > 7) continue;
    const missing = swlEventMissing(event);
    const eventTasks = reminders.filter(r => r.event_id === event.id);
    if (!missing.length && !eventTasks.length) continue;
    const pieces = [];
    if (missing.length) pieces.push(`${missing.length} unchecked load-out items (${missing.slice(0, 2).join(", ")}${missing.length > 2 ? "…" : ""})`);
    if (eventTasks.length) pieces.push(`${eventTasks.length} open event reminders`);
    candidates.push({key:`event-open:${event.id}:${dayKey}`,
      title:`📋 ${event.name || "SWL event"}: still to do`,
      body:pieces.join(" · "), url:"/admin/?screen=events"});
  }

  for (const reminder of outstanding) {
    // Initial due alert, plus fresh nudges twice daily while still incomplete.
    candidates.push({key:`reminder:${reminder.id}`,
      ...reminderPushCopy(reminder, now), url:"/admin/?screen=attention"});
    if (morning) candidates.push({key:`reminder-followup:${reminder.id}:${dayKey}:am`,
      title:"⏰ Still on your list", body:`${reminder.title} is overdue and not checked off.`,
      url:"/admin/?screen=attention"});
    if (afternoon) candidates.push({key:`reminder-followup:${reminder.id}:${dayKey}:pm`,
      title:"📣 One more nudge", body:`${reminder.title} is still open.`,
      url:"/admin/?screen=attention"});
  }

  if (nightly) {
    const tomorrow = events.filter(e => e.days === 1);
    const nextWeek = events.filter(e => e.days >= 0 && e.days <= 7);
    const unchecked = nextWeek.reduce((sum, e) => sum + swlEventMissing(e).length, 0);
    candidates.push({key:`nightly-wrap:${dayKey}`,
      title:"🌙 SWL Ops nightly wrap-up",
      body:`${tomorrow.length} event${tomorrow.length === 1 ? "" : "s"} tomorrow · ${outstanding.length} overdue reminder${outstanding.length === 1 ? "" : "s"} · ${unchecked} unchecked load-out items across the next 7 days.`,
      url:"/admin/"});
  }

  // Appointments: 15-minute Cron must not use a five-minute eligibility window.
  await ensureAppointmentsTable(env);
  const appointmentRows = (await env.DB.prepare(`SELECT * FROM appointments
    WHERE starts_at >= ? AND starts_at <= ? AND remind_minutes >= 0`)
    .bind(new Date(now.getTime()-86400000).toISOString(),
      new Date(now.getTime()+86400000).toISOString()).all()).results || [];
  for (const appointment of appointmentRows) {
    const reminderAt = new Date(appointment.starts_at).getTime() - appointment.remind_minutes * 60000;
    if (!Number.isFinite(reminderAt) || reminderAt > now.getTime() || now.getTime()-reminderAt > 30*60000) continue;
    const when = new Intl.DateTimeFormat("en-US", {timeZone:"America/Chicago",
      hour:"numeric", minute:"2-digit"}).format(new Date(appointment.starts_at));
    candidates.push({key:`appointment:${appointment.id}:${appointment.starts_at}:${appointment.remind_minutes}`,
      title:`${appointment.title} ${appointment.remind_minutes===0 ? "starts now" : "coming up"}`,
      body:`${appointment.kind === "call" ? "Phone call" : "Appointment"} at ${when}${appointment.location ? " · " + appointment.location : ""}`,
      url:"/admin/?screen=calendar"});
  }

  console.log("SWL scheduled push candidates", {subscriptions:subscriptions.length, candidates:candidates.map(c => c.key)});
  for (const sub of subscriptions) {
    for (const candidate of candidates) {
      const already = await env.DB.prepare(`
        SELECT 1 FROM push_deliveries WHERE endpoint = ? AND notification_key = ?
      `).bind(sub.endpoint, candidate.key).first();
      if (already) continue;
      try {
        await env.DB.prepare(`
          INSERT OR IGNORE INTO push_pending (id, endpoint, notification_key, title, body, url, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(crypto.randomUUID(), sub.endpoint, candidate.key, candidate.title,
          candidate.body, candidate.url, now.toISOString()).run();
        const response = await sendEmptyWebPush(env, sub.endpoint);
        if (response.status === 404 || response.status === 410) {
          await env.DB.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`).bind(sub.endpoint).run();
          await env.DB.prepare(`DELETE FROM push_pending WHERE endpoint = ?`).bind(sub.endpoint).run();
          break;
        }
        if (!response.ok) {
          console.warn("SWL scheduled push rejected", {key:candidate.key, status:response.status});
          continue;
        }
        // Acceptance by a push service is NOT proof that the device displayed it.
        // The service worker records delivery through /push/ack after showNotification.
        console.log("SWL scheduled push accepted; awaiting device acknowledgment", {key:candidate.key, status:response.status});
      } catch (err) {
        console.error("Push send failed", {key:candidate.key, error:String(err)});
      }
    }
  }
}

function base64UrlBytes(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlText(value) {
  return base64UrlBytes(new TextEncoder().encode(value));
}

function base64UrlDecode(value) {
  const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function vapidToken(env, endpoint) {
  const jwk = JSON.parse(env.VAPID_PRIVATE_JWK);
  const publicKey = base64UrlBytes(Uint8Array.from([4, ...base64UrlDecode(jwk.x), ...base64UrlDecode(jwk.y)]));
  const header = base64UrlText(JSON.stringify({ typ:"JWT", alg:"ES256" }));
  const payload = base64UrlText(JSON.stringify({
    aud: new URL(endpoint).origin,
    exp: Math.floor(Date.now()/1000) + 12*60*60,
    sub: env.VAPID_SUBJECT || "mailto:hello@stuffedwithlovegb.com"
  }));
  const unsigned = `${header}.${payload}`;
  const key = await crypto.subtle.importKey("jwk", jwk, { name:"ECDSA", namedCurve:"P-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign({ name:"ECDSA", hash:"SHA-256" }, key, new TextEncoder().encode(unsigned)));
  return { token:`${unsigned}.${base64UrlBytes(signature)}`, publicKey };
}

async function sendEmptyWebPush(env, endpoint) {
  const vapid = await vapidToken(env, endpoint);
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `vapid t=${vapid.token},k=${vapid.publicKey}`,
      "TTL": "300",
      "Urgency": "normal"
    }
  });
}

/* =========================================================
   NOTES
========================================================= */

async function handleNotes(
  request,
  env,
  id
) {
  if (
    request.method === "GET"
  ) {
    const url =
      new URL(request.url);

    const eventId =
      url.searchParams.get(
        "eventId"
      );

    if (!eventId) {
      return error(
        "eventId is required."
      );
    }

    const result = await env.DB
      .prepare(`
        SELECT
          id,
          event_id,
          text,
          created_at
        FROM notes
        WHERE event_id = ?
        ORDER BY created_at ASC
      `)
      .bind(eventId)
      .all();

    return json({
      ok: true,
      notes: result.results
    });
  }

  if (
    request.method === "POST" &&
    !id
  ) {
    const note =
      await request.json();

    if (
      !note.id ||
      !note.eventId ||
      !note.text
    ) {
      return error(
        "Note ID, event ID and text are required."
      );
    }

    await env.DB
      .prepare(`
        INSERT INTO notes (
          id,
          event_id,
          text,
          created_at
        )
        VALUES (?, ?, ?, ?)
      `)
      .bind(
        note.id,
        note.eventId,
        note.text,
        note.createdAt ||
          new Date().toISOString()
      )
      .run();

    return json({
      ok: true,
      note
    });
  }

  if (
    request.method === "DELETE" &&
    id
  ) {
    await env.DB
      .prepare(`
        DELETE FROM notes
        WHERE id = ?
      `)
      .bind(id)
      .run();

    return json({
      ok: true
    });
  }

  return error(
    "Unsupported note request.",
    405
  );
}

/* STUFF AT HOME CHECKOUT — added alongside the existing SWL Ops API. */
const SHOP_PRODUCTS = {teddy:'Honey Teddy',dog:'Golden Retriever',dino:'Dino',unicorn:'Unicorn'};
const SHOP_STATES = new Set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' '));
// PROVISIONAL packing estimates. Replace these after measuring your packed orders.
const SHOP_PARCELS = [{capacity:1,length:8,width:8,height:8,weight:3},{capacity:2,length:16,width:8,height:8,weight:6},{capacity:4,length:16,width:16,height:8,weight:12},{capacity:10,length:24,width:18,height:18,weight:30}];
function shopJson(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
function shopFail(message,status=400){const e=new Error(message);e.status=status;throw e;}
function shopTest(env){return env.SQUARE_ENVIRONMENT!=='production';}
function shopConfig(env){
 const test=shopTest(env);
 const credentials=env.SQUARE_APPLICATION_ID&&env.SQUARE_LOCATION_ID&&env.SQUARE_ACCESS_TOKEN&&env.SHIPPO_API_TOKEN;
 const address=env.SHIP_FROM_STREET1&&env.SHIP_FROM_CITY&&env.SHIP_FROM_STATE&&env.SHIP_FROM_ZIP;
 const match=test?String(env.SQUARE_APPLICATION_ID||'').startsWith('sandbox-')&&String(env.SHIPPO_API_TOKEN||'').startsWith('shippo_test_'):!String(env.SQUARE_APPLICATION_ID||'').startsWith('sandbox-')&&String(env.SHIPPO_API_TOKEN||'').startsWith('shippo_live_');
 const enabled=test||(env.SHOP_LIVE_ENABLED==='true'&&env.SHOP_PACKAGING_CONFIRMED==='true');
 return {test,ready:Boolean(credentials&&address&&match&&enabled),applicationId:env.SQUARE_APPLICATION_ID||'',locationId:env.SQUARE_LOCATION_ID||'',message:!credentials?'Checkout connection settings are incomplete.':!address?'Shipping origin settings are incomplete.':!match?'Payment and shipping credentials must both use the selected test or live mode.':!enabled?'Online ordering is coming soon. Please contact us for help.':''};
}
async function shopBody(request){if(!request.headers.get('Content-Type')?.includes('application/json'))shopFail('Please send a JSON checkout request.',415);const text=await request.text();if(text.length>40000)shopFail('Checkout request is too large.',413);try{return JSON.parse(text);}catch(e){shopFail('Checkout request could not be read.');}}
function shopChild(c){if(!c||!SHOP_PRODUCTS[c.productId])shopFail('Choose an available plush friend.');const shirt=c.shirt===true;const shirtName=shirt?String(c.shirtName||'').trim():'';if(shirt&&(!shirtName||shirtName.length>40))shopFail('Each custom shirt needs a name of 1–40 characters.');return {productId:c.productId,shirt,shirtName,recorder:c.recorder===true};}
function shopCart(raw){if(!Array.isArray(raw)||!raw.length||raw.length>50)shopFail('Your cart is empty or too large.');let kits=0,subtotal=0;const cart=raw.map(r=>{const quantity=Number(r.quantity);if(!Number.isSafeInteger(quantity)||quantity<1||quantity>20)shopFail('Choose a quantity from 1 to 20.');let clean,price;if(r.kind==='kit'){clean={kind:'kit',quantity,...shopChild(r)};price=2999+(clean.shirt?1000:0)+(clean.recorder?1000:0);kits+=quantity;}else if(r.kind==='birthday'&&Array.isArray(r.children)&&r.children.length===10){clean={kind:'birthday',quantity,children:r.children.map(shopChild)};price=25000+clean.children.reduce((n,c)=>n+(c.shirt?1000:0)+(c.recorder?1000:0),0);kits+=10*quantity;}else shopFail('A Birthday Box must contain exactly ten friends.');subtotal+=price*quantity;return clean;});if(kits>20)shopFail('Online checkout supports up to 20 kits per order. Please contact us for a larger order.');return {cart,kits,subtotal};}
function shopAddress(a){if(!a||typeof a!=='object')shopFail('Enter your delivery address.');const v={};for(const [key,max] of Object.entries({name:120,email:180,street1:180,street2:80,city:100,state:2,zip:10,phone:30})){v[key]=String(a[key]||'').trim();if(v[key].length>max)shopFail('Please shorten the '+key+' field.');}v.state=v.state.toUpperCase();v.email=v.email.toLowerCase();if(!v.name||!v.street1||!v.city||!SHOP_STATES.has(v.state)||!/^\d{5}(-\d{4})?$/.test(v.zip)||!/^\S+@\S+\.\S+$/.test(v.email))shopFail('Enter a complete U.S. shipping address and valid email.');return v;}
function shopPacking(kits,env){let profiles=SHOP_PARCELS;if(env.SHOP_PARCEL_PROFILES){try{profiles=JSON.parse(env.SHOP_PARCEL_PROFILES);}catch(e){shopFail('Shipping box configuration needs attention.',503);}}if(!Array.isArray(profiles)||!profiles.length||profiles.some(p=>!Number.isSafeInteger(p.capacity)||p.capacity<1||['length','width','height','weight'].some(k=>!Number.isFinite(Number(p[k]))||Number(p[k])<=0)))shopFail('Shipping box configuration needs attention.',503);profiles=[...profiles].sort((a,b)=>a.capacity-b.capacity);const parcels=[];while(kits>0){const p=profiles.find(p=>p.capacity>=kits)||profiles[profiles.length-1];parcels.push({length:String(p.length),width:String(p.width),height:String(p.height),weight:String(p.weight),distance_unit:'in',mass_unit:'lb'});kits-=p.capacity;}return parcels;}
let shopSchemaPromise;
async function shopTables(env){if(!shopSchemaPromise){shopSchemaPromise=(async()=>{await env.DB.prepare(`CREATE TABLE IF NOT EXISTS shop_rate_limits (id TEXT PRIMARY KEY, hits INTEGER NOT NULL, created_at INTEGER NOT NULL)`).run();await env.DB.prepare(`CREATE TABLE IF NOT EXISTS shop_quotes (id TEXT PRIMARY KEY, data TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)`).run();await env.DB.prepare(`CREATE TABLE IF NOT EXISTS shop_orders (id TEXT PRIMARY KEY, quote_id TEXT NOT NULL UNIQUE, access_key TEXT NOT NULL, status TEXT NOT NULL, data TEXT NOT NULL, payment_request TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`).run();})().catch(e=>{shopSchemaPromise=null;throw e;});}await shopSchemaPromise;}
async function shopExternal(url,options={}){try{const r=await fetch(url,{...options,signal:AbortSignal.timeout(25000)});const d=await r.json();return {ok:r.ok,status:r.status,data:d};}catch(e){shopFail('A checkout service is unavailable. Please try again shortly.',503);}}
async function shopWisconsinTax(address){
 if(address.state!=='WI')return {rate:0,source:'No collection configured outside Wisconsin'};
 // Same public lookup service used by Wisconsin DOR's official lookup page.
 // This is not a contracted tax API; if it changes or cannot match, checkout stops.
 const date=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',month:'2-digit',day:'2-digit',year:'numeric'}).format(new Date());
 const endpoint=new URL('https://ww2.revenue.wi.gov/VaultExternal/rest/strb/lookup');
 endpoint.search=new URLSearchParams({saleDate:date,address:address.street1,zip:address.zip.slice(0,5),plus4:address.zip.slice(6)}).toString();
 const r=await shopExternal(endpoint.toString());const s=r.data?.subject;
 const boundaries=s?.boundaries?.filter(x=>x.salesType==='general')||[];
 if(!r.ok||r.data.result!=='Ok'||s.fullMatch!=='t'||boundaries.length!==1)shopFail('We could not confirm the Wisconsin tax rate for this street address. Please check the address or contact us.',422);
 const rate=Number(String(boundaries[0].totalRate).replace('%',''))/100;
 if(!Number.isFinite(rate)||rate<.05||rate>.10)shopFail('The Wisconsin tax lookup needs attention. Please contact us.',503);
 return {rate,source:'Wisconsin Department of Revenue address lookup',interpretedAddress:s.interpretAddress,jurisdictions:boundaries[0].jurisdictions};
}
async function shopQuote(request,env){
 const ip=request.headers.get('CF-Connecting-IP');
 if(ip){const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip)))).map(v=>v.toString(16).padStart(2,'0')).join('');const now=Date.now();const bucket=hash+'-'+Math.floor(now/60000);const limit=await env.DB.prepare('INSERT INTO shop_rate_limits (id,hits,created_at) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET hits=hits+1 RETURNING hits').bind(bucket,now).first();if(limit.hits>5)shopFail('Please wait a minute before requesting more shipping quotes.',429);await env.DB.prepare('DELETE FROM shop_rate_limits WHERE created_at<?').bind(now-3600000).run();}
 const {cart:raw,address:a}=await shopBody(request);const order=shopCart(raw),address=shopAddress(a);
 const tax=await shopWisconsinTax(address);const parcels=shopPacking(order.kits,env);
 const from={name:env.SHIP_FROM_NAME||'Stuffed With Love LLC',street1:env.SHIP_FROM_STREET1,street2:env.SHIP_FROM_STREET2||'',city:env.SHIP_FROM_CITY,state:env.SHIP_FROM_STATE,zip:env.SHIP_FROM_ZIP,country:'US',email:'hello@stuffedwithlovegb.com',phone:env.SHIP_FROM_PHONE||'9206648282'};
 const result=await shopExternal('https://api.goshippo.com/shipments/',{method:'POST',headers:{Authorization:'ShippoToken '+env.SHIPPO_API_TOKEN,'Content-Type':'application/json','SHIPPO-API-VERSION':'2018-02-08'},body:JSON.stringify({address_from:from,address_to:{...address,country:'US'},parcels,async:false})});
 if(!result.ok)shopFail('Shipping options could not be retrieved. Please check your address or contact us.',503);
 const rates=(result.data.rates||[]).filter(r=>r.currency==='USD'&&r.object_id&&Number.isFinite(Number(r.amount))&&Number(r.amount)>0).map(r=>({id:r.object_id,provider:r.provider,service:r.servicelevel?.name||r.servicelevel?.token||'Delivery',amount:Math.round(Number(r.amount)*100),days:Number(r.estimated_days)||null})).sort((a,b)=>a.amount-b.amount).slice(0,12).map(r=>({...r,tax:Math.round((order.subtotal+r.amount)*tax.rate)}));
 if(!rates.length)shopFail('No shipping options were available for this address and box size. Please contact us.',422);
 const id=crypto.randomUUID(),now=Date.now(),data={...order,address,tax,rates,parcels,shipmentId:result.data.object_id,test:shopTest(env)};
 await env.DB.prepare('DELETE FROM shop_quotes WHERE expires_at<?').bind(now-86400000).run();
 await env.DB.prepare('INSERT INTO shop_quotes (id,data,expires_at,created_at) VALUES (?,?,?,?)').bind(id,JSON.stringify(data),now+30*60000,now).run();
 return shopJson({id,subtotal:order.subtotal,address,rates,test:data.test});
}
async function shopPrepare(request,env){const body=await shopBody(request);const quote=await env.DB.prepare('SELECT * FROM shop_quotes WHERE id=?').bind(String(body.quoteId||'')).first();if(!quote||quote.expires_at<Date.now())shopFail('Your shipping quote expired. Please request shipping options again.',409);const data=JSON.parse(quote.data);if(data.test!==shopTest(env))shopFail('Checkout mode changed. Please refresh your shipping options.',409);const rate=data.rates.find(r=>r.id===body.rateId);if(!rate)shopFail('Choose one of the quoted shipping options.');const id='SWL-'+crypto.randomUUID(),key=crypto.randomUUID()+crypto.randomUUID(),now=Date.now();const d={...data,selectedRate:rate,total:data.subtotal+rate.amount+rate.tax,locationId:env.SQUARE_LOCATION_ID};const result=await env.DB.prepare('INSERT OR IGNORE INTO shop_orders (id,quote_id,access_key,status,data,created_at,updated_at) VALUES (?,?,?,?,?,?,?)').bind(id,quote.id,key,'pending',JSON.stringify(d),now,now).run();if(!result.meta.changes){const existing=await env.DB.prepare('SELECT id,access_key,status,data FROM shop_orders WHERE quote_id=?').bind(quote.id).first();const ed=JSON.parse(existing.data);if(ed.selectedRate.id!==rate.id)shopFail('This shipping quote already has an order. Request new shipping options.',409);return shopJson({id:existing.id,key:existing.access_key,status:existing.status});}return shopJson({id,key,status:'pending'});}
async function shopGetOrder(env,id,key){const row=await env.DB.prepare('SELECT * FROM shop_orders WHERE id=? AND access_key=?').bind(String(id||''),String(key||'')).first();if(!row)shopFail('Order reference was not found.',404);return row;}
function shopNote(data){const describe=c=>SHOP_PRODUCTS[c.productId]+(c.shirt?' [shirt: '+c.shirtName+']':'')+(c.recorder?' [+voice]':'');return data.cart.map(r=>r.quantity+'x '+(r.kind==='birthday'?'Birthday Box: '+r.children.map(describe).join(', '):describe(r))).join('; ').slice(0,450);}
async function shopProcessPayment(row,env){
 const data=JSON.parse(row.data),payload=JSON.parse(row.payment_request);
 const base=data.test?'https://connect.squareupsandbox.com':'https://connect.squareup.com';
 // Replaying this exact payload with the same idempotency key cannot charge twice.
 const r=await shopExternal(base+'/v2/payments',{method:'POST',headers:{Authorization:'Bearer '+env.SQUARE_ACCESS_TOKEN,'Content-Type':'application/json','Square-Version':'2026-09-16'},body:JSON.stringify(payload)});
 if(!r.ok){const codes=(r.data.errors||[]).map(e=>e.code);if(r.status>=500||r.status===429||codes.includes('IDEMPOTENCY_KEY_REUSED'))shopFail('Payment confirmation is pending. Do not place another order; check the order status.',503);await env.DB.prepare('UPDATE shop_orders SET status=?,payment_request=NULL,updated_at=? WHERE id=? AND status=?').bind('failed',Date.now(),row.id,'processing').run();return {status:'failed',id:row.id,error:'Square declined or could not complete this payment. Contact us or return to checkout with a new shipping quote.'};}
 const payment=r.data.payment;if(!payment?.id)shopFail('Payment confirmation is pending. Check your order status.',503);
 if(payment.status!=='COMPLETED'){shopFail('Payment confirmation is pending. Check your order status.',503);}
 if(payment.amount_money?.amount!==data.total||payment.amount_money?.currency!=='USD')shopFail('The payment amount needs review. Please contact us.',503);
 const updated={...data,paymentId:payment.id,receiptUrl:payment.receipt_url||'',paidAt:new Date().toISOString()};
 await env.DB.prepare('UPDATE shop_orders SET status=?,data=?,payment_request=NULL,updated_at=? WHERE id=?').bind('paid',JSON.stringify(updated),Date.now(),row.id).run();
 return {status:'paid',id:row.id};
}
async function shopPay(request,env){const body=await shopBody(request);let row=await shopGetOrder(env,body.id,body.key);if(row.status==='paid')return shopJson({status:'paid',id:row.id});if(row.status==='failed')return shopJson({status:'failed',id:row.id,error:'Payment was not completed. Please contact us or request a new shipping quote.'});if(row.status==='processing')return shopJson(await shopProcessPayment(row,env));const data=JSON.parse(row.data);if(data.test!==shopTest(env)||data.locationId!==env.SQUARE_LOCATION_ID)shopFail('Payment settings changed. Please start checkout again.',409);if(Date.now()-row.created_at>30*60000)shopFail('This checkout expired. Please request shipping options again.',409);const sourceId=String(body.sourceId||'');if(!sourceId||sourceId.length>500)shopFail('Square payment token is missing.');const a=data.address;const payload={source_id:sourceId,idempotency_key:row.id,amount_money:{amount:data.total,currency:'USD'},autocomplete:true,location_id:data.locationId,reference_id:row.id,buyer_email_address:a.email,shipping_address:{address_line_1:a.street1,address_line_2:a.street2,locality:a.city,administrative_district_level_1:a.state,postal_code:a.zip,country:'US',first_name:a.name.split(' ')[0],last_name:a.name.split(' ').slice(1).join(' ')},note:'Stuff At Home '+shopNote(data)};
 const locked=await env.DB.prepare('UPDATE shop_orders SET status=?,payment_request=?,updated_at=? WHERE id=? AND status=?').bind('processing',JSON.stringify(payload),Date.now(),row.id,'pending').run();row=await shopGetOrder(env,body.id,body.key);if(!locked.meta.changes&&row.status==='paid')return shopJson({status:'paid',id:row.id});if(row.status!=='processing')shopFail('This order could not be processed. Please contact us.',409);return shopJson(await shopProcessPayment(row,env));}
async function shopOrderStatus(url,env){let row=await shopGetOrder(env,url.searchParams.get('id'),url.searchParams.get('key'));if(row.status==='processing'&&Date.now()-row.updated_at>10000){try{await shopProcessPayment(row,env);row=await shopGetOrder(env,row.id,row.access_key);}catch(e){/* Keep uncertain payments pending and recover with the same key. */}}
 const d=JSON.parse(row.data);return shopJson({id:row.id,status:row.status,test:d.test,total:d.total,cart:d.cart,address:d.address,receiptUrl:d.receiptUrl||''});}
async function handleShopApi(request,env,url){try{
 const path=url.pathname.slice('/shop/api/'.length);
 if(path==='config'&&request.method==='GET')return shopJson(shopConfig(env));
 if(path==='admin-orders'&&request.method==='GET'){if(!env.SHOP_ADMIN_TOKEN||request.headers.get('Authorization')!=='Bearer '+env.SHOP_ADMIN_TOKEN)shopFail('Enter your shop admin key.',401);await shopTables(env);const rows=(await env.DB.prepare("SELECT id,status,data,created_at FROM shop_orders WHERE status IN ('paid','processing','failed') ORDER BY created_at DESC LIMIT 100").all()).results;return shopJson({orders:rows.map(r=>({...JSON.parse(r.data),id:r.id,status:r.status,createdAt:r.created_at}))});}
 if(!['quote','prepare','pay','order'].includes(path))return shopJson({error:'Checkout route not found.'},404);
 if(request.method==='POST'){const origin=request.headers.get('Origin');if(origin&&origin!==url.origin)shopFail('Checkout must be submitted from this website.',403);}
 if(path==='order'&&request.method==='GET'){await shopTables(env);return await shopOrderStatus(url,env);}
 if(request.method!=='POST')return shopJson({error:'Unsupported checkout request.'},405);
 const config=shopConfig(env);if(!config.ready)shopFail(config.message,503);
 await shopTables(env);
 if(path==='quote')return await shopQuote(request,env);
 if(path==='prepare')return await shopPrepare(request,env);
 if(path==='pay')return await shopPay(request,env);
 return shopJson({error:'Checkout route not found.'},404);
}catch(e){return shopJson({error:e.status?e.message:'Checkout could not complete the request. Please try again or contact us.'},e.status||500);}}
