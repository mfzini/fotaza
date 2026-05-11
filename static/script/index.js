const search = document.getElementById('search');
const searchHelper = document.getElementById('searchHelper');
search.addEventListener('focusin', (e) => {
    searchHelper.style.display = 'block'
})
search.addEventListener('focusout', (e) => {
    searchHelper.style.display = 'none'
})
