const gallery = document.getElementById('gallery');
const btn_next = document.getElementById('btn_next');
let i = 0;
let current = gallery.children[i];
current.classList.replace('invisible', 'visible');

// aca tenemos que hacer un fetch para obtener los files con sus comentarios y toda la vaina;


btn_next.addEventListener('click', (e) => {
    e.preventDefault();
    current.classList.replace('visible', 'invisible');
    if (current.firstElementChild.localName == 'video') {
        current.firstElementChild.pause();
    }
    i++;
    if (i >= gallery.children.length-1) {
        i = 0;
    }
    current = gallery.children[i];
    current.classList.replace('invisible', 'visible');
    
})

