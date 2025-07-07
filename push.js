const webpush = require('web-push');

// Встав сюди свої ключі VAPID
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

// Встав сюди підписку, скопійовану з консолі браузера 👇
const pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/eisxrwotnNw:APA91bEkpT0JrYLX0eeu-yYhaB3u1GjQygaDl6iriAaUb4_bL7PLDeb88GNnhsyZCjHOZygywfZAv53R9-iFRKoyBIkerHfiDoF8zl1Kjyjf1s2MGxIUTPoHjjoVegvtjq-cZ7gVuMJB",
    expirationTime: null,
    keys: {
        "p256dh": "BIgEzpaEqnivTukPYtPjeRlSM1iuN_NBZELtWBjgSoCLp9PG29oVUKl6ACKwdWtyk7oYDB0SGGDjiUJyGLbcSB0",
        "auth": "_S_CvES9ySMtBUuB3ueIsA"
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