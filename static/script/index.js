const search = document.getElementById('searchBar');
const searchHelper = document.getElementById('searchHelper');


search.addEventListener('click', (e) => {
    searchHelper.style.display = 'block'
})

document.addEventListener('click', (e) => {
    const clickOutside = !searchHelper.contains(e.target) && !search.contains(e.target);
    if (clickOutside)
        searchHelper.style.display = 'none'
})

let userData;
document.addEventListener('DOMContentLoaded', (e) => {
    userData = JSON.parse(document.getElementById('userData').innerText);
})

function createButton(className, textContent, onclick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add(className);
    btn.textContent = textContent;
    btn.addEventListener('click', onclick)
    return btn;
}