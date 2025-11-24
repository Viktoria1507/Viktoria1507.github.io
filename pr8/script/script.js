// Отримуємо доступ до тегів header та section, щоб потім додати туди дані
const header = document.querySelector("header");
const section = document.querySelector("section");

// Шлях до JSON файлу
const requestURL = "heroes.json";

// Створюємо об'єкт запиту для отримання JSON
const request = new XMLHttpRequest();
request.open("GET", requestURL);  // відкриваємо запит на читання файлу
request.responseType = "json";    // кажемо що чекатимемо JSON
request.send();                   // відправляємо запит

// Коли файл завантажиться — виконується цей код
request.onload = function () {

    // Отримуємо JSON вже як JavaScript-об'єкт
    const superHeroes = request.response;

    // Додаємо дані в шапку (назва, місто, рік)
    populateHeader(superHeroes);

    // Створюємо картки героїв
    showHeroes(superHeroes);
};


// Функція заповнює header інформацією з JSON
function populateHeader(jsonObj) {

    const h1 = document.createElement("h1"); // назва команди
    const p = document.createElement("p");   // додаткова інфа

    // Беремо текст з JSON
    h1.textContent = jsonObj.squadName;
    p.textContent = "Місто: " + jsonObj.homeTown + ", створено: " + jsonObj.formed;

    // Додаємо елементи в HTML
    header.appendChild(h1);
    header.appendChild(p);
}


// Функція створює елементи для кожного героя і виводить їх на сторінку
function showHeroes(jsonObj) {

    const heroes = jsonObj.members; // беремо масив героїв

    // Перебираємо список героїв
    for (let i = 0; i < heroes.length; i++) {

        // Створюємо HTML елементи для одного героя
        const article = document.createElement("article");
        const h2 = document.createElement("h2");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const p3 = document.createElement("p");
        const ul = document.createElement("ul");

        // Додаємо дані про героя у створені теги
        h2.textContent = heroes[i].name;
        p1.textContent = "Секретне імʼя: " + heroes[i].secretIdentity;
        p2.textContent = "Вік: " + heroes[i].age;
        p3.textContent = "Суперсили:";

        // Додаємо суперсили у список <ul>
        const powers = heroes[i].powers;
        for (let j = 0; j < powers.length; j++) {
            const li = document.createElement("li");
            li.textContent = powers[j];
            ul.appendChild(li);
        }

        // Формуємо "картку" героя і додаємо на сторінку
        article.appendChild(h2);
        article.appendChild(p1);
        article.appendChild(p2);
        article.appendChild(p3);
        article.appendChild(ul);

        section.appendChild(article); // додаємо у секцію
    }
}
