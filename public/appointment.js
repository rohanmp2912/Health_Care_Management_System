
document.addEventListener('DOMContentLoaded', function () {
    const referdoctor = document.querySelector('#find_doctor');
    referdoctor.onclick = function () {
        const dept_id = document.querySelector('input[name="department"]:checked').value;
        fetch('http://localhost:5000/search/' + dept_id)
            .then(response => response.json())
            .then(data => loadHTMLTable(data['data']));
    };
});

function loadHTMLTable(data) {
    console.log(data);
    const table = document.querySelector('table tbody');
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='4'>No data<td></tr>";
        return;
    }

    let tableHtml = "";
    data.forEach(function ({ d_name, d_study, d_place, d_phone }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${d_name}</td>`;
        tableHtml += `<td>${d_study}</td>`;
        tableHtml += `<td>${d_place}</td>`;
        tableHtml += `<td>${d_phone}</td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
}

///////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {

    const urlParams = new URLSearchParams(window.location.search);
     const pat_id = urlParams.get('p_id');
     if(!pat_id)
     {
        const patientName = sessionStorage.getItem('patientName');
        if (!patientName) {
            
            alert("Please Enter Details before Entering into appointment,You are new User .");
           
            window.location.href = 'option.html'; 
            return;
        }
        fetch('http://localhost:5000/find_patient_Id/' + patientName)
        .then(response => response.json())
        .then(data => {
             pat_id= data.data[0].d_id;
        });
     }

    const appointment = document.querySelector('#app_submit');
    
    
         appointment.onclick=function(){
            const department_id = document.querySelector('input[name="department"]:checked').value;
            const doctor_name = document.querySelector('#doct').value;
            fetch('http://localhost:5000/find_doctorId/'+ doctor_name)
            .then(response => response.json())
            .then(data => {
            const doctor_id = data.data[0].d_id;

            const cause = document.querySelector('#subject').value;
            fetch('http://localhost:5000/appointment_details', {
                headers: { 'content-type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({cause,department_id,doctor_id,pat_id})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Successfully stored the data")
                    alert(" Appointment Registered  Successfully!!");
                    setTimeout(function() {
                        window.location.href = `patient_.html`;
                    }, 1000);
                } else {
                    console.log("Invalid response format", data.error);
                }
            })
            .catch(error => console.log('Error in inserting Data', error));

            fetch('http://localhost:5000/belongs_details', {
                headers: { 'content-type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({pat_id,department_id})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Successfully stored the data")
                } else {
                    console.log("Invalid response format", data.error);
                }
            })
            .catch(error => console.log('Error in inserting Data', error));


        })
        .catch(error => console.log('Error in fetching Doctor ID', error))

        

        };
   
});

