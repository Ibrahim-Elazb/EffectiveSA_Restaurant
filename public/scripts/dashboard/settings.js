const language = getCookie("language");

// ---------------------------------- Confirm Modal  --------------------------------------------
const confirmModal = document.getElementById("confirm-modal");
const confirmModalContentTitle = document.querySelector(".confirm-modal__content h2")
const confirmModalContentText = document.querySelector(".confirm-modal__content p")
const closeConfirmModalBtn = document.getElementById("confirm-modal__close-btn");


const nameEl = document.getElementById("name");
const nameError = document.getElementById("nameError");
const emailEl = document.getElementById("email");
const emailError = document.getElementById("emailError");
const phoneEl = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");


const settingForm = document.getElementById("settingsForm")
settingForm?.addEventListener("submit",async(event)=>{
    event.preventDefault();
    if (!checkInputsValidation()) return;
    try{
        // Request Configuration
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const data = JSON.stringify({
            "name": nameEl.value,
            "email": emailEl.value,
            "phone": phoneEl.value,
        });

        const requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
        };

        const response = await fetch("http://localhost:3000/api/v1/user/editSettings/" + settingForm.dataset.id, requestOptions)
        if (response.ok && response.status === 201) {
            const result = await response.json()
            if (result.count === 0) throw new Error("No Updates Occurred")
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "User Info Updated Successfully"
            confirmModal.style.display = "block";
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error_message)
        }
    }catch(error){
        if (error.message.startsWith('[') && error.message.endsWith(']')) {
            const errorMessageArray = JSON.parse(error.message);
            const listItems = errorMessageArray.map(message => `<li>${message}</li>`);
            error.message = `<ul>\n${listItems.join('\n')}\n</ul>`;
        }
        confirmModalContentTitle.innerHTML = `<span style="color:red;"><ion-icon name="close-circle-outline"></ion-icon></span>`
        confirmModalContentText.innerHTML = error.message
        confirmModal.style.display = "block";
    }
})

function checkInputsValidation() {
    let validForm = true;
    if (nameEl.value.trim() === '') {
        nameError.textContent = 'Name is required.';
        nameEl.classList.add('error');
        nameEl.focus();
        validForm = validForm && false;
    } else {
        nameError.textContent = '';
        nameEl.classList.remove('error');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailEl.value.trim())) {
        emailError.textContent = 'Email is invalid.';
        emailEl.classList.add('error');
        emailEl.focus();
        validForm = validForm && false;
    } else {
        emailError.textContent = '';
        emailEl.classList.remove('error');
    }

    if (phone.value.trim() === '') {
        phoneError.textContent = 'Phone Number is required.';
        phone.classList.add('error');
        phone.focus();
        validForm = validForm && false;
    } else {
        phoneError.textContent = '';
        phone.classList.remove('error');
    }
    return validForm
}


closeConfirmModalBtn.addEventListener("click", function () {
    confirmModal.style.display = "none";
});

window.addEventListener("click", function (event) {
     if (event.target == confirmModal) {
        confirmModal.style.display = "none";
    }
});