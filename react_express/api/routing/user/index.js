//  USER NAMESPACE
const express = require('express');
const router = express.Router();
const db = require('../../database');
const { initPlatform, validateNewUser } = require('./helpers');

// REGISTER
router.post('/new', (req, res) => {
  const response = { };
  const { first_name, last_name, email, password } = req.body;
  const statement = `INSERT INTO Users (first_name, last_name, email, password) VALUES ('${first_name}', '${last_name}', '${email}', '${password}')`;

  initPlatform().then(() => {
    const duplicates = validateNewUser(email);
    if (duplicates?.length > 0) {
      response.error = 'dupe';
    } else {
      db.query(statement, (err, r) => {
        if (err) {
          response.success = false;
          console.log('Unable to register ', err);
          throw err;
        } else {
          response.success = true;
          res.send(response);
        }
      });
    }
  })
});

router.get('/:id', (req, res) => {
  res.send('Info on household id: ', req.params.id);
});

module.exports = router;
