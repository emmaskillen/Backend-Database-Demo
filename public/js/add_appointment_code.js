// Code Citation:
// 08/14/2023
// Template from nodejs-starter-app from GitHub user: currym-osu
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%205%20-%20Adding%20New%20Data/README.md

// Get the objects we need to modify
let addAppointmentCodeForm = document.getElementById('add-appointment-code-form-ajax');

// Modify the objects we need
addAppointmentCodeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAppointmentID = document.getElementByName("input-appointment-code-appt");
    let inputCodeID = document.getElementByName("input-appointment-code-code");

    // Get the values from the form fields
    let appointmentIDValue = inputAppointmentID.value;
    let codeIDValue = inputCodeID.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        appointmentID: appointmentIDValue,
        codeID: codeIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-appointment-code-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAppointmentID.value = '';
            inputCodeID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("appointment-codes");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let appointmentIDCell = document.createElement("TD");
    let codeIDCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    appointmentIDCell.innerText = newRow.appointmentID;
    codeIDCell.innerText = newRow.codeID;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAppointmentCode(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(appointmentIDCell);
    row.appendChild(codeIDCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-appt', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}