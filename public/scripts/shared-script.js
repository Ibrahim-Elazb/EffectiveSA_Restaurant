const languageBtn = document.querySelector(".lang-choice");

languageBtn?.addEventListener("click",changeLanguage)

function changeLanguage(){

    let language = "en";
    const cookieLanguage = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('language='));

    if (cookieLanguage) {
        language = cookieLanguage.split('=')[1];
    }

    const cookieName = 'language';
    const cookieValue = (language==="en")?'ar':"en";
    const expirationDays = 365; // Number of days until the cookie expires

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    const cookieString = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieString;

    location.reload();
}