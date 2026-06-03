const input = document.getElementById('files');
const preview = document.getElementById('preview');
const submitBtn = document.getElementById('submit');
const popover = document.getElementById('config-popover');
const form = document.getElementById('postForm');
const dt = new DataTransfer();
const watermarks = new Map();

submitBtn.addEventListener('click', submit);
input.addEventListener('change', cargarArchivos);
popover.addEventListener('beforetoggle', popoverHook);

async function cargarArchivos(event) {
    event.preventDefault();
    for (const file of event.target.files) {
        if (dt.files.length == 10) {
            alert('Máximo 10 archivos.');
            break;
        }
        const hash = await getHash(file);
        if (watermarks.has(hash)) {
            continue;
        }
        watermarks.set(hash, '');
        
        const container = createPreviewContainer(file, hash);
        if (!container) return;
        dt.items.add(file);
        preview.appendChild(container);
    }
}

function createPreviewContainer(file, hash) {
    const content = getMediaHTML(file);
    if (!content) return;
    const container = document.createElement('div');

    const btn_del = createButton('delbtn', 'X', e => {
        dt.items.remove(file);
        watermarks.delete(hash);
        preview.removeChild(container);
    });

    const btn_cfg = createButton('btn-cfg', 'C', (e) => {
        document.querySelectorAll('.btn-cfg').forEach(btn => {
            btn.style.anchorName = 'none';
        });

        popover.dataset.activeFileName = file.name;
        popover.dataset.activeHash = hash;
        const file_name = document.getElementById('popover-file-name');
        if (file_name) file_name.textContent = file.name;

        e.target.style.anchorName = '--boton-activo';
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
        watermarks.set(e.target.dataset.activeHash, input_watermark.value);
        input_watermark.value = '';
    } else {
        const watermark = watermarks.get(e.target.dataset.activeHash);
        input_watermark.value = watermark ? watermark : '';
    }
}

function submit(e) {
    if (dt.files.length == 0)  {
        e.preventDefault();
        return alert('No se seleccionó ningún archivo.')
    }
    const hidden = document.createElement('input');
    hidden.type = 'text';
    hidden.style.display = 'none';
    hidden.name = 'watermarks';
    hidden.value = JSON.stringify(Object.fromEntries(watermarks));
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