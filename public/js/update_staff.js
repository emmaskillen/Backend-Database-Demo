// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/README.md

// Get the form element for updating staff
let updateStaffForm = document.getElementById('update-staff-form-ajax');

// Attach a submit event listener to the form
updateStaffForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields to retrieve data
    let IDName = document.getElementById("mySelect"); 
    let lastName = document.getElementById("input-last-name-update");
    let firstName = document.getElementById("input-first-name-update");
    let phone = document.getElementById("input-phone-update");
    let email = document.getElementById("input-email-update");

    // Get values from form fields
    let IDNameValue = IDName.value;
    let lastNameValue = lastName.value;
    let firstNameValue = firstName.value;
    let phoneValue = phone.value;
    let emailValue = email.value;

    // Check if IDNameValue is not a number (NULL check)
    if (isNaN(IDNameValue)) {
        return;
    }

    // Create a JavaScript object with data to send
    let data = {
        staff_id: IDNameValue,
        last_name: lastNameValue,
        first_name: firstNameValue,
        phone: phoneValue,
        email: emailValue
    };

    // Set up an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-staff-ajax", true);
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

// Function to update a row in the staff table
function updateRow(data, staffID, object) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("staff-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows
        if (table.rows[i].getAttribute("data-value") == staffID) {
            // Get the location of the row where we found the matching staff ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Update values in the corresponding table cells
            updateRowIndex.getElementsByTagName("td")[1].innerHTML = object.last_name;
            updateRowIndex.getElementsByTagName("td")[2].innerHTML = object.first_name;
            updateRowIndex.getElementsByTagName("td")[3].innerHTML = object.phone;
            updateRowIndex.getElementsByTagName("td")[4].innerHTML = object.email;
        }
    }
}