/* STUFFED WITH LOVE OPS — SERVICE WORKER
   Receives a push, displays queued notifications, then acknowledges each one.
   Requires the matching SWL-Ops-Worker-Push-Fixed.txt Worker deployment.
*/
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

self.addEventListener("push", event => {
  event.waitUntil((async () => {
    const subscription = await self.registration.pushManager.getSubscription();
    if (!subscription) {
      console.warn("SWL push received without an active subscription");
      return;
    }
    const endpoint = subscription.endpoint;
    // One push may wake the worker for several queued reminders.
    for (let i = 0; i < 30; i++) {
      try {
        const response = await fetch("/admin/api/push/pending", {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint })
        });
        if (!response.ok) throw new Error(`Pending request failed: ${response.status}`);
        const note = (await response.json())?.notification;
        if (!note) return;

        await self.registration.showNotification(note.title || "Stuffed With Love", {
          body: note.body || "A little SWL nudge 💛",
          icon: "/admin/icon-192.png",
          badge: "/admin/icon-192.png",
          tag: `swl-${note.notification_key || note.id}`,
          renotify: true,
          data: { url: note.url || "/admin/" }
        });

        const ack = await fetch("/admin/api/push/ack", {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint, id: note.id })
        });
        if (!ack.ok) throw new Error(`Notification acknowledgment failed: ${ack.status}`);
      } catch (err) {
        console.error("SWL push notification failed; queued notification retained for retry", err);
        return;
      }
    }
  })());
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/admin/", self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if (new URL(client.url).origin === self.location.origin && "navigate" in client) {
        await client.navigate(target);
        await client.focus();
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});
