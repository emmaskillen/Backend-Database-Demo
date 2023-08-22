/*
=======================================================================================================================
---------- app.js -----------------------------------------------------------------------------------------------------
Code Citation:
Date: 8/14/23
Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%203%20-%20Integrating%20a%20Templating%20Engine%20(Handlebars)/README.md
=======================================================================================================================
*/

// Import required libraries and set up the server
var express = require('express');   
var app = express();            

// Configure middleware for handling requests and serving static files
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

var routes = require('./routes/index');
var users = require('./routes/users');
var path = require('path');

// Set the port number at the top for easy future changes
//const PORT = 443;                 

// Import the database connector
var db = require('./database/db-connector');

// Import and configure the handlebars template engine
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     
app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');                 
app.use(express.static('public')); 

app.use('/', routes);
app.use('/users', users);
/*
=======================================================================================================================
---------- Handlebars -------------------------------------------------------------------------------------------------
Citation for the following template code:
Date: 07/31/23
Copied from nodejs-starter-app on GitHub: currym-osu
Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
=======================================================================================================================
*/

// Create a handlebars instance
var hbs = exphbs.create({});

// Helper function to format a date (mm/dd/yy)
hbs.handlebars.registerHelper('formatDate', function (date) {
    newDate = new Date(date).toLocaleDateString('en-US');
    return newDate; 
});

// Helper function to format a phone number (###-###-####)
hbs.handlebars.registerHelper('formatPhone', function(phone) {
    newPhone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
    return newPhone;
});

// Helper function to format currency (USD)
hbs.handlebars.registerHelper('formatCurrency', function(currency) {
    const newCurrency = currency.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    return newCurrency;
});

/*
=======================================================================================================================
---------- Index Routes -----------------------------------------------------------------------------------------------
=======================================================================================================================
*/

// Route to display the index (home) page
app.get('/', function(req, res) {
    // Note the use of render() instead of send() to process the template before sending HTML to the client.
    res.render('index');  
});

/*
=======================================================================================================================
---------- Staff Routes -----------------------------------------------------------------------------------------------
=======================================================================================================================
*/

// Display staff information and search form
app.get('/staff', function(req, res) {
    let query1;

    // If no last_name_search query parameter, perform basic SELECT
    if (req.query.last_name_search === undefined) {
        query1 = "SELECT * FROM Staff;";
    } else {
        // If last_name_search exists, perform search
        query1 = `SELECT * FROM Staff WHERE last_name LIKE "${req.query.last_name_search}%"`
    }

    // Execute query and render staff.hbs template
    db.pool.query(query1, function(error, rows, fields) {
        let staff = rows;
        res.render('staff.hbs', { data: staff });
    });
});

// Add a new staff member
app.post('/add-staff', function(req, res) {
    let data = req.body;

    // Create the query and run it on the database
    let query = `
        INSERT INTO Staff (last_name, first_name, phone_number, email)
        VALUES ('${data.last_name}', '${data.first_name}', '${data.phone}', '${data.email}')
    `;

    // Execute query and handle response
    db.pool.query(query, function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/staff.hbs'); // Redirect to staff page after successful insert
        }
    });
});

// Display staff information for dropdown
app.get('/staff-dropdown', function(req, res) {
    let query = "SELECT * FROM Staff;";

    // Execute query and render staff-dropdown template
    db.pool.query(query, function(error, rows, fields) {
        res.render('staff-dropdown', { staffData: rows });
    });
});

// Delete a staff member
app.delete('/delete-staff/:id', function(req, res) {
    let staffId = req.params.id;

    let deleteQuery = `DELETE FROM Staff WHERE id_staff = ?`;

    // Execute delete query and handle response
    db.pool.query(deleteQuery, [staffId], function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204); // Send success status without content
        }
    });
});

// Update staff member using AJAX
app.put('/put-staff-ajax', function(req, res, next) {
    let data = req.body;
    let staff_id = parseInt(data.staff_id);
    let last_name = data.last_name;
    let first_name = data.first_name;
    let phone = data.phone;
    let email = data.email;
  
    let queryUpdateStaff = `UPDATE Staff SET last_name = ?, first_name = ?, phone_number = ?, email = ? WHERE id_staff = ?`;
    let selectStaff = `SELECT * FROM Staff WHERE id_staff = ?`;

    // Execute update query and handle response
    db.pool.query(queryUpdateStaff, [last_name, first_name, phone, email, staff_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Execute select query to get updated data
            db.pool.query(selectStaff, [staff_id], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Render the staff.hbs template after updating the record
                    res.render('staff', { data: rows });
                }
            });
        }
    });
});
    
