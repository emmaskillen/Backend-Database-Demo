// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/README.md

// Get a reference to the form for updating a code
let updateCodeForm = document.getElementById('update-code-form-ajax');

// Add event listener to the form
updateCodeForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields
    let inputCodeID = document.getElementById("mySelectCode");
    let inputCptCode = document.getElementById("input-cpt-code-update");
    let inputDescription = document.getElementById("input-description-update");
    let inputFee = document.getElementById("input-initial-fee-update");

    // Get values from the form fields
    let codeIDValue = inputCodeID.value;
    let cptCodeValue = inputCptCode.value;
    let descriptionValue = inputDescription.value;
    let feeValue = inputFee.value;

    // Create a data object to send
    let data = {
        id_code: codeIDValue,
        cpt_code: cptCodeValue,
        description: descriptionValue,
        initial_fee: feeValue
    };

    // Setup an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-code-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update the table row with the new data
            updateRow(xhttp.response, codeIDValue);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Function to update a row in the table
function updateRow(data, codeID) {
    let parsedData = JSON.parse(data);

    // Get a reference to the table
    let table = document.getElementById("codesTable");

    // Iterate through rows to find the matching code ID
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-codes") == codeID) {
            // Get the location of the row where we found the matching code ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Update the values in the table cells
            let tdCpt = updateRowIndex.getElementsByTagName("td")[1];
            tdCpt.innerHTML = parsedData[0].cpt_code;

            let tdDescription = updateRowIndex.getElementsByTagName("td")[2];
            tdDescription.innerHTML = parsedData[0].description;

            let tdFee = updateRowIndex.getElementsByTagName("td")[3];
            tdFee.innerHTML = parsedData[0].initial_fee;
        }
    }
}