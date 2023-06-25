// @ts-nocheck

const language = getCookie("language");
// ---------------------------------- Menu Types Modal (Add and Update)  --------------------------------------------
const menuTypesModal = document.querySelector(".menu-type-modal");
const closeMenuTypesModal = document.querySelector(".close");
const menuTypesForm = document.getElementById("menuTypeForm");
const englishNameEl = document.getElementById("name_en");
const englishNameError = document.getElementById("name_enError");
const arabicNameEl = document.getElementById("name_ar");
const arabicNameError= document.getElementById("name_arError");

// ---------------------------------- Confirm Modal  --------------------------------------------
const confirmModal = document.getElementById("confirm-modal");
const confirmModalContentTitle = document.querySelector(".confirm-modal__content h2")
const confirmModalContentText = document.querySelector(".confirm-modal__content p")
const closeConfirmModalBtn = document.getElementById("confirm-modal__close-btn");

closeConfirmModalBtn.addEventListener("click", function () {
    confirmModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == confirmModal) {
        confirmModal.style.display = "none";
    }
});
// ---------------------------------- Menu Types (Add and Edit) Event Handler  --------------------------------------------
let editMode = false;
const addNewMenuType = document.querySelector(
    ".menu-types-section .btn-add"
);

addNewMenuType.addEventListener("click", (event) => {
    editMode = false;
    openMenuTypeModal();
});

const menuTypesGridContainer = document.querySelector(".menu-types-grid")
menuTypesGridContainer.addEventListener("click", event => {
    // For update button handler
    if (event.target.classList.contains("btn-edit")) {
        const editButton = event.target
        editMode = true
        openMenuTypeModal(editButton.dataset.name_en, editButton.dataset.name_ar, editButton.dataset.id);
    } else if (event.target.classList.contains("btn-delete")) {//  For delete button handler
        const deleteButton = event.target
        const menuTypeId = deleteButton.dataset.id
        const isDeleteConfirmed = confirm(
            "Are you Sure That You will delete this menu type ??"
        );
        if (isDeleteConfirmed) {
            //send delete Request to the server
            deleteMenuTypeHandler(menuTypeId).then(result => {
                if (result.count === 0) throw new Error("No Delete Occurred")
                menuTypesModal.style.display = "none";
                confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
                confirmModalContentText.textContent = "Menu Type Deleted Successfully"
                confirmModal.style.display = "block";
                renderMenuTypesUI().then(result => {
                    console.log(result)
                })
            }).catch(error => {
                menuTypesModal.style.display = "none";
                confirmModalContentTitle.innerHTML = `<span style="color:red;"><ion-icon name="close-circle-outline"></ion-icon></span>`
                confirmModalContentText.textContent = error.message
                confirmModal.style.display = "block";
            })
        }
    }
})

menuTypesForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission
    if(!checkInputsValidation())
        return;
    try {
        if (editMode) {
            //edit request to the server
            const result = await updateMenuTypeHandler(englishNameEl.value, arabicNameEl.value, menuTypesForm.dataset.id)
            if (result.count === 0) throw new Error("No Updates Occurred")
            menuTypesModal.style.display = "none";
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "Menu Type Updated Successfully"
            confirmModal.style.display = "block";
        } else {
            //new menu type request to the server
            const result = await addNewMenuTypeHandler(englishNameEl.value, arabicNameEl.value)
            if (!result.done) throw new Error("No Insertion Occurred")
            menuTypesModal.style.display = "none";
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "Menu Type Added Successfully"
            confirmModal.style.display = "block";
        }
        renderMenuTypesUI().then(result => {
            console.log(result)
        })
    } catch (error) {
        if (error.message.startsWith('[') && error.message.endsWith(']')) {
            const errorMessageArray = JSON.parse(error.message);
            const listItems = errorMessageArray.map(message => `<li>${message}</li>`);
            error.message = `<ul>\n${listItems.join('\n')}\n</ul>`;
        }
        menuTypesModal.style.display = "none";
        confirmModalContentTitle.innerHTML = `<span style="color:red;"><ion-icon name="close-circle-outline"></ion-icon></span>`
        confirmModalContentText.innerHTML = error.message
        confirmModal.style.display = "block";
    }
});

