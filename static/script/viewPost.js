const gallery = document.getElementById('gallery');
const btn_p = document.getElementById('btn_p');
const mediaContainer = document.getElementById('mediaContainer');
const btn_n = document.getElementById('btn_n');
const commentsContainer = document.getElementById('comments');
const commentForm = document.getElementById('postComment');
const stars = [...document.getElementsByName('rating')];
const collection = [...document.getElementById('mediaContainer').children];

let i = 0;
render();

[btn_p, btn_n].forEach(b => {
    b.addEventListener('click', (e) => {
        e.preventDefault();
        collection[i].style.display = 'none';
        if (collection[i].firstChild.nodeName == 'VIDEO') {
            collection[i].firstChild.pause();
        }
        i += e.target.id == 'btn_n' ? 1 : -1
        if (i >= collection.length) {
            i = 0;
        } else if (i < 0) {
            i = collection.length - 1;
        }
        render();
    })
});

const comment = document.getElementById('comment');
if (comment) {
    comment.addEventListener('keypress', e => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            commentForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    });
}
if (commentForm) {
    commentForm.addEventListener('submit', async event => {
        event.preventDefault();
        const textarea = document.getElementById('comment');
        const text = textarea.value;
        const fileId = getFileId();
        const comment = await fetch(`/comments/${fileId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileId,
                text
            })
        });
        textarea.value = '';
        render();
    });
}

stars.forEach(s => s.addEventListener('click', async event => {
    const value = event.target.value;
    const fileId = getFileId();
    const res = await fetch(`/ratings/${fileId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value
        })
    });
    renderRatings();
}));

async function renderRatings() {
    const ratings = await fetchRatings();

    const promedio = ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length;
    document.getElementById('promedio').innerText = `${promedio > 0 ? 'Promedio: ' + promedio : ''}`;

    const [userRating] = ratings.filter(r => r.userId == userId);
    if (!userRating) {
        stars.forEach(s => s.checked = false);
        return;
    }
    const [selected] = stars.filter(s => s.value == userRating.value);
    selected.checked = true;
}

async function renderComments() {
    const comments = await fetch(`/comments/${getFileId()}`).then(response => response.json());
    comments.forEach(c => {
        const authorDiv = document.createElement('div');
        authorDiv.classList.add('author');
        authorDiv.textContent = c.author.username;
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        dateDiv.textContent = new Date(c.createdAt).toLocaleString('es-AR');
        const textDiv = document.createElement('div');
        textDiv.classList.add('text');
        textDiv.textContent = c.text;

        const commentHeader = document.createElement('div');
        commentHeader.classList.add('commentHeader');
        commentHeader.appendChild(authorDiv);
        commentHeader.appendChild(dateDiv);

        const comment = document.createElement('div');
        comment.classList.add('comment');
        comment.appendChild(commentHeader);
        comment.appendChild(textDiv);

        commentsContainer.appendChild(comment);
    })
}

async function fetchRatings() {
    return fetch(`/ratings/${getFileId()}`).then(r => r.json());
}
function getFileId() {
    return collection[i].dataset.fileId
}

function render() {
    if (collection.length == 1) {
        [btn_p, btn_n].forEach(b => b.style.display = 'none');
    }
    collection[i].style.display = 'flex';
    renderComments();
    renderRatings();
}