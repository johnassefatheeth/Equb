const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser')
const equbRoutes = require('./routes/equbRouter');
const userRoutes = require('./routes/userRouter');
const authRoutes=require('./routes/authroutes')
const adminRoutes = require('./routes/adminRouter');
const cors = require('cors');


 dotenv.config();

 const app = express();
 app.use(cors({
    origin: '*', // Allow requests from all origins
    methods: ['*'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow sending cookies
}));


 app.use(express.json());
 app.use(cookieParser())
 app.use(express.urlencoded({ extended: true }));

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));  
// }

 app.use('/api/admin', adminRoutes);
 app.use('/api/equbs', equbRoutes);
 app.use('/api/users', userRoutes);
 app.use('/api/users', authRoutes);



 module.exports = app;
