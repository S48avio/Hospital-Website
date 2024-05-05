
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const collection = require('./config.js');
const Appointment = require('./appointmentModel.js');
const Medical_records = require('./medicalrecord.js');
const prescriptions = require('./prescription.js');
const Doctor = require('./doctor.js');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../views')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
            return res.send("Username not found");
        }

        if (password === user.password) {
            return res.redirect(`/home?username=${username}`);
        } else {
            return res.send("Wrong password");
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.send("An error occurred. Please try again later.");
    }
});

app.get('/home', async (req, res) => {
    try {
        const systemDate = new Date();
        const { username } = req.query;
        console.log(username);
        const Appointments = await Appointment.find({ Appoint_Date: systemDate.toISOString().split('T')[0]} && {Doctor_ID: username});
        console.log(systemDate.toISOString().split('T')[0]);
       
        
        const Doctors = await Doctor.findOne({ Doctor_ID: username });
        console.log(Doctors);        
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
        console.log(appoint)
        console.log(medical)
        
        // Extracting the description of the patient's current disease from the appointment dataset
        const description = appoint[0].description;
        const name=appoint[0].Name;
        const id=appoint[0].Patient_ID;

        const aggregatedMedicalRecords = medical.map(record => ({
            Name: record.Name,
            Patient_ID: record.Patient_ID,
            Prescription: record.Prescription,
            Findings: record.Findings
        }));
        console.log(aggregatedMedicalRecords);
        
        const genAI = new GoogleGenerativeAI('AIzaSyDrPrJ3cF1H4NV1zEfPyYNOdUJ2J2BUMSA');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Including the description in the prompt sent to Gemini
        const prompt = `Summarise the medical records  by first showing the patient name,id,current disease and also Provide an analysis of the patient's condition based on the following medical records. Patient's current disease: ${description},Patient's Name is ${name} and id is ${id}. Remember to make your analysis accurate and never tell anything outside the medical record and  also give some suggestions to the doctor,always follow same text format:\n${JSON.stringify(aggregatedMedicalRecords)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text(); // Store the generated text
        console.log(generatedText);

        // Pass the generated text to the appointment.ejs page
        res.render('appointments', { appoint, medical, generatedText });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("An error occurred. Please try again later.");
    }
});

app.post('/submitMedicalReport', async (req, res) => {
    try {
        const { name, age, description, startDate, patient_ID, prescription, findings } = req.body;

        // Get the current date with just the day and date
        const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });

        const newMedicalRecord = new Medical_records({
            Name: name,
            Age: age,
            description: description,
            startDate: startDate,
            Patient_ID: patient_ID,
            Prescription: prescription,
            Findings: findings,
            Appoint_Date: currentDate // Set the date with just the day and date
        });

        const newPrescript = new prescriptions({
            Name: name,
            Patient_ID: patient_ID,
            Prescription: prescription,
            Date: currentDate // Set the date with just the day and date
        });

        await newPrescript.save();
        await newMedicalRecord.save();
        const appointmentToDelete = await Appointment.findOneAndDelete({ Name: name });

        res.redirect('/home');
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("An error occurred. Please try again later.");
    }
});


const port = 5000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});