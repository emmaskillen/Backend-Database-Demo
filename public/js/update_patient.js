// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/README.md

// Get the form element for updating a patient
let updatePatientForm = document.getElementById('update-patient-form-ajax');

// Add event listener for form submission
updatePatientForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting normally
    e.preventDefault();

    // Get references to form fields
    let IDName = document.getElementById("mySelect"); 
    let insuranceId = document.getElementById("id_insurance");
    let lastName = document.getElementById("input-last-name-update");
    let firstName = document.getElementById("input-first-name-update");
    let birthdate = document.getElementById("input-birthdate-update");
    let phone = document.getElementById("input-phone-update");
    let email = document.getElementById("input-email-update");
    let streetName = document.getElementById("input-street-name-update");
    let city = document.getElementById("input-city-update");
    let zipCode = document.getElementById("input-zip-code-update");
    
    // Get values from form fields
    let IDNameValue = IDName.value;
    let insuranceIdValue = insuranceId.value;
    let lastNameValue = lastName.value;
    let firstNameValue = firstName.value;
    let birthdateValue = birthdate.value;
    let phoneValue = phone.value;
    let emailValue = email.value;
    let streetNameValue = streetName.value;
    let cityValue = city.value;
    let zipCodeValue = zipCode.value;
    
    // Check if the IDNameValue is a valid number
    if (isNaN(IDNameValue)) {
        return; // Abort if IDNameValue is not a number
    }

    // Create an object with the data to send
    let data = {
        patient_id: IDNameValue,
        insurance_id: insuranceIdValue,
        last_name: lastNameValue,
        first_name: firstNameValue,
        birthdate: birthdateValue,
        phone: phoneValue,
        email: emailValue,
        street_name: streetNameValue,
        city: cityValue,
        zip_code: zipCodeValue
    }
    
    // Setup an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-patient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define how to handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                // Reload the page to show updated data
                location.reload();
            } else {
                console.log("There was an error with the input.");
            }
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});