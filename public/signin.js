
let nameInput;

document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.querySelector('#signinbtn');

    loginBtn.onclick = function () {
         nameInput = document.querySelector('#add_name').value;
        const email = document.querySelector('#add_email').value;
        const password = document.querySelector('#add_password').value;
        const role = document.querySelector('input[name="Loginas"]:checked').value;

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nameInput, email, password, role }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server Response:', data);
            if (data.success) {
                console.log('Server Response:', data);
                handleSuccessfulSignupRedirect(role);
            } else {
                console.log('Login failed:', data.error);
                alert(" Invalid Login Credentials  !!");
            }
        })
        .catch(error=>{
            console.error('Error during fetch ',error);
        })
    }

    function handleSuccessfulSignupRedirect(role) {
        switch (role) {
            case 'P':
                sessionStorage.setItem('patientName', nameInput);
                window.location.href = 'patient_.html';
                break;
            case 'D':
                sessionStorage.setItem('doctorName', nameInput);
                window.location.href = 'doctor_.html';
                break;
            case 'A':
                sessionStorage.setItem('adminName', nameInput);
                window.location.href = 'admin_.html';
                break;
            default:
                console.log('Unexpected role:', role);
                break;
        }
    }
});
