self.addEventListener('notificationclose', event => {
    console.log('Notification closed.');
}); // notificationclose

self.addEventListener('notificationclick', event => {
    if (event.action === 'view')
        clients.openWindow(`https://google.com`);
}) // notificationclick

self.addEventListener('push', event => {
    const data = event.data.text();
    const options = {
        body: data
    } // options

    event.waitUntil(
        self.registration.showNotification('Server push', options)
    ) // waitUntil
}) // push