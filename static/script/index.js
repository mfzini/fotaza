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


function getUserId() {
  return document.querySelector('nav').dataset.userId;
}


function createButton(className, textContent, onclick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add(className);
    btn.textContent = textContent;
    btn.addEventListener('click', onclick)
    return btn;
}