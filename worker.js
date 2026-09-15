export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
        id
      );
    }

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
  await ensureClientsTables(env);
  await ensurePushTables(env);
  await ensureFileFolders(env);
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
  id
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
      SELECT id, title, body, url
      FROM push_pending
      WHERE endpoint = ?
      ORDER BY created_at ASC
      LIMIT 1
    `).bind(endpoint).first();

    if (!row) return json({ ok: true, notification: null });
    await env.DB.prepare(`DELETE FROM push_pending WHERE id = ?`).bind(row.id).run();
    return json({ ok: true, notification: { title: row.title, body: row.body, url: row.url } });
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

  if (local.hour >= 9) {
    const rows = (await env.DB.prepare(`SELECT id, data FROM events`).all()).results || [];
    for (const row of rows) {
      let event;
      try { event = JSON.parse(row.data); } catch { continue; }
      if (!event || event.closed || !event.date) continue;
      const value = swlDateOnlyValue(event.date);
      if (value == null) continue;
      const days = Math.round((value - today) / 86400000);
      if (days !== 7 && days !== 1) continue;
      const copy = eventPushCopy(event, days);
      candidates.push({ key:`event:${event.id}:${event.date}:${days}`, ...copy, url:"/admin/" });
    }
  }

  const now = new Date();
  const reminders = (await env.DB.prepare(`
    SELECT id, title, remind_by, done
    FROM reminders
    WHERE done = 0 AND remind_by IS NOT NULL
  `).all()).results || [];

  for (const reminder of reminders) {
    const due = new Date(reminder.remind_by);
    if (Number.isNaN(due.getTime()) || due > now) continue;
    const copy = reminderPushCopy(reminder, now);
    candidates.push({ key:`reminder:${reminder.id}`, ...copy, url:"/admin/" });
  }

  for (const sub of subscriptions) {
    for (const candidate of candidates) {
      const already = await env.DB.prepare(`
        SELECT 1 FROM push_deliveries WHERE endpoint = ? AND notification_key = ?
      `).bind(sub.endpoint, candidate.key).first();
      if (already) continue;

      const pendingId = crypto.randomUUID();
      try {
        await env.DB.prepare(`
          INSERT OR IGNORE INTO push_pending (id, endpoint, notification_key, title, body, url, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(pendingId, sub.endpoint, candidate.key, candidate.title, candidate.body, candidate.url, now.toISOString()).run();

        const response = await sendEmptyWebPush(env, sub.endpoint);
        if (response.status === 404 || response.status === 410) {
          await env.DB.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`).bind(sub.endpoint).run();
          await env.DB.prepare(`DELETE FROM push_pending WHERE endpoint = ?`).bind(sub.endpoint).run();
          break;
        }
        if (!response.ok) {
          console.warn("Push service returned", response.status);
          continue;
        }

        await env.DB.prepare(`
          INSERT OR IGNORE INTO push_deliveries (endpoint, notification_key, sent_at) VALUES (?, ?, ?)
        `).bind(sub.endpoint, candidate.key, now.toISOString()).run();
      } catch (err) {
        console.error("Push send failed", err);
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
