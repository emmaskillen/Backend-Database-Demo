// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    port            : '3306',
    user            : 'skillene',
    password        : 'Mimi1918!',
    database        : 'skillene'
})

// Export it for use in our applicaiton
module.exports.pool = pool;