// Тут зберігається шлях до файлу з товарами
// (у мене він лежить в тій же папці, що і index.html)
const productsUrl = 'products.json';

// Шукаю елементи на сторінці, з якими буду працювати
const languageSelect = document.getElementById('languageSelect'); // вибір мови
const cardsWrapper = document.querySelector('.catalog-cards');    // куди вставлятимуться картки товарів
const titleElement = document.querySelector('.catalog-title');     // заголовок каталогу

// Змінні, де буде зберігатися стан додатку
let currentLanguage = 'uk';   // мова за замовчуванням
let productsData = null;      // сюди потім збережу JSON з товарами
let catalogSlider = null;     // Swiper слайдер (створю пізніше)


// Перевіряю, чи користувач вже колись вибирав мову.
// Якщо так — беремо її з localStorage.
const savedLanguage = localStorage.getItem('catalogLanguage');
if (savedLanguage === 'uk' || savedLanguage === 'en') {
    currentLanguage = savedLanguage;
}
languageSelect.value = currentLanguage;


// --- СТАРТ РОБОТИ ---
// Коли сторінка запустилась — завантажуємо JSON
loadProducts();


// Коли користувач перемикає мову у select
languageSelect.addEventListener('change', (event) => {

    // Записуємо нову мову
    currentLanguage = event.target.value;

    // Зберігаємо мову в браузері, щоб не скидалася при перезавантаженні
    localStorage.setItem('catalogLanguage', currentLanguage);

    // Якщо JSON вже завантажений — оновлюємо вміст
    if (productsData) {
        renderCatalog();

        // Оновлюю слайдер, щоб він знав про нові елементи
        if (catalogSlider) {
            catalogSlider.update();
        }
    }
});



// ⬇ Функція, яка завантажує JSON з товарами
function loadProducts() {
    fetch(productsUrl)
        .then((response) => {

            // Якщо JSON не знайдено — викидаємо помилку
            if (!response.ok) {
                throw new Error('Файл products.json не завантажився');
            }

            return response.json();
        })
        .then((data) => {

            // Зберігаємо дані у змінну
            productsData = data;

            // Малюємо товари
            renderCatalog();

            // Запускаємо слайдер
            initSlider();
        })
        .catch((error) => {
            console.error('Помилка:', error);
        });
}



// ⬇ Малювання каталогу з JSON
function renderCatalog() {

    // Якщо JSON ще не був завантажений — виходимо
    if (!productsData) return;

    // Підставляю заголовок для обраної мови
    titleElement.textContent = productsData.translations.title[currentLanguage];

    // Очищаю старі картки, щоб не було дублювання
    cardsWrapper.innerHTML = '';

    // Перебираю масив товарів з JSON та створюю HTML
    productsData.products.forEach((product) => {

        // Створюю слайд (блок) для Swiper
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        // Визначаю, який бейдж (новинка чи хіт)
        const badgeClass =
            product.badgeType === 'new'
                ? 'badge badge-new'
                : 'badge badge-hit';

        // Беру потрібний текст залежно від мови
        const badgeText = product.badgeText[currentLanguage];
        const categoryText = product.category[currentLanguage];
        const titleText = product.title[currentLanguage];
        const currencyText = product.currency[currentLanguage];

        // Ціни
        const price = product.price;
        const oldPrice = product.oldPrice;

        // Текст кнопки ("У кошик" або "Add to cart")
        const buttonText = productsData.translations.buttons[product.btnType][currentLanguage];

        // Формую HTML-картку товару
        slide.innerHTML = `
            <article class="product-card">
                <div class="${badgeClass}">${badgeText}</div>

                <div class="product-category">${categoryText}</div>

                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${titleText}">
                </div>

                <h3 class="product-title">
                    <a href="${product.link}" target="_blank">
                        ${titleText}
                    </a>
                </h3>

                <div class="price-block">
                    ${oldPrice ? `<span class="old-price">${oldPrice} ${currencyText}</span>` : ''}
                    <span class="current-price">${price}</span>
                    <span class="currency">${currencyText}</span>
                </div>

                <a href="${product.link}" target="_blank" class="btn-cart">${buttonText}</a>
            </article>
        `;

        // Додаю картку в контейнер
        cardsWrapper.appendChild(slide);
    });
}



// ⬇ Функція, яка запускає Swiper (слайдер)
function initSlider() {
    catalogSlider = new Swiper('.catalog-swiper', {
        loop: true,            // нескінченна прокрутка
        speed: 600,            // швидкість анімації
        spaceBetween: 30,      // відступи між картками

        navigation: {
            nextEl: '.catalog-next',
            prevEl: '.catalog-prev',
        },

        pagination: {
            el: '.catalog-pagination',
            clickable: true,
        },

        // Адаптивність
        breakpoints: {
            0: { slidesPerView: 1 },      // на телефоні — 1 картка
            576: { slidesPerView: 2 },    // на маленькому планшеті — 2
            992: { slidesPerView: 3 },    // на ноутбуці — 3
            1200: { slidesPerView: 4 }    // на великому моніторі — 4
        }
    });
}
