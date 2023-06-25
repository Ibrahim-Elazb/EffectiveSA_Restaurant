// @ts-nocheck
const language = getCookie("language");

// ---------------------------------- Menu Types Modal (Add and Update)  --------------------------------------------
const UserModal = document.querySelector(".user-modal");
const closeModal = document.querySelector(".close");
const userForm = document.getElementById("userForm");
const nameEl = document.getElementById("name");
const nameError = document.getElementById("nameError");
const emailEl = document.getElementById("email");
const emailError = document.getElementById("emailError");
const phoneEl = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");
const passwordEl = document.getElementById("password");
const passwordError = document.getElementById("passwordError");
const cfmPasswordEl = document.getElementById("cfm-password");
const cfmPasswordError = document.getElementById("cfm-passwordError");
const dateEl = document.getElementById("date");
const dateError = document.getElementById("dateError");
const roleEl = document.getElementById("role");
const roleError = document.getElementById("roleError");
const notesEl = document.getElementById("notes");

// ---------------------------------- Confirm Modal  --------------------------------------------
const confirmModal = document.getElementById("confirm-modal");
const confirmModalContentTitle = document.querySelector(".confirm-modal__content h2")
const confirmModalContentText = document.querySelector(".confirm-modal__content p")
const closeConfirmModalBtn = document.getElementById("confirm-modal__close-btn");

// ---------------------------------- Menus (Add and Edit) Event Handler  --------------------------------------------
let editMode = false;

const addNewUser = document.querySelector(".users-section .btn-add");
addNewUser.addEventListener("click", (event) => {
    editMode = false;
    openUserModal();
});

const userGridContainer = document.querySelector(".users-grid")
userGridContainer.addEventListener("click", event => {
    // For update button handler
    if (event.target.classList.contains("btn-edit")) {
        const editButton = event.target
        editMode = true
        // Create a new Date object with the desired date
        const start_working_day = new Date(editButton.dataset.user_start_working_day);
        // Format the date as "yyyy-mm-dd"
        const formattedDate = start_working_day.toISOString().substring(0, 10);
        openUserModal(
            editButton.dataset.user_id,
            editButton.dataset.user_name,
            editButton.dataset.user_email,
            editButton.dataset.user_phone,
            formattedDate,
            editButton.dataset.user_role,
            editButton.dataset.user_notes);
    } else if (event.target.classList.contains("btn-delete")) {//  For delete button handler
        const deleteButton = event.target
        const userId = deleteButton.dataset.user_id
        const isDeleteConfirmed = confirm(
            "Are you Sure That You will delete this menu type ??"
        );
        if (isDeleteConfirmed) {
            //send delete Request to the server
            deleteUserHandler(userId).then(result => {
                if (result.count === 0) throw new Error("No Delete Occurred")
                UserModal.style.display = "none";
                confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
                confirmModalContentText.textContent = "Menu Item Deleted Successfully"
                confirmModal.style.display = "block";
                renderUsersListUI().then(result => {
                    console.log(result)
                })
            }).catch(error => {
                UserModal.style.display = "none";
                confirmModalContentTitle.innerHTML = `<span style="color:red;"><ion-icon name="close-circle-outline"></ion-icon></span>`
                confirmModalContentText.textContent = error.message
                confirmModal.style.display = "block";
            })
        }
    }
})

userForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission
    try {
        if(!checkInputsValidation()) return;
        if (editMode) {
            //edit request to the server
            const result = await updateUserInfoHandler()
            if (result.count === 0) throw new Error("No Updates Occurred")
            UserModal.style.display = "none";
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "User Info Updated Successfully"
            confirmModal.style.display = "block";
        } else {
            //new menu type request to the server
            const result = await addNewUserHandler()
            if (!result.done) throw new Error("No Insertion Occurred")
            UserModal.style.display = "none";
            confirmModalContentTitle.innerHTML = `<span style="color:green;"><ion-icon name="checkmark-circle-outline"></ion-icon></span>`
            confirmModalContentText.textContent = "User Info Added Successfully"
            confirmModal.style.display = "block";
        }
        renderUsersListUI().then(result => {
            console.log(result)
        })
    } catch (error) {
        if (error.message.startsWith('[') && error.message.endsWith(']')) {
            const errorMessageArray = JSON.parse(error.message);
            const listItems = errorMessageArray.map(message => `<li>${message}</li>`);
            error.message = `<ul>\n${listItems.join('\n')}\n</ul>`;
        }
        UserModal.style.display = "none";
        confirmModalContentTitle.innerHTML = `<span style="color:red;"><ion-icon name="close-circle-outline"></ion-icon></span>`
        confirmModalContentText.innerHTML = error.message
        confirmModal.style.display = "block";
    }
});

