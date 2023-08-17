// Code Citation:
// Date: 8/2/23
// Cited from nodejs-starter-app from github osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// This function deletes an appointment code relationship based on the provided ID.
function deleteAppointmentCode(appointmentCodeID) {
    // Confirm with the user before proceeding with the deletion.
    if (confirm('Are you sure you want to delete this appointment code relationship?')) {
        // Initiate a DELETE request to the specified endpoint.
        fetch(`/delete-appointment-code/${appointmentCodeID}`, {
            method: 'DELETE'
        })
        .then(response => {
            // Check if the deletion was successful (status code 204).
            if (response.status === 204) {
                // Successful deletion, reload the page to reflect changes.
                location.reload();
            } else {
                // If deletion was not successful, log an error message.
                console.error('Failed to delete appointment code relationship.');
            }
        })
        .catch(error => {
            // Handle any errors that occur during the deletion process.
            console.error('Error deleting appointment code relationship:', error);
        });
    }
}
