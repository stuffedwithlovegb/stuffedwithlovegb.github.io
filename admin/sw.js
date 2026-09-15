/* STUFFED WITH LOVE OPS — SERVICE WORKER */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
  event.waitUntil((async () => {
    try {
      const subscription = await self.registration.pushManager.getSubscription();
      if (!subscription) return;

      const response = await fetch("/admin/api/push/pending", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });

      if (!response.ok) return;
      const data = await response.json();
      const note = data?.notification;
      if (!note) return;

      await self.registration.showNotification(note.title || "Stuffed With Love", {
        body: note.body || "A little SWL nudge 💛",
        icon: "/admin/icon-192.png",
        badge: "/admin/icon-192.png",
        tag: `swl-${Date.now()}`,
        data: { url: note.url || "/admin/" }
      });
    } catch (err) {
      console.error("SWL push notification failed", err);
    }
  })());
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = event.notification.data?.url || "/admin/";

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of windows) {
      if ("focus" in client) {
        await client.focus();
        return;
      }
    }

    if (self.clients.openWindow) {
      await self.clients.openWindow(url);
    }
  })());
});
