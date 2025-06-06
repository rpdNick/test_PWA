// sw.js
// Версія кешу. Змінюйте її, коли оновлюєте файли, щоб змусити Service Worker перекешувати все.
const CACHE_NAME = 'my-test-pwa-cache-v1';

// Список URL-адрес, які потрібно кешувати під час встановлення Service Worker
const urlsToCache = [
  'index.html',
  './style/style.css',
];

// Подія 'install' - відбувається, коли Service Worker встановлюється
self.addEventListener('install', event => {
  console.log('Service Worker: Подія "install"');
  event.waitUntil(
    caches.open(CACHE_NAME) // Відкриваємо або створюємо кеш
      .then(cache => {
        console.log('Service Worker: Кешування основних ресурсів');
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
            console.log('Service Worker: Видалення старого кешу:', cacheName);
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
          console.log('Service Worker: Відповідь з кешу для', event.request.url);
          return response; // Ресурс знайдено в кеші, повертаємо його
        }

        // Ресурс не знайдено в кеші, йдемо в мережу
        console.log('Service Worker: Запит до мережі для', event.request.url);
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