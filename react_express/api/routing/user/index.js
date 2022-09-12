//  USER NAMESPACE

const express = require('express');
const router = express.Router();
const db = require('../../database');
const { createTable } = require('../../database/queries/common');

router.post('/new', (req, res) => {
  // TABLES SHOULD BE CREATED ON REGISTER
  const response = {success: false};
  const { name, email, password } = req.body;
  createTable('family_tracker.households', 'id AUTO_INCREMENT, name VARCHAR(255),  members JSON, objectives JSON, crated DATETIME, last_updated DATETIME, PRIMARY KEY id');
  const statement = `INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${password})`;
  db.query(statement, (e, r) => {
    if (e) throw e;

    response.data = r;
    response.success = true;
  });

  res.send(response);
});

router.get('/:id', (req, res) => {
  res.send('Info on household id: ', req.params.id);
});

module.exports = router;
