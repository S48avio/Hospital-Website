const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb+srv://saviosunny48:2TJsNwpNwqJX2aG3@cluster0.0zmwv1l.mongodb.net/';

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Database connection established");
    })
    .catch((err) => {
        console.error("Database connection is not established", err);
    });

// Define the schema for symptoms
const SymptomSchema = new mongoose.Schema({
    symptom: String,
    average_time: Number
}, { collection: 'symptom' }); 

// Create a model for the Symptom collection
const Symptom = mongoose.model('symptom', SymptomSchema);

// Export the Symptom model
module.exports = Symptom;
