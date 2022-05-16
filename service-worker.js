self.addEventListener('notificationclose', event => {
    console.log('Notification closed');
}); // notificationclose

self.addEventListener('notificationclick', event => {
    console.log('Notification clicked, action =', event.action);
}) // notificationclick