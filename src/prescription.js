const mongoose = require('mongoose');

// Connect to the MongoDB database
const connect = mongoose.connect('mongodb+srv://saviosunny48:2TJsNwpNwqJX2aG3@cluster0.0zmwv1l.mongodb.net/');

// Handle database connection status
connect.then(() => {
    console.log("Database connection established");
}).catch(error => {
    console.error("Error connecting to database:", error.message);
});


// Define schema for prescriptions


// Define schema for prescriptions
const prescriptionSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Patient_ID: {
        type: String,
        required: true
    },
    Prescription1: {
        Medicine: {
            type: String,
            required: true
        },
        Quantity: {
            type: Number,
            required: true
        },
        Timing: {
            Morning: {
                type: Boolean,
                default: false
            },
            Afternoon: {
                type: Boolean,
                default: false
            },
            Night: {
                type: Boolean,
                default: false
            }
        },
        Food: {
            type: String,
            required: true
        },
        Dosage: {
            type: String,
            required: true
        }
    },
   
});

// Create Prescription model
const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
