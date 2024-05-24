const mongoose = require('mongoose');

// Connect to the MongoDB database
const connect = mongoose.connect('mongodb+srv://saviosunny48:2TJsNwpNwqJX2aG3@cluster0.0zmwv1l.mongodb.net/');

// Handle database connection status
connect.then(() => {
    console.log("Database connection established");
}).catch(error => {
    console.error("Error connecting to database:", error.message);
});

// Define schema for appointments
const AppointmentSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    Patient_ID: {
        type: String,
        required: true
    },
    Appointment_ID: {
        type: String,
        required: true
    },
    Doctor_ID:{
        type:String,
    required: true    },
    Token: {
        type:Number,
        required: true
    },
    Appoint_Date:{
        type:String,
        required: true
    },
    
    
})

// Create Appointment model
const Appointment = mongoose.model('Appointment', AppointmentSchema);
console.log(Appointment);

// Export the Appointment model
module.exports = Appointment;
