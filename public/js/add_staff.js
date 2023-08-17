// Code Citation:
// Date: 8/14/23
// Cited from nodejs-starter-app from GitHub osu-cs340-ecampus
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Function to add a new row to the people table
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("people-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a new table row and cells for data
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let homeworldCell = document.createElement("TD");
    let ageCell = document.createElement("TD");

    // Create a cell for the delete button
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    firstNameCell.innerText = newRow.fname;
    lastNameCell.innerText = newRow.lname;
    homeworldCell.innerText = newRow.homeworld;
    ageCell.innerText = newRow.age;

    // Create a delete button for the row
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";

    // Attach a click event to the delete button
    deleteButton.onclick = function() {
        deletePerson(newRow.id);
    };

    // Append the delete button to the delete cell
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(homeworldCell);
    row.appendChild(ageCell);
    row.appendChild(deleteCell);

    // Add a custom row attribute to help identify the row later
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find the dropdown menu, create a new option, fill data in the option (full name, id),
    // then append the option to the dropdown menu so newly created rows via AJAX will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.fname + ' ' + newRow.lname;
    option.value = newRow.id;
    selectMenu.add(option);
    
    // End of new step 8 code.
}