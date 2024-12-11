const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser')
const equbRoutes = require('./routes/equbRouter');
const userRoutes = require('./routes/userRouter');
const authRoutes=require('./routes/authroutes')


 dotenv.config();

 const app = express();

 app.use(express.json());
 app.use(cookieParser())
 app.use(express.urlencoded({ extended: true }));

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));  
// }


 app.use('/api/equbs', equbRoutes);
 app.use('/api/users', userRoutes);
 app.use('/api/users', authRoutes);


 module.exports = app;
