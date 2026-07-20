const messagePopover = document.getElementById('messagePopover');
const reBtn = document.getElementById('reBtn');
//const deleteMailBtn = document.getElementById('deleteMailBtn');
[...document.getElementsByClassName('messageRow')].forEach(r => {
    r.addEventListener('click', async e => {
        const senderField = document.getElementById('sender');
        const subjectField = document.getElementById('subject');
        const createdAtField = document.getElementById('createdAt');
        const messageField = document.getElementById('message');
        const { createdAt, sender, message, subject, senderId } = r.dataset;
        r.classList.remove('new');
        if (getUserId() != senderId) {
            fetch(`/mail/${r.id}`, { method: 'PATCH' });

        }
        const mail = document.getElementById(`${r.id}`);
        mail.classList.remove('unreaded');
        senderField.innerText = sender;
        subjectField.innerText = subject;
        createdAtField.innerText = createdAt;
        messageField.innerText = message;
        reBtn.dataset.to = sender;
        reBtn.dataset.subject = `RE: ${subject}`
        //deleteMailBtn.dataset.mailId = r.id;
        messagePopover.showPopover();
    })
})

const inBtn = document.getElementById('inBtn');
const outBtn = document.getElementById('outBtn');

const inbox = document.getElementById('in');
const outbox = document.getElementById('out');
inBtn.addEventListener('click', e => {
    outbox.style.display = 'none';
    inbox.style.display = '';
    reBtn.style.display = 'inline';
})
outBtn.addEventListener('click', e => {
    outbox.style.display = '';
    inbox.style.display = 'none';
    reBtn.style.display = 'none';
})

const writePopover = document.getElementById('writePopover');
const submitBtn = document.getElementById('submitBtn');
const input_to = document.getElementById('inputTo');
const input_subject = document.getElementById('inputSubject');
const input_message = document.getElementById('inputMessage');
submitBtn.addEventListener('click', async e => {
    e.preventDefault();
    const to = input_to.value;
    const subject = input_subject.value;
    const message = input_message.value;
    const data = { to, subject, message }
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(data);
    const r = await fetch('/mail', { method: 'POST', headers, body })
    if (r.status == 201) {
        input_to.value = '';
        input_subject.value = '';
        input_message.value = '';
        return window.location.reload();

    } else if (r.status == 404) {
        const errMessage = document.createElement('p');
        errMessage.innerText = 'No se encotró el usuario.'
        writePopover.appendChild(errMessage);
    }
});

reBtn.addEventListener('click', e => {
    input_to.value = reBtn.dataset.to;
    input_subject.value = reBtn.dataset.subject;
    input_message.value = '';
    writePopover.showPopover();
})

const writeBtn = document.getElementById('writeBtn');
writeBtn.addEventListener('click', e => {
    input_to.value = '';
    input_subject.value = '';
    input_message.value = '';
    writePopover.showPopover();
})