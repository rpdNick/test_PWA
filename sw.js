// sw.js
// Версія кешу. Змінюйте її, коли оновлюєте файли, щоб змусити Service Worker перекешувати все.
const CACHE_NAME = 'my-test-pwa-cache-v1.7';

// Список URL-адрес, які потрібно кешувати під час встановлення Service Worker
const urlsToCache = [
  '/test_PWA/',
  '/test_PWA/index.html',
  '/test_PWA/style/style.css',
  '/test_PWA/icons/favicon/favicon.svg',
  '/test_PWA/icons/favicon/favicon-96x96.png',
  '/test_PWA/icons/favicon/favicon.ico',
  '/test_PWA/icons/favicon/apple-touch-icon.png',
  '/test_PWA/js/script.js',
];

// Подія 'install' - відбувається, коли Service Worker встановлюється
self.addEventListener('install', event => {
  console.log('Service Worker: Подія "install"');
  event.waitUntil(
    caches.open(CACHE_NAME) // Відкриваємо або створюємо кеш
      .then(cache => {
        // console.log('Service Worker: Кешування основних ресурсів');
        return cache.addAll(urlsToCache); // Додаємо всі файли до кешу
      })
      .then(() => self.skipWaiting()) // Примусово активуємо Service Worker негайно
  );
});

// Подія 'activate' - відбувається, коли Service Worker активується
self.addEventListener('activate', event => {
  console.log('Service Worker: Подія "activate"');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) { // Видаляємо старі кеші
            // console.log('Service Worker: Видалення старого кешу:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Негайно перехоплюємо контроль над сторінками
  );
});

// Подія 'fetch' - перехоплює всі мережеві запити від сторінок
self.addEventListener('fetch', event => {
  // Стратегія кешування: Cache-First (Кеш спочатку)
  // Спочатку намагаємося знайти ресурс у кеші.
  // Якщо знайдено, повертаємо з кешу.
  // Якщо не знайдено, йдемо в мережу, кешуємо відповідь і повертаємо її.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // console.log('Service Worker: Відповідь з кешу для', event.request.url);
          return response; // Ресурс знайдено в кеші, повертаємо його
        }

        // Ресурс не знайдено в кеші, йдемо в мережу
        // console.log('Service Worker: Запит до мережі для', event.request.url);
        return fetch(event.request)
          .then(networkResponse => {
            // Перевіряємо, чи отримали ми дійсну відповідь
            // (статус 200, не редирект, не помилка)
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Важливо: відповідь можна прочитати лише один раз, тому клонуємо її для кешування
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache); // Кешуємо нову відповідь
              });

            return networkResponse; // Повертаємо відповідь з мережі
          })
          .catch(error => {
            console.error('Service Worker: Помилка fetch (можливо, офлайн):', error);
            // Тут можна повернути офлайн-сторінку або інший запасний ресурс,
            // якщо мережа недоступна і ресурсу немає в кеші.
            // Для цього простого прикладу ми не реалізуємо офлайн-сторінку,
            // але в реальному PWA її варто мати.
            // Наприклад: return caches.match('/offline.html');
          });
      })
  );
});




// push notificatons service-worker

self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Отримано push-повідомлення:', data);

    const title = data.title || 'Нове сповіщення';
    const options = {
        body: data.body || 'Тут може бути текст вашого сповіщення.',
        icon: data.icon || '/test_PWA/icons/192.png',
        data: data.data || {}
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    console.log('Натиснуто на сповіщення:', event.notification);
    event.notification.close();

    const clickUrl = event.notification.data.url || '/';
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === clickUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(clickUrl);
            }
        })
    );
});