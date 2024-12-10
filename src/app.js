const express = require('express');
const dotenv = require('dotenv');
const equbRoutes = require('./routes/equbRouter');
const userRoutes = require('./routes/userRouter');


 dotenv.config();

 const app = express();

 app.use(express.json());

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));  
// }


 app.use('/api/equbs', equbRoutes);
 app.use('/api/users', userRoutes);


 module.exports = app;
