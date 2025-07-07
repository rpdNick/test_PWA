const webpush = require('web-push');

// 🔐 Встав сюди свої ключі VAPID
const vapidKeys = {
    publicKey: 'BGFzlsNrqsgQUum-2KMmxmgMUl9nZhkvRBMITDOB__dWROhLGZ_AfJAuvXW15nSezP1VzOmPk-LCCbKa-UZv9Ac',
    privateKey: 'RXCS-bx4P-shsnuzMV2uaHPjU6m5257cibGr12Wwq2w'
};

// Налаштовуємо VAPID
webpush.setVapidDetails(
    'mailto:your@email.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// 👇 Встав сюди підписку, скопійовану з консолі браузера
// const pushSubscription = {
//     endpoint: 'https://fcm.googleapis.com/fcm/send/abc123....',
//     expirationTime: null,
//     keys: {
//         p256dh: 'BC....',
//         auth: 'SC....'
//     }
// };

const pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/ctLA-wy3EjU:APA91bGVKYn6A6yQY4k5jR2uOxuZTk5n0tKB6z8r5WJzjjY9ei3D-SR5VE7XR5rMekWLzdCYjBM3Oi25s47YehaSaeNxFNayxFK4B4ZRZyPz0LgO9FT-6Z1XWXQlzlEysJXN_Gki9abq",
    expirationTime: null,
    keys: {
        "p256dh": "BIxrLUSh1_07H_jFVSBuC6LSR4O9ue8FI7VpyvrFkICQuGik2WhFz29Plp4_v0n60GFRH3bio0TRwoJfnt8eyY0",
        "auth": "yYnhqSXwtdGUK2qCnSEMww"
    }
};


// 🔔 Що буде в пуші
const payload = JSON.stringify({
    title: 'Привіт, це PUSH!',
    body: 'Це тестове повідомлення з Node.js!',
    icon: '/test_PWA/icons/192.png',
    data: {
        url: 'https://rpdnick.github.io/test_PWA/index.html'
    }
});

// Відправлення
webpush.sendNotification(pushSubscription, payload)
    .then(response => {
        console.log('✅ Повідомлення надіслано успішно');
    })
    .catch(error => {
        console.error('❌ Помилка надсилання повідомлення:', error);
    });