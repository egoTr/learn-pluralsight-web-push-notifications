const webPush = require('web-push');
const vapidKeyPublic = 'BDfXjRorq85Z38hdpkykT4laa1VDDVZGXxQ1HKbHG1jGhSJqQT1nrtRTTz37xVXWwhhA2EOwUWz2mYNhJjtwDrU';
const vapidKeyPrivate = '7I2nZlfdGrQK0V9LAq1RyHI8UIsuyj83uWhgO-TB6fc';

const options = {
    TTL: 60, // time-to-live
    vapidDetails: {
        subject: 'mailto: person@domain.com',
        publicKey: vapidKeyPublic,
        privateKey: vapidKeyPrivate
    } // vapidDetails
} // options

const notify = (subscribers) => {
    subscribers.forEach(sub => {
        webPush.sendNotification(
            sub,
            "Hello from server !",
            options
        ) // sendNotification
            .then(() => console.log(`${subscribers.size} subscriber(s) notified.`))
            .catch(err => console.error('Error on pushing notification', err));
    }); // forEach subscriber
} // notify

module.exports = {
    notify
}