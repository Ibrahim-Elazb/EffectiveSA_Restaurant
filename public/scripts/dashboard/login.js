// @ts-nocheck
const emailInputEl = document.getElementById("email");
const passwordInputEl = document.getElementById("password");

const invalidLogin = document.getElementById("invalid-login");
const invalidEmail = document.getElementById("email-error");

const loginForm = document.getElementById("login-form")
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": emailInputEl.value,
        "password": passwordInputEl.value
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("/api/v1/user/login", requestOptions)
        const result = await response.json();
        if (response.ok && response.status === 200) {
            window.location.href = '/dashboard';
        } else {
            console.log(result)
            invalidLogin.style.display = "block"
            invalidLogin.textContent = "Login Failed: " + result.error_message;
        }
    } catch (error) {
        invalidLogin.style.display = "block"
        invalidLogin.textContent = "Login Failed: " + error.message;
    }
});