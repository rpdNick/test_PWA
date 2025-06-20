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
    let installPromptEvent; // Store the prompt event
    let installBlick =  document.querySelector('.install_block');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();  // Prevent default prompt
        installPromptEvent = e; // Store the event
        console.log(installPromptEvent);
        // Show custom install block
       installBlick.style.display = 'flex';
    });

    document.getElementById('installApp').addEventListener('click', () => {
        // Trigger the browser's install prompt
        installPromptEvent.prompt();

        installPromptEvent.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User installed the PWA');
            } else {
                console.log('User dismissed the installation');
            }

            // Hide the install block after user interaction
            installBlick.style.display = 'none';
        });
    });
});