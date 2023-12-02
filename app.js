const express = require('express');
const cors = require("cors");
const app = express();
const multer = require('multer'); // For handling file uploads
const nodemailer = require('nodemailer'); // For sending emails
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const port = 3000;
app.use(express.static("public"));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});
app.get("/about", (req, res) => {
	res.sendFile(__dirname + "/public/about.html");
});
app.get("/contact", (req, res) => {
	res.sendFile(__dirname + "/public/contact.html");
});
app.get("/policies", (req, res) => {
	res.sendFile(__dirname + "/public/policies.html");
});
app.get("/projects", (req, res) => {
	res.sendFile(__dirname + "/public/projects.html");
});
app.get("/construction", (req, res) => {
	res.sendFile(__dirname + "/public/projects/construction.html");
});
app.get("/engineering", (req, res) => {
	res.sendFile(__dirname + "/public/projects/engineering.html");
});
app.get("/procurement", (req, res) => {
	res.sendFile(__dirname + "/public/projects/procurement.html");
});
app.get("/projectmgt", (req, res) => {
	res.sendFile(__dirname + "/public/projects/projectmgt.html");
});




// Middleware to handle form data
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage, limits: { fileSize: 7 * 1024 * 1024 }, }); // Use the defined storage

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    host: 'mail.fiscocompanies.com',
    auth: {
        user: 'quotation@fiscocompanies.com',
        pass: 'Abayomiusman1.',
    },
    port: 465,
    secure: true,
    debug: true,
});

// Your endpoint to handle the form
app.post('/submit-form', upload.array('file', 2), async (req, res) => {
    try {
        // Extract data from the form
        const { fullname, phone, email, service, message } = req.body;
        const filesArr = req.files;

        // Read content from the uploaded file
        let fileContent = '';
        let i = 1
for (const file of filesArr) {
  

        if (file && (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            // Handle PDF and Word
            if (file.mimetype === 'application/pdf') {
                const pdfData = await pdfParse(file.buffer);
            
                fileContent += `<strong><p><h1>FILE ${i}</strong></p></h1>` + pdfData.text + ":";
            } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
             
                const wordData = await mammoth.convertToHtml ({ buffer: file.buffer });
       
                fileContent += `<strong><p><h1>FILE ${i}</strong></p></h1>` +  wordData.value + ":"; 

            }
        } else {
            // Handle other file types if needed
            fileContent += 'Unsupported file type';
        }
        i += 1
}
console.log(fileContent);
        // Configure Nodemailer for sending emails
     
        // Configure email content
        const mailOptions = {
            from: 'quotation@fiscocompanies.com',
            to: 'quotation@fiscocompanies.com',
            subject: 'Form Submission',
            html: `
                <p><strong>Name:</strong> ${fullname}</p>
                <p><strong>Phone Number:</strong> ${phone}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Service Description:</strong> ${service}</p>
                <p><strong>File Content:</strong> ${fileContent}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Respond to the client
        res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/submit-contact-form', upload.any(),async (req, res) => {
    try {
        // Extract data from the form
        const { name, email, subject, message } = req.body;

        // Configure email content
        const mailOptions = {
            from: 'quotation@fiscocompanies.com',
            to: 'quotation@fiscocompanies.com',
            subject: `New Contact Form Submission - ${subject}`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Respond to the client
        res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
const MAILCHIMP_API_KEY = "d3cda6fc92e51b731212add030844019-us21";
const MAILCHIMP_LIST_ID = "45f3c6b592";
  
app.post("/subscribe", async (req, res) => {
  const email = req.body.email;

  if (!validateEmail(email)) {
    return res.status(401).json({ message: "Email not set" });
  }

  const data = {
    email_address: email,
    status: "subscribed",
    tags: ["Fans"],
  };

  try {
    const response = await fetch(
      `https://us21.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `apikey:${MAILCHIMP_API_KEY}`
          ).toString("base64")}`,
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      res.json({ success: true, message: "Subscription successful!" });
    } else {
      res.json({
        success: false,
        message: responseData.title || "Subscription failed.",
      });
    }
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(401).json({ success: false, message: "An error occurred." });
  }
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});

