// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%207%20-%20Dynamically%20Deleting%20Data/README.md

// Function to handle the deletion of a staff member
function deleteStaff(staffId) {
    // Confirm the deletion with a popup - original work
    if (confirm('Are you sure you want to delete this staff member?')) {
        // Use the fetch API to send a DELETE request to the server
        fetch(`/delete-staff/${staffId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                // Successful deletion, reload the page to reflect changes
                location.reload();
            } else {
                console.error('Failed to delete staff member.');
            }
        })
        .catch(error => console.error('Error deleting staff member:', error));
    }
}