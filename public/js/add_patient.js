// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Event listener to ensure DOM content is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {

    // Get references to form and button elements
    let addInsuranceForm = document.getElementById('add-insurance-form');
    let saveInsuranceButton = document.getElementById('saveInsurance');

    // Modify the form submission behavior
    saveInsuranceButton.addEventListener('click', function () {
        addInsuranceForm.submit(); // Trigger the form submission
    });

    // Attach event listener directly to the form to handle submission
    addInsuranceForm.addEventListener('submit', function (e) {
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
        xhttp.open('POST', '/add-insurance-form', true);
        xhttp.setRequestHeader('Content-type', 'application/json');

        // Handle response
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    // Assuming response contains the updated insurance data, you can update table
                    updateInsuranceTable(xhttp.response);
                } else {
                    console.log('Error adding insurance');
                }
            }
        };

        // Send the request
        xhttp.send(JSON.stringify(data));
    });

    // Update the insurance table with new data and display submitted information
    function updateInsuranceTable(data) {
        let insuranceTable = document.getElementById('insuranceTable');
        let newRow = insuranceTable.insertRow();
        let newData = JSON.parse(data)[0]; // Since newData is an array of one item

        // Populate cells with data
        newRow.insertCell(0).innerText = newData.id_insurance;
        newRow.insertCell(1).innerText = newData.org_name;
        newRow.insertCell(2).innerText = newData.member_id;
        newRow.insertCell(3).innerText = newData.group_number;

        // Display submitted information
        document.getElementById('submitted-insurance-name').textContent = newData.org_name;
        document.getElementById('submitted-member-id').textContent = newData.member_id;
        document.getElementById('submitted-group-number').textContent = newData.group_number;

        // Update the "Add a New Patient" form fields with the new insurance data
        document.getElementById('input-patient-insurance').value = newData.id_insurance;

        // Clear form fields
        document.getElementById('insurance-name').value = '';
        document.getElementsByName('member-ID')[0].value = '';
        document.getElementsByName('add-group-number')[0].value = '';
    }

    // Function to add a patient row to the table
    function addPatientRow(data) {
        // Get a reference to the current table on the page and clear it out.
        let currentTable = document.getElementById('patients-table');

        // Create a row and cells
        let row = document.createElement('TR');
        let idCell = document.createElement('TD');
        let insuranceCell = document.createElement('TD');
        let firstNameCell = document.createElement('TD');
        let lastNameCell = document.createElement('TD');
        let birthdateCell = document.createElement('TD');
        let phoneCell = document.createElement('TD');
        let emailCell = document.createElement('TD');
        let streetCell = document.createElement('TD');
        let cityCell = document.createElement('TD');
        let zipCell = document.createElement('TD');

        // Fill the cells with correct data
        idCell.innerText = data.id_patient;
        insuranceCell.innerText = data.id_insurance;
        firstNameCell.innerText = data.first_name;
        lastNameCell.innerText = data.last_name;
        birthdateCell.innerText = data.birthdate;
        phoneCell.innerText = data.phone_number;
        emailCell.innerText = data.email;
        streetCell.innerText = data.street_name;
        cityCell.innerText = data.city;
        zipCell.innerText = data.zip_code;

        // Add the cells to the row
        row.appendChild(idCell);
        row.appendChild(insuranceCell);
        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(birthdateCell);
        row.appendChild(phoneCell);
        row.appendChild(emailCell);
        row.appendChild(streetCell);
        row.appendChild(cityCell);
        row.appendChild(zipCell);

        // Clear the selected option of the "Add a New Patient" insurance dropdown
        document.getElementById('input-patient-insurance').value = 'select-insurance';

        // Add a custom row attribute so the deleteRow function can find a newly added row
        row.setAttribute('data-value', data.id_patient);

        // Add the row to the table
        currentTable.appendChild(row);
    }

    // Function to handle the form submission for adding a patient
    document.getElementById('add-patient-form').addEventListener('submit', function (event) {
        event.preventDefault();

        // Get the form data
        const formData = new FormData(this);

        // Send an AJAX request to the server
        fetch('/add-patient', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Update the table with the new patient data
                addPatientRow(data);

                // Reset the form fields
                this.reset();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

});