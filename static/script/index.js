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

let userId;
document.addEventListener('DOMContentLoaded', (e) => {
    userId = document.querySelector('nav').dataset.userId;
})


function createButton(className, textContent, onclick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add(className);
    btn.textContent = textContent;
    btn.addEventListener('click', onclick)
    return btn;
}

const follow_btn = document.getElementById('FollowBtn');
if (follow_btn) {
    follow_btn.addEventListener('click', async e => {
        const profileId = document.getElementById('profileId').innerText;
        e.preventDefault();
        const r = await fetch(`/follow/${profileId}`, {
            method: 'POST',
        });
        switch (r.status) {
            case 200:
                follow_btn.innerText = 'Dejar de seguir'
                break;
            case 204:
                follow_btn.innerText = 'Seguir'
                break;
        }
    })
}