
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const passwordDisplay = document.getElementById('password');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const copyNotification = document.getElementById('copyNotification');
const strengthBar = document.getElementById('strengthBar');

const lowercaseCheckbox = document.getElementById('lowercase');
const uppercaseCheckbox = document.getElementById('uppercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');

// Обновляем отображение длины
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

// Генерация пароля
generateBtn.addEventListener('click', () => {
    const length = parseInt(lengthSlider.value);
    const lowercase = lowercaseCheckbox.checked;
    const uppercase = uppercaseCheckbox.checked;
    const numbers = numbersCheckbox.checked;
    const symbols = symbolsCheckbox.checked;
    
    if (!lowercase && !uppercase && !numbers && !symbols) {
        passwordDisplay.textContent = 'Выбери хоть что-то, дебил!';
        return;
    }
    
    let charset = '';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    const cryptoArray = new Uint32Array(length);
    window.crypto.getRandomValues(cryptoArray);
    
    for (let i = 0; i < length; i++) {
        password += charset[cryptoArray[i] % charset.length];
    }
    
    passwordDisplay.textContent = password;
    updateStrengthMeter(password);
});

// Копирование в буфер
copyBtn.addEventListener('click', () => {
    const password = passwordDisplay.textContent;
    
    if (!password || password === 'Нажми "Сгенерировать"' || password.includes('дебил')) {
        showNotification('Сначала сгенерируй пароль, мудак!');
        return;
    }
    
    navigator.clipboard.writeText(password)
        .then(() => showNotification('Пароль скопирован!'))
        .catch(err => showNotification('Ошибка: ' + err));
});

// Показ уведомления
function showNotification(message) {
    copyNotification.textContent = message;
    copyNotification.style.opacity = '1';
    
    setTimeout(() => {
        copyNotification.style.opacity = '0';
    }, 2000);
}

// Оценка сложности пароля
function updateStrengthMeter(password) {
    let strength = 0;
    
    // Проверка длины
    if (password.length >= 12) strength += 2;
    else if (password.length >= 8) strength += 1;
    
    // Проверка на наличие разных символов
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    
    if (hasLower) strength += 1;
    if (hasUpper) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSymbol) strength += 2;
    
    // Обновление полоски
    const percent = Math.min(100, strength * 20);
    strengthBar.style.width = percent + '%';
    
    // Цвет в зависимости от силы
    if (percent < 40) {
        strengthBar.style.background = '#ff4d4d'; // Красный
    } else if (percent < 70) {
        strengthBar.style.background = '#ffcc00'; // Жёлтый
    } else {
        strengthBar.style.background = '#00cc66'; // Зелёный
    }
}
 