document.addEventListener('DOMContentLoaded', function () {
    const doct_pres = document.querySelector('#pres');
    doct_pres.onclick = function () {
        let doctor_id;
        let patient_id;
        
        
        const urlParams = new URLSearchParams(window.location.search);
        const app_id = urlParams.get('apt_id');

        console.log("app is i am sending is ",app_id);
        const fetchPatientId = fetch('http://localhost:5000/find_patientId_byAppId/' + app_id)
            .then(response => response.json())
            .then(data => {
                patient_id = data.data[0].pat_id;
            });

        const doctorName = sessionStorage.getItem('doctorName');
        const fetchDoctorId = fetch('http://localhost:5000/find_doctorId/' + doctorName)
            .then(response => response.json())
            .then(data => {
                doctor_id = data.data[0].d_id;
            });

        Promise.all([fetchPatientId, fetchDoctorId]).then(() => {
            const pres_data = document.querySelector('#pres_data').value; 
            console.log('all three values which i got  is  :', patient_id,doctor_id,pres_data);
            fetch('http://localhost:5000/insertToPresTable', {
                headers: { 'content-type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ pres_data, patient_id, doctor_id })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Successfully inserted:', data);

                        alert(" Successfully Sent Medication");
                    setTimeout(function() {
                        window.location.href = `view_patient.html`;
                    }, 1000);
                        
                    } else {
                        console.log('Invalid response format', data.error);
                    }
                })
                .catch(error => console.log('Error in inserting Data', error));
        });
    };
});
