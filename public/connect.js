document.addEventListener('DOMContentLoaded', function () {
    const doctorName = sessionStorage.getItem('doctorName');
    const video = document.getElementById('connect');

    video.addEventListener('submit', function (event) {
        event.preventDefault();
        const pName = document.getElementById('pname');
        const patientName = pName.value;

        console.log(patientName, doctorName);
        fetch('http://localhost:5000/find_patient_Id/' + patientName)
            .then(response => response.json())
            .then(data => {
                const patient_id = data.data[0].p_id;

                console.log(patient_id);
                fetch('http://localhost:5000/find_doctorId/' + doctorName)
                    .then(response => response.json())
                    .then(data => {
                        const doctor_id = data.data[0].d_id;

                        console.log(doctor_id);
                        
                        window.location.href = 'http://localhost:3000/';

                        // Adding event listener to capture the generated UUID after redirection
                        window.addEventListener('load', function () {
                            const redirectedUUID = extractUUIDFromCurrentURL();
                            console.log('Redirected UUID:', redirectedUUID);

                            fetch('http://localhost:5000/addVideoCallInfo', {
                                headers: { 'content-type': 'application/json' },
                                method: 'POST',
                                body: JSON.stringify({ patient_id, doctor_id, redirectedUUID })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        console.log("Successfully stored the data");
                                    } else {
                                        console.log("Invalid response format", data.error);
                                    }
                                })
                                .catch(error => console.log('Error in inserting Data', error));
                        });

                    })
                    .catch(error => console.log('Error fetching Doctor ID', error));
            })
            .catch(error => console.log('Error fetching Patient ID', error));
    });
});

function extractUUIDFromCurrentURL() {
    const urlSegments = window.location.href.split('/');
    return urlSegments[urlSegments.length - 1];
}
