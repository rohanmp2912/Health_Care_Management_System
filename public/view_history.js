function viewAppointments(patient_id) {
    let combinedDetails;
    fetch(`http://localhost:5000/get_appointments_of_patient/${patient_id}`)
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
                                   combinedDetails = { ...appointment, ...patientDetails.data[0] };
                                    
                                } else {
                                    console.error("Patient details are not available or not in the expected format:", patientDetails);
                                }
                            })
                            .catch(error => {
                                console.error("Error during fetch:", error);
                            });
                            
                            console.log("i am sending to bring prescription is : ",patient_id)
                            fetch(`http://localhost:5000/get_prescription/${patient_id}`)
                            .then(response=>response.json())
                            .then(data => {
                                const presDetails = data.data[0].data;
                                combinedDetails = { ...combinedDetails, presDetails };
                            });
                            
                            
                            const department_id = appointment.dept_id;
                            fetch(`http://localhost:5000/get_detpName_byId/${department_id}`)
                            .then(response=>response.json())
                            .then(data => {
                                const deptName = data.data[0].dpt_name;
                                
                                combinedDetails = { ...combinedDetails, deptName };
                                console.log("after merging :",combinedDetails)
                            });


                            const doctor_id = appointment.doct_id;
                            fetch(`http://localhost:5000/get_doctorName_byId/${doctor_id}`)
                            .then(response=>response.json())
                            .then(data => {
                                const doctorName = data.data[0].d_name;
                                combinedDetails = { ...combinedDetails, doctorName };
                                displayAppointment(combinedDetails);
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
    row.insertCell(6).textContent = details.deptName;
    row.insertCell(7).textContent = details.doctorName;
    row.insertCell(8).textContent = details.date_time;
    row.insertCell(9).textContent = details.cause;
    row.insertCell(10).textContent = details.presDetails;
  
}






document.addEventListener('DOMContentLoaded', function () {
    const patientName = sessionStorage.getItem('patientName');
    if (!patientName) {
        alert("Now Past History !!,You are new User.");
        window.location.href = 'patient_.html'; 
        return;
    }
    const viewAppButton = document.querySelector('#view-history');
    
    viewAppButton.addEventListener('click', function () {
        fetch('http://localhost:5000/find_patient_Id/' + patientName)
        .then(response => response.json())
        .then(data => {
            const patient_id= data.data[0].p_id;
            console.log("patient id i am sending is :",patient_id)
            viewAppointments(patient_id);
        });
    });
});


       
