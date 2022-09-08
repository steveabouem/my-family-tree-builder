/*
 * HOUSEHOLD NAMESPACE
 *
  */
const express = require('express');
const router = express.Router();
const db = require('../../../database');

// middleware that is specific to this router
// router.use((req, res, next) => {
//     console.log('Time: ', Date.now())
//     next()
// })
router.post('/create_table', (req, res) => {
    let statement = "CREATE TABLE households";
    db.query(statement, (e, r) => {
        if (e) throw e;
        
        res.send({
            success: true
        });
        
    })
})


router.get('/index', (req, res) => {
    res.send('households list');
})

router.get('/:id', (req, res) => {
    res.send('Info on household id: ', req.params.id);
})

router.post('/:id', (req, res) => {
    const statement = "INSERT into households "
});

module.exports = router;