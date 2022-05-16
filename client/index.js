const client = (() => {
    let registrationObject;
    const btnRequestNotification = document.querySelector('.request-notification');
    const btnSendNotification = document.querySelector('.send-notification');

    btnRequestNotification.onclick = () => requestNotificationPermission();

    const uiHandle = (status) => {
        console.log("Notification permission status = ", status);

        btnRequestNotification.style.display =
            status === 'granted' ?
                'none' :
                'block';

        btnSendNotification.onclick = () => sendNotification(status);
        btnSendNotification.style.display =
            status === 'granted' ?
                'block' :
                'none';
    } // uiHandle

    const sendNotification = (status) => {
        if (status !== 'granted')
            return;

        const simpleNotification = "A simple notification";
        const customNotification = {
            title: "A custom notification",
            options: {
                body: "Body of the custom notification",
                icon: "img/notification.png",
                actions: [
                    { action: "view", title: "View" },
                ] // actions
            } // options
        } // customNotification

        navigator.serviceWorker.getRegistration()
            .then(registration => registration.showNotification(
                customNotification.title,
                customNotification.options
            ));
    } // sendNotification

    const checkNotificationSupport = () => {
        if ('Notification' in window) {
            console.info("Notification is supported.");

            uiHandle(Notification.permission);

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
                }) // then
        } // if

        return Promise.reject("Service worker not available.")
    } // registerServiceWorker

    const requestNotificationPermission = () => {
        return Notification.requestPermission(status => {
            uiHandle(status);
        }); // requestPermission
    } // requestNotificationPermission

    checkNotificationSupport()
        .then(registerServiceWorker)
        .catch(err => console.error(err));

    return 0;
})(); // client