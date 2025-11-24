// Отримуємо елементи з HTML
var langSelect = document.getElementById("langSelect");
var titleElem = document.getElementById("title");
var textElem = document.getElementById("text");

// Змінна для зберігання всіх перекладів
var translations = null;

// Функція завантажує JSON з перекладами
function loadTranslations() {
    var request = new XMLHttpRequest();          // створюємо запит
    request.open("GET", "lang.json");            // читаємо файл lang.json
    request.responseType = "json";               // очікуємо JSON
    request.send();                              // відправляємо запит

    // коли файл завантажився
    request.onload = function() {
        translations = request.response;         // записуємо переклади в змінну
        setLanguage("en");                       // за замовчуванням показуємо англійську
    };
}

// Функція змінює мову на сторінці
function setLanguage(lang) {
    if (!translations) return;                   // якщо ще не завантажили JSON

    // беремо потрібний об'єкт по ключу "en" або "uk"
    var current = translations[lang];

    // змінюємо текст у HTML
    titleElem.textContent = current.title;
    textElem.textContent = current.text;
}

// Обробник зміни мови в select
langSelect.addEventListener("change", function() {
    // this.value буде "en" або "uk"
    setLanguage(this.value);
});

// Запускаємо завантаження перекладів при відкритті сторінки
loadTranslations();
