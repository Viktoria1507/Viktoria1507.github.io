// Масив для зберігання товарів у корзині.
// Кожен товар матиме вигляд: { name: "Назва", price: 1500, qty: 2 }
var cart = [];

// -------------------------------
// Функція для завантаження корзини
// з localStorage (браузерне сховище).
// Якщо дані існують — перетворюємо у масив,
// якщо ні — створюємо пусту корзину.
// -------------------------------
function loadCart() {
    var data = localStorage.getItem("cart");
    if (data) {
        cart = JSON.parse(data);
    } else {
        cart = [];
    }
}

// -------------------------------
// Збереження корзини в localStorage.
// Дані переводимо в JSON, бо localStorage
// працює тільки з текстом.
// -------------------------------
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ------------------------------------------------
// Оновлення лічильника біля іконки корзини.
// Тут рахується НЕ кількість товарів,
// а кількість найменувань (умова завдання).
// ------------------------------------------------
function updateCartCount() {
    var span = document.getElementById("cartCount");
    if (!span) return; // якщо елемента немає (наприклад на cart.html) — нічого не робимо

    var uniqueNames = [];

    // перевіряємо, чи назва товару вже врахована
    for (var i = 0; i < cart.length; i++) {
        var name = cart[i].name;
        if (uniqueNames.indexOf(name) === -1) {
            uniqueNames.push(name);
        }
    }

    span.textContent = uniqueNames.length;
}

// ---------------------------------------------------------
// Функція, яка виводить товари в таблицю на cart.html.
// Якщо корзина порожня — пишемо повідомлення.
// Якщо є товари — створюємо рядки таблиці.
// ---------------------------------------------------------
function renderCartPage() {
    var tbody = document.getElementById("cartTableBody");
    if (!tbody) return; // якщо ми не на сторінці корзини

    var totalEl = document.getElementById("cartTotal");

    // пустий кошик
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Корзина пуста</td></tr>';
        totalEl.textContent = '';
        return;
    }

    tbody.innerHTML = '';
    var total = 0;

    // перебираємо товари і додаємо їх у таблицю
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var sum = item.price * item.qty;
        total += sum;

        var tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty} шт.</td>
            <td>${item.price} грн</td>
            <td>${sum} грн</td>
        `;

        tbody.appendChild(tr);
    }

    // Показуємо загальну суму
    totalEl.textContent = "Загальна сума: " + total + " грн";
}

// ----------------------------
// Функції для модальних вікон
// ----------------------------
function openModal(id) {
    var modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
}

function closeModal(id) {
    var modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

// ====================================================================
//                     ОСНОВНА ЧАСТИНА СКРИПТА
// Виконується тільки коли сторінка завантажилася повністю.
// ====================================================================
document.addEventListener("DOMContentLoaded", function () {

    loadCart();
    updateCartCount();
    renderCartPage();

    var cartBtn = document.getElementById("cartBtn"); // кнопка корзини на головній
    var addBtns = document.querySelectorAll(".add"); // кнопки "Додати"
    var payLink = document.getElementById("payLink"); // кнопка оплати

    // Елементи модальних вікон
    var quantityInput = document.getElementById("quantityInput");
    var quantityConfirmBtn = document.getElementById("quantityConfirmBtn");
    var quantityCancelBtn = document.getElementById("quantityCancelBtn");

    var goToCartBtn = document.getElementById("goToCartBtn");
    var continueShoppingBtn = document.getElementById("continueShoppingBtn");
    var emptyOkBtn = document.getElementById("emptyOkBtn");

    var currentProductName = "";
    var currentProductPrice = 0;

    // ------------------------------
    // Кнопка корзини.
    // Якщо порожня — показує модальне вікно.
    // Якщо має товари — відкриває cart.html.
    // ------------------------------
    if (cartBtn) {
        cartBtn.onclick = function () {
            if (cart.length === 0) {
                openModal("emptyCartModal");
            } else {
                location.href = "cart.html";
            }
        };
    }

    if (emptyOkBtn) {
        emptyOkBtn.onclick = function () {
            closeModal("emptyCartModal");
        };
    }

    // ----------------------------------------------------
    // Клік по кнопці "Додати у корзину".
    // Відкриваємо модальне вікно з кількістю.
    // ----------------------------------------------------
    addBtns.forEach(function (btn) {
        btn.onclick = function () {
            currentProductName = this.getAttribute("data-name");
            currentProductPrice = Number(this.getAttribute("data-price"));

            quantityInput.value = 1;
            openModal("quantityModal");
        };
    });

    // ----------------------------------------------------
    // Підтвердження кількості → товар додається у кошик
    // ----------------------------------------------------
    if (quantityConfirmBtn) {
        quantityConfirmBtn.onclick = function () {
            var qty = Number(quantityInput.value);
            if (qty <= 0) return;

            var existingItem = null;

            // шукаємо товар у корзині
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].name === currentProductName) {
                    existingItem = cart[i];
                    break;
                }
            }

            if (existingItem) {
                existingItem.qty += qty;
            } else {
                cart.push({ name: currentProductName, price: currentProductPrice, qty: qty });
            }

            saveCart();
            updateCartCount();
            closeModal("quantityModal");
            openModal("addedModal");
        };
    }

    // Закриваємо вибір кількості
    if (quantityCancelBtn) {
        quantityCancelBtn.onclick = function () {
            closeModal("quantityModal");
        };
    }

    // після додавання → перейти до корзини
    if (goToCartBtn) {
        goToCartBtn.onclick = function () {
            location.href = "cart.html";
        };
    }

    // після додавання → залишитись
    if (continueShoppingBtn) {
        continueShoppingBtn.onclick = function () {
            closeModal("addedModal");
        };
    }

    // кнопка оплати на cart.html
    if (payLink) {
        payLink.onclick = function (e) {
            e.preventDefault();
            alert("Оплата поки що не реалізована.");
        };
    }
});
