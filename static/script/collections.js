const popover = document.getElementById('collectionPopover');
const input_name = document.getElementById('inputName');
const input_id = document.getElementById('inputId');
const submitBtn = document.getElementById('submitBtn');
const form = document.querySelector('form');
let targetCollection;

[...document.getElementsByClassName('renameBtn')].forEach(btn => {
    btn.addEventListener('click', e => {
        targetCollection = btn.parentNode.parentNode;
        popover.showPopover();
    })
});

[...document.getElementsByClassName('deleteBtn')].forEach(btn => {
    btn.addEventListener('click', async e => {
        const id = btn.parentNode.parentNode.dataset.id;
        const action = '/collections';
        const method = 'DELETE';
        const headers = {
            'Content-Type': 'application/json'
        };
        const data = { id };
        const body = JSON.stringify(data);
        const r = await fetch(action, { method, headers, body });
        window.location.reload();
    })
});

popover.addEventListener('toggle', e => {
    if (e.newState == 'closed') {
        targetCollection = undefined;
        return;
    }
    else if (targetCollection) {
        popover.firstChild.innerText = 'Renombrar'
        input_id.value = targetCollection.dataset.id;
        input_name.value = targetCollection.dataset.name;
    } else {
        popover.firstChild.innerText = 'Crear nueva';
        input_id.value = '';
        input_name.value = '';
    }
})

submitBtn.addEventListener('click', async e => {
    e.preventDefault();
    const action = '/collections';
    const method = targetCollection ? 'PATCH' : 'POST';
    const headers = {
        'Content-Type': 'application/json'
    };
    const data = {
        id: input_id.value,
        name: input_name.value
    };
    const body = JSON.stringify(data);
    const r = await fetch(action, { method, headers, body });
    window.location.reload();
})