//  HOUSEHOLD NAMESPACE

const express = require('express');
const router = express.Router();
const db = require('../../database');
const { createTable } = require('../../database/queries/common');

// middleware that is specific to this router
// router.use((req, res, next) => {
//     console.log('Time: ', Date.now())
//     next()
// })
router.post('/new', (req, res) => {
    // TABLES SHOULD BE CREATED ON REGISTER
  createTable(
    'households', 'id AUTO_INCREMENT, name VARCHAR(255),  members JSON, objectives JSON, crated DATETIME, last_updated DATETIME, PRIMARY KEY id'
  );
  const tableData = req.body;

  db.query(statement, (e, r) => {
    if (e) throw e;

    res.send({
      success: true,
    });
  });
});

router.get('/index', (req, res) => {
  const statement = "SELECT * FROM households;";

  res.send('households list');
});

router.get('/:id', (req, res) => {
  res.send('Info on household id: ', req.params.id);
});

router.post('/:id', (req, res) => {
  const statement = 'INSERT into households ';
});

module.exports = router;
