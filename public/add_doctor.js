document.addEventListener('DOMContentLoaded', function () {
    const doctor_detail = document.querySelector('#add_doct');
    doctor_detail.onclick=function(){
            const department_id = document.querySelector('input[name="department"]:checked').value;
            const doctor_name = document.querySelector('#doctorName').value;
            const doctor_qual=document.querySelector('#qualification').value;
            const doctor_age=document.querySelector('#age').value;
            const doctor_place=document.querySelector('#place').value;
            const doctor_phone=document.querySelector('#phone').value;

         
            fetch('http://localhost:5000/addNewDoctor', {
                headers: { 'content-type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({doctor_name,doctor_qual,doctor_age,doctor_place,doctor_phone,department_id})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Successfully stored the data")
                    alert(" New Doctor Added Successfully !!");
                    setTimeout(function() {
                        window.location.href = 'admin_.html';
                    }, 1000);
                } else {
                    console.log("Invalid response format", data.error);
                }
            })
            .catch(error => console.log('Error in inserting Data', error));
        }
});
