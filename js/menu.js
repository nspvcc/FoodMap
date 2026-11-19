/* menu.js — адаптивне бургер-меню */

// Позначаємо, що JavaScript доступний: лише тоді CSS ховає меню на смартфонах.
// Скрипт підключено в <head>, тому клас додається до першого відображення сторінки.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('main-nav');

    if (!toggle || !nav) {
        return;
    }

    function setOpen(isOpen) {
        nav.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
    }

    toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Закриття меню клавішею Esc
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            toggle.focus();
        }
    });

    // Закриття меню після переходу за посиланням
    nav.addEventListener('click', function (event) {
        if (event.target.closest('a')) {
            setOpen(false);
        }
    });

    // Скидання стану при переході на широкий екран
    window.matchMedia('(min-width: 768px)').addEventListener('change', function (event) {
        if (event.matches) {
            setOpen(false);
        }
    });
});
