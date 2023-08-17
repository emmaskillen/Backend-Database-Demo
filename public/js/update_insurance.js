// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/README.md

// Get the form element we need to modify
let updateInsuranceForm = document.getElementById('updateInsuranceForm');

// Attach event listener to the form for handling updates
updateInsuranceForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields' values
    let insuranceID = document.getElementById("insuranceID").value;
    let orgName = document.getElementById("orgName").value;
    let memberID = document.getElementsByName('member-id')[0].value;
    let groupNumber = document.getElementsByName('group-number-update')[0].value;

    // Create a JavaScript object to hold the data we want to send
    let data = {
        insurance_id: insuranceID,
        org_name: orgName,
        member_id: memberID,
        group_number: groupNumber
    }

    // Setup an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-insurance-ajax", true);
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

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Function to update the row with new insurance data
function updateInsuranceRow(data, insuranceID, object) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("insurance-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows
        if (table.rows[i].getAttribute("data-value") == insuranceID) {
            // Get the location of the row with the matching insurance ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get the table cells for organization name, member ID, and group number
            let tdOrgName = updateRowIndex.getElementsByTagName("td")[1];
            let tdMemberID = updateRowIndex.getElementsByTagName("td")[2];
            let tdGroupNumber = updateRowIndex.getElementsByTagName("td")[3];

            // Update the values in the cells with the new data
            tdOrgName.innerHTML = object.org_name;
            tdMemberID.innerHTML = object.member_id;
            tdGroupNumber.innerHTML = object.group_number;
        }
    }
}

// Function to update the current insurance information
function updateCurrentInsurance() {
    var selectedInsurance = document.getElementById('input-patient-insurance');
    var currentInsuranceField = document.getElementById('id_insurance');
    
    // Get the selected option
    var selectedOption = selectedInsurance.options[selectedInsurance.selectedIndex];
    
    // Get the data-insuranceid attribute value from the selected option
    var insuranceId = selectedOption.getAttribute('data-insuranceid');
    
    // Update the Current Insurance ID field with the extracted insurance ID
    currentInsuranceField.value = insuranceId === 'self-pay' ? 'Self Pay' : insuranceId;
}