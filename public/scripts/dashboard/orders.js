// @ts-nocheck
const language = getCookie("language");
// ---------------------------------- Orders Modal  --------------------------------------------
const orderModal = document.querySelector(".order-modal");
const closeOrderModal = document.querySelector(".order-modal .close");
const customerNameEl = document.getElementById("customerName");
const customerEmailEl = document.getElementById("customerEmail");
const customerPhoneEl = document.getElementById("customerPhone");
const vehicleNumberEl = document.getElementById("vehicleNumber");
const customerNotesEl = document.getElementById("customerNotes");
const orderTimeEl = document.getElementById("orderTime");
const totalPriceEl = document.getElementById("totalPrice");
const orderStatusEl = document.getElementById("orderStatus");
const orderItemsEl = document.getElementById("orderItems");
// ---------------------------------- Confirm Modal  --------------------------------------------
const confirmModal = document.getElementById("confirm-modal");
const confirmModalContentTitle = document.querySelector(".confirm-modal__content h2")
const confirmModalContentText = document.querySelector(".confirm-modal__content p")
const closeConfirmModalBtn = document.getElementById("confirm-modal__close-btn");
// ---------------------------------- Order Details Event Handler  --------------------------------------------
const ordersGridList = document.querySelector(".orders-grid");
ordersGridList.addEventListener("click", async (event) => {
    try {
        if (event.target.classList.contains("order-id")) {
            const order = event.target;
            const { order: orderDetails } = await getOrderDetails(order.id);
            const formattedDate = new Date(orderDetails.order_time).toLocaleString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });
            openModal(
                orderDetails.client_name,
                orderDetails.client_email,
                orderDetails.client_phone,
                orderDetails.client_vehicle,
                orderDetails.notes,
                formattedDate,
                orderDetails.total_price,
                orderDetails.status,
                orderDetails.orderItems
            )
        } else if (event.target.classList.contains("btn-ready")) {
            const readyButton = event.target
            //edit request to the server
            const result = await changeOrderStatus(readyButton.dataset.order_id, "ready")
            if (result.count === 0) throw new Error("No Updates Occurred")
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "Menu Type Updated Successfully"
            confirmModal.style.display = "block";
            await updateOrdersListUI()
        } else if (event.target.classList.contains("btn-delivered")) {
            const deliveredButton = event.target
            //edit request to the server
            const result = await changeOrderStatus(deliveredButton.dataset.order_id, "delivered")
            if (result.count === 0) throw new Error("No Updates Occurred")
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "Menu Type Updated Successfully"
            confirmModal.style.display = "block";
            await updateOrdersListUI()
        } else if (event.target.classList.contains("btn-cancel")) {
            const cancelButton = event.target
            const result = await changeOrderStatus(cancelButton.dataset.order_id, "cancelled")
            if (result.count === 0) throw new Error("No Updates Occurred")
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "Menu Type Updated Successfully"
            confirmModal.style.display = "block";
            await updateOrdersListUI()
        }
    } catch (error) {
        console.log(error)
        confirmModalContentTitle.innerHTML = `<span style="color:red;"><ion-icon name="close-circle-outline"></ion-icon></span>`
        confirmModalContentText.textContent = "unable to update UI after change"
        confirmModal.style.display = "block";
    }
})

async function changeOrderStatus(order_id, status) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const data = JSON.stringify({
            "status": status
        });

        const requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
        };

        const response = await fetch("http://localhost:3000/api/v1/order/status/" + order_id, requestOptions)
        if (response.ok && response.status === 201) {
            const result = await response.json()
            console.log("the result is " + result)
            return result
        } else {
            const errorData = await response.json();
            console.log(errorData)
            throw new Error(errorData.error_message);
        }
    } catch (error) {
        console.log(error)
        confirmModalContentTitle.innerHTML = `<span style="color:red;"><ion-icon name="close-circle-outline"></ion-icon></span>`
        confirmModalContentText.textContent = "unable to update UI after change"
        confirmModal.style.display = "block";
        return false;
    }
}

function openModal(
    customerName,
    customerEmail,
    customerPhone,
    vehicleNumber,
    customerNotes,
    orderTime,
    totalPrice,
    orderStatus,
    orderItems
) {

    customerNameEl.textContent = customerName;
    customerEmailEl.textContent = customerEmail;
    customerPhoneEl.textContent = customerPhone;
    vehicleNumberEl.textContent = vehicleNumber;
    customerNotesEl.textContent = customerNotes;
    orderTimeEl.textContent = orderTime;
    totalPriceEl.textContent = totalPrice;
    orderStatusEl.textContent = orderStatus;

    // Clear previous order items
    orderItemsEl.innerHTML = "";
    console.log(orderItems)
    // Loop through order items and add them to the list
    orderItems.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = `${item.name_en} (Count: ${item.count
            }, Price Before Discount: ${item.price}, Price After Discount: ${item.price - item.price * item.discount
            })`;
        orderItemsEl.appendChild(li);
    });

    orderModal.style.display = "block";
}

closeOrderModal.addEventListener("click", function () {
    orderModal.style.display = "none";
});

closeConfirmModalBtn.addEventListener("click", function () {
    confirmModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == orderModal) {
        orderModal.style.display = "none";
    } else if (event.target == confirmModal) {
        confirmModal.style.display = "none";
    }
});

