const input = document.getElementById('files');
const preview = document.getElementById('preview');
let dt = new DataTransfer();

input.addEventListener('change', (event) => {
    event.preventDefault();
    ext: for (const tbu of event.target.files) {
        if (dt.files.length == 10) {
            alert('Máximo 10 archivos.');
            break;
        }
        for (const dtf of dt.files)
            if (tbu.name == dtf.name && tbu.size == dtf.size)
                continue ext;
        dt.items.add(tbu);
        createHTMLElement(tbu);
    }
    input.files = dt.files;
});

function getMediaElement(f) {
    let element;
    if (f.type.startsWith('image')) {
        element = new Image();
        element.src = URL.createObjectURL(f);
        element.onload = () => URL.revokeObjectURL(element.src);
    } else if (f.type.startsWith('video')) {
        element = document.createElement('video');
        element.src = URL.createObjectURL(f);
        element.onloadeddata = () => URL.revokeObjectURL(element.src);
        element.controls = true;
        element.muted = true;
    }
    return element;
}
function createHTMLElement(file) {
    const content = getMediaElement(file)
    if (!content) return;

    const container = document.createElement('div');
    container.classList.add('container');
    container.appendChild(content);

    const del_btn = document.createElement('button');
    del_btn.classList.add('delbtn');
    del_btn.textContent = 'X';
    del_btn.addEventListener('click', e => {
        dt.items.remove(file);
        preview.removeChild(container);
    })


    container.appendChild(del_btn);
    preview.appendChild(container);
}