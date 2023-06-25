// @ts-nocheck
const language = getCookie("language");
// ---------------------------------- Menu Types Modal (Add and Update)  --------------------------------------------
const MenuItemModal = document.querySelector(".menu-item-modal");
const closeModal = document.querySelector(".close");
const menuItemForm = document.getElementById("menuItemForm");
const englishNameEl = document.getElementById("englishName");
const englishNameError = document.getElementById("englishNameError");
const arabicNameEl = document.getElementById("arabicName");
const arabicNameError = document.getElementById("arabicNameError");
const priceEl = document.getElementById("price");
const priceError = document.getElementById("priceError");
const discountEl = document.getElementById("discount");
const discountError = document.getElementById("discountError");
const menuTypeEl = document.getElementById("menuType");
const menuTypeError = document.getElementById("menuTypeError");
const menuImageSrcEl = document.getElementById("menuImage");

// ---------------------------------- Confirm Modal  --------------------------------------------
const confirmModal = document.getElementById("confirm-modal");
const confirmModalContentTitle = document.querySelector(".confirm-modal__content h2")
const confirmModalContentText = document.querySelector(".confirm-modal__content p")
const closeConfirmModalBtn = document.getElementById("confirm-modal__close-btn");

// ---------------------------------- Menus (Add and Edit) Event Handler  --------------------------------------------
let editMode = false;
function previewImage(event) {
    const input = event.target;
    const imagePreview = document.getElementById("imagePreview");

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        imagePreview.style.display = "none";
    }
}

const addNewMenu = document.querySelector(".menu-section .btn-add");
addNewMenu.addEventListener("click", (event) => {
    editMode = false;
    openMenuItemModal();
});

const menuGridContainer = document.querySelector(".menu-grid")
menuGridContainer.addEventListener("click", event => {
    // For update button handler
    if (event.target.classList.contains("btn-edit")) {
        console.log("click")
        const editButton = event.target
        editMode = true
        openMenuItemModal(
            editButton.dataset.menu_item_id,
            editButton.dataset.menu_item_name_en,
            editButton.dataset.menu_item_name_ar,
            editButton.dataset.menu_item_price,
            editButton.dataset.menu_item_discount,
            editButton.dataset.menu_item_menu_type);
    } else if (event.target.classList.contains("btn-delete")) {//  For delete button handler
        const deleteButton = event.target
        const menuItemId = deleteButton.dataset.menu_item_id
        const isDeleteConfirmed = confirm(
            "Are you Sure That You will delete this menu type ??"
        );
        if (isDeleteConfirmed) {
            //send delete Request to the server
            deleteMenuItemHandler(menuItemId).then(result => {
                if (result.count === 0) throw new Error("No Delete Occurred")
                MenuItemModal.style.display = "none";
                confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
                confirmModalContentText.textContent = "Menu Item Deleted Successfully"
                confirmModal.style.display = "block";
                renderMenuItemsUI().then(result => {
                    console.log(result)
                })
            }).catch(error => {
                MenuItemModal.style.display = "none";
                confirmModalContentTitle.innerHTML = `<span style="color:red;"><ion-icon name="close-circle-outline"></ion-icon></span>`
                confirmModalContentText.textContent = error.message
                confirmModal.style.display = "block";
            })
        }
    }
})

menuItemForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission
    if(!checkInputsValidation()) return
    try {
        if (editMode) {
            //edit request to the server
            const result = await updateMenuItemHandler()
            if (result.count === 0) throw new Error("No Updates Occurred")
            MenuItemModal.style.display = "none";
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "Menu Type Updated Successfully"
            confirmModal.style.display = "block";
        } else {
            //new menu type request to the server
            const result = await addNewMenuItemHandler()
            if (!result.done) throw new Error("No Insertion Occurred")
            MenuItemModal.style.display = "none";
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "Menu Item Added Successfully"
            confirmModal.style.display = "block";
        }
        renderMenuItemsUI().then(result => {
            console.log(result)
        })
    } catch (error) {
        if (error.message.startsWith('[') && error.message.endsWith(']')) {
            const errorMessageArray = JSON.parse(error.message);
            const listItems = errorMessageArray.map(message => `<li>${message}</li>`);
            error.message = `<ul>\n${listItems.join('\n')}\n</ul>`;
        }
        MenuItemModal.style.display = "none";
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

    if (priceEl.value.trim() === '') {
        priceError.textContent = 'Price is required.';
        priceEl.classList.add('error');
        priceEl.focus();
        validForm = validForm && false;
    } else {
        priceError.textContent = '';
        priceEl.classList.remove('error');
    }

    if (discountEl.value.trim() === '') {
        discountError.textContent = 'Discount is required.';
        discountEl.classList.add('error');
        discountEl.focus();
        validForm = validForm && false;
    } else {
        discountError.textContent = '';
        discountEl.classList.remove('error');
    }

    if (menuTypeEl.value.trim() === '') {
        menuTypeError.textContent = ' select a Menu Type.';
        menuTypeEl.classList.add('error');
        menuTypeEl.focus();
        validForm = validForm && false;
    } else {
        menuTypeError.textContent = '';
        menuTypeEl.classList.remove('error');
    }

    return validForm;
}
closeConfirmModalBtn.addEventListener("click", function () {
    confirmModal.style.display = "none";
});

