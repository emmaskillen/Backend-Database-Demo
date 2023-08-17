// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from github osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/README.md

// Get the form element for updating appointment information
let updateAppointmentForm = document.getElementById('update-appointment-form-ajax');

// Attach an event listener to the form submission
updateAppointmentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get references to form input fields
    let inputAppointmentID = document.getElementById("mySelectAppointment");
    let inputPatientID = document.getElementById("id_patient");
    let inputStaffID = document.getElementById("id_staff");
    let inputApptDate = document.getElementById("input-apptDate-update");
    let inputApptTime = document.getElementById("input-apptTime-update");
    let inputPurpose = document.getElementById("input-purpose-update");
    
    // Extract values from the input fields
    let appointmentIDValue = inputAppointmentID.value;
    let patientIDValue = inputPatientID.value;
    let staffIDValue = inputStaffID.value;
    let apptDateValue = inputApptDate.value;
    let apptTimeValue = inputApptTime.value;
    let purposeValue = inputPurpose.value;
    
    // Check if the appointmentIDValue is a valid number before proceeding
    if (isNaN(appointmentIDValue)) 
    {
        return;  // Abort if appointmentIDValue is not a valid number
    }

    // Create a JavaScript object to hold the data we want to send
    let data = {
        appointment_id: appointmentIDValue,
        patient_id: patientIDValue,
        staff_id: staffIDValue,
        appointment_date: apptDateValue,
        appointment_time: apptTimeValue,
        purpose: purposeValue
    }
    
    // Set up an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-appointment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Reload the current page to show updated data
            location.reload();
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the AJAX request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Function to update a row in the table with new data
function updateRow(data, appointmentID, object){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("appointmentTable");

    console.log(parsedData);
    console.log(data.inputPurpose);

    for (let i = 0, row; row = table.rows[i]; i++) {
       // Iterate through rows
       // Rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == appointmentID) {

            // Get the location of the row where we found the matching appointment ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get the <td> element that contains the patient ID
            let tdPatient = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign patient ID
            tdPatient.innerHTML = object.patient_id;

            // Get the <td> element that contains the staff ID
            let tdStaff = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign staff ID
            tdStaff.innerHTML = object.staff_id;

            // Get the <td> element that contains the appointment date
            let tdDate = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign appointment date
            tdDate.innerHTML = object.appointment_date;

            // Get the <td> element that contains the appointment time
            let tdTime = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign appointment time
            tdTime.innerHTML = object.appointment_time;

            // Get the <td> element that contains the purpose
            let tdPurpose = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign purpose
            tdPurpose.innerHTML = object.purpose;
       }
    }
}