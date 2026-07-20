const filesView = document.getElementById('filesView');
const commentsView = document.getElementById('commentsView');
if (filesView) {
    const filesViewBtn = document.getElementById('filesViewBtn');
    const commentsViewBtn = document.getElementById('commentsViewBtn');

    filesViewBtn.addEventListener('click', e => {
        commentsView.style.display = 'none';
        filesView.style.display = 'flex';
    });
    commentsViewBtn.addEventListener('click', e => {
        commentsView.style.display = 'flex';
        filesView.style.display = 'none';
    })
}

const handleResource = async (e, baseUrl, method) => {
    const { targetId } = e.currentTarget.dataset;
    const res = await fetch(`${baseUrl}/${targetId}`, { method });
    if (res.status != 200) return;
    const target = document.getElementById(targetId);
    target.remove();
}

[...document.getElementsByClassName('deleteCommentBtn')]
    .forEach(btn => btn.addEventListener('click', e => handleResource(e, '/comments', 'DELETE')));

[...document.getElementsByClassName('dismissCommentReports')]
    .forEach(btn => btn.addEventListener('click', e => handleResource(e, '/report/comment', 'PATCH')));

[...document.getElementsByClassName('dismissFileReports')]
    .forEach(btn => btn.addEventListener('click', e => handleResource(e, '/report/file', 'PATCH')));
    
[...document.getElementsByClassName('strike')]
    .forEach(btn => btn.addEventListener('click', e => handleResource(e, '/report/file', 'PUT')));
