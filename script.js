document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;

    const userData = {
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobile,
        password: password
    };

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        const result = await response.json();
        console.log('Response from server:', result);

        if (response.ok) {
            alert('Registration Successful!');
            window.location.href = 'login.html'; 
        } else {
            alert(result.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error connecting to the server.');
    }
});
