// @ts-nocheck
const language = getCookie("language");
// ---------------------------------- Read and Unread CheckBox Event Handler  --------------------------------------------
const unreadOnlyChkBox = document.getElementById("show-only-unread");
unreadOnlyChkBox.addEventListener("change", showOrHideReadMessages);

function showOrHideReadMessages(){
    const readMessages = document.querySelectorAll(".message.read");
    if (unreadOnlyChkBox.checked) {
        readMessages.forEach((message) => {
            message.classList.add("hide-element");
        });
    } else {
        readMessages.forEach((message) => {
            message.classList.remove("hide-element");
        });
    }
}

// ---------------------------------- Set message as read  --------------------------------------------
let markAsReadBtns;
MarkReadBtnsHandlers();

function MarkReadBtnsHandlers(){
    markAsReadBtns = document.querySelectorAll(".btn-mark-read");
    markAsReadBtns.forEach(button => {
        button.addEventListener("click", async (event) => {
            try {
                // console.log(event.target.dataset.message_id)
                // console.log(button.dataset.message_id)
                const messageId = button.dataset.message_id
                const succeed = await setMessageAsRead(messageId)
                if (succeed) {
                    button.innerHTML = `<ion-icon name="mail-open-outline"></ion-icon>`
                    button.disabled = true
                    button.classList.add("inactive")
                    document.getElementById(`message-${messageId}`)?.classList.add("read")
                    document.getElementById(`message-${messageId}`)?.classList.remove("unread")
                    showOrHideReadMessages()
                }
            } catch (error) {
                alert(error)
            }
        })
    })
}

async function setMessageAsRead(messageId) {
    const requestOptions = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        }
    };

    const response = await fetch(`http://localhost:3000/api/v1/message/mark-read/${messageId}`, requestOptions)
    if (response.ok && response.status === 201) {
        return true;
    } else {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.error_message);
    }
}

// ---------------------------------- pagination  --------------------------------------------
let page = 1;
const messageList = document.querySelector(".message-list")
const loadMoreBtn = document.querySelector(".load-more-btn");
const totalCount = messageList.dataset.messages_count

loadMoreBtn.addEventListener("click", async (event) => {
    console.log("clicked")
    await loadMoreMessages();
})

async function loadMoreMessages() {
    console.log(totalCount)
    console.log(page)
    if (totalCount > page * 3) {
        page++;
        const response = await fetch(`http://localhost:3000/api/v1/message/?page=${page}`)
        if (response.ok && response.status === 200) {
            const result = await response.json()
            console.log(result)
            result.messages.forEach(item => {
                const readButton = item.has_read ?
                    `<button class="btn-mark-read inactive" data-message_id="${item.id}" disabled>
                  <ion-icon name="mail-open-outline"></ion-icon>
                </button>`: `<button class="btn-mark-read" data-message_id="${item.id}" >
                  <ion-icon name="mail-outline"></ion-icon>
                </button>`

                messageList.innerHTML += `<div id="message-${item.id}" class="message ${item.has_read ? 'read' : 'unread'}">
              <h3>${item.subject}</h3>
               <span class="message-sender">From : ${item.name}</span>
              <p class="message-content">
                ${item.message}
              </p>
              <p class="message-date">${item.date}</p>
              <div class="message-actions">
                <a href="mailto:${item.email}" class="btn-contact"
                  ><ion-icon name="send-outline"></ion-icon
                ></a>
                <a href="tel:${item.phone}" class="btn-contact"
                  ><ion-icon name="call-outline"></ion-icon
                ></a>
               ${readButton}
                <button class="btn-delete">
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </div>
            </div>`
            })
            
            MarkReadBtnsHandlers();
            if (totalCount <= page * 3)
                loadMoreBtn.style.display = "none"
            return true;
        } else {
            const errorData = await response.json();
            console.log(errorData)
            throw new Error(errorData.error_message);
        }
    }

}
