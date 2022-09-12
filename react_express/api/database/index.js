const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mypass',
  database: 'family_tracker'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});