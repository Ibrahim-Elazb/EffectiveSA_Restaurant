const slides = document.querySelectorAll(
    ".gallery-carousel .carousel-slide"
);
let currentSlide = 0;

function showSlide() {
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add("active");
        } else {
            slide.classList.remove("active");
        }
        console.log(slide)
    });
    console.log(currentSlide)
    currentSlide = (currentSlide + 1) % slides.length;
}

setInterval(showSlide, 5000);

const cartItemCount = document.querySelector(".cart-item-count");
let ordersList = [];
readOrders();

function readOrders() {
    const localStorageContent = localStorage.getItem("cartItems");
    if (localStorageContent) ordersList = JSON.parse(localStorageContent);
    cartItemCount.textContent = ordersList.reduce(
        (acc, item) => acc + item.count,
        0
    );
}