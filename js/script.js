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
    let installPrompt = null;
    let installBlock = document.querySelector('.install_block');
    const installButton = document.querySelector("#installApp");

    window.addEventListener("beforeinstallprompt", (event) => {
        // event.preventDefault();
        installPrompt = event;
        installBlock.style.display = "flex";
    });

    installButton.addEventListener("click", async () => {
        if (!installPrompt) {
            return;
        }
        const result = await installPrompt.prompt();
        console.log(`Install prompt was: ${result.outcome}`);
        disableInAppInstallPrompt();
    });

    function disableInAppInstallPrompt() {
        installPrompt = null;
        installBlock.style.display = "none";
    }

    askNotifications();
});



// Notification request
/*
Надсилання пушів з https://web-push-codelab.glitch.me/
{
  "title": "Привіт з Glitch!",
  "body": "Це тестове веб-пуш повідомлення.",
  "icon": "/icons/192.png",
  "data": {
    "url": "/"
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
                // Надішліть об'єкт subscription на ваш бекенд
                sendSubscriptionToServer(subscription);
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