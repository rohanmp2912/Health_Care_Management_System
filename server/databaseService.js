const mysql=require('mysql');
let instance=null;

const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"health_care_mng_system",
})

connection.connect((err)=>{
    if(err)
    {
        console.log(err.message);
    }
    console.log('Health Care Database connected'+connection.state);
})


class DbService{
    static getDbServiceInstance(){
        return instance ? instance:new DbService();
    }
    constructor() {
        this.lastGeneratedQuery = null;
    }
    async insert_signUp(name,email,password,role)
    {
        try{
            
            const query ="INSERT INTO signup(usr_name,email,password,role)VALUES(?,?,?,?);";
            const insertId = await new Promise((resolve,reject)=>{
                
                connection.query(query,[name,email,password,role],(err,result)=>{
                    if(err) 
                    {
                        console.log(err);
                        reject (new Error(err.message));
                    }
                    else{
                        console.log(result);
                        resolve(result.insertId);
                     }
                    
                })
            });
            return {success:true};
        
        
        }catch(error)
        {
            console.log(error);
            return{success:false,error:error.message};
        }
    }

    async serachByCredentials(nameInput, email, password, role) {
        try {
            const response = await new Promise((resolve, reject) => {
               //console.log('Values:', nameInput, email, password, role);

                const query = "SELECT * FROM signup WHERE usr_name=? AND email=? AND password=? AND role=?";
              // console.log('Generated Query:', query);
              
                connection.query(query, [nameInput, email, password, role], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        
                        if (results.length > 0) {
                            // User found, return success and user data
                            resolve({ success: true, data: results[0] });
                        } else {
                            // User not found, return failure
                            resolve({ success: false, error: 'User not found' });
                        }
                    }
                });
               
            });
          
            return response;
        } catch (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    }
    getLastGeneratedQuery() {
        return this.lastGeneratedQuery;
    }
    
