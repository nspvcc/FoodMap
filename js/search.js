/* Пошук закладів за стравою, бюджетом і рейтингом. Дані меню демонстраційні. */
document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var dish = (params.get('dish') || '').trim().toLocaleLowerCase('uk');
    var district = params.get('location') || 'any';
    var form = document.getElementById('filters-form');
    var minPrice = document.getElementById('min-price-filter');
    var maxPrice = document.getElementById('max-price-filter');
    var minValue = document.getElementById('min-price-value');
    var maxValue = document.getElementById('max-price-value');
    var rating = document.getElementById('rating-filter');
    var cards = Array.from(document.querySelectorAll('.restaurant-card'));
    var summary = document.getElementById('search-summary');

    function normalize(value) {
        return value.toLocaleLowerCase('uk').replace(/[’'`]/g, '').replace(/\s+/g, ' ').trim();
    }

    function getMenu(card) {
        try { return JSON.parse(card.dataset.menu || '{}'); }
        catch (error) { return {}; }
    }

    // Кілька страв можна ввести через кому або крапку з комою.
    // Для кожного запиту окремо шукаємо відповідну позицію меню.
    function getDishQueries() {
        return dish.split(/[,;]+/).map(normalize).filter(Boolean);
    }

    function getMatchingItems(card) {
        var menu = getMenu(card);
        var entries = Object.entries(menu);
        var queries = getDishQueries();
        if (!queries.length) return entries;

        var matches = [];
        for (var i = 0; i < queries.length; i++) {
            var query = queries[i];
            var candidates = entries.filter(function (entry) {
                var name = normalize(entry[0]);
                return name.includes(query) || query.includes(name);
            });
            // Якщо хоча б однієї шуканої страви немає в меню, заклад
            // не відповідає запиту «і ця страва, і ця страва».
            if (!candidates.length) return [];
            candidates.sort(function (a, b) {
                return normalize(a[0]).length - normalize(b[0]).length;
            });
            var found = candidates[0];
            if (!matches.some(function (item) { return item[0] === found[0]; })) {
                matches.push(found);
            }
        }
        return matches;
    }

    function syncRange(changed) {
        if (Number(minPrice.value) > Number(maxPrice.value)) {
            if (changed === 'min') maxPrice.value = minPrice.value;
            else minPrice.value = maxPrice.value;
        }
        minValue.textContent = minPrice.value;
        maxValue.textContent = maxPrice.value;
    }

    function applyFilters() {
        syncRange();
        var min = Number(minPrice.value);
        var max = Number(maxPrice.value);
        var minRating = Number(rating.value) || 1;
        var visible = 0;

        cards.forEach(function (card) {
            var matchingItems = getMatchingItems(card);
            var itemsInBudget = matchingItems.filter(function (item) {
                var price = Number(item[1]);
                return price >= min && price <= max;
            });
            var districtMatches = district === 'any' || card.dataset.district === district;
            var ratingMatches = Number(card.dataset.rating) >= minRating;
            var show = matchingItems.length > 0 && itemsInBudget.length > 0 && districtMatches && ratingMatches;
            card.hidden = !show;

            var priceLine = card.querySelector('.dish-price');
            if (priceLine) {
                if (dish) {
                    priceLine.textContent = show
                        ? itemsInBudget.map(function (item) { return item[0] + ' — ' + item[1] + ' грн'; }).join('; ')
                        : 'Страва не знайдена в меню або не входить у вибраний бюджет.';
                    if (show) priceLine.textContent = 'Ціна шуканої страви: ' + priceLine.textContent;
                } else {
                    priceLine.textContent = show
                        ? 'Ціни в межах бюджету: ' + itemsInBudget.map(function (item) { return item[0] + ' — ' + item[1] + ' грн'; }).join('; ')
                        : 'Немає страв у вибраному бюджеті.';
                }
            }
            if (show) visible++;
        });

        var dishText = dish ? 'Шукані страви: ' + getDishQueries().join(', ') + '.' : 'Показано страви з меню.';
        var districtText = district === 'any' ? 'Усі райони.' : (district === 'darnytskyi' ? 'Район: Дарницький.' : 'Обраний район: ' + district + '.');
        summary.textContent = dishText + ' ' + districtText + ' Бюджет: ' + min + '–' + max + ' грн. Знайдено закладів: ' + visible + '.';

        var oldEmpty = document.getElementById('no-results');
        if (oldEmpty) oldEmpty.remove();
        if (!visible) {
            var empty = document.createElement('p');
            empty.id = 'no-results';
            empty.textContent = dish
                ? 'Не знайдено закладів, у меню яких є всі вибрані страви (' + getDishQueries().join(', ') + ') у межах заданого бюджету. Спробуйте змінити запит або діапазон ціни.'
                : 'За вибраними параметрами закладів не знайдено. Спробуйте змінити бюджет або рейтинг.';
            document.getElementById('results-list').appendChild(empty);
        }
    }

    minPrice.addEventListener('input', function () { syncRange('min'); applyFilters(); });
    maxPrice.addEventListener('input', function () { syncRange('max'); applyFilters(); });
    form.addEventListener('submit', function (event) { event.preventDefault(); applyFilters(); });
    form.addEventListener('reset', function () {
        window.setTimeout(function () {
            minPrice.value = '0';
            maxPrice.value = '500';
            rating.value = '1';
            syncRange();
            applyFilters();
        }, 0);
    });
    applyFilters();
});
