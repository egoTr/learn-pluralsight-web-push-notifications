const client = (() => {
    let serviceWorkerObject;
    let isSubscribed = false;
    const btnRequestNotification = document.querySelector('.request-notification');
    const btnSendNotification = document.querySelector('.send-notification');
    const btnSubscription = document.querySelector('.subscription');
    const btnSubscription_code = document.querySelector('code');

    btnRequestNotification.onclick = () => requestNotificationPermission();

    btnSubscription.onclick = () => subscriptionHandle();

    const uiHandle = (status) => {
        console.log("Notification permission status = ", status);

        btnRequestNotification.style.display =
            status === 'granted' ?
                'none' :
                'block';

        btnSendNotification.onclick = () => sendNotification(status);
        btnSubscription.style.display =
            btnSendNotification.style.display =
            status === 'granted' ?
                'block' :
                'none';
    } // uiHandle

    const btnSubscriptionHandle = () => {
        if (!isSubscribed) {
            isSubscribed = true;
            btnSubscription.innerText = "Unsubscribe";
        } else {
            isSubscribed = false;
            btnSubscription.innerText = "Subscribe";
            btnSubscription_code.innerText = "";
        } // else
    } // btnSubscriptionHandle

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

    const subscriptionHandle = () => {
        function urlB64ToUint8Array(url) {
            const padding = '='.repeat((4 - url.length % 4) % 4);
            const base64 = (url + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i)
                outputArray[i] = rawData.charCodeAt(i);

            return outputArray;
        } // urlB64ToUint8Array

        const subscribeToServer = (subscription) => {
            return fetch(
                'http://localhost:3000/subscribe',
                {
                    method: 'POST',
                    body: JSON.stringify(subscription),
                    headers: {
                        'Content-Type': 'application/json'
                    } // headers
                } // options
            ); // fetch
        }; // subscribeToServer

        const unsubscribeToServer = (id) => {
            return fetch(
                'http://localhost:3000/unsubscribe',
                {
                    method: 'POST',
                    body: JSON.stringify({ id }),
                    headers: {
                        'Content-Type': 'application/json'
                    } // headers
                } // options
            ); // fetch
        }; // unsubscribeToServer

        const subscribe = () => {
            const vapidKeyPublic = 'BDfXjRorq85Z38hdpkykT4laa1VDDVZGXxQ1HKbHG1jGhSJqQT1nrtRTTz37xVXWwhhA2EOwUWz2mYNhJjtwDrU';
            const vapidKeyPublicArray = urlB64ToUint8Array(vapidKeyPublic);

            serviceWorkerObject.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKeyPublicArray
            }) // subscribe
                .then(subscription => {
                    subscribeToServer(subscription);

                    btnSubscriptionHandle();
                    btnSubscription_code.innerText = JSON.stringify(subscription, null, 4);
                }) // then
                .catch(err => console.error("Failed to subscribe to the Push service.", err));
        }; // subscribe

        const unsubscribe = () => {
            serviceWorkerObject.pushManager.getSubscription()
                .then(subscription => {
                    if (subscription) {
                        // Magical codes are below 🤣
                        let subJSON = JSON.stringify(subscription);
                        let subObj = JSON.parse(subJSON);

                        unsubscribeToServer(subObj.keys.auth);

                        return subscription.unsubscribe();
                    } // if
                }) // then
                .then(btnSubscriptionHandle())
                .catch(err => console.error("Failed to unsubscribe.", err));
        } // unsubscribe

        if (isSubscribed) unsubscribe();
        else subscribe();
    } // subscriptionHandle

    const checkNotificationSupport = () => {
        if ('Notification' in window) {
            console.info("Notification is supported.");

            uiHandle(Notification.permission);

            return Promise.resolve("Notification is supported.");
        } // if

        alert('Notification support not checked yet')
        return Promise.reject("Notification is not supported.");
    } // checkNotificationSupport

    const registerServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            console.info("Service worker is available.");

            return navigator.serviceWorker.register('service-worker.js')
                .then(registrationResult => {
                    console.info("Service worker is registered successfully.");
                    serviceWorkerObject = registrationResult;

                    // Check if subscribed
                    serviceWorkerObject.pushManager.getSubscription()
                        .then(subscription => {
                            if (subscription) {
                                isSubscribed = false; // this is weird !!!
                                btnSubscriptionHandle();
                            } // if
                        }); // then
                }) // then
        } // if

        alert('Service worker not available')
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