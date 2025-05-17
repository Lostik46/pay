// Константа с номером телефона
const PHONE_NUMBER = '+79524912232';

// Обработчики для кнопок банков
const bankButtons = document.querySelectorAll('.bank-button');
bankButtons.forEach(button => {
    button.addEventListener('click', function() {
        const bank = this.classList.contains('sberbank') ? 'sber' : 
                    this.classList.contains('tinkoff') ? 'tinkoff' : 
                    this.classList.contains('alfabank') ? 'alfa' : null;
        
        if (!bank) {
            showError('Неизвестный банк');
            return;
        }

        // Показываем спиннер
        showSpinner();

        // Формируем URL в зависимости от банка
        let url;
        switch(bank) {
            case 'sber':
                url = `https://online.sberbank.ru/CSAFront/service.do?srvUrl=transfers?start&phone=${encodeURIComponent(PHONE_NUMBER)}`;
                break;
            case 'tinkoff':
                url = `https://www.tinkoff.ru/payments/persons/agreement/?phone=${encodeURIComponent(PHONE_NUMBER)}`;
                break;
            case 'alfa':
                url = `https://alfabank.ru/payments/?phone=${encodeURIComponent(PHONE_NUMBER)}`;
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
                    appUrl = `budgetonline-ios://sbolonline/payments/p2p-by-phone-number?phoneNumber=${encodeURIComponent(PHONE_NUMBER)}`;
                } else if (isAndroid) {
                    appUrl = `intent://ru.sberbankmobile/payments/p2p?type=phone_number&requisiteNumber=${encodeURIComponent(PHONE_NUMBER)}`;
                }
            } else if (bank === 'tinkoff') {
                appUrl = `tinkoffbank://Main/TransferToPeople?targetAccountId=${encodeURIComponent(PHONE_NUMBER)}`;
            } else if (bank === 'alfa') {
                if (isIOS) {
                    appUrl = `alfabank://payments/phone?number=${encodeURIComponent(PHONE_NUMBER)}`;
                } else if (isAndroid) {
                    appUrl = `intent://ru.alfabank.mobile.android/payments/phone?number=${encodeURIComponent(PHONE_NUMBER)}`;
                }
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