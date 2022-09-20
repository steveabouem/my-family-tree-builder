const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./database/index.js');
const userRoutes = require('./routing/user/index');
const householdsRoutes = require('./routing/household/index');
// const taskRoutes = require('./task/index');
// const objectiveRoutes = require('./objective/index');

require('dotenv').config();

const app = express();
const PORT = 3001;

/*
*MIDDLEWARES
 */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

/*
* MODULES
 */
app.use('/api/users', userRoutes);
app.use('/api/households', householdsRoutes);
// app.use(taskRoutes);
// app.use(objectiveRoutes);

app.get('/', (req, res) => {
    res.send('test');
});

app.listen(PORT, () => {
  console.log('API Server live on port ', PORT);
})