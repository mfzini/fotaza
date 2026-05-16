const gallery = document.getElementById('gallery');
const btn_p = document.getElementById('btn_p');
const mediaContainer = document.getElementById('mediaContainer');
const btn_n = document.getElementById('btn_n');
const commentsContainer = document.getElementById('comments');
const commentForm = document.getElementById('postComment');
const stars = [...document.getElementsByName('rating')];
let files;
let i = 0;
async function init() {
    const postId = window.location.href.split('/post/')[1];
    try {
        const r = await fetch(`/post/${postId}/files`);
        files = await r.json();
        renderMedia()
    } catch (err) {
        console.error(err);
    }
    console.log('init')
}

function renderMedia() {
    let element;
    const target = files[i];
    if (mediaContainer.childNodes.length > 0) {
        mediaContainer.removeChild(mediaContainer.firstChild);
    }
    if (target.mimetype.startsWith('image')) {
        element = new Image();
    } else {
        element = document.createElement('video');
        element.controls = true;
        element.muted = true;
    }
    element.src = target.url
    mediaContainer.appendChild(element);
    renderRatings();
    renderComments();
}

function renderComments() {
    commentsContainer.innerHTML = files[i].comments.map(comment => `
        <div class='comment'>
            <div class='author'>
                ${comment.authorId}
            </div class='text'><div>
                ${comment.text}
            </div><div class='date'>
                ${comment.createdAt}
            </div>
        </div>
     `).join('');
}

[btn_p, btn_n].forEach(b => {
    b.addEventListener('click', (e) => {
        e.preventDefault();
        i += e.target.id == 'btn_n' ? 1 : -1
        if (i >= files.length) {
            i = 0;
        } else if (i < 0) {
            i = files.length - 1;
        }
        renderMedia();
    })
});

commentForm.addEventListener('submit', async event => {
    event.preventDefault();
    const textarea = event.target.firstElementChild;
    const text = textarea.value;
    const fileId = files[i].id;
    const comment = await fetch(`/comment/${fileId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fileId,
            text
        })
    }).then(r => r.json());
    textarea.value = '';
    console.log(files[i].comments.push(comment));
    renderComments()
});
function renderRatings() {
    const userRating = getUserRating();
    if (!userRating) {
        stars.forEach(s => s.checked = false);
        return;
    }
    const [selected] = stars.filter(s => s.value == userRating.value);
    
    selected.checked = true;
}
stars.forEach(s => s.addEventListener('click', async event => {
    console.log('arrancamos')
    const value = event.target.value;
    let userRating = getUserRating();
    const res = await fetch(`/files/rating`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fileId: files[i].id,
            value: event.target.value
        })
    });
    switch (res.status) {
        case 201:
            const r = await res.json();
            files[i].ratings.push(r);
            break;
        case 204:
            const index = files[i].ratings.indexOf(userRating);
            files[i].ratings.splice(index, 1);
            break;
        case 202:
            userRating.value = value;
            break;
    }
    renderRatings();
}));

function getUserRating() {
    return files[i].ratings.filter(r => r.userId == userData.id)[0];
}
document.addEventListener('DOMContentLoaded', init)
