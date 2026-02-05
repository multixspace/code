// const — константа. Посилання на об'єкт не зміниться.
// let — змінна, яку можна переприсвоювати.
// Ніколи не використовуй var (це старий, небезпечний стиль).

const UI = {
    editor: document.getElementById('code-editor'),
    btnMode: document.getElementById('btn-mode'),
    console: document.getElementById('console-output')
};

const State = {
    isEditMode: false,
    // Додамо трохи помилкового коду для тесту
    code: "; MULTIX Sys Asm\n\n_start:\n    MOV x1, 10\n    ERR_CMD x2, 0 ; Помилка тут\n    RET"
};

function init() {
    UI.editor.value = State.code;
    UI.btnMode.addEventListener('click', toggleMode);
    
    log("Terminal ready.", "sys");
    
    // Імітація: через 1 секунду "компілятор" знаходить помилку
    setTimeout(() => {
        // Уявімо, що компілятор повернув: Error at char 35
        reportError("Unknown instruction 'ERR_CMD'", 35, 42); 
    }, 1000);
}

function toggleMode() {
    State.isEditMode = !State.isEditMode;
    UI.editor.readOnly = !State.isEditMode;
    
    if (State.isEditMode) {
        UI.btnMode.textContent = "Save";
        UI.btnMode.style.borderColor = "var(--accent)";
        UI.btnMode.style.background = "var(--accent)";
        UI.btnMode.style.color = "white";
    } else {
        UI.btnMode.textContent = "Edit";
        UI.btnMode.style = ""; // Скидаємо стилі до дефолтних (CSS)
        log("Saved to memory.", "sys");
    }
}

// Функція стрибка до коду
// start - індекс початку символу, end - індекс кінця
function jumpToCode(start, end) {
    // 1. Фокусуємо редактор
    UI.editor.focus();
    
    // 2. Виділяємо текст (native browser selection)
    // Це найпростіший і найнадійніший спосіб підсвітити код без складних бібліотек
    UI.editor.setSelectionRange(start, end);
    
    // 3. Скролимо до виділення (щоб не шукати очима)
    // blur і focus іноді допомагають браузеру "стрибнути"
    UI.editor.blur();
    UI.editor.focus();
}

function reportError(msg, start, end) {
    const div = document.createElement('div');
    div.className = "log-item log-err";
    
    // Створюємо текст помилки
    div.innerHTML = `[ERROR] ${msg} `;
    
    // Створюємо "посилання" (кнопку)
    const link = document.createElement('span');
    link.className = "err-link";
    link.textContent = `@jump`;
    
    // При кліку викликаємо функцію стрибка
    link.onclick = () => jumpToCode(start, end);
    
    div.appendChild(link);
    UI.console.appendChild(div);
}

function log(msg, type="") {
    const div = document.createElement('div');
    div.className = `log-item log-${type}`;
    div.textContent = `> ${msg}`;
    UI.console.appendChild(div);
}

document.addEventListener('DOMContentLoaded', init);
