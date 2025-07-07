Згенерувати ключі

1. Використовуй одні й ті ж ключі всюди — і в фронті (на GitHub Pages), і в бекенді (локальний Node.js скрипт)
Згенеруй ключі один раз локально:

npx web-push generate-vapid-keys
Скопіюй публічний і приватний ключі.

const vapidKeys = {
    publicKey: 'BMB2JRruTzeiwbzpwLLqtzwY6PaMcsBdS0Kr4X-jl5VzT2Zc8EAifChiF7M023xsJa8rwYJmarJZqdz8-pDyIpQ',
    privateKey: '3C4jWd_GMyzU7S5kR2KzoEncWX49ADGaEh2YFniCisI'
};

2. Публічний ключ встав у фронтенд-код, який розгортаєш на GitHub Pages (це applicationServerKey у subscribe())

const applicationServerKey = urlBase64ToUint8Array('ТУТ_ПУБЛІЧНИЙ_КЛЮЧ');
Закоміть і пуш в репозиторій, щоб GitHub Pages мав актуальний ключ.

3. Приватний ключ і публічний ключ встав у свій локальний Node.js скрипт (push.js), який надсилає повідомлення

webpush.setVapidDetails(
  'mailto:your@email.com',
  'ТУТ_ПУБЛІЧНИЙ_КЛЮЧ',
  'ТУТ_ПРИВАТНИЙ_КЛЮЧ'
);

4. Видали стару підписку в браузері і підпишись знову, щоб підписка створювалась із новим публічним ключем
У консолі браузера:

navigator.serviceWorker.ready.then(registration =>
  registration.pushManager.getSubscription().then(sub => {
    if (sub) {
      sub.unsubscribe().then(() => console.log('Стара підписка видалена'));
    }
  })
);
Потім онови сторінку і дозволь пуші заново — тепер буде нова підписка, відповідна новому ключу.

5. Скопіюй новий об’єкт pushSubscription з консолі браузера і використовуй його для тесту пушів у Node.js

to run push:
node push.js