closeModal.addEventListener("click", function () {
    MenuItemModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == MenuItemModal) {
        MenuItemModal.style.display = "none";
    } else if ((event.target == confirmModal)){
        confirmModal.style.display = "none";
    }
});

function openMenuItemModal(
    id,
    englishName,
    arabicName,
    price,
    discount,
    menuType
) {

    menuItemForm.reset(); // Reset form fields
    menuItemForm.querySelectorAll(".error-message").forEach(item => {
        item.textContent = ""
    })

    const imagePreview = document.getElementById("imagePreview");
    imagePreview.src = "";
    imagePreview.style.display = "none";
    if (editMode) {
        menuItemForm.dataset.id = id;
        englishNameEl.value = englishName;
        arabicNameEl.value = arabicName;
        priceEl.value = price;
        discountEl.value = discount;
        menuTypeEl.value = menuType
    }
    MenuItemModal.style.display = "block";
}

// ---------------------------------- menu Items (Delete) Event Handler  --------------------------------------------
async function updateMenuItemHandler() {
    // Request Configuration
    const formdata = new FormData();
    formdata.append("name_en", englishNameEl.value);
    formdata.append("name_ar", arabicNameEl.value);
    formdata.append("price", priceEl.value);
    formdata.append("discount", discountEl.value);
    formdata.append("menu_type", menuTypeEl.value);
    if (menuImageSrcEl.files && menuImageSrcEl.files[0]) {
        formdata.append("image", menuImageSrcEl.files[0], menuImageSrcEl.result);
    }
    var requestOptions = {
        method: 'PATCH',
        body: formdata,
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:3000/api/v1/menu/edit/" + menuItemForm.dataset.id, requestOptions)
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

async function addNewMenuItemHandler() {
    // Request Configuration
    const formdata = new FormData();
    formdata.append("name_en", englishNameEl.value);
    formdata.append("name_ar", arabicNameEl.value);
    formdata.append("price", priceEl.value);
    formdata.append("discount", discountEl.value);
    formdata.append("menu_type", menuTypeEl.value);
    if (menuImageSrcEl.files && menuImageSrcEl.files[0]) {
        formdata.append("image", menuImageSrcEl.files[0], menuImageSrcEl.result);
    }

    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:3000/api/v1/menu/new", requestOptions)

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

async function deleteMenuItemHandler(menuItemId) {
    // Request Configuration
    const requestOptions = {
        method: 'DELETE'
    };
    //Request Handling
    const response = await fetch("http://localhost:3000/api/v1/menu/delete/" + menuItemId, requestOptions)
    if (response.ok && response.status === 201) {
        const result = await response.json()
        return result;
    } else {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.error_message);
    }
}

async function renderMenuItemsUI() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/menu/all")
        if (response.ok && response.status === 200) {
            const result = await response.json()
            if (result.menu.length >= 0) {
                menuGridContainer.innerHTML = `<div class="grid-header">Menu Item ID</div>
                                                  <div class="grid-header">English Name</div>
                                                  <div class="grid-header">Arabic Name</div>
                                                  <div class="grid-header">Price</div>
                                                  <div class="grid-header">Discount</div>
                                                  <div class="grid-header">Menu Type</div>
                                                  <div class="grid-header"></div>`

                result.menu.forEach(item => {
                    menuGridContainer.innerHTML += `<div id="${item.id}" class="menu-item-id">${item.id}</div>
                        <div>${item.name_en}</div>
                        <div>${item.name_ar}</div>
                        <div>${item.price}</div>
                        <div>${item.discount}</div>
                        <div>${language === "ar" ? item.menu_type_ar : item.menu_type_en}</div>
                        <div>
                          <button class="btn-edit"
                            data-menu_item_id="${item.id}"
                            data-menu_item_name_en="${item.name_en}"
                            data-menu_item_name_ar="${item.name_ar}"
                            data-menu_item_price="${item.price}"
                            data-menu_item_discount="${item.discount}"
                            data-menu_item_menu_type="${item.menu_type}">
                            ${language === "ar" ? "تعديل" : "Edit"}
                            <span class="icon-view"
                              ><ion-icon name="create-outline"></ion-icon
                            ></span>
                          </button>
                          <button class="btn-delete" 
                            data-menu_item_id="${item.id}">
                            ${language === "ar" ? "حذف" : "Delete"}
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