/*
=======================================================================================================================
---------- Insurance Routes -------------------------------------------------------------------------------------------
=======================================================================================================================
*/

// Display insurance information and search features
app.get('/insurance.hbs', function(req, res) {
    let query;

    // If no insurance_search query parameter, perform basic SELECT
    if (req.query.insurance_search === undefined) {
        query = "SELECT * FROM Insurances;";
    } else {
        const searchParam = req.query.insurance_search;
        query = `SELECT * FROM Insurances WHERE org_name LIKE "%${searchParam}%"`;
    }

    // Execute query and render insurance.hbs template
    db.pool.query(query, function(error, rows, fields) {
        let insurances = rows;
        res.render('insurance.hbs', { data: insurances });
    });
});

// Add new insurance
app.post('/add-insurance-form', function(req, res) {
    let data = req.body;

    // Create the insert query and run it on the database
    let query = `
        INSERT INTO Insurances (org_name, member_id, group_number)
        VALUES ('${data['insurance-name']}', '${data['member-ID']}', '${data['add-group-number']}')
    `;

    // Execute insert query and handle response
    db.pool.query(query, function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Retrieve the newly inserted insurance data
            let selectQuery = `
                SELECT * FROM Insurances WHERE id_insurance = ${result.insertId}
            `;

            // Execute select query and redirect to insurance.hbs page
            db.pool.query(selectQuery, function(selectError, selectResult) {
                if (selectError) {
                    console.log(selectError);
                    res.sendStatus(400);
                } else {
                    res.redirect('/insurance.hbs');
                }
            });
        }
    });
});

// Update insurance information using AJAX
app.put('/update-insurance-ajax', function(req, res, next) {
    let data = req.body;

    let insurance_id = parseInt(data.insurance_id);
    let org_name = data.org_name;
    let member_id = data.member_id;
    let group_number = data.group_number;

    let queryUpdateInsurance = `UPDATE Insurances SET org_name = ?, member_id = ?, group_number = ? WHERE id_insurance = ?`;

    // Execute update query and handle response
    db.pool.query(queryUpdateInsurance, [org_name, member_id, group_number, insurance_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Execute select query to get updated data
            let selectInsurance = `SELECT * FROM Insurances WHERE id_insurance = ?`;
            db.pool.query(selectInsurance, [insurance_id], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Render the insurance.hbs template after updating the record
                    res.render('insurance', { data: rows });
                }
            });
        }
    });
});

// Delete Insurance
app.delete('/delete-insurance/:id', function(req, res) {
    let insuranceID = req.params.id;

    let deleteQuery = `DELETE FROM Insurances WHERE id_insurance = ?`;

    // Execute delete query and handle response
    db.pool.query(deleteQuery, [insuranceID], function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

/*
=======================================================================================================================
---------- Patients Routes -------------------------------------------------------------------------------------------
=======================================================================================================================
*/

// Display patient information and search form
app.get('/patients.hbs', function(req, res) {
    // Fetch insurance data
    const queryInsurance = "SELECT * FROM Insurances";
    
    // Fetch patient data based on search or basic SELECT
    let queryPatients;
    
    if (req.query.last_name_search === undefined) {
        queryPatients = "SELECT * FROM Patients;";
    } else {
        queryPatients = `SELECT * FROM Patients WHERE last_name LIKE "${req.query.last_name_search}%"`;
    }

    // Run both queries in parallel using Promise.all
    // Original work referencing https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
    Promise.all([
        new Promise((resolve, reject) => {
            // Fetch patient data
            db.pool.query(queryPatients, function(error, rows, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            });
        }),
        new Promise((resolve, reject) => {
            // Fetch insurances not associated with any patient
            let query = `
                SELECT i.*
                FROM Insurances i
                LEFT JOIN Patients p ON i.id_insurance = p.id_insurance
                WHERE p.id_patient IS NULL
            `;
            db.pool.query(query, function(error, rows, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            });
        })
    ]).then(([patients, insurance]) => {
        return res.render('patients', { data: patients, insurance: insurance });
    }).catch(error => {
        console.error("Error:", error);
        return res.status(500).send("An error occurred");
    });
});

// Add new patient
app.post('/add-patient', function(req, res) {
    let data = req.body;

    // Map "self-pay" option to NULL for id_insurance
    let idInsurance = data['input-patient-insurance'] === 'self-pay' ? null : data['input-patient-insurance'];

    // Create the query and run it on the database
    let query = `
        INSERT INTO Patients (id_insurance, last_name, first_name, birthdate, phone_number, email, street_name, city, zip_code)
        VALUES (${idInsurance}, '${data['input-patient-last-name']}', '${data['input-patient-first-name']}', '${data['input-patient-birthdate']}', '${data['input-patient-phone']}', '${data['input-patient-email']}', '${data['input-patient-street-name']}', '${data['input-patient-city']}', '${data['input-patient-zip']}')
    `;

    // Execute insert query and handle response
    db.pool.query(query, function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/patients.hbs'); // Redirect back to the patients page after successful insert
        }
    });
});

// Add new insurance via form
app.post('/add-patient-insurance', function(req, res) {
    // Get data from the form
    let insuranceData = {
        org_name: req.body['insurance-name'],
        member_id: req.body['member-ID'],
        group_number: req.body['add-group-number']
    };

    // Create and run the query to insert the insurance data into the database
    let insertQuery = `INSERT INTO Insurances (org_name, member_id, group_number) VALUES ('${insuranceData.org_name}', '${insuranceData.member_id}', '${insuranceData.group_number}')`;

    // Execute insert query and handle response
    db.pool.query(insertQuery, function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/patients.hbs');
        }
    });
});

