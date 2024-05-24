
const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb+srv://saviosunny48:2TJsNwpNwqJX2aG3@cluster0.0zmwv1l.mongodb.net/');
connect.then(()=>{
    console.log("Database connection established hbducyydbbyub");
})
.catch(()=>{
    console.log("Database connection is not established");
})

// Define the schema for medicines
const MedicineSchema = new mongoose.Schema({
    medicines: [
        {
            medicine: {
                type: String,
                required: true
            },
            cost: {
                type: Number,
                required: true
            }
        }
    ]
});

// Create a model for the Medicine collection
const Medicine = mongoose.model('Medicine', MedicineSchema);
console.log(Medicine)

module.exports = Medicine;
