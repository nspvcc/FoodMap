/* validation.js — клієнтська валідація форм на основі HTML5-атрибутів
   (required, type, min, max, minlength...). Скрипт лише показує зрозумілі
   повідомлення про помилки та вмикає стилі .touched / .was-validated. */

document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form.needs-validation');

    function getMessage(field) {
        var v = field.validity;

        if (v.valueMissing) {
            return 'Заповніть це поле.';
        }
        if (v.typeMismatch && field.type === 'email') {
            return 'Введіть email у форматі name@example.com.';
        }
        if (v.tooShort) {
            return 'Мінімум символів: ' + field.getAttribute('minlength') + '.';
        }
        if (v.rangeUnderflow || v.rangeOverflow) {
            return 'Введіть число від ' + field.min + ' до ' + field.max + '.';
        }
        if (v.stepMismatch) {
            return 'Некоректне значення: крок — ' + field.step + '.';
        }
        if (v.patternMismatch) {
            return field.title || 'Значення має неправильний формат.';
        }
        return field.validationMessage;
    }

    function getErrorBox(field) {
        var id = field.id + '-error';
        var box = document.getElementById(id);

        if (!box) {
            box = document.createElement('p');
            box.id = id;
            box.className = 'error-message';
            field.insertAdjacentElement('afterend', box);
            field.setAttribute('aria-describedby', id);
        }
        return box;
    }

    function check(field) {
        var box = getErrorBox(field);

        if (field.checkValidity()) {
            box.textContent = '';
            field.removeAttribute('aria-invalid');
        } else {
            box.textContent = getMessage(field);
            field.setAttribute('aria-invalid', 'true');
        }
    }

    forms.forEach(function (form) {
        // Без JS працюють стандартні підказки браузера; з JS показуємо власні
        form.setAttribute('novalidate', '');

        var fields = form.querySelectorAll('input, select, textarea');
        var summary = form.querySelector('.form-summary');

        // Помилка під полем зсуває кнопку вниз. Якщо перевіряти поле на blur у момент
        // натискання кнопки, клік «зісковзує» з кнопки й форма не надсилається
        // (особливо в Safari). Тому під час натискання кнопки перевірку на blur пропускаємо:
        // усі поля все одно перевіряються в обробнику submit.
        var pressingButton = false;
        form.addEventListener('pointerdown', function (event) {
            if (event.target.closest('button')) {
                pressingButton = true;
            }
        });
        document.addEventListener('pointerup', function () {
            window.setTimeout(function () { pressingButton = false; }, 0);
        });
        document.addEventListener('pointercancel', function () {
            pressingButton = false;
        });

        fields.forEach(function (field) {
            if (!field.id || field.type === 'hidden') {
                return;
            }

            field.addEventListener('blur', function () {
                field.classList.add('touched');
                if (pressingButton) {
                    return;
                }
                check(field);
            });

            field.addEventListener('input', function () {
                if (field.classList.contains('touched')) {
                    check(field);
                }
            });
        });

        form.addEventListener('submit', function (event) {
            if (form.checkValidity()) {
                if (summary) {
                    summary.textContent = '';
                }
                return;
            }

            event.preventDefault();
            form.classList.add('was-validated');

            fields.forEach(function (field) {
                if (field.id) {
                    check(field);
                }
            });

            if (summary) {
                summary.textContent = 'Перевірте форму: деякі поля заповнені неправильно.';
            }

            var firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        });

        form.addEventListener('reset', function () {
            form.classList.remove('was-validated');
            fields.forEach(function (field) {
                field.classList.remove('touched');
                field.removeAttribute('aria-invalid');
                var box = document.getElementById(field.id + '-error');
                if (box) {
                    box.textContent = '';
                }
            });
            if (summary) {
                summary.textContent = '';
            }
        });
    });
});
