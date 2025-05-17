// Utility functions
String.prototype.escHtml = function() {
    return this.replace(/[&<>'"]/g, _ => "&#" + _.charCodeAt(0) + ";");
};

// Browser detection class
class BrowserDetector {
    static getUserAgent() {
        return window.navigator.userAgent;
    }
    
    static userAgentContains(str) {
        return this.getUserAgent().toLowerCase().indexOf(str.toLowerCase()) > -1;
    }
    
    static isAndroid() {
        return this.userAgentContains("Android");
    }
    
    static isIphone() {
        return (this.userAgentContains("iPad") || this.userAgentContains("iPhone")) && !window.MSStream;
    }

    static isDesktop() {
        return !this.isAndroid() && !this.isIphone();
    }
}

// Payment handler class
class PaymentHandler {
    static DEFAULT_TIMEOUT = 2000;
    
    static async openBankApp(bankId, scheme, phoneNumber, onSuccess, onError) {
        const uri = `${scheme}://${phoneNumber}`;
        
        try {
            if (BrowserDetector.isDesktop()) {
                // Для ПК открываем веб-версию банка
                const bankUrls = {
                    sberbank: 'https://online.sberbank.ru',
                    tinkoff: 'https://www.tinkoff.ru',
                    alfabank: 'https://alfabank.ru'
                };
                
                if (bankUrls[bankId]) {
                    window.open(bankUrls[bankId], '_blank');
                    onSuccess();
                } else {
                    onError();
                }
            } else {
                // Для мобильных устройств используем deep linking
                window.location.href = uri;
                setTimeout(() => {
                    onError();
                }, this.DEFAULT_TIMEOUT);
            }
        } catch (error) {
            onError();
        }
    }

    static showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Bank-specific handlers
const Banks = {
    sberbank: {
        scheme: 'sberbank',
        phoneNumber: '+79524912232',
        name: 'Сбербанк'
    },
    tinkoff: {
        scheme: 'tinkoff',
        phoneNumber: '+79524912232',
        name: 'Тинькофф'
    },
    alfabank: {
        scheme: 'alfabank',
        phoneNumber: '+79524912232',
        name: 'Альфа-Банк'
    }
};

// Initialize payment buttons
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(Banks).forEach(bankId => {
        const button = document.querySelector(`.bank-button.${bankId}`);
        if (button) {
            button.addEventListener('click', () => {
                const bank = Banks[bankId];
                PaymentHandler.openBankApp(
                    bankId,
                    bank.scheme,
                    bank.phoneNumber,
                    () => {
                        if (BrowserDetector.isDesktop()) {
                            PaymentHandler.showError(`Открыта веб-версия ${bank.name}`);
                        } else {
                            PaymentHandler.showError(`Открыто приложение ${bank.name}`);
                        }
                    },
                    () => {
                        PaymentHandler.showError(`Не удалось открыть ${bank.name}. Пожалуйста, установите приложение или используйте веб-версию.`);
                    }
                );
            });
        }
    });
}); 