async function getOrderDetails(orderId) {

    try {
        // Request Configuration
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        //Request Handling
        const response = await fetch("http://localhost:3000/api/v1/order/" + orderId, requestOptions)
        if (response.ok && response.status === 200) {
            const result = await response.json()
            console.log(result)
            return result
        } else {
            const errorData = await response.json();
            console.log(errorData)
            throw new Error(errorData.error_message);
        }
    } catch (error) {
        console.log(error)
        confirmModalContentTitle.innerHTML = `<span style="color:red;"><ion-icon name="close-circle-outline"></ion-icon></span>`
        confirmModalContentText.textContent = "unable to update UI after change"
        confirmModal.style.display = "block";
        return false;
    }
}

let page = 1;
const loadMoreBtn = document.querySelector(".load-more-btn");
const totalCount = ordersGridList.dataset.orders_count

loadMoreBtn.addEventListener("click", async (event) => {
    await loadMoreOrders();
})

async function loadMoreOrders() {
    if (totalCount > page * 3) {
        page++;
        const response = await fetch(`http://localhost:3000/api/v1/order/all?page=${page}`)
        if (response.ok && response.status === 200) {
            const result = await response.json()
            console.log(result)
            result.forEach(item => {
                let statusIcon = ``, actionButtons = `<div></div>`;
                if (item.status === "pending") {
                    statusIcon = `<span class="overview-card-icon pending"
                        ><ion-icon name="reload-outline"></ion-icon
                      ></span>`
                    actionButtons = `<button class="btn-ready" data-order_id="${item.id}">Ready</button>
                        <button class="btn-cancel" data-order_id="${item.id}">Cancel</button>`
                } else if (item.status === "ready") {
                    statusIcon = `<span class="overview-card-icon ready"
                        ><ion-icon name="checkmark-outline"></ion-icon
                        ></span>`
                    actionButtons = `<button class="btn-delivered" data-order_id="${item.id}">Deliver</button>
                        <button class="btn-cancel" data-order_id="${item.id}">Cancel</button>`
                } else if (item.status === "delivered") {
                    statusIcon = `<span class="overview-card-icon delivered"
                        ><ion-icon name="checkmark-done-outline"></ion-icon></span>`
                    actionButtons = `<div></div>`
                } else if (item.status === "cancelled") {
                    statusIcon = `<span class="overview-card-icon cancelled"
                        ><ion-icon name="thumbs-down-outline"></ion-icon></span>`
                    actionButtons = `<div></div>`
                }
                ordersGridList.innerHTML +=
                    `<div id="${item.id}" class="order-id">${item.id}</div>
                    <div>${item.client_name}</div>
                    <div>${item.total_price} SAR</div>
                    <div>
                    ${item.status}
                    ${statusIcon}
                    </div>
                    <div>
                    ${actionButtons}
                    </div>`

            })
            if (totalCount <= page * 3)
                loadMoreBtn.style.display = "none"
            console.log(page)
            return true;
        } else {
            const errorData = await response.json();
            console.log(errorData)
            throw new Error(errorData.error_message);
        }
    }
}

async function updateOrdersListUI() {
    ordersGridList.innerHTML = `<div class="grid-header">Order ID</div>
                    <div class="grid-header">Customer Name</div>
                    <div class="grid-header">Order Price</div>
                    <div class="grid-header">Order Status</div>
                    <div class="grid-header">Actions</div>`
    for (let index = 1; index <= page; index++) {
        const response = await fetch(`http://localhost:3000/api/v1/order/all?page=${index}`)
        if (response.ok && response.status === 200) {
            const result = await response.json()
            result.forEach(item => {
                let statusIcon = ``, actionButtons = `<div></div>`;
                if (item.status === "pending") {
                    statusIcon = `<span class="overview-card-icon pending"
                        ><ion-icon name="reload-outline"></ion-icon
                      ></span>`
                    actionButtons = `<button class="btn-ready" data-order_id="${item.id}">Ready</button>
                        <button class="btn-cancel" data-order_id="${item.id}">Cancel</button>`
                } else if (item.status === "ready") {
                    statusIcon = `<span class="overview-card-icon ready"
                        ><ion-icon name="checkmark-outline"></ion-icon
                        ></span>`
                    actionButtons = `<button class="btn-delivered" data-order_id="${item.id}">Deliver</button>
                        <button class="btn-cancel" data-order_id="${item.id}">Cancel</button>`
                } else if (item.status === "delivered") {
                    statusIcon = `<span class="overview-card-icon delivered"
                        ><ion-icon name="checkmark-done-outline"></ion-icon></span>`
                    actionButtons = `<div></div>`
                } else if (item.status === "cancelled") {
                    statusIcon = `<span class="overview-card-icon cancelled"
                        ><ion-icon name="thumbs-down-outline"></ion-icon></span>`
                    actionButtons = `<div></div>`
                }
                ordersGridList.innerHTML +=
                    `<div id="${item.id}" class="order-id">${item.id}</div>
                    <div>${item.client_name}</div>
                    <div>${item.total_price} SAR</div>
                    <div>
                    ${item.status}
                    ${statusIcon}
                    </div>
                    <div>
                    ${actionButtons}
                    </div>`

            })
        }

    }

}