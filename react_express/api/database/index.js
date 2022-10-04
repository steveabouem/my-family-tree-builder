const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpass',
  database: 'tracker',
});

connection.connect((err) => {
  if (err) throw err;

  console.log('New database created');
});

module.exports = connection;
