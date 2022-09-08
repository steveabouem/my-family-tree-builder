const sql = require('mysql');

const db = sql.createConnection({
    user: 'root',
    host: 'localhost',
    password: "1234",
    database: 'family_tracker'
});

module.exports = db;