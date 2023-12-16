document.addEventListener('DOMContentLoaded', function () {
    const dept_detail = document.querySelector('#add_dept');
   dept_detail.onclick=function(){
            
            const dept_name = document.querySelector('#departmentName').value;
            const dept_manager=document.querySelector('#departmentManager').value;
            

         
            fetch('http://localhost:5000/addNewDepartment', {
                headers: { 'content-type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({dept_name,dept_manager})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Successfully stored the data")
                    alert(" New Depaartment Added Successfully !!");
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
