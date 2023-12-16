document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.querySelector('#signupbtn');

    addBtn.onclick = function () {
        const nameInput = document.querySelector('#add_name');
        const emailInput = document.querySelector('#add_email');
        const passwordInput = document.querySelector('#add_password');
        const selectedRole = document.querySelector('input[name="Loginas"]:checked');

        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const role = selectedRole ? selectedRole.value : null;

        fetch('http://localhost:5000/insert_signUp', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ name: name, email: email, password: password, role: role })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Server Response:', data);
                    handleSuccessfulSignupRedirect(role);
                } else {
                    console.log('Invalid response format', data);
                }
            })
            .catch(error => console.log('Error in inserting Data', error));
    };

    function handleSuccessfulSignupRedirect(role) {
        switch (role) {
            case 'P':
                window.location.href = 'patient_.html';
                break;
            case 'D':
                window.location.href = 'doctor_.html';
                break;
            case 'A':
                window.location.href = 'admin_.html';
                break;
            default:
                console.log('Unexpected role:', role);
                break;
        }
    }
});
