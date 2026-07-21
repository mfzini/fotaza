const posts = document.querySelectorAll('.postCard');
posts.forEach(p => {
    p.addEventListener('click', e => {
        window.location = `/post/${e.currentTarget.id}`
    })
})

