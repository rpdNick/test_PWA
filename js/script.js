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
    // Customizing the Install Prompt:

    function initPwa() {
        let installPromptEvent = null;
        const installButton = document.getElementById('install_pwa');

        if (!installButton) {
            console.warn('Кнопка встановлення PWA не знайдена в DOM.');
            return;
        }

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            installPromptEvent = event;
            updateInstallButtonState();
        });

        installButton.addEventListener('click', () => {
            console.log('Натиск на кнопку встановлення PWA');

            if (!installPromptEvent) {
                console.warn('Встановлення PWA недоступне або застосунок вже встановлено.');
                return;
            }

            installPromptEvent.prompt();

            installPromptEvent.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Користувач погодився на встановлення PWA');
                } else {
                    console.log('Користувач відхилив встановлення PWA');
                }

                installPromptEvent = null;
                updateInstallButtonState();
            });
        });

        function updateInstallButtonState() {
            if (isPwaRunning()) {
                installButton.setAttribute('disabled', '');
                console.log('Сайт запущено як PWA — кнопка вимкнена.');
            } else if (installPromptEvent) {
                installButton.removeAttribute('disabled');
                console.log('PWA доступна для встановлення — кнопка активна.');
            } else {
                installButton.setAttribute('disabled', '');
                console.log('PWA наразі недоступна — кнопка вимкнена.');
            }
        }

        function isPwaRunning() {
            return ['standalone', 'fullscreen', 'minimal-ui'].some((mode) =>
                window.matchMedia(`(display-mode: ${mode})`).matches
            );
        }

        ['standalone', 'fullscreen', 'minimal-ui'].forEach((mode) => {
            window.matchMedia(`(display-mode: ${mode})`).addEventListener('change', updateInstallButtonState);
        });

        updateInstallButtonState();
    }

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

    initPwa();
    askNotifications();
});



// Notification request
/*
Надсилання пушів з https://web-push-codelab.glitch.me/

Get PushSubscription from console.log:
{
    endpoint: "https://fcm.googleapis.com/fcm/send/eabykqNY9AU:APA91bEEa4h4hYan4nh0TaCiHim2nFaj1XxEP4646YtKb6A1XXBk4d19ZWiIMYd4jpZZwcCElmpsej2xiZ9vO4ZbGQnZ7CNFensTH9e2SFFk3A5epMNlNjhgXaUYeh8K1dEzOzCSxdII"
    expirationTime: null
    "keys": {
        "p256dh": "BCAQnFAFVevxATMnppbkpOJGgOOPGoVOu3gspspFxSpFYWTYeVJ8lSARctafbsdbuRf0tbmAwKIz0IfLbmQ8_gs",
        "auth": "scfUMgTh1V420C9iQYEo4KK2YNnHxVBM-RgHEWfB-O4"
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

function subscribeUserToPush() {
    navigator.serviceWorker.ready.then(registration => {
        const applicationServerKey = urlBase64ToUint8Array('BGFzlsNrqsgQUum-2KMmxmgMUl9nZhkvRBMITDOB__dWROhLGZ_AfJAuvXW15nSezP1VzOmPk-LCCbKa-UZv9Ac'); // Перетворіть ваш публічний ключ VAPID
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