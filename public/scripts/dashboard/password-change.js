// @ts-nocheck
const language = getCookie("language");

// ---------------------------------- Confirm Modal  --------------------------------------------
const confirmModal = document.getElementById("confirm-modal");
const confirmModalContentTitle = document.querySelector(".confirm-modal__content h2")
const confirmModalContentText = document.querySelector(".confirm-modal__content p")
const closeConfirmModalBtn = document.getElementById("confirm-modal__close-btn");


const currentPasswordEl = document.getElementById("currentPassword");
const currentPasswordError = document.getElementById("currentPasswordError");
const newPasswordEl = document.getElementById("newPassword");
const newPasswordError = document.getElementById("newPasswordError");
const confirmPasswordEl = document.getElementById("confirmPassword");
const confirmPasswordError = document.getElementById("confirmPasswordError");


const passwordChangeForm = document.getElementById("password-change-form")
passwordChangeForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!checkInputsValidation())return;
    try {
        // Request Configuration
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const data = JSON.stringify({
            "currentPassword": currentPasswordEl.value,
            "newPassword": newPasswordEl.value,
            "confirmPassword": confirmPasswordEl.value,
        });

        const requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
        };

        const response = await fetch("http://localhost:3000/api/v1/user/change-password/" + passwordChangeForm.dataset.id, requestOptions)
        if (response.ok && response.status === 201) {
            const result = await response.json()
            if (result.count === 0) throw new Error("No Updates Occurred")
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "Password Updated Successfully"
            confirmModal.style.display = "block";
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error_message)
        }
    } catch (error) {
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
    if (currentPasswordEl.value.trim() === '') {
        currentPasswordError.textContent = 'current Password is required.';
        currentPasswordEl.classList.add('error');
        currentPasswordEl.focus();
        validForm = validForm && false;
    } else {
        currentPasswordError.textContent = '';
        currentPasswordEl.classList.remove('error');
    }

    if (newPasswordEl.value.trim() === '') {
        newPasswordError.textContent = 'New Password is required.';
        newPasswordEl.classList.add('error');
        newPasswordEl.focus();
        validForm = validForm && false;
    } else {
        newPasswordError.textContent = '';
        newPasswordEl.classList.remove('error');
    }
    if (confirmPasswordEl.value.trim() === '' || confirmPasswordEl.value.trim() !== newPasswordEl.value.trim()) {
        confirmPasswordError.textContent = 'confirm password should match new password';
        confirmPasswordEl.classList.add('error');
        confirmPasswordEl.focus();
        validForm = validForm && false;
    } else {
        confirmPasswordError.textContent = '';
        confirmPasswordEl.classList.remove('error');
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