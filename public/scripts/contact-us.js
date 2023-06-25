const cartItemCount = document.querySelector(".cart-item-count");
const modal = document.getElementById("confirm-modal");
const modalContentTitle = document.querySelector(".confirm-modal__content h2")
const modalContentText = document.querySelector(".confirm-modal__content p")
const closeModalBtn = document.getElementById("confirm-modal__close-btn");

// ------------------------  Modal  --------------------------------------
closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// ------------------------  Orders count in header  --------------------------------------
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

// ------------------------  Submit Form  --------------------------------------
const contactForm = document.getElementById("contact-us__form");
contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const subject = contactForm.elements.subject.value;
    const name = contactForm.elements.name.value;
    const email = contactForm.elements.email.value;
    const phone = contactForm.elements.phone.value;
    const message = contactForm.elements.message.value;
    if (!subject || !name || !email || !phone || !message) {
        modal.style.display = "block"
        modalContentTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:red;"></i>`
        modalContentText.textContent = "Sorry, All Fields (subject, name, email, phone, message) Should be Entered"
        return;
    }
    try {
        const response = await sendMessage(subject, name, email, phone, message)
        modal.style.display = "block";
        if (response) {
            modalContentTitle.innerHTML = `<i class="fa-solid fa-circle-check" style="color:green;"></i>`
            modalContentText.textContent = "Message sent successfully, Thanks For Contacting Us"
        } else {
            modalContentTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:red;"></i>`
            modalContentText.textContent = "Sorry, An error Occured so try to send message later"
        }
    } catch (error) {
        console.log(error);
        modal.style.display = "block";
        modalContentTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:red;"></i>`
        modalContentText.textContent = error.message
    }
});

async function sendMessage(subject, name, email, phone, message) {
    const response = await fetch("http://127.0.0.1:3000/api/v1/message/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, name, email, phone, message }),
    });

    if (response.ok && response.status === 201) {
        return true;
    } else {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.error_message);
    }
}
