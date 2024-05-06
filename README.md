

# Hospital Website for Doctors

This project is a hospital website built for doctors using Node.js, Express, MongoDB, HTML, CSS, and JavaScript. The website provides essential features for doctors to manage appointments, access patient information, write medical reports, prescriptions, and receive AI-powered suggestions using GEMINI support.

## Features

- **Appointment Management**: Allows doctors to view appointments scheduled for the day.
- **Patient Information**: Provides access to the current problem and past medical history of patients from the hospital database.
- **Medical Reporting**: Enables doctors to write new medical reports for patients.
- **Prescription Writing**: Facilitates doctors in writing prescriptions for patients.
- **GEMINI Support**: Integrates GEMINI AI to analyze current and past patient reports and provide opinions, suggestions, etc., to the doctor.

## Technologies Used

- **Node.js**: A JavaScript runtime used for building server-side applications.
- **Express**: A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database used for storing patient information, medical reports, prescriptions, etc.
- **HTML**: The standard markup language for creating web pages.
- **CSS**: A style sheet language used for describing the presentation of a document written in HTML.
- **JavaScript**: A programming language that enables interactive web pages.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/S48avio/hospital-website.git
   ```

2. Navigate to the project directory:

   ```bash
   cd hospital-website
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and add the following:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/hospital_db
   ```

   Adjust the MongoDB URI as per your setup.

5. Start the server:

   ```bash
   npm start
   ```

6. Access the website:

   Open a web browser and navigate to `http://localhost:3000`.

## Usage

- Log in to the website using your credentials.
- Navigate through different sections to manage appointments, access patient information, write medical reports, prescriptions, and receive AI-powered suggestions.
- Utilize GEMINI support for analyzing patient reports and receiving opinions, suggestions, etc.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize the content according to your project's specifics and add any additional details you find relevant.

Let me know if you need further assistance or have any questions!
