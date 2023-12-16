const express=require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const app=express();
const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();

const databaseService = require('./databaseService.js');

app.use(cookieParser());

const sessionStore = new MySQLStore({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'health_care_mng_system',
});

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
}));

app.use(cors());             
app.use(express.json())   
app.use(express.urlencoded({extended:false}))


app.post('/insert_signUp', async (request, response) => {
    try {
        const { name, email, password, role } = request.body;
        const db = databaseService.getDbServiceInstance();
         //console.log('Received data:', { name, email, password, role });
        const result = await db.insert_signUp(name, email, password, role);
        console.log('Database insert result:', result); //for checking the resopnse

        response.json(result);
    } catch (error) {
       
        console.error(error);
        response.json({ success: false, error: error.message });
    }
});





app.post('/login', async (request, response) => {
    try {
        const { nameInput, email, password, role } = request.body;
        console.log('Received request:', { nameInput, email, password, role });
        const db =  databaseService.getDbServiceInstance();
        const result =await db.serachByCredentials(nameInput,email, password, role);
        console.log('Database insert result:', result); 
       
        if (result.success) {
            request.session.user = {
                nameInput: result.data.nameInput,
                email: result.data.email,
                role: result.data.role,
            };

            response.json({ success: true, data: result.data });
        } else {
            response.json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        response.json({ success: false, error: error.message });
    }
});


app.post('/patient_details', async (request, response) => {
    try {
        
        const { name, age, gender, place, phone } = request.body;
        const db = databaseService.getDbServiceInstance();
        const result = await db.patient_details(name, age, gender, place, phone);
        console.log("Patient details stored. p_id:", result.p_id);  
        response.json({ success: true, p_id: result.p_id });
    } catch (error) {
        console.log(error);
        response.json({ success: false, error: error.message });
    }
});


app.get('/search/:dept_id', async (request, response) => {
    try {
        const { dept_id } = request.params;
        const db = databaseService.getDbServiceInstance();
        const result = await db.searchByDeptId(dept_id);
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/find_doctorId/:doctor_name', async (request, response) => {
    try {
        const { doctor_name } = request.params;
        const db = databaseService.getDbServiceInstance();
        const result = await db.searchByDoctName(doctor_name);
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/appointment_details',async (request,response)=>{
    try{ 
        const {cause,department_id,doctor_id,pat_id}=request.body;
        const db=databaseService.getDbServiceInstance();
        const result=await db.appointment_details(cause,department_id,doctor_id,pat_id);
        response.json({ success: true, data:result});
    }catch(error){
        console.log(error);
        response.json({success:false,error:error.message});
    }
});


app.post('/belongs_details',async (request,response)=>{
    try{ 
        const {pat_id,department_id}=request.body;
        const db=databaseService.getDbServiceInstance();
        const result=await db.belongs_details(pat_id,department_id);
        response.json({ success: true, data:result});
    }catch(error){
        console.log(error);
        response.json({success:false,error:error.message});
    }
});



app.get('/get_appointments/:doctor_id', async (request, response) => {
    try {
        const { doctor_id } = request.params;
        const db = databaseService.getDbServiceInstance();
        const result = await db.appointmentDetailsOfDoctor(doctor_id);
        console.log("server sending result as :",result)
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/get_appointments_detials/:departmentId', async (request, response) => {
    try {
        const { departmentId } = request.params;
        const db = databaseService.getDbServiceInstance();
        const result = await db.appointmentDetailsOfDepartment(departmentId);
        console.log("server sending result as :",result)
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/get_patient_details/:patient_id', async (request, response) => {
    try {
        const { patient_id } = request.params;
        console.log("now patient id",patient_id)
        console.log("recieved patient id is :",patient_id)
        const db = databaseService.getDbServiceInstance();
        const result = await db.patientBelongToDoctor(patient_id);
        console.log("now sending result as :",result)
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/find_patientId_byAppId/:app_id',async(request,response)=>{
    try{
        const {app_id}=request.params;
       
        const db=databaseService.getDbServiceInstance();
        const result=await db.searchP_idByApp_id(app_id);
        console.log("returning patient_id ",result)
        
        response.json({success:true,data:result});

    }catch(error)
    {
        console.log(error);
        response.status(500).json({erroe:'Internal server Error'})
    }
});




app.post('/insertToPresTable',async (request,response)=>{
    try{
        
        const{pres_data, patient_id, doctor_id} =request.body;
        console.log("three values are ",pres_data, patient_id, doctor_id);
        const db=databaseService.getDbServiceInstance();
        const result=await db.insertToPresTable(pres_data, patient_id, doctor_id);
        response.json({success:true,data:result});
    }catch(error){
        console.log(error);
        response.json({success: false, error: error.message});
    }
});






app.get('/find_patient_Id/:patientName', async (request, response) => {
    try {
        const { patientName } = request.params;
        console.log("patient name i recieving in session is :",patientName)
        const db = databaseService.getDbServiceInstance();
        const result = await db.searchByPatientName(patientName);
        console.log("i am sending patient id is",result)
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/get_appointments_of_patient/:patient_id', async (request, response) => {
    try {
        const { patient_id } = request.params;
        console.log("receiving data 1",patient_id)
        const db = databaseService.getDbServiceInstance();
        const result = await db.appointmentDetailsOfPatient(patient_id);
        console.log("server sending result as 1:",result)
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/get_prescription/:patient_id', async (request, response) => {
    try {
        const { patient_id } = request.params;
        console.log("receiving data 2",patient_id)
        const db = databaseService.getDbServiceInstance();
        const result = await db.bringPrescription(patient_id);
        console.log("server sending result as 2:",result)
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/get_detpName_byId/:department_id', async (request, response) => {
    try {
        const { department_id} = request.params;
        console.log("receiving data 3",department_id)
        const db = databaseService.getDbServiceInstance();
        const result = await db.findDeptNameById(department_id);
        console.log("server sending result as 3:",result)
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/get_doctorName_byId/:doctor_id', async (request, response) => {
    try {
        const { doctor_id} = request.params;
        console.log("receiving data 4",doctor_id)
        const db = databaseService.getDbServiceInstance();
        const result = await db.findDoctorNameById(doctor_id);
        console.log("server sending result as 4:",result)
        response.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/addNewDoctor',async (request,response)=>{
    try{
        
        const{doctor_name,doctor_qual,doctor_age,doctor_place,doctor_phone,department_id} =request.body;
        const db=databaseService.getDbServiceInstance();
        const result=await db.insertNewDoctor(doctor_name,doctor_qual,doctor_age,doctor_place,doctor_phone,department_id);
        response.json({success:true,data:result});
    }catch(error){
        console.log(error);
        response.json({success: false, error: error.message});
    }
});


app.post('/addNewDepartment',async (request,response)=>{
    try{
        
        const{dept_name,dept_manager} =request.body;
        const db=databaseService.getDbServiceInstance();
        const result=await db.insertNewDepartment(dept_name,dept_manager);
        response.json({success:true,data:result});
    }catch(error){
        console.log(error);
        response.json({success: false, error: error.message});
    }
});

app.post('/addVideoCallInfo',async (request,response)=>{
    try{
        
        const{patient_id, doctor_id, generatedUUID} =request.body;
        const db=databaseService.getDbServiceInstance();
        const result=await db.insertVideoInfo(patient_id, doctor_id, generatedUUID);
        response.json({success:true,data:result});
    }catch(error){
        console.log(error);
        response.json({success: false, error: error.message});
    }
});




app.get('/logout', (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            console.log(err);
            response.json({ success: false, error: 'Error logging out' });
        } else {
            response.json({ success: true });
        }
    });
});


app.listen(process.env.PORT , ()=>{
    console.log("port is connected successfully!!")
})