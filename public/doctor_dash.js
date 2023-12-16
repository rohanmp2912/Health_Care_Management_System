function viewAppointments(doctor_id) {
    fetch(`http://localhost:5000/get_appointments/${doctor_id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const appointments = data.data;
                if (Array.isArray(appointments)) {
                    for (const appointment of appointments) {
                        const patient_id = appointment.pat_id;
                        fetch(`http://localhost:5000/get_patient_details/${patient_id}`)
                            .then(response => response.json())
                            .then(patientDetails => {
                                if (patientDetails.success && Array.isArray(patientDetails.data) && patientDetails.data.length > 0) {
                                    const combinedDetails = { ...appointment, ...patientDetails.data[0] };
                                    displayAppointment(combinedDetails);
                                } else {
                                    console.error("Patient details are not available or not in the expected format:", patientDetails);
                                }
                            })
                            .catch(error => {
                                console.error("Error during fetch:", error);
                            });
                    }
                } else {
                    console.error("Appointments data is not an array:", appointments);
                }
            } else {
                console.error("Error fetching appointments:", data.error);
            }
        })
        .catch(error => {
            console.error("Error during fetch:", error);
        });
}




function displayAppointment(details) {
    console.log("Details to display:", details); // Log details
    const table = document.querySelector('table tbody');
    let row = table.insertRow();
    row.insertCell(0).textContent = details.apt_id;
    row.insertCell(1).textContent = details.p_name;
    row.insertCell(2).textContent = details.p_age;
    row.insertCell(3).textContent = details.gender;
    row.insertCell(4).textContent = details.p_place;
    row.insertCell(5).textContent = details.p_phone;
    row.insertCell(6).textContent = details.date_time;
    row.insertCell(7).textContent = details.cause;
    const prescriptionButton = document.createElement('button');
    prescriptionButton.textContent = 'Give Prescription';

    
    prescriptionButton.addEventListener('click', function () {
        window.location.href = `pres.html?apt_id=${details.apt_id}`;
    });
    

    // Append the button to the row
    row.insertCell(8).appendChild(prescriptionButton);
}





document.addEventListener('DOMContentLoaded', function () {
    const doctorName = sessionStorage.getItem('doctorName');
    const viewAppButton = document.querySelector('#view-app');
    
    viewAppButton.addEventListener('click', function () {
        fetch('http://localhost:5000/find_doctorId/' + doctorName)
            .then(response => response.json())
            .then(data => {
                const doctor_id = data.data[0].d_id;
                viewAppointments(doctor_id);
            });
    });
});
