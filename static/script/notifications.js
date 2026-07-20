document.addEventListener('DOMContentLoaded', () => {
    const notifications = [...document.getElementsByClassName('notification')];
    notifications.forEach(notification => {
        notification.addEventListener('mousedown', async e => {
            if (!e.currentTarget.classList.contains('unreaded')) return;
            if (e.button == 2) return;
            const notificationDiv = e.currentTarget;
            const { id } = notificationDiv;
            const r = await fetch('/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (r.status != 200) return;
            notificationDiv.classList.remove('unreaded');
        })
    })
})