function checkInputsValidation() {
    let validForm = true;
    if (englishNameEl.value.trim() === '') {
        englishNameError.textContent = 'English Name is required.';
        englishNameEl.classList.add('error');
        englishNameEl.focus();
        validForm = validForm && false;
    } else {
        englishNameError.textContent = '';
        englishNameEl.classList.remove('error');
    }

    if (arabicNameEl.value.trim() === '') {
        arabicNameError.textContent = 'Arabic Name is required.';
        arabicNameEl.classList.add('error');
        arabicNameEl.focus();
        validForm = validForm && false;
    } else {
        arabicNameError.textContent = '';
        arabicNameEl.classList.remove('error');
    }
    return validForm
}

closeMenuTypesModal.addEventListener("click", function () {
    menuTypesModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == menuTypesModal) {
        menuTypesModal.style.display = "none";
    }
});

function openMenuTypeModal(englishName, arabicName, menuTypeId) {

    menuTypesForm.reset(); // Reset form fields
    menuTypesForm.querySelectorAll(".error-message").forEach(item => {
        item.textContent = ""
    })

    if (editMode) {
        menuTypesForm.dataset.id = menuTypeId
        englishNameEl.value = englishName;
        arabicNameEl.value = arabicName;
    }
    menuTypesModal.style.display = "block";
}

async function updateMenuTypeHandler(englishName, arabicName, menuTypeId) {

    // Request Configuration
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const newMenuType = JSON.stringify({
        "name_en": englishName,
        "name_ar": arabicName
    });
    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: newMenuType,
    };

    //Request Handling
    const response = await fetch("http://localhost:3000/api/v1/menu-type/edit/" + menuTypeId, requestOptions)
    if (response.ok && response.status === 201) {
        const result = await response.json()
        console.log(result)
        return result
    } else {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.error_message);
    }

}

async function addNewMenuTypeHandler(englishName, arabicName) {

    // Request Configuration
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const newMenuType = JSON.stringify({
        "name_en": englishName,
        "name_ar": arabicName
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: newMenuType,
    };
    // Request Handling
    const response = await fetch("http://localhost:3000/api/v1/menu-type/new", requestOptions)
    if (response.ok && response.status === 201) {
        const result = await response.json()
        console.log(result)
        return result;
    } else {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.error_message);
    }
}

async function deleteMenuTypeHandler(menuTypeId) {

    // Request Configuration
    const requestOptions = {
        method: 'DELETE'
    };

    //Request Handling
    const response = await fetch("http://localhost:3000/api/v1/menu-type/delete/" + menuTypeId, requestOptions)
    if (response.ok && response.status === 201) {
        const result = await response.json()
        return result;
    } else {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.error_message);
    }

}

async function renderMenuTypesUI() {

    try {
        const response = await fetch("http://localhost:3000/api/v1/menu-type/all")
        if (response.ok && response.status === 200) {
            const result = await response.json()
            if (result.menu_types.length >= 0) {
                menuTypesGridContainer.innerHTML = `<div class="grid-header">Menu Type ID</div>
                                            <div class="grid-header">English Name</div>
                                            <div class="grid-header">Arabic Email</div>
                                            <div class="grid-header"></div>`
                result.menu_types.forEach(item => {
                    menuTypesGridContainer.innerHTML += `<div id="${item.id}" class="menu-type-id">${item.id}</div>
                <div>${item.name_en}</div>
                <div>${item.name_ar}</div>
                <div data-menu-item-id="${item.id}">
                    <button class="btn-edit" data-id="${item.id}" data-name_en="${item.name_en}" data-name_ar="${item.name_ar}">
                        ${getCookie("language") === "ar" ? "تعديل" : "Edit"}
                        <span class="icon-view"
                        ><ion-icon name="create-outline"></ion-icon
                        ></span>
                    </button>
                    <button class="btn-delete" data-id="${item.id}">
                        ${getCookie("language") === "ar" ? "حذف" : "Delete"}
                        <span class="icon-view"
                        ><ion-icon name="trash-outline"></ion-icon
                        ></span>
                    </button>
                </div>`
                })
            }
            return true;
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