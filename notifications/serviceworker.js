"use strict";

var url = [];
var count = 0;

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting()); //will install the service worker
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim()); //will activate the serviceworker
});

// Register event listener for the 'notificationclick' event.
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
    .then(function(clientList) {

      if (clients.openWindow) {
        var c = count;
        count++;
        return clients.openWindow(url[c]);
      }
    })
  );

});


self.addEventListener('push', function(event) {
  event.waitUntil(
    self.registration.pushManager.getSubscription()
    .then(function(subscription) {

      console.log("subscription", subscription);

      var payload = event.data ? JSON.parse(event.data.text()) : {
        title: 'Notif Name',
        body: 'Notification data, can be a good long sentence if wanted.',
        icon: 'https://host.host.com/img.png',
        url: 'https://www.url.com'
      };


      url.push(payload.url);
      return self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon,
        tag: payload.url + payload.body + payload.icon + payload.title
      });


    })
  );
});