document.addEventListener('DOMContentLoaded', () => {
    const onlineStatusElement = document.getElementById('onlineStatus');
    // const checkOnlineStatusButton = document.getElementById('checkOnlineStatus');

    function updateOnlineStatus() {
        onlineStatusElement.textContent = `Статус: ${navigator.onLine ? 'Онлайн' : 'Офлайн'}`;
        onlineStatusElement.style.color = navigator.onLine ? 'green' : 'red';
    }

    // Оновлюємо статус при завантаженні сторінки
    updateOnlineStatus();

    // Додаємо слухачів подій для відстеження змін статусу
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Додаємо слухача для кнопки
    // checkOnlineStatusButton.addEventListener('click', updateOnlineStatus);


    // Customizing the Install Prompt:
    let installPromptEvent = null;
    const installBlock = document.querySelector('.install_block');
    const installButton = document.getElementById("installApp");

    window.addEventListener('beforeinstallprompt', (e) => {
        installPromptEvent = e; // Store the event

        // Show custom install block
        installBlock.classList.remove("installed");

    });

    installButton.addEventListener('click', () => {
        console.log('install PWA click');
        // Trigger the browser's install prompt
        installPromptEvent.prompt();

        installPromptEvent.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User installed the PWA');

                // Hide the install block after user interaction
                installBlock.classList.add("installed");
            } else {
                console.log('User dismissed the installation');
            }
        });
    });

    askNotifications();
});



// Notification request
/*
Надсилання пушів з https://web-push-codelab.glitch.me/

Get PushSubscription from console.log:
{
    "endpoint": "https://fcm.googleapis.com/fcm/send/f5Hfh-sras8:APA91bGgC7dU7O7pQ25_OmIPxvqL-r3Ehw1xlBa7t0y03owvBgfZjkGJHUJdxFeEeFhbkPEI79lusXamf0b8XxD_5lvQjzIL6RrIQSE1PFcCHo_alWo8Cu3QMdtwP3IHabidTvou8Yvb",
    "expirationTime": null,
    "keys": {
        "p256dh": "BPzWjEiDdX24FmesMzI2n2rX95F2cvyc9-pxgoQGVz5Zi9NMguWvG_tScrwGrvZUeZDXcVpKRW0msgWVZuMXMYo",
        "auth": "MRR3XlkIzguAxlgAMnYf_g"
    }
}

Text to Send:
{
  "title": "Привіт, це PWA-тест!",
  "body": "Ви отримали сповіщення з вашого PWA!",
  "icon": "/test_PWA/icons/192.png",
  "data": {
    "url": "https://rpdnick.github.io/test_PWA/index.html",
    "trackingId": "some_unique_id_123"
  }
}

*/

function askNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Дозвіл на сповіщення надано.');
                // Тепер ви можете підписатися на push-повідомлення
                subscribeUserToPush();
            } else {
                console.log('Дозвіл на сповіщення відхилено.');
            }
        });
    }
}

function subscribeUserToPush() {
    navigator.serviceWorker.ready.then(registration => {
        const applicationServerKey = urlBase64ToUint8Array('BGtcy5rKEuF1WMl3puOS1LOQkD_fI6V0TPXzyrrt6UWqTCPpCay2W9wSlwn5kyZoMALTW6HXzHh7zxwE_mE2KHc'); // Перетворіть ваш публічний ключ VAPID
        registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(subscription => {
                console.log('Користувач підписався:', subscription);
                // sendSubscriptionToServer(subscription);
            })
            .catch(error => {
                console.error('Не вдалося підписатися на push-сповіщення:', error);
            });
    });
}

// Допоміжна функція для перетворення base64 URL на Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}