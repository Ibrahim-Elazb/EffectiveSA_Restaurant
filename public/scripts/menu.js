const cartItemCount = document.querySelector(".cart-item-count");

const addToCartEl_list = document.querySelectorAll(".add-to-cart-btn");
addToCartEl_list.forEach((buttonEl) => {
    buttonEl.addEventListener("click", (event) => {
        addToOrder(
            buttonEl.dataset.id,
            buttonEl.dataset.name_en,
            buttonEl.dataset.name_ar,
            buttonEl.dataset.price
        );
        cartItemCount.textContent = ordersList.reduce(
            (acc, item) => acc + item.count,
            0
        );
    });
});
// Manage Orders
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

function addToOrder(id, name_en,name_ar, price) {
    const itemIndex = ordersList.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        const item = { id, name_en, name_ar, price, count: 1 };
        ordersList.push(item);
    } else {
        ordersList[itemIndex].count += 1;
    }
    localStorage.setItem("cartItems", JSON.stringify(ordersList));
}

function removeFromOrder(id) {
    const itemIndex = ordersList.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
        ordersList[itemIndex].count -= 1;
        if (ordersList[itemIndex].count <= 0) {
            ordersList = ordersList.filter((item) => item.count > 0);
        }
        localStorage.setItem("cartItems", JSON.stringify(ordersList));
    }
}