document.addEventListener('DOMContentLoaded', () => {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    const now = new Date();
    const hour = now.getHours();
    let greeting = 'Good Morning';

    if (hour >= 12 && hour < 18) {
        greeting = 'Good Afternoon';
    } else if (hour >= 18) {
        greeting = 'Good Evening';
    }

    document.getElementById('greeting').textContent = `${greeting}, ${firstName} ${lastName}`;
});

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'registration.html';
});
