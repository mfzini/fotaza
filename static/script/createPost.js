const input = document.getElementById('files');
const preview = document.getElementById('preview');
const subitBtn = document.getElementById('submit');
const popover = document.getElementById('config-popover');
const form = document.getElementById('postForm');
const dt = new DataTransfer();
const hashMap = new Map();

subitBtn.addEventListener('click', submit);
input.addEventListener('change', cargarArchivos);
popover.addEventListener('beforetoggle', popoverHook)

async function cargarArchivos(event) {
    event.preventDefault();
    for (const tbu of event.target.files) {
        if (dt.files.length == 10) {
            alert('Máximo 10 archivos.');
            break;
        }
        const hash = await getHash(tbu);
        if (hashMap.has(hash)) {
            continue;
        }
        hashMap.set(hash, '');
        dt.items.add(tbu);
        const container = createPreviewContainer(tbu, hash);
        preview.appendChild(container);
    }
}

function createPreviewContainer(file, hash) {
    const content = getMediaHTML(file);
    if (!content) return;
    const container = document.createElement('div');

    const btn_del = createButton('delbtn', 'X', e => {
        dt.items.remove(file);
        hashMap.delete(hash);
        preview.removeChild(container);
    });

    const btn_cfg = createButton('btn-cfg', 'C', (e) => {
        document.querySelectorAll('.btn-cfg').forEach(btn => {
            btn.style.anchorName = 'none';
        });
        e.target.style.anchorName = '--boton-activo';
        popover.dataset.activeFileName = file.name;
        const file_name = document.getElementById('popover-file-name');
        if (file_name) file_name.textContent = file.name;

        popover.showPopover();
    });

    container.classList.add('container');
    container.appendChild(content);
    container.appendChild(btn_cfg);
    container.appendChild(btn_del);
    return container;
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

function createButton(className, textContent, onclick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add(className);
    btn.textContent = textContent;
    btn.addEventListener('click', onclick)
    return btn;
}

function popoverHook(e) {
    const input_watermark = document.getElementById('input-watermark');
    if (e.newState == 'closed') {
        hashMap.set(e.target.dataset.activeHash, input_watermark.value);
        input_watermark.value = '';
    } else {
        const watermark = hashMap.get(e.target.dataset.activeHash);
        input_watermark.value = watermark ? watermark : '';
    }
}

function submit(e) {
    const hidden = document.createElement('input');
    hidden.type = 'text';
    hidden.style.display = 'none';
    hidden.name = 'watermarks';
    hidden.value = JSON.stringify(Object.fromEntries(hashMap));
    form.appendChild(hidden);
    input.files = dt.files;
}

async function getHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}