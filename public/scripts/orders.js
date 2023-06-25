// @ts-nocheck
const cartItemCountEl = document.querySelector(".cart-item-count");
const orderListEl = document.querySelector(".order-list");
const addToCartEl_list = document.querySelectorAll(".add-to-cart-btn");
const loadingEL = document.querySelector(".lds-facebook");
const clientInfo_form = document.querySelector(".client-info__form");
const modal = document.getElementById("confirm-modal");
const modalContentTitle = document.querySelector(".confirm-modal__content h2")
const modalContentText = document.querySelector(".confirm-modal__content p")
const closeModalBtn = document.getElementById("confirm-modal__close-btn");

let language="en";
const cookieLanguage = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('language='));

if (cookieLanguage) {
    language = cookieLanguage.split('=')[1];
}


// ------------------------  Modal  --------------------------------------
closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// Manage Orders
let orderList = [];
readOrders();

function readOrders() {
    const localStorageContent = localStorage.getItem("cartItems");
    if (localStorageContent) {
        orderList = JSON.parse(localStorageContent);
        cartItemCountEl.textContent = orderList.reduce(
            (acc, item) => acc + item.count,
            0
        );
    }else{
        orderList=[]
    }
    updateOrderListUI();
}

function updateOrderListUI() {
    orderListEl.innerHTML = "";

    if (orderList.length == 0) {
        orderListEl.parentElement.innerHTML = `<div class="cart-empty">No Items in the cart</div>`;
        // document.querySelector(".total-price").classList.remove("active");
        return;
    }

    orderList.forEach((item) => {
        orderListEl.innerHTML += `
              <label for="item_1">${(!language || language === "en") ? item.name_en : item.name_ar}</label>
              <div class="order-list__item-details" data-id="${item.id}" data-name="${item.name
            }" data-price="${item.price}">
                <button class="add"><i class="fa-solid fa-plus"></i></button>
                <input type="number" class="count" value="${item.count
            }" disabled/>
                <button class="minus"><i class="fa-solid fa-minus"></i></button>
              </div>
              <div class="item-price">${item.count} * ${item.price} = (${+item.count * +item.price
            }) SAR</div>
            `;

        const addBtns = orderListEl.querySelectorAll("button.add");
        addBtns.forEach((btn) =>
            btn.addEventListener("click", (event) => {
                addToOrder(
                    btn.parentElement.dataset.id,
                    btn.parentElement.dataset.name_en,
                    btn.parentElement.dataset.name_ar,
                    btn.parentElement.dataset.price
                );

                cartItemCountEl.textContent = orderList.reduce(
                    (acc, item) => acc + item.count,
                    0
                );

                //----   Way to update UI inside the input value only  without updating the whole list-----------
                //   btn.nextElementSibling.setAttribute(
                //     "value",
                //     +btn.nextElementSibling.getAttribute("value") + 1
                //   );
                updateOrderListUI();
            })
        );

        const minusBtns = orderListEl.querySelectorAll("button.minus");
        minusBtns.forEach((btn) =>
            btn.addEventListener("click", (event) => {
                removeFromOrder(btn.parentElement.dataset.id);

                cartItemCountEl.textContent = orderList.reduce(
                    (acc, item) => acc + item.count,
                    0
                );

                //----   Way to update UI inside the input value only  without updating the whole list-----------
                //   if (+btn.previousElementSibling.getAttribute("value") <= 1)
                //     updateOrderListUI();
                //   else
                //     btn.previousElementSibling.setAttribute(
                //       "value",
                //       +btn.previousElementSibling.getAttribute("value") - 1
                //     );
                updateOrderListUI();
            })
        );
    });

    const totalPrice = document.querySelector(".total-price");
    if (!totalPrice.classList.contains("active")) {
        totalPrice.classList.add("active");
    }
    const totalPriceValue = totalPrice
        .querySelector(".total-price-value")
        .textContent = orderList.reduce((acc, item) => acc + item.price * item.count, 0)
        ;
}

function addToOrder(id, name_en,name_ar, price) {
    const itemIndex = orderList.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        const item = { id, name_en,name_ar, price, count: 1 };
        orderList.push(item);
    } else {
        orderList[itemIndex].count += 1;
    }
    localStorage.setItem("cartItems", JSON.stringify(orderList));
}

function removeFromOrder(id) {
    const itemIndex = orderList.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
        orderList[itemIndex].count -= 1;
        if (orderList[itemIndex].count <= 0) {
            orderList = orderList.filter((item) => item.count > 0);
        }
        localStorage.setItem("cartItems", JSON.stringify(orderList));
    }
}

// ------------------------  Submit Form  --------------------------------------
clientInfo_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const client_name = clientInfo_form.elements.client_name.value;
    const client_email = clientInfo_form.elements.client_email.value;
    const client_phone = clientInfo_form.elements.client_phone.value;
    const client_vehicle = clientInfo_form.elements.client_vehicle.value;
    const notes = clientInfo_form.elements.notes.value;
    if (!client_name || !client_email || !client_phone) {
        modal.style.display = "block"
        modalContentTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:red;"></i>`
        modalContentText.textContent = "Sorry, At least Fields (name, email, phone) Should be Entered"
        return;
    }
    fetchOrders(client_name, client_email, client_phone, client_vehicle, notes)
        .then((response) => {
            console.log(response);
            loadingEL.style.display = "none"
            modal.style.display = "block";
            if (response) {
                modalContentTitle.innerHTML = `<i class="fa-solid fa-circle-check" style="color:green;"></i>`
                modalContentText.textContent = "Message sent successfully, Thanks For"
                localStorage.removeItem("cartItems");
                readOrders();
                clientInfo_form.reset();
            } else {
                modalContentTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:red;"></i>`
                modalContentText.textContent = "Sorry, An error Occured so try to send message later"
            }
        })
        .catch((error) => {
            console.log(error);
            modalContentTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:red;"></i>`
            modalContentText.textContent = "Sorry, An error Occured so try to send message later"
        });
});

async function fetchOrders(client_name, client_email, client_phone, client_vehicle, notes){
    try {
        orderList = orderList.map(item=>{
            return{id:item.id,
            count:item.count}
        })
        loadingEL.style.display="inline-block"
        const response = await fetch("http://127.0.0.1:3000/api/v1/order/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ client_name, client_email, client_phone, client_vehicle, notes, orderList }),
        });

        if (response.ok && response.status === 201) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}