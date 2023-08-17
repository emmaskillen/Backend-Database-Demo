// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// Function to handle the deletion of a patient
function deletePatient(patientID) {
    // Confirm the deletion with a popup - original work
    if (confirm('Are you sure you want to delete this patient?')) {
        // Use the fetch API to send a DELETE request to the server
        fetch(`/delete-patient/${patientID}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                // Successful deletion, reload the page to reflect changes
                location.reload();
            } else {
                console.error('Failed to delete patient.');
            }
        })
        .catch(error => console.error('Error deleting patient:', error));
    }
}