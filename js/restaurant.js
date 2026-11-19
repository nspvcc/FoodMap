/* Демонстраційні дані закладів. Меню та ціни тут узгоджені з картками пошуку. */
document.addEventListener('DOMContentLoaded', function () {
    var restaurants = {
    "puzata": {
        "name": "Пузата Хата",
        "rating": "4.5",
        "address": "Київ, Дарницький район",
        "description": "Демонстраційна сторінка закладу.",
        "menu": {
            "борщ": 95,
            "піца": 145,
            "вареники": 110
        }
    },
    "chornomorka": {
        "name": "Чорноморка",
        "rating": "4.7",
        "address": "Київ, Дарницький район",
        "description": "Демонстраційна сторінка закладу.",
        "menu": {
            "піца з морепродуктами": 245,
            "рибний суп": 190,
            "салат": 165
        }
    },
    "gastrofamily": {
        "name": "GastroFamily Market",
        "rating": "4.6",
        "address": "Київ, Дарницький район",
        "description": "Демонстраційна сторінка закладу.",
        "menu": {
            "борщ": 120,
            "піца": 175,
            "паста": 185,
            "салат": 130
        }
    },
    "nemarket": {
        "name": "Nemarket",
        "rating": "4.3",
        "address": "Київ, Дарницький район",
        "description": "Демонстраційна сторінка закладу.",
        "menu": {
            "піца": 210,
            "борщ": 130,
            "паста": 195
        }
    },
    "pervak": {
        "name": "Pervak",
        "rating": "4.8",
        "address": "вул. Рогнідинська, 2, Київ",
        "description": "Демонстраційна сторінка закладу.",
        "menu": {
            "борщ із салом та пампушками": 180,
            "вареники з картоплею": 140,
            "котлета по-київськи": 220
        }
    }
};
    var id = new URLSearchParams(window.location.search).get('id') || 'pervak';
    var restaurant = restaurants[id];
    var title = document.getElementById('restaurant-name');
    if (!restaurant) {
        title.textContent = 'Заклад не знайдено';
        document.getElementById('restaurant-menu').innerHTML = '<li>Перейдіть до результатів пошуку та оберіть заклад.</li>';
        return;
    }
    document.title = restaurant.name + ' - FoodMap';
    title.textContent = restaurant.name;
    document.getElementById('restaurant-rating').textContent = restaurant.rating + '/5';
    document.getElementById('restaurant-address').textContent = restaurant.address;
    document.getElementById('restaurant-description').textContent = restaurant.description;
    var list = document.getElementById('restaurant-menu');
    Object.entries(restaurant.menu).forEach(function (entry) {
        var li = document.createElement('li');
        var name = document.createElement('span');
        var price = document.createElement('span');
        name.textContent = entry[0].charAt(0).toLocaleUpperCase('uk') + entry[0].slice(1);
        price.className = 'price';
        price.textContent = entry[1] + ' грн';
        li.append(name, price);
        list.appendChild(li);
    });
});
