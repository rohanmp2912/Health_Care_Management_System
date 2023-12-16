
let departmentId;
function viewPatients(button) {
     departmentId = button.getAttribute('data-department-id');
    //console.log('View patients for Department ID:', departmentId);
    fetch(`http://localhost:5000/get_appointments_detials/${departmentId}`)
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
    
    // Construct the table ID based on the departmentId
    const tableId = `table-${departmentId}`;
    
    const table = document.querySelector(`#${tableId} tbody`);
    let row = table.insertRow();
    row.insertCell(0).textContent = departmentId;
    row.insertCell(1).textContent = details.apt_id;
    row.insertCell(2).textContent = details.p_name;
    row.insertCell(3).textContent = details.p_age;
    row.insertCell(4).textContent = details.gender;
    row.insertCell(5).textContent = details.p_place;
    row.insertCell(6).textContent = details.p_phone;
    row.insertCell(7).textContent = details.date_time;
    row.insertCell(8).textContent = details.cause;
}





