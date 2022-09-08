const express = require('express');
const db = require('../database/index.js');
const morgan = require('morgan');
// const userRoutes = require('./user/index');
const householdsRoutes = require('./routing/household/index.js');
// const taskRoutes = require('./task/index');
// const objectiveRoutes = require('./objective/index');

const app = express();
const PORT = 3001;

/*
*MIDDLEWARES
 */
app.use(morgan('dev'));

/*
* MODULES
 */
// app.use(userRoutes);
app.use('/households', householdsRoutes);
// app.use(taskRoutes);
// app.use(objectiveRoutes);

app.get('/', (req, res) => {
    res.send('test');
});

app.listen(PORT, () => {
    console.log('API Server live on port ', PORT);
})