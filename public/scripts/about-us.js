const cartItemCount = document.querySelector(".cart-item-count");
let ordersList = [];
readOrders();

function readOrders() {
    const localStorageContent = localStorage.getItem("cartItems");
    if (localStorageContent) ordersList = JSON.parse(localStorageContent);
    console.log(ordersList);
    cartItemCount.textContent = ordersList.reduce(
        (acc, item) => acc + item.count,
        0
    );
}