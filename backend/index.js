//Loading the required modules in index.js 
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const lessonProgressRoutes = require('./routes/lessonProgressRoutes');
const cors = require('cors');


// Loading environment variables from .env file 
dotenv.config();

// Creating instance of Express App that is going to be use in the backend
const app = express();

//Locating Middlewares for the App
app.use(cors());          //Basically enabling Cors for the Backend and Frontend Communication 
app.use(express.json());  //Parse Incoming JSON request bodies

//Routes
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/lessons',lessonRoutes);
app.use('/api/lessons',lessonProgressRoutes);
app.use('/api/submissions',require('./routes/submissionRoutes'));
app.use('/api/admin' , require('./routes/adminRoutes'));

//Uploads route
app.use('/uploads',express.static('uploads'));

//Basic routes to test the servers
app.get('/',(req,res)=>{
    res.send("SnapQuest Backend is Running");
})

mongoose.set("strictPopulate",false);

//Connecting the backend to MongoDB 
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('MongoDB Connection Successfull');

        //Starting the server , once the MongoDB connected 
        app.listen(process.env.PORT,() =>{
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err)=>{
        console.error('Mongo Connection Failed : ', err.message);
    });