// ---------------------------------- Navigation Bar  --------------------------------------------
const navLinks = document.querySelectorAll(".nav-list__item-container");
const navMenuBtnEl = document.querySelector(".header__toggle-menu-btn");

navLinks.forEach((currentLink) => {
    currentLink.addEventListener("click", (event) => {
        navLinks.forEach((link) => {
            link.classList.remove("active");
        });
        currentLink.classList.add("active");
    });

    //   currentLink.addEventListener("mouseover",event=>{
    //        navLinks.forEach(link=>{
    //             link.classList.remove("active")
    //         })
    //     currentLink.classList.add("active")
    //   })
});

navMenuBtnEl.addEventListener("click", (event) => {
    document.querySelector(".navbar").classList.toggle("active");
    document.querySelector("main").classList.toggle("active");
});


// ---------------------------------- Read Cookie Values --------------------------------------------
function getCookie(name) {
    const cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

const signOutBtn = document.getElementById("sign-out-btn")
signOutBtn.addEventListener("click",async(event)=>{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders
    };

    try {
        const response = await fetch("/api/v1/user/logout", requestOptions)
        console.log(response)
        if (!response.ok) {
            throw new Error("logout failed...")
        }else{
            window.location.href = '/dashboard/login';
        }
    } catch (error) {
        alert("logout failed...")
    }
})