// Add new insurance
app.post('/add-insurance', function(req, res) {
    let data = req.body;

    // Create the query and run it on the database to insert insurance data
    let query = `
        INSERT INTO Insurances (org_name, member_id, group_number)
        VALUES ('${data['insurance-name']}', '${data['member-ID']}', '${data['add-group-number']}')
    `;

    // Execute insert query and handle response
    db.pool.query(query, function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Fetch the updated insurance data and send it back as JSON response
            let fetchQuery = "SELECT * FROM Insurances WHERE id_insurance = LAST_INSERT_ID()";
            db.pool.query(fetchQuery, function(error, rows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.json(rows); // Send the inserted data back as JSON
                }
            });
        }
    });
});

// Delete Patient 
app.delete('/delete-patient/:id', function(req, res, next) {
    let patientID = req.params.id;

    let deletePatients = `DELETE FROM Patients WHERE id_patient = ?`;
    
    // Execute delete query and handle response
    db.pool.query(deletePatients, [patientID], function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Update patient using AJAX
app.put('/put-patient-ajax', function(req, res, next) {
    let data = req.body;

    // Extract the patient's data from the request
    let patient_id = parseInt(data.patient_id);
    let insurance_id = data.insurance_id === 'N/A' ? null : data.insurance_id; // Handle 'N/A' value
    let first_name = data.first_name;
    let last_name = data.last_name;
    let birthdate = data.birthdate;
    let phone = data.phone;
    let email = data.email;
    let street_name = data.street_name;
    let city = data.city;
    let zip_code = data.zip_code;

    // Construct the UPDATE query
    let queryUpdatePatient = `
    UPDATE Patients 
    SET id_insurance = ?, last_name = ?, first_name = ?, birthdate = ?, phone_number = ?, email = ?, street_name = ?, city = ?, zip_code = ? 
    WHERE id_patient = ?
    `;

    // Run the update query and handle response
    db.pool.query(queryUpdatePatient, [insurance_id || null, last_name, first_name, birthdate, phone, email, street_name, city, zip_code, patient_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400); // Bad request
        } else {
            // Return the updated patient data
            let selectPatientQuery = `SELECT * FROM Patients WHERE id_patient = ?`;
            db.pool.query(selectPatientQuery, [patient_id], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400); // Bad request
                } else {
                    res.json(rows); // Return the updated patient data as JSON
                }
            });
        }
    });
});

/*
=======================================================================================================================
---------- Appointments Routes ----------------------------------------------------------------------------------------
=======================================================================================================================
*/

// display appointments 
app.get('/appointment.hbs', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.input_search_date === undefined)
    {
        query1 = "SELECT * FROM Appointments;";
    }

    // search by appointment date
    else
    {
        query1 = `SELECT * FROM Appointments WHERE appointment_date = "${req.query.input_search_date}%"`;
    }

    // get patient data (for names)
    let query2 = "SELECT * FROM Patients;";

    // get staff last name 
    let query3 = "SELECT * FROM Staff;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the appointment data
        let appointments = rows;
        
            // Run the second query
            db.pool.query(query2, (error, rows, fields) => {
            
                // Save the patients
                let patients = rows; 
        
                    db.pool.query(query3, (error, rows, fields) => {

                        // save the staff
                        let staff = rows; 
                    
                        // replace patient ID with patient last name 
                        let patientmap = {}
                        patients.map(patient => {
                            let id = parseInt(patient.id_patient, 10);
                
                            patientmap[id] = patient["first_name"] + " " + patient["last_name"];
                        })
                
                        // Overwrite the patient ID with the last name of patient 
                        appointments = appointments.map(person => {
                            return Object.assign(person, {id_patient: patientmap[person.id_patient]})
                        })

                        // replace staff ID with staff last name
                        let staffmap = {}
                        staff.map(provider => {
                            let id = parseInt(provider.id_staff, 10);
                
                            staffmap[id] = provider["first_name"] + " " + provider["last_name"];
                        })
                
                        // Overwrite the patient ID with the last name of patient 
                        appointments = appointments.map(member => {
                            return Object.assign(member, {id_staff: staffmap[member.id_staff]})
                        })

                        return res.render('appointment.hbs', {data: appointments, patients: patients, staff:staff});
                    })
            })
    })
});

