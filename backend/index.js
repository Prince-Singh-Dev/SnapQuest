//Loading the required modules in index.js 
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
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

//Basic routes to test the servers
app.get('/',(req,res)=>{
    res.send("SnapQuest Backend is Running");
})

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