const mongoose = require('mongoose');

// Connect to the MongoDB database
const connect = mongoose.connect('mongodb+srv://saviosunnygodb.net/');

// Handle database connection status
connect.then(() => {
    console.log("Database connection established");
}).catch(error => {
    console.error("Error connecting to database:", error.message);
});

// Define schema for appointments
const Prescript= mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    
    Patient_ID: {
        type: String,
        required: true
    },
    Prescription: {
        type: String,
        required: true
    },
    Date:{
        type:Date,
        required: true

    },
    
    
});

// Create Appointment model
const Prescription= mongoose.model('Prescription', Prescript);
console.log(Prescription);

// Export the Appointment model
module.exports = Prescription;
