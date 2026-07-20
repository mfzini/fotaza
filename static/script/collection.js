const btns = document.getElementsByClassName('removePost');
const collectionId = document.getElementById('collectionId').innerText;
[...btns].forEach(btn => btn.addEventListener('click', async e => {
    const postId = e.target.dataset.postId;
    const res = await fetch(`/collections/${collectionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
        , body: JSON.stringify({
            postId
        })
    });
    if (res.status == 200) {
        document.getElementById(postId).parentElement.remove();
    }
}));
