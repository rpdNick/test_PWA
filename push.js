const webpush = require('web-push');

// 🔐 Встав сюди свої ключі VAPID
const vapidKeys = {
    publicKey: 'BJSt032OJqlfoHxPIke1J2oQMSkyXgFQu-459dTuVAv7-nC2gQIk-cHB78a69Du1I6Odi2umoANW8-jR9kUeuPY',
    privateKey: 'WJ3s6f0U9yL7QKXfM3ds7xNBSOqgAj1CPQuO9sA1XNI'
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
    endpoint: "https://fcm.googleapis.com/fcm/send/ea7u47oHrTw:APA91bETW5ijWMUNbQCJbq0eDk5z-CtAgqz7QriOh-voW9SlSfLAtd_CfKG0cWlGcZXetrOhRfetTsi9ClFUdrU_RQMxrP7q0O6e9AmwCtGT-U5nCSg5xX5EvgBEeymsTz8LJirsrCzo",
    expirationTime: null,
    keys: {
        "p256dh": "BHN71CJles2ok0WTSFgApIjtSdCgBqZm2uGojrEgvkUfdg26_-FR8M643mheYZTa10EsOT63354YML46ctWknek",
        "auth": "ljOUN6KofcaWphjFEXUDqw"
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