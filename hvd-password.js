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
        this.hintElement = null; // контейнер для подсказки
        
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
        // Удаляем старую подсказку, если она есть
        if (this.hintElement && this.hintElement.parentNode) {
            this.hintElement.remove();
            this.hintElement = null;
        }

        // Создаём блок под подсказку и стиль делаем инлайн, чтобы не зависеть от CSS
        const hintDiv = document.createElement('div');
        hintDiv.style.display = 'block';
        hintDiv.style.color = '#fff';
        hintDiv.style.marginTop = '6px';

        const hintLink = document.createElement('a');
        hintLink.href = this.config.hintUrl;
        hintLink.target = '_blank';
        hintLink.rel = 'noopener';
        hintLink.textContent = 'Подсказка.';
        // Ссылка белого цвета
        hintLink.style.color = '#fff';
        // Сохраним стандартное подчёркивание, но можно убрать если нужно
        hintLink.style.textDecoration = 'underline';

        hintDiv.appendChild(hintLink);

        // Добавляем подсказку как следующий блок внутри messageElement
        this.messageElement.appendChild(hintDiv);
        this.hintElement = hintDiv;
    }
    
    clearMessage() {
        // Очистим основной текст и класс
        if (this.messageElement) {
            this.messageElement.textContent = '';
            this.messageElement.className = '';
        }
        // Удалим подсказку, если была
        if (this.hintElement && this.hintElement.parentNode) {
            this.hintElement.remove();
            this.hintElement = null;
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
