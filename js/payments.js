// Обработчики для кнопок банков
const bankButtons = document.querySelectorAll('.bank-button');
bankButtons.forEach(button => {
    button.addEventListener('click', function() {
        const bank = this.getAttribute('data-bank');
        const amount = document.getElementById('amount').value;
        const comment = document.getElementById('comment').value;
        
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            showError('Пожалуйста, введите корректную сумму');
            return;
        }

        // Показываем спиннер
        showSpinner();

        // Формируем URL в зависимости от банка
        let url;
        switch(bank) {
            case 'sber':
                url = `https://online.sberbank.ru/CSAFront/service.do?srvUrl=transfers?start&amount=${amount}&comment=${encodeURIComponent(comment)}`;
                break;
            case 'tinkoff':
                url = `https://www.tinkoff.ru/payments/persons/agreement/?amount=${amount}&comment=${encodeURIComponent(comment)}`;
                break;
            case 'vtb':
                url = `https://online.vtb.ru/i/sbor/?amount=${amount}&comment=${encodeURIComponent(comment)}`;
                break;
            case 'yoomoney':
                url = `https://yoomoney.ru/to/?amount=${amount}&comment=${encodeURIComponent(comment)}`;
                break;
            default:
                hideSpinner();
                showError('Неизвестный банк');
                return;
        }

        // Пробуем открыть приложение банка
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);

        if (isMobile) {
            let appUrl;
            if (bank === 'sber') {
                if (isIOS) {
                    appUrl = `budgetonline-ios://sbolonline/payments/p2p-by-phone-number?phoneNumber=${encodeURIComponent(comment)}`;
                } else if (isAndroid) {
                    appUrl = `intent://ru.sberbankmobile/payments/p2p?type=phone_number&requisiteNumber=${encodeURIComponent(comment)}`;
                }
            } else if (bank === 'tinkoff') {
                appUrl = `tinkoffbank://Main/TransferToPeople?targetAccountId=${encodeURIComponent(comment)}`;
            }

            if (appUrl) {
                const timeout = setTimeout(() => {
                    // Если приложение не открылось, открываем веб-версию
                    window.location.href = url;
                }, 3000);

                window.location.href = appUrl;
            } else {
                window.location.href = url;
            }
        } else {
            // Для десктопа просто открываем веб-версию
            window.location.href = url;
        }
    });
});

// Функция для проверки открытия приложения
function checkAppOpened() {
    const timeout = setTimeout(() => {
        hideSpinner();
        showError('Не удалось открыть приложение банка. Пожалуйста, попробуйте веб-версию.');
    }, 3000);
}

// Функция для показа спиннера
function showSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.innerHTML = '<div class="spinner-inner"></div>';
    document.body.appendChild(spinner);
}

// Функция для скрытия спиннера
function hideSpinner() {
    const spinner = document.querySelector('.spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Функция для показа ошибки
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
} 