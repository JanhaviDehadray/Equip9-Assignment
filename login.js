document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;

    const loginData = { mobileNumber: mobile, password: password };

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('firstName', result.firstName);
            localStorage.setItem('lastName', result.lastName);
            window.location.href = 'main.html';
        } else {
            alert(result.message || 'Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error connecting to the server.');
    }
});