// Add Appointment
app.post('/add-appointment-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Appointments (id_patient, id_staff, appointment_date, appointment_time, visit_purpose) VALUES ('${data['patientID']}', '${data['staffID']}', '${data['apptDate']}', '${data['apptTime']}', '${data['purpose']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/appointment.hbs');
        }
    })
});

// Delete Appointment
app.delete('/delete-appointment/:id', function(req, res) {
    let appointmentID = req.params.id;

    let deleteQuery = `DELETE FROM Appointments WHERE id_appointment = ?`;

    db.pool.query(deleteQuery, [appointmentID], function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Update Appointment
app.put('/put-appointment-ajax', function(req,res,next){
    let data = req.body;
  
    let appointmentID = data.appointment_id;
    let patientID = data.patient_id;
    let staffID = data.staff_id;
    let apptDate = data.appointment_date;
    let apptTime = data.appointment_time;
    let purpose = data.purpose;
  
    let queryUpdateAppointment = `UPDATE Appointments SET id_patient = ?, id_staff = ?, appointment_date = ?, appointment_time = ?, visit_purpose = ? WHERE Appointments.id_appointment = ?`; 
        
          // Run the 1st query
          db.pool.query(queryUpdateAppointment, [patientID, staffID, apptDate, apptTime, purpose, appointmentID], function(error, rows, fields){
              if (error) {
  
              // send error to user
              console.log(error);
              res.sendStatus(400);
              }
  
             // no error so update table on display
              else
              {
                  // Run the second query
                  let selectAppointment = `SELECT * FROM Appointments WHERE id_appointment = ?`;
                  db.pool.query(selectAppointment, [appointmentID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                        // Render the staff.hbs template after updating the record
                        res.render('appointment', { data: rows }); 
                      }
                  })
              }
  })});

/*
=======================================================================================================================
---------- CPT Codes Routes -------------------------------------------------------------------------------------------
=======================================================================================================================
*/

// Display and Search Codes Page
app.get('/codes.hbs', function(req, res) {
    let query;

    if (req.query.description_search === undefined) {
        query = "SELECT * FROM Codes;";
    } else {
        const searchParam = req.query.description_search;
        query = `SELECT * FROM Codes WHERE description LIKE "%${searchParam}%"`;
    }

    db.pool.query(query, function(error, rows, fields) {
        let codes = rows;
        res.render('codes.hbs', { data: codes });
    });
});

// Add new code 
app.post('/add-code-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Codes (cpt_code, description, initial_fee) VALUES ('${data['input-cpt-code']}', '${data['input-code-description']}', '${data['input-fee']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/codes.hbs');
        }
    })
})