function checkInputsValidation(){
    let validForm=true;
    if (nameEl.value.trim() === '') {
        nameError.textContent = 'Name is required.';
        nameEl.classList.add('error');
        nameEl.focus();
        validForm=validForm && false;
    } else {
        nameError.textContent = '';
        nameEl.classList.remove('error');
    }

    if (emailEl.value.trim() === '') {
        emailError.textContent = 'Email is required.';
        emailEl.classList.add('error');
        emailEl.focus();
        validForm=validForm && false;
    } else {
        emailError.textContent = '';
        emailEl.classList.remove('error');
    }

    if (phoneEl.value.trim() === '') {
        phoneError.textContent = 'Phone is required.';
        phoneEl.classList.add('error');
        phoneEl.focus();
        validForm=validForm && false;
    } else {
        phoneError.textContent = '';
        phoneEl.classList.remove('error');
    }

    if(!editMode){
        if (passwordEl.value.trim() === '') {
            passwordError.textContent = 'Password is required.';
            passwordEl.classList.add('error');
            passwordEl.focus();
            validForm=validForm && false;
        } else {
            passwordError.textContent = '';
            passwordEl.classList.remove('error');
        }
        if (cfmPasswordEl.value.trim() !== passwordEl.value.trim()) {
            cfmPasswordError.textContent = 'Password and Confirm password should be matched';
            cfmPasswordEl.classList.add('error');
            cfmPasswordEl.focus();
            validForm=validForm && false;
        } else {
            cfmPasswordError.textContent = '';
            cfmPasswordEl.classList.remove('error');
        }
    }

    if (dateEl.value.trim() === '') {
        dateError.textContent = 'Date is required.';
        dateEl.classList.add('error');
        dateEl.focus();
        validForm=validForm && false;
    } else {
        dateError.textContent = '';
        dateEl.classList.remove('error');
    }

    if (roleEl.value.trim() === '') {
        roleError.textContent = 'role is required.';
        roleEl.classList.add('error');
        roleEl.focus();
        validForm=validForm && false;
    } else {
        roleError.textContent = '';
        roleEl.classList.remove('error');
    }

    return validForm;
}

closeConfirmModalBtn.addEventListener("click", function () {
    confirmModal.style.display = "none";
});

closeModal.addEventListener("click", function () {
    UserModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == UserModal) {
        UserModal.style.display = "none";
    } else if (event.target == confirmModal) {
        confirmModal.style.display = "none";
    }
});

function openUserModal(
    id,
    name,
    email,
    phone,
    start_working_day,
    role,
    notes
) {

    userForm.reset(); // Reset form fields
    userForm.querySelectorAll(".error-message").forEach(item=>{
        item.textContent=""
    })

    if (editMode) {
        //hide password container
        document.querySelectorAll(".password-container").forEach(item => {
            item.style.display = "none"
        })
        userForm.dataset.id = id;
        nameEl.value = name;
        emailEl.value = email;
        phoneEl.value = phone;
        dateEl.value = start_working_day;
        roleEl.value = role;
        notesEl.value = notes;
    } else {
        document.querySelectorAll(".password-container").forEach(item => {
            item.style.display = "block"
        })
    }
    UserModal.style.display = "block";
}

// ---------------------------------- menu Items (Delete) Event Handler  --------------------------------------------
async function updateUserInfoHandler() {
    // Request Configuration
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
        "name": nameEl.value,
        "email": emailEl.value,
        "phone": phoneEl.value,
        "start_working_day": dateEl.value,
        "role": roleEl.value,
        "notes": notesEl.value
    });

    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:3000/api/v1/user/edit/" + userForm.dataset.id, requestOptions)
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

async function addNewUserHandler() {
    // Request Configuration
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
        "name": nameEl.value,
        "email": emailEl.value,
        "phone": phoneEl.value,
        "password": passwordEl.value,
        "confirm_password": cfmPasswordEl.value,
        "start_working_day": dateEl.value,
        "role": roleEl.value,
        "notes": notesEl.value
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:3000/api/v1/user/new", requestOptions)
    console.log(response)

    if (response.ok && response.status === 201) {
        const result = await response.json()
        console.log(result)
        return result
    } else {
        const errorData = await response.json();
        throw new Error(errorData.error_message);
    }
}

async function deleteUserHandler(userId) {
    // Request Configuration
    const requestOptions = {
        method: 'DELETE'
    };
    //Request Handling
    const response = await fetch("http://localhost:3000/api/v1/user/delete/" + userId, requestOptions)
    if (response.ok && response.status === 201) {
        const result = await response.json()
        return result;
    } else {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.error_message);
    }
}

async function renderUsersListUI() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/user/all")
        if (response.ok && response.status === 200) {
            const result = await response.json()
            if (result.users.length >= 0) {
                userGridContainer.innerHTML = `<div class="grid-header">User ID</div>
                                              <div class="grid-header">Name</div>
                                              <div class="grid-header">Email</div>
                                              <div class="grid-header">Phone</div>
                                              <div class="grid-header">Start Day</div>
                                              <div class="grid-header">role</div>
                                              <div class="grid-header">Notes</div>
                                              <div class="grid-header"></div>`

                result.users.forEach(item => {
                    const formattedDate = new Date(item.start_working_day)
                        .toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
                    userGridContainer.innerHTML += ` <div id="${item.id}" class="user-id">${item.id}</div>
                                                      <div>${item.name}</div>
                                                      <div>${item.email}</div>
                                                      <div>${item.phone}</div>
                                                      <div>${formattedDate}</div>
                                                      <div>${item.role}</div>
                                                      <div>${item.notes}</div>
                                                      <div data-user-id="${item.id}">
                                                        <button class="btn-edit"
                                                        data-user_id="${item.id}"
                                                        data-user_name="${item.name}"
                                                        data-user_email="${item.email}"
                                                        data-user_phone="${item.phone}"
                                                        data-user_start_working_day="${formattedDate}"
                                                        data-user_role="${item.role}"
                                                        data-user_notes="${item.notes}">
                                                          ${language === "ar" ? "تعديل" : "Edit"}
                                                          <span class="icon-view"
                                                            ><ion-icon name="create-outline"></ion-icon
                                                          ></span>
                                                        </button>
                                                        <button class="btn-delete" data-user_id="${item.id}">
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