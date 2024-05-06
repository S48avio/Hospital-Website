const mongoose = require('mongoose');

// Connect to the MongoDB database
const connect = mongoose.connect('mongodb+srv://wv1l.mongodb.net/');

// Handle database connection status
connect.then(() => {
    console.log("Database connection established");
}).catch(error => {
    console.error("Error connecting to database:", error.message);
});

// Define schema for appointments
const Doctors= mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Doctor_ID: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Specialization: {
        type: String,
        required: true
    },
    Available: {
        type: Boolean,
        required: true
    },
    Rating:{
        type:Number,
        required: true

    },
    
   
    
    
});

// Create Appointment model
const Doctor= mongoose.model('Doctor', Doctors);
console.log(Doctor);

// Export the Appointment model
module.exports = Doctor;
