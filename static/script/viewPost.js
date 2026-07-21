const postData = document.getElementById('postHeader').dataset;
const files = [...document.getElementsByClassName('file')];
let params = new URLSearchParams(window.location.search);
let requestedFileId = params.get('file');
let requestedIndex = files.findIndex(file => file.id == requestedFileId);
let i = requestedIndex < 0 ? 0 : requestedIndex;
files[i].style.display = 'inline-block';

[...document.getElementsByClassName('interestedBtn')]
    .forEach(btn => btn.addEventListener('click', async e => {
        const popover = document.getElementById('interestedPopover');
        popover.showPopover();
        const fileId = files[i].id;
        const res = await fetch(`/interested/${fileId}`, { method: 'POST' });
        if (res.status != 200) return;
        document.getElementById(`interested-${fileId}`).remove();
        setInterval(() => popover.hidePopover(), 5000);
    }));

[...document.getElementsByClassName('gbtns')]
    .forEach(btn => {
        btn.addEventListener('click', e => {
            files[i].style.display = 'none';
            i += e.target.innerText == '>' ? 1 : -1;
            if (i < 0) {
                i = files.length - 1;
            } else if (i >= files.length) {
                i = 0;
            }
            files[i].style.display = 'inline-block';
        });
    });

[...document.getElementsByClassName('starsForm')]
    .forEach(form => form.addEventListener('change', e => {
        form.submit();
    }));

const reportPopover = document.getElementById('reportPopover');
if (reportPopover) {
    reportPopover.addEventListener('toggle', e => {
        if (e.newState == 'hidden') return;
        inputFileId.value = files[i].id;
    });
    const reportPopoverTitle = document.getElementById('reportPopoverTitle');
    const inputFileId = document.getElementById('reportFileId');
    const inputReportCommentId = document.getElementById('reportCommentId');

    [...document.getElementsByClassName('reportFileBtn')]
        .forEach(btn => btn.addEventListener('click', e => {
            reportPopoverTitle.textContent = 'Reportar imágen';
            inputReportCommentId.value = '';
            reportPopover.showPopover();
        }));

    [...document.getElementsByClassName('reportCommentBtn')].forEach(btn => {
        btn.addEventListener('click', e => {
            const commentId = e.target.dataset.commentId;
            reportPopoverTitle.textContent = 'Reportar comentario';
            inputReportCommentId.value = commentId;
            reportPopover.showPopover();
        })
    })
}

const deletePopover = document.getElementById('deletePopover');
if (deletePopover) {
    const deletePostBtn = document.getElementById('deletePostBtn');
    if (deletePostBtn) deletePostBtn.addEventListener('click', e => {
        deletePopover.showPopover();
    });

    document.getElementById('confirmDeleteBtn').addEventListener('click', async e => {
        console.log(`/post/${postData.id}`)
        const r = await fetch(`/post/${postData.id}`, {
            method: 'DELETE',
        });

        if (r.status == 200) window.location = '/';
    })
    document.getElementById('cancelDeleteBtn').addEventListener('click', e => {
        deletePopover.hidePopover();
    });

};

const deleteCommentPopover = document.getElementById('deleteCommentPopover');
if (deleteCommentPopover) {

    [...document.getElementsByClassName('deleteCommentBtn')]
        .forEach(btn => btn.addEventListener('click', e => {
            const confirmDeleteCommentBtn = document.getElementById('confirmDeleteCommentBtn');
            confirmDeleteCommentBtn.dataset.commentId = e.target.dataset.commentId;
            deleteCommentPopover.showPopover();
        }));

    document.getElementById('confirmDeleteCommentBtn').addEventListener('click', async e => {
        const confirmDeleteCommentBtn = document.getElementById('confirmDeleteCommentBtn');
        const commentId = confirmDeleteCommentBtn.dataset.commentId;
        if (!commentId) return;
        const res = await fetch(`/comments/${commentId}`, {
            method: 'DELETE',
        })
        if (res.status != 200) return;
        const comment = document.getElementById(commentId);
        comment.remove();
        deleteCommentPopover.hidePopover();
    })
}

const toggleCommentsBtn = document.getElementById('toggleCommentsBtn');
if (toggleCommentsBtn) {
    toggleCommentsBtn.addEventListener('click', async e => {
        const postId = postData.id;
        const r = await fetch(`/post/${postId}`, {
            method: 'PATCH',
        });
        if (r.status != 200) return;
        const { newValue } = await r.json();
        toggleCommentsBtn.innerText = newValue ? 'Cerrar comentarios' : 'Abrir comentarios';
        const postCommentForm = document.getElementById('postComment');
        postCommentForm.style.display = newValue ? 'flex' : 'none';
    })
}

if (getUserId()) {
    files.forEach(f => {
        const watermark = f.dataset.watermark;
        const container = f.querySelector('.mediaContainer')
        if (watermark) {
            ['mousedown', 'contextmenu'].forEach(event => {
                container.addEventListener(event, e => e.preventDefault());
            });
            const watermarkDiv = document.createElement('div');
            watermarkDiv.classList.add('watermark');
            watermarkDiv.innerText = watermark;
            container.appendChild(watermarkDiv);
        }
    })
}