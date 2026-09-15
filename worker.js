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

    if (resource === "notes") {
      return handleNotes(
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
   FILES
========================================================= */

async function handleFiles(
  request,
  env,
  id,
  action
) {

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

    const allowedCategories = [
      "Brand",
      "Cricut",
      "Printables",
      "Event Assets",
      "Other"
    ];

    const category =
      allowedCategories.includes(
        requestedCategory
      )
        ? requestedCategory
        : "Other";

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
            r2_key,
            original_name,
            content_type,
            size_bytes,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          fileId,
          name,
          category,
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

    const allowedCategories = [
      "Brand",
      "Cricut",
      "Printables",
      "Event Assets",
      "Other"
    ];

    const requestedCategory =
      String(
        body.category ??
        existing.category
      ).trim();

    if (
      !allowedCategories.includes(
        requestedCategory
      )
    ) {
      return error(
        "Valid file category is required."
      );
    }

    const result =
      await env.DB
        .prepare(`
          UPDATE files
          SET
            name = ?,
            category = ?
          WHERE id = ?
        `)
        .bind(
          name,
          requestedCategory,
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
