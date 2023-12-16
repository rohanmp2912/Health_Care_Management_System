document.addEventListener('DOMContentLoaded', function () {
    const patientForm = document.querySelector('#patientForm');
    
    if (patientForm) {
        patientForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nameInput = document.querySelector('#fname');
            const ageInput = document.querySelector('#age');
            const genderInput = document.querySelector('input[name="gender"]:checked');
            const placeInput = document.querySelector('#place');
            const phoneInput = document.querySelector('#phone');

            const name = nameInput.value;
            const age = ageInput.value;
            const gender = genderInput ? genderInput.value : null;
            const place = placeInput.value;
            const phone = phoneInput.value;

            fetch('http://localhost:5000/patient_details', {
                headers: { 'content-type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ name, age, gender, place, phone })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Server Response:', data);
                if (data.success) {
                    console.log('Patient ID:', data.p_id);
                    redirectToPage(data.p_id);
                } else {
                    console.log("Invalid response format", data.error);
                }
            })
            
            .catch(error => {
                console.log('Error in inserting Data', error);
               
                console.error(error);
            });
            
        });
    } else {
        console.log("Form element not found.");
    }
});

function redirectToPage(patient_id) {
    console.log('Redirecting to the next page...');
    window.location.href = `appform.html?p_id=${patient_id}`;
}



