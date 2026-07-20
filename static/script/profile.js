const followersView = document.getElementById('followersView');
const alternateViewBtn = document.getElementById('followersBtn');
const postsView = document.getElementById('recientes');
const profileData = document.getElementById('profileHeader').dataset;

alternateViewBtn.addEventListener('click', e => {
    const flag = alternateViewBtn.textContent == 'Publicaciones';
    postsView.style.display = flag ? 'flex' : 'none';
    followersView.style.display = flag ? 'none' : 'flex';
    alternateViewBtn.textContent = flag ? `Seguidores (${profileData.followersCount})` : 'Publicaciones';
})