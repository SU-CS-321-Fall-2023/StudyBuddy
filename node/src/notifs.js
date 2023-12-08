const emailservice = require('./services/email.service2');
const loginhistory = require('./models/loginhistory.model');
const usr = require('./models/user.model');


function comeBackEmail() {
    if(usr.emailPreferences) {
        emaillist = loginhistory.create_email_reminder_list;
        if(usr.user_email in emaillist) {
            emailservice.sendComeBackEmail;
        };
    };
};

//*

function ratelimit(lastnotif) { // ratelimit function to make sure there's no spam for any particular notif
    current = moment(current_date).startOf('hour');
    lastnotif = moment(lastnotif).startOf('hour');
    timediff = Math.abs(current.getTime() - lastnotif.getTime());
    hourdiff = Math.ceil(timediff / (1000 * 3600));
    return hourdiff;
}

const lastnotifmsg;
const lastnotifmatch;
const lastnotifreq;
const lastnotifjoined;
const lastnotifinv;

const notiflist = [];

function newNotif(type) { // needs passed type of notification when called
    let notifmessage;
    let notifbody;
    let ratelimited = false;

    switch (type) {
        case 'newmessage':
            notifmessage = "New Message!";
            notifbody = "You have a new message, check it out!";
            // add unread message indicator to corresponding chat
            if (ratelimit(lastnotifmsg) <= 6) {
                ratelimited = true;
            }
            break;
        case 'match':
            notifmessage = "Match Found!";
            notifbody = "You've found a study buddy, say hi!";
            if (ratelimit(lastnotifmatch) < 1) {
                ratelimited = true;
            }
            break;
        case 'friendrequest':
            notifmessage = "Incoming Friend Request!";
            notifbody = "You have a friend request! Say hi!";
            if (ratelimit(lastnotifreq) <= 1) {
                ratelimited = true;
            }
            break;
        case 'groupjoined':
            notifmessage = "Member Joined!";
            notifbody = "Your study group has a new member, say hi!";
            if (ratelimit(lastnotifjoined) <= 2) {
                ratelimited = true;
            }
            break;
        case 'groupinvite':
            notifmessage = "New Group Invite!";
            notifbody = "You have been invited to join a study group!";
            if (ratelimit(lastnotifinv) < 1) {
                ratelimited = true;
            }
            break;
        default:
            // shouldn't be needed, but just in case
            break;
    };

    if (type !== 'newmessage') {
        // add notification to front of notif array
        notiflist.unshift(notifmessage);
        // this now gets shown on the notification page
    };

    /*
    // check if push notifications are enabled
    if (pushNotificationsEnabled) {
        pushNotif(notifmessage, notifbody);
    }
    */

    if (!ratelimited) {
        // email notifs
    }
}

/*
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

*/