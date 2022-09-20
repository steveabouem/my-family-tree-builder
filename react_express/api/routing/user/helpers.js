const db = require('../../database');

const initPlatform = () => {
  const usersTableStatement = new Promise((resolve, reject) => {
    const statement = 'CREATE TABLE IF NOT EXISTS Users (id INT AUTO_INCREMENT, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, created DATETIME, password TINYTEXT, PRIMARY KEY (id))';
    db.query(statement, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  const householdsTableStatement = new Promise((resolve, reject) => {
    const statement = 'CREATE TABLE IF NOT EXISTS Households (id INT AUTO_INCREMENT, name VARCHAR(255),  members JSON, objectives JSON, crated DATETIME, last_updated DATETIME, PRIMARY KEY (id))';
    db.query(statement, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  const expensesTableStatement = new Promise((resolve, reject) => {
    const statement = 'CREATE TABLE IF NOT EXISTS Expenses (id INT AUTO_INCREMENT, goal_id INT,  description TEXT(500),  task INT,  date_created DATETIME, PRIMARY KEY (id))';
    db.query(statement, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  const objectivesTableStatement = new Promise((resolve, reject) => {
    const statement = 'CREATE TABLE IF NOT EXISTS Objectives (id INT AUTO_INCREMENT, created_by INT,  description TEXT(500),  tasks JSON,  date_created DATETIME, cost INT, PRIMARY KEY (id))';
    db.query(statement, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  const tasksTableStatement = new Promise((resolve, reject) => {
    const statement = 'CREATE TABLE IF NOT EXISTS Tasks (id INT AUTO_INCREMENT, date_created DATETIME,  description TEXT(500),  objective INT, PRIMARY KEY (id))';
    db.query(statement, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  return Promise.all([
    usersTableStatement,
    householdsTableStatement,
    expensesTableStatement,
    objectivesTableStatement,
    tasksTableStatement,
  ]);
};

const validateNewUser = (email) => {
  const check = `SELECT * FROM tracker.Users WHERE email = '${email}'`;
  db.query(check, (err, r) => {
    if (err) {
      console.log('Unable to check ', err);
    } else {
      return r;
    }
  });
};

const helpers = { initPlatform, validateNewUser };
module.exports = helpers;
