const input = document.getElementById('files');
const preview = document.getElementById('preview');
const subitBtn = document.getElementById('submit');
const dt = new DataTransfer();
const hashSet = new Set();

subitBtn.addEventListener('click', (e) => {
    input.files = dt.files;
});

input.addEventListener('change', async (event) => {
    event.preventDefault();
    for (const tbu of event.target.files) {
        if (dt.files.length == 10) {
            alert('Máximo 10 archivos.');
            break;
        }
        const hash = await getHash(tbu);
        if (hashSet.has(hash))
            continue;
        hashSet.add(hash);
        dt.items.add(tbu);
        createPreviewContainer(tbu, hash);
    }
});

function createPreviewContainer(file, hash) {
    const content = getMediaHTML(file)
    if (!content) return;

    const container = document.createElement('div');
    container.classList.add('container');
    container.appendChild(content);

    const del_btn = document.createElement('button');
    del_btn.classList.add('delbtn');
    del_btn.textContent = 'X';
    del_btn.addEventListener('click', e => {
        dt.items.remove(file);
        hashSet.delete(hash);
        preview.removeChild(container);
    })

    container.appendChild(del_btn);
    preview.appendChild(container);
}

async function getHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function getMediaHTML(f) {
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