// Delete Codes
app.delete('/delete-code/:id', function(req, res) {
    let codeID = req.params.id;

    let deleteQuery = `DELETE FROM Codes WHERE id_code = ?`;

    db.pool.query(deleteQuery, [codeID], function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Update Codes
app.put('/put-code-ajax', function(req,res,next){
    let data = req.body;
  
    let id_code = parseInt(data.id_code);
    let cpt_code = data.cpt_code;
    let description = data.description;
    let initial_fee = data.initial_fee;
  
    let queryUpdateCode = `UPDATE Codes SET cpt_code = ?, description = ?, initial_fee = ? WHERE id_code = ?`;
    let selectCode = `SELECT * FROM Codes WHERE id_code = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateCode, [cpt_code, description, initial_fee, id_code], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectCode, [id_code], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

/*
=======================================================================================================================
---------- Appointment Codes Routes -----------------------------------------------------------------------------------
=======================================================================================================================
*/

// display appointment-codes + search feature
app.get('/appointment-codes.hbs', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.appointment_codes_search === undefined)
    {
        query1 = `SELECT Appointments.id_patient, Patients.last_name, Patients.first_name, Appointments.appointment_time, 
        appointments_has_codes.id_appointment, appointments_has_codes.id_code, Appointments.appointment_date, Appointments.visit_purpose
        FROM Appointments INNER JOIN Patients ON Appointments.id_patient=Patients.id_patient
        INNER JOIN appointments_has_codes ON Appointments.id_appointment = appointments_has_codes.id_appointment;
        `; 
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT Appointments.id_patient, Patients.last_name, Patients.first_name, Appointments.appointment_time, 
        appointments_has_codes.id_appointment, appointments_has_codes.id_code, Appointments.appointment_date, 								Appointments.visit_purpose
        FROM Appointments INNER JOIN Patients ON Appointments.id_patient = Patients.id_patient
        INNER JOIN appointments_has_codes ON Appointments.id_appointment = appointments_has_codes.id_appointment
        WHERE last_name LIKE "${req.query.appointment_codes_search}%"`;
    }

    // get cpt codes 
    let query2 = "SELECT * FROM Codes;";

    // get staff last name 
    //let query3 = "SELECT * FROM Appointments;";
    let query3 = `SELECT Appointments.id_patient, Patients.last_name, Patients.first_name, Appointments.appointment_time, 
                appointments_has_codes.id_appointment, appointments_has_codes.id_code, Appointments.appointment_date, Appointments.visit_purpose
                FROM Appointments INNER JOIN Patients ON Appointments.id_patient=Patients.id_patient
                INNER JOIN appointments_has_codes ON Appointments.id_appointment = appointments_has_codes.id_appointment;
                `; 

    // get only cpt codes not used for adding feature
    let query4 = `
        SELECT * FROM Appointments; 
    `;

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the appointment data
        let appointmentCodes = rows;
        
            // Run the second query
            db.pool.query(query2, (error, rows, fields) => {
            
                // Save the cpt codes
                let codes = rows; 
        
                    db.pool.query(query3, (error, rows, fields) => {

                        // save the appointment-details
                        let appointments = rows; 

                            db.pool.query(query4, (error, rows, fields) => {

                                let appts = rows; 
                    
                                // replace codes with CPT + description 
                                let codesmap = {}
                                codes.map(code => {
                                    let id = parseInt(code.id_code, 10);
                        
                                    codesmap[id] = code["cpt_code"] + " " + code["description"];
                                })
                                
                                // Overwrite code id with CPT code + description 
                                appointmentCodes = appointmentCodes.map(person => {
                                    return Object.assign(person, {id_code: codesmap[person.id_code]})
                                })

                                // replace appointment ID with details
                                let appointmentmap = {}
                                appointments.map(appt => {
                                    let id = parseInt(appt.id_appointment, 10);
                        
                                    appointmentmap[id] = appt["id_appointment"] + " -- " + appt["visit_purpose"];
                                })
                        
                                // Overwrite the patient ID with the last name of patient 
                                appointmentCodes = appointmentCodes.map(member => {
                                    return Object.assign(member, {id_appointment: appointmentmap[member.id_appointment]})
                                })

                                
                                return res.render('appointment-codes', {appointmentCodes: appointmentCodes, codes: codes, appointments:appointments, appts:appts});
                            })
                    })
            })
    })
});

app.post('/add-appointment-code-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // run query in database
    query1 = `INSERT INTO appointments_has_codes (id_appointment, id_code) VALUES ('${data['input-appointment-code-appt']}', '${data['input-appointment-code-code']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // look for error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // redirect
        else
        {
            res.redirect('/appointment-codes.hbs');
        }
    })
})

// Delete Appointment-Codes
app.delete('/delete-appointment-code/:id', function(req, res) {
    let appointmentCodeID = req.params.id;
    
    let deleteQuery = `DELETE FROM appointments_has_codes WHERE id_appointment = ?`; 

    db.pool.query(deleteQuery, [appointmentCodeID], function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

  // Update Appointment-Code page
  app.put('/put-appointment-code-ajax', function(req,res,next){
    let data = req.body;
    
    let id_appointment = parseInt(data.id_appointment);
    let id_code = data.id_code;
  
    let queryUpdateApptCodes = `UPDATE appointments_has_codes SET id_code = ? WHERE id_appointment = ?`;
    let selectApptCodes = `SELECT * FROM appointments_has_codes WHERE id_appointment = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateApptCodes, [id_code, id_appointment], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectApptCodes, [id_appointment], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

/*
=======================================================================================================================
---------- Listener ---------------------------------------------------------------------------------------------------
=======================================================================================================================
*/

/*app.listen(PORT, function(){ 
    // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
*/

module.exports = app;