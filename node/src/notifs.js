const notiflist = [];

function newNotif(type) {
    let notifmessage;
    let notifbody;

    switch (type) {
        case 'newmessage':
            notifmessage = "New Message!";
            notifbody = "You have a new message, check it out!";
            // add badge indicating unread message next to corresponding chat
            break;
        case 'match':
            notifmessage = "Match Found!";
            notifbody = "You've found a study buddy, say hi!";
            break;
        case 'friendrequest':
            notifmessage = "Incoming Friend Request!";
            notifbody = "You have a friend request! Say hi!";
            break;
        case 'groupjoined':
            notifmessage = "Member Joined!";
            notifbody = "Your study group has a new member, say hi!";
            break;
        case 'groupinvite':
            notifmessage = "New Group Invite!";
            notifbody = "You have been invited to join a study group!";
            break;
        default:
            // shouldn't be needed, but just in case
            break;
    }

    if (type !== 'newmessage') {
        // add notification to front of notif array
        notiflist.unshift(notifmessage);
        // this now gets the notification page
    }

    // check if push notifications are enabled
    if (pushNotificationsEnabled) {
        pushNotif(notifmessage, notifbody);
    }
}

// send push notifications
function pushNotif(notifmessage, notifbody) {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service worker successfully registered.');
            })
            .catch(function(error) {
                console.log('Service worker registration failed:', error);
            });
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
            console.log('Notification permission granted.');
            } else {
            console.log('Unable to get permission to notify.');
            }
        });
        navigator.serviceWorker.ready.then(function(registration) {
            registration.pushManager.subscribe({userVisibleOnly: true})
            .then(function(subscription) {
            console.log('Subscribed for push:', subscription.endpoint);
            })
            .catch(function(error) {
            console.log('Subscription failed:', error);
            });
        });
        // make post request to endpoint
        self.addEventListener('push', function(event) {
            const title = notifmessage;
            const options = {
            body: notifbody,
            };
        event.waitUntil(self.registration.showNotification(title, options));
        });
        console.log(`Push notification sent: ${notifmessage}`);
    }
}

