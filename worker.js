export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // SWL Ops API
    if (url.pathname.startsWith("/admin/api/")) {
      return handleApi(request, env, url);
    }

    // Everything else = normal website files
    return env.ASSETS.fetch(request);
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
        id
      );
    }

    if (resource === "reminders") {
      return handleReminders(
        request,
        env,
        id
      );
    }

    if (resource === "notes") {
      return handleNotes(
        request,
        env,
        id
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
        auto_reserve
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
          Boolean(row.auto_reserve)
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

  return json({
    ok: true,
    events,
    inventory,
    attention: reminders
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
  id
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
          auto_reserve
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
              Boolean(row.auto_reserve)
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
        Boolean(autoReserve)
    };

    return json({
      ok: true,
      item
    });
  }


  // UPDATE INVENTORY COUNT
  if (
    request.method === "PUT" &&
    id
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
    id
  ) {
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
