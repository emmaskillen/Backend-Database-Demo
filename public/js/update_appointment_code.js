// Code Citation:
// Date: 8/11/23
// Cited from nodejs-starter-app from github osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/README.md

// Get the form element for updating appointment codes
let updateApptCodeForm = document.getElementById('update-appointment-code-form-ajax');

// Attach an event listener to the form submission
updateApptCodeForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get references to form input fields
    let inputAppointmentID = document.getElementById("input-appointment-code-appt");
    let inputCodeID = document.getElementById("input-appointment-code-code");

    // Extract values from the input fields
    let appointmentIDValue = inputAppointmentID.value;
    let codeIDValue = inputCodeID.value;
    
    // Create a JavaScript object to hold the data we want to send
    let data = {
        id_appointment: appointmentIDValue,
        id_code: codeIDValue,
    }
    
    // Set up an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-appointment-code-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update the table with the new data
            updateRow(xhttp.response, id_appointment);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the AJAX request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Function to update a row in the table with new data
function updateRow(data, appointmentID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("appointment-codes");

    // Loop through table rows to find a matching appointment ID
    for (let i = 0, row; row = table.rows[i]; i++) {
       
       if (table.rows[i].getAttribute("data-appt") == appointmentID) {

            // Get the location of the row with the matching appointment ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get the <td> element that contains the id_code value
            let tdCode = updateRowIndex.getElementsByTagName("td")[1];

            // Update the id_code value in the table cell
            tdCode.innerHTML = parsedData[0].id_code; 
       }
    }
}