// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Event listener to ensure DOM content is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {

    // Get references to form and button elements
    let addInsuranceForm = document.getElementById('add-insurance-form'); // Form element
    let saveInsuranceButton = document.getElementById('saveInsurance'); // Button element

    // Modify the form submission behavior
    saveInsuranceButton.addEventListener("click", function () {
        addInsuranceForm.submit(); // Trigger the form submission
    });

    // Alternatively, you can attach the event directly to the form
    addInsuranceForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the form from submitting normally

        // Get form fields
        let insuranceName = document.getElementById('insurance-name').value;
        let memberID = document.getElementsByName('member-ID')[0].value;
        let groupNumber = document.getElementsByName('add-group-number')[0].value;

        // Create the data object to send
        let data = {
            'insurance-name': insuranceName,
            'member-id': memberID,
            'group-number': groupNumber
        };

        // Setup AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/add-insurance-form", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Handle response
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    // Assuming response contains the updated insurance data, you can update table
                    updateInsuranceTable(xhttp.response);
                } else {
                    console.log("Error adding insurance");
                }
            }
        };

        // Send the request
        xhttp.send(JSON.stringify(data));
    });

    // Update the insurance table with new data and display submitted information
    function updateInsuranceTable(data) {
        let insuranceTable = document.getElementById("insuranceTable");
        let newRow = insuranceTable.insertRow();
        let newData = JSON.parse(data)[0]; // Since newData is an array of one item

        // Populate cells with data
        newRow.insertCell(0).innerText = newData.id_insurance;
        newRow.insertCell(1).innerText = newData.org_name;
        newRow.insertCell(2).innerText = newData.member_id;
        newRow.insertCell(3).innerText = newData.group_number;

        // Display submitted information
        document.getElementById("submitted-insurance-name").textContent = newData.org_name;
        document.getElementById("submitted-member-id").textContent = newData.member_id;
        document.getElementById("submitted-group-number").textContent = newData.group_number;

        // Clear form fields
        document.getElementById('insurance-name').value = '';
        document.getElementsByName('member-ID')[0].value = '';
        document.getElementsByName('add-group-number')[0].value = '';
    }
});