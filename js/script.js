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
        event.preventDefault();
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
});