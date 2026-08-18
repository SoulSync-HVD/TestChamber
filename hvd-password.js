const CONFIG = {
    // Правильные пароли в нижнем регистре
    validPasswordsLowerCase: ['дицентра', 'dicentra'],
    redirectUrl: 'https://soulsync-hvd.neocities.org/diary',
    redirectDelay: 1000,
    messages: {
        empty: 'Пожалуйста, введите пароль',
        success: 'Верно.',
        error: 'Неверно.'
    },
    // Ссылка подсказки, показываемая при неверном пароле
    hintUrl: 'https://ru.wikipedia.org/wiki/Дицентра'
};

class PasswordValidator {
    constructor(config) {
        this.config = config;
        this.form = document.getElementById('passwordForm');
        this.passwordInput = document.getElementById('password');
        this.messageElement = document.getElementById('message');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
        this.passwordInput.addEventListener('input', () => this.clearMessage());
        
        window.addEventListener('load', () => {
            this.passwordInput.value = '';
            this.passwordInput.focus();
        });
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        const password = this.passwordInput.value.trim();
        this.clearMessage();
        
        if (!password) {
            this.showMessage(this.config.messages.empty, 'error');
            return false;
        }
        
        // Проверяем пароль без учёта регистра
        if (this.isValidPassword(password)) {
            this.showMessage(this.config.messages.success, 'success');
            this.disableForm();
            this.redirectToTarget();
            return true;
        } else {
            // Показываем сообщение об ошибке и подсказку (ссылка)
            this.showMessage(this.config.messages.error, 'error');
            this.showHint();
            this.resetForm();
            return false;
        }
    }
    
    isValidPassword(password) {
        // Приводим введённый пароль к нижнему регистру и сравниваем
        const passwordLower = password.toLowerCase();
        return this.config.validPasswordsLowerCase.includes(passwordLower);
    }
    
    showMessage(text, type) {
        // Используем textContent для безопасного текста
        this.messageElement.textContent = text;
        this.messageElement.className = type;
    }
    
    showHint() {
        // Добавляем ссылку с текстом "Подсказка." после текущего сообщения
        // Используем innerHTML только здесь, содержимое ссылки известно и безопасно
        const hintLink = `<a href="${this.config.hintUrl}" target="_blank" rel="noopener">Подсказка.</a>`;
        // Если уже есть текст внутри, добавим пробел перед ссылкой
        if (this.messageElement.innerHTML) {
            this.messageElement.innerHTML = this.messageElement.innerHTML + ' ' + hintLink;
        } else {
            this.messageElement.innerHTML = hintLink;
        }
    }
    
    clearMessage() {
        if (this.messageElement.textContent || this.messageElement.innerHTML) {
            this.messageElement.textContent = '';
            this.messageElement.className = '';
        }
    }
    
    disableForm() {
        this.passwordInput.disabled = true;
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
            submitButton.style.cursor = 'not-allowed';
        }
    }
    
    resetForm() {
        this.passwordInput.value = '';
        this.passwordInput.focus();
    }
    
    redirectToTarget() {
        setTimeout(() => {
            window.location.href = this.config.redirectUrl;
        }, this.config.redirectDelay);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PasswordValidator(CONFIG);
});
