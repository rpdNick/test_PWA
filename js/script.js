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

    function getCurrentDisplayMode() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return 'standalone';
        } else if (window.matchMedia('(display-mode: fullscreen)').matches) {
            return 'fullscreen';
        } else if (window.matchMedia('(display-mode: minimal-ui)').matches) {
            return 'minimal-ui';
        } else {
            // Зазвичай це означає 'browser'
            return 'browser';
        }
    }

    console.log('Поточний display-mode:', getCurrentDisplayMode());

    initPwa();
    function initPwa() {
        let installPromptEvent = null;
        const installButton = document.getElementById('install_pwa');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            installPromptEvent = e; // Store the event
            updateInstallButtonVisibility();
        });

        installButton.addEventListener('click', () => {
            console.log('install PWA click');
            if (installPromptEvent) {
                // Trigger the browser's install prompt
                installPromptEvent.prompt();
                console.log(installPromptEvent);

                installPromptEvent.userChoice.then((choiceResult) => {
                    console.log(choiceResult)
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User installed the PWA');
                        updateInstallButtonVisibility();
                        installPromptEvent = null;
                    } else {
                        console.log('User dismissed the installation');
                    }
                });
            } else {
                console.warn('Встановлення PWA зараз недоступне, або застосунок вже встановлено.');
                console.log(installPromptEvent)
                installButton.setAttribute('disabled', '');
            }
        });

        function updateInstallButtonVisibility() {
            if (!installButton) return;

            if (isRunningAsPWA()) {
                installButton.setAttribute('disabled', '');
                console.log('Сайт запущений як PWA. Кнопка встановлення прихована.');
                return;
            }

            // 2. Якщо PWA не запущено як додаток, перевіряємо, чи браузер готовий запропонувати встановлення
            // (тобто, чи спрацювала подія beforeinstallprompt і deferredPrompt зберігає подію)
            console.log('installPromptEvent: ' + installPromptEvent);
            console.log(window.matchMedia)
            if (installPromptEvent) {
                installButton.removeAttribute('disabled');
                console.log('PWA може бути встановлено. Кнопка встановлення видима.');
            } else {
                // Якщо beforeinstallprompt ще не спрацював або вже був використаний/скинутий,
                // і сайт не запущений як PWA.
                // Це може статися, якщо користувач вже відхилив запит, або в режимі інкогніто,
                // або якщо браузер ще не визначив PWA придатним для встановлення.
                installButton.setAttribute('disabled', '');
                console.log('PWA не може бути встановлено зараз (або вже встановлено, але не запущено як PWA). Кнопка прихована.');
            }
        }

        document.addEventListener('DOMContentLoaded', updateInstallButtonVisibility);

        window.matchMedia('(display-mode: standalone)').addEventListener('change', updateInstallButtonVisibility);
        window.matchMedia('(display-mode: fullscreen)').addEventListener('change', updateInstallButtonVisibility);
        window.matchMedia('(display-mode: minimal-ui)').addEventListener('change', updateInstallButtonVisibility);

        function isRunningAsPWA() {
            return (
                window.matchMedia('(display-mode: standalone)').matches ||
                window.matchMedia('(display-mode: fullscreen)').matches ||
                window.matchMedia('(display-mode: minimal-ui)').matches
            );
        }
    }

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