async searchByDeptId(dept_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                DOCTOR.d_name,
                DOCTOR.d_study,
                DOCTOR.d_place,
                DOCTOR.d_phone
            FROM
                DOCTOR
            JOIN
                DEPARTMENT ON DOCTOR.dept_id = DEPARTMENT.dpt_id
            WHERE
                DOCTOR.dept_id = ?;
        `;

        connection.query(query, [dept_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}



async patient_details(name,age,gender,place,phone)
{
    try{
        
        const query ="INSERT INTO patient(p_name,p_age,gender,p_place,p_phone)VALUES(?,?,?,?,?);";
        const insertId = await new Promise((resolve,reject)=>{
            
            connection.query(query,[name,age,gender,place,phone],(err,result)=>{
                if(err) 
                {
                    console.log(err);
                    reject (new Error(err.message));
                }
                else{
                    console.log(result);
                    resolve(result.insertId);
                 }
                
            })
        });
        return { success: true, p_id: insertId };
    
    
    }catch(error)
    {
        console.log(error);
        return{success:false,error:error.message};
    }
}



async searchByDoctName(doctor_name) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                DOCTOR.d_id
                
            FROM
                DOCTOR
            
            WHERE
                DOCTOR.d_name = ?;
        `;

        connection.query(query, [doctor_name], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}


async appointment_details(cause,department_id,doctor_id,pat_id)
{
    try{
        const dataAdded=new Date();
        const query ="INSERT INTO appointment(cause,dept_id,doct_id,pat_id,date_time)VALUES(?,?,?,?,?);";
        const insertId = await new Promise((resolve,reject)=>{
            
            connection.query(query,[cause,department_id,doctor_id,pat_id,dataAdded],(err,result)=>{
                if(err) 
                {
                    console.log(err);
                    reject (new Error(err.message));
                }
                else{
                    console.log(result);
                    resolve(result.insertId);
                 }
                
            })
        });
        return { success: true };
    
    
    }catch(error)
    {
        console.log(error);
        return{success:false,error:error.message};
    }
}
async belongs_details(pat_id,department_id)
{
    try{
        const dataAdded=new Date();
        const query ="INSERT INTO belongs(pat_id,dept_id)VALUES(?,?);";
        const insertId = await new Promise((resolve,reject)=>{
            
            connection.query(query,[pat_id,department_id],(err,result)=>{
                if(err) 
                {
                    console.log(err);
                    reject (new Error(err.message));
                }
                else{
                    console.log(result);
                    resolve(result.insertId);
                 }
                
            })
        });
        return { success: true };
    
    
    }catch(error)
    {
        console.log(error);
        return{success:false,error:error.message};
    }
}


async appointmentDetailsOfDoctor(doctor_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                APPOINTMENT.apt_id,
                APPOINTMENT.cause,
                APPOINTMENT.date_time,
                APPOINTMENT.pat_id

            FROM
                APPOINTMENT
            JOIN
               DOCTOR  ON APPOINTMENT.doct_id = DOCTOR.d_id
            WHERE
                APPOINTMENT.doct_id = ?;
        `;

        connection.query(query, [doctor_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}



async appointmentDetailsOfDepartment(departmentId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                APPOINTMENT.apt_id,
                APPOINTMENT.cause,
                APPOINTMENT.date_time,
                APPOINTMENT.pat_id

            FROM
                APPOINTMENT
            JOIN
               DEPARTMENT  ON APPOINTMENT.dept_id = DEPARTMENT.dpt_id
            WHERE
                APPOINTMENT.dept_id = ?;
        `;

        connection.query(query, [departmentId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}







async patientBelongToDoctor(patient_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                PATIENT.p_name,
                PATIENT.p_age,
                PATIENT.gender,
                PATIENT.p_place,
                PATIENT.p_phone
            FROM
                PATIENT
            JOIN
                APPOINTMENT ON PATIENT.p_id = APPOINTMENT.pat_id
            WHERE
                PATIENT.p_id= ?;
        `;

       
        //console.log('Executing SQL query:', query, 'with patient_id:', patient_id);

        connection.query(query, [patient_id], (err, rows) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
                return;
            }

         
          //  console.log('Query results:', rows);

            resolve(rows);
        });
    });
}

async searchP_idByApp_id(app_id) {
    console.log("getting app id is ",app_id)
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                APPOINTMENT.pat_id
                
            FROM
                APPOINTMENT
            
            WHERE
            APPOINTMENT.apt_id = ?;
        `;
        //console.log(query)
        connection.query(query, [app_id], (err, rows) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}


async insertToPresTable(pres_data, patient_id, doctor_id)
{
    try{
        const query="INSERT INTO prescription(data,pat_id,doct_id)VALUES(?,?,?);";
            const insertId=await new Promise((resolve,reject)=>{
                connection.query(query,[pres_data, patient_id, doctor_id],(err,result)=>{
                    if(err)
                    {
                        console.log(err);
                        reject (new Error(err.message));
                    }
                    else{
                        resolve(result.insertId);
                    }
                })
            });
            return{success:true};
    }catch(error)
    {
        console.log(error);
        return{success:false,error:error.message};
    }
}

async searchByPatientName(patientName) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                PATIENT.p_id
                
            FROM
            PATIENT
            
            WHERE
            PATIENT.p_name = ?;
        `;

        connection.query(query, [patientName], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}

async appointmentDetailsOfPatient(patient_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                APPOINTMENT.apt_id,
                APPOINTMENT.cause,
                APPOINTMENT.date_time,
                APPOINTMENT.dept_id,
                APPOINTMENT.doct_id,
                APPOINTMENT.pat_id
                

            FROM
                APPOINTMENT
            JOIN
               PATIENT  ON APPOINTMENT.pat_id = PATIENT.p_id
            WHERE
                APPOINTMENT.pat_id = ?;
        `;

        connection.query(query, [patient_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}

async bringPrescription(patient_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                PRESCRIPTION.data
                
            FROM
                PRESCRIPTION
            
            WHERE
            PRESCRIPTION.pat_id= ?;
        `;

        connection.query(query, [patient_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}


async findDeptNameById(department_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                DEPARTMENT.dpt_name
                
            FROM
                DEPARTMENT
            
            WHERE
            DEPARTMENT.dpt_id= ?;
        `;

        connection.query(query, [department_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}


async findDoctorNameById(doctor_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                DOCTOR.d_name
                
            FROM
                DOCTOR
            
            WHERE
            DOCTOR.d_id=?;
        `;

        connection.query(query, [doctor_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}


async insertNewDoctor(doctor_name,doctor_qual,doctor_age,doctor_place,doctor_phone,department_id)
{
    try{
        const query="INSERT INTO doctor(d_name,d_study,d_age,d_place,d_phone,dept_id)VALUES(?,?,?,?,?,?);";
            const insertId=await new Promise((resolve,reject)=>{
                connection.query(query,[doctor_name,doctor_qual,doctor_age,doctor_place,doctor_phone,department_id],(err,result)=>{
                    if(err)
                    {
                        console.log(err);
                        reject (new Error(err.message));
                    }
                    else{
                        resolve(result.insertId);
                    }
                })
            });
            return{success:true};
    }catch(error)
    {
        console.log(error);
        return{success:false,error:error.message};
    }
}





async insertNewDepartment(dept_name,dept_manager)
{
    try{
        const query="INSERT INTO department(dpt_name,d_mng)VALUES(?,?);";
            const insertId=await new Promise((resolve,reject)=>{
                connection.query(query,[dept_name,dept_manager],(err,result)=>{
                    if(err)
                    {
                        console.log(err);
                        reject (new Error(err.message));
                    }
                    else{
                        resolve(result.insertId);
                    }
                })
            });
            return{success:true};
    }catch(error)
    {
        console.log(error);
        return{success:false,error:error.message};
    }
}


async insertVideoInfo(patient_id, doctor_id, generatedUUID)
{
    try{
        const query="INSERT INTO video(p_id,d_id,uuid)VALUES(?,?,?);";
            const insertId=await new Promise((resolve,reject)=>{
                connection.query(query,[patient_id, doctor_id, generatedUUID],(err,result)=>{
                    if(err)
                    {
                        console.log(err);
                        reject (new Error(err.message));
                    }
                    else{
                        resolve(result.insertId);
                    }
                })
            });
            return{success:true};
    }catch(error)
    {
        console.log(error);
        return{success:false,error:error.message};
    }
}


}



module.exports = DbService;