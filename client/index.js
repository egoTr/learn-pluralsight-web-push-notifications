const client = ( () => {
    let registrationObject;
    const btnRequestNotification = document.querySelector('.request-notification');
    const btnSendNotification = document.querySelector('.send-notification');

    btnRequestNotification.onclick = () => requestNotificationPermission();

    const checkNotificationSupport = () => {
        if ('Notification' in window) {
            console.info("Notification is supported.");

            return Promise.resolve("Notification is supported.");
        } // if

        return Promise.reject("Notification support not checked yet.");
    } // checkNotificationSupport

    const registerServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            console.info("Service worker is available.");

            return navigator.serviceWorker.register('service-worker.js')
                .then(registrationResult => {
                    console.info("Service worker is registered successfully.");
                    registrationObject = registrationResult;

                    btnRequestNotification.style.display = 'block';
                }) // then
        } // if

        return Promise.reject("Service worker not available.")
    } // registerServiceWorker

    const requestNotificationPermission = () => {
        return Notification.requestPermission(status => {
            console.log("Notification permission status = ", status);

            btnRequestNotification.style.display = 
                status === 'granted' ?
                'none' :
                'block';

            btnSendNotification.style.display =
                status === 'granted' ?
                'block' :
                'none';
            
            btnSendNotification.onclick = () => {
                navigator.serviceWorker.getRegistration()
                    .then(registration => registration.showNotification('A simple notification'));
            } // onclick
        }); // requestPermission
    } // requestNotificationPermission

    checkNotificationSupport()
        .then(registerServiceWorker)
        .catch(err => console.error(err));

    return 0;
})(); // client