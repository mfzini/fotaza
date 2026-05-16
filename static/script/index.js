const search = document.getElementById('search');
const searchHelper = document.getElementById('searchHelper');
search.addEventListener('focusin', (e) => {
    searchHelper.style.display = 'block'
})
search.addEventListener('focusout', (e) => {
    searchHelper.style.display = 'none'
})

let userData;
document.addEventListener('DOMContentLoaded', (e) => {
    userData = JSON.parse(document.getElementById('userData').innerText);
    console.log(userData)
})