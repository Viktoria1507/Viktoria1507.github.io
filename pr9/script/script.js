const catalogSwiper = new Swiper('.catalog-swiper', {
    loop: true,
    speed: 600,
    spaceBetween: 30,
    navigation: {
        nextEl: '.catalog-next',
        prevEl: '.catalog-prev',
    },
    pagination: {
        el: '.catalog-pagination',
        clickable: true,
    },
    // адаптив
    breakpoints: {
        0: {          // телефон
            slidesPerView: 1
        },
        576: {       // невеликий планшет
            slidesPerView: 2
        },
        992: {       // планшет / невеликий десктоп
            slidesPerView: 3
        },
        1200: {      // великий екран – 4 товари як на макеті
            slidesPerView: 4
        }
    }
});
