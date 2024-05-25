const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const collection = require('./config.js');
const Appointment = require('./appointmentModel.js');
const Medical_records = require('./medicalrecord.js');
const Prescriptions = require('./prescription.js');
const Doctor = require('./doctor.js');
const axios = require('axios');
const Medicine = require('./medicine.js');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const accessTokenSecret = 'yourAccessTokenSecret'; // Replace with your actual secret key

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../views')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware for the root page
function authenticateToken(req, res, next) {
    const token = req.query.token;

    if (token == null) {
        return res.redirect('/');
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            return res.redirect('/');
        }
        req.user = user;
        next();
    });
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            password: req.body.password
        };
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect('/');
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("An error occurred. Please try again later.");
    }
});

app.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await collection.findOne({ name: username });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (password === user.password) {
            // Token expires in 4 seconds
            const accessToken = jwt.sign({ username: user.name }, accessTokenSecret, { expiresIn: '4s' });
            res.redirect(`/home?username=${username}&token=${accessToken}`);
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("An error occurred. Please try again later.");
    }
});

app.get('/home', authenticateToken, async (req, res) => {
    try {
        const systemDate = new Date();
        const { username } = req.query;
        console.log(username);
        const Appointments = await Appointment.find({ Doctor_ID: username });
        console.log(systemDate.toISOString().split('T')[0]);
        console.log(Appointments);

        const Doctors = await Doctor.findOne({ Doctor_ID: username });
        console.log(Doctors);
        console.log(Appointments);
        res.render('next', { Appointments, Doctors });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("An error occurred. Please try again later.");
    }
});

app.get('/appointment', async (req, res) => {
    try {
        const appoints = req.query.name;
        const appoint = await Appointment.find({ Name: appoints });
        const medical = await Medical_records.find({ Name: appoints });
        console.log(appoint);
        console.log(medical);

        // Extracting the description of the patient's current disease from the appointment dataset
        const description = appoint[0].description;
        const name = appoint[0].Name;
        const id = appoint[0].Patient_ID;

        const aggregatedMedicalRecords = medical.map(record => ({
            Name: record.Name,
            Patient_ID: record.Patient_ID,
            Prescription: record.Prescription,
            Findings: record.Findings
        }));
        console.log(aggregatedMedicalRecords);

        const genAI = new GoogleGenerativeAI('AIzaSyDrPrJ3cF1H4NV1zEfPyYNOdUJ2J2BUMSA'); // Replace with your actual Google API key
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Including the description in the prompt sent to Gemini
        const prompt = `Summarise the medical records  by first showing the patient name, id, current disease and also Provide an analysis of the patient's condition based on the following medical records. Patient's current disease: ${description}, Patient's Name is ${name} and id is ${id}. Remember to make your analysis accurate and never tell anything outside the medical record and also give some suggestions to the doctor, always follow the same text format:\n${JSON.stringify(aggregatedMedicalRecords)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text(); // Store the generated text
        console.log(generatedText);
        const medicineData = await Medicine.findOne(); // Assuming there's only one document in the Medicine collection

        if (!medicineData) {
            return res.status(404).send("Medicine data not found");
        }

        const savio = medicineData.medicines.map(item => ({
            medicine: item.medicine,
            cost: item.cost.$numberInt
        })); // Extracting medicine names and costs

        // Pass the generated text to the appointment.ejs page
        res.render('appointments', { appoint, medical, generatedText, savio });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("An error occurred. Please try again later.");
    }
});

app.post('/submitMedicalReport', async (req, res) => {
    try {
        const { name, age, description, startDate, patient_ID, findings, medicine, quantity, timing, food, dosage, Doctor_ID } = req.body;
        console.log(findings);
        console.log(medicine);
        console.log(dosage);
        // Get the current date with just the day and date
        const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
        const systemDate = new Date();
        // Convert timing and food to booleans
        const isMorning = timing === "Morning";
        const isAfternoon = timing === "Afternoon";
        const isNight = timing === "Night";
        const isBefore = food === "before";
        const isAfter = food === "after";

        const newMedicalRecord = new Medical_records({
            Name: name,
            Age: age,
            description: description,
            startDate: systemDate.toISOString().split('T')[0],
            Patient_ID: patient_ID,
            Prescription: medicine,
            Dosage: dosage,
            Findings: findings,
            Appoint_Date: currentDate // Set the date with just the day and date
        });

        const newPrescription = new Prescriptions({
            Name: name,
            Patient_ID: patient_ID,
            Prescription1: {
                Medicine: medicine,
                Quantity: quantity,
                Timing: {
                    Morning: isMorning,
                    Afternoon: isAfternoon,
                    Night: isNight
                },
                Food: isBefore ? 'Before' : 'After', // Convert food to string
                Dosage: dosage
            }
        });

        await newPrescription.save();
        await newMedicalRecord.save();
        const appointmentToDelete = await Appointment.findOneAndDelete({ Name: name });

        // Re-generate a new token to extend session after form submission
        const accessToken = jwt.sign({ username: Doctor_ID }, accessTokenSecret, { expiresIn: '4s' });

        res.redirect(`/home?username=${Doctor_ID}&token=${accessToken}`);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("An error occurred. Please try again later.");
    }
});

const port = 5000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});
