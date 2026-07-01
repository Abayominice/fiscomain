const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const nodemailer = require("nodemailer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

const app = express();
const port = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, "public");
const maxUploadBytes = 10 * 1024 * 1024;
const allowedUploadTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.static(publicDir));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

const generalPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many subscription attempts. Please try again later." },
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: maxUploadBytes,
    files: 2,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedUploadTypes.has(file.mimetype)) {
      cb(new Error("Unsupported file type"));
      return;
    }
    cb(null, true);
  },
});

const transporter = nodemailer.createTransport({
  host: "mail.fiscocompanies.com",
  port: 465,
  secure: true,
  auth: {
    user: "enquiry@fiscocompanies.com",
    pass: "Abayomiusman1.",
  },
});

function sendPage(res, filePath) {
  res.sendFile(path.join(publicDir, filePath));
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function requireText(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

async function buildFileSummary(files) {
  let fileContent = "";

  for (const [index, file] of files.entries()) {
    if (file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(file.buffer);
      fileContent += `<strong><p><h1>FILE ${index + 1}</h1></p></strong>${pdfData.text}:`;
      continue;
    }

    if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const wordData = await mammoth.extractRawText({ buffer: file.buffer });
      fileContent += `<strong><p><h1>FILE ${index + 1}</h1></p></strong>${wordData.value}:`;
    }
  }

  return fileContent;
}

app.get("/", (req, res) => sendPage(res, "index.html"));
app.get("/about", (req, res) => sendPage(res, "about.html"));
app.get("/robots.txt", (req, res) => sendPage(res, "robots.txt"));
app.get("/sitemap.xml", (req, res) => sendPage(res, "sitemap.xml"));
app.get("/contact", (req, res) => sendPage(res, "contact.html"));
app.get("/policies", (req, res) => sendPage(res, "policies.html"));
app.get("/projects", (req, res) => sendPage(res, "projects.html"));
app.get("/construction", (req, res) => sendPage(res, "projects/construction.html"));
app.get("/engineering", (req, res) => sendPage(res, "projects/engineering.html"));
app.get("/procurement", (req, res) => sendPage(res, "projects/procurement.html"));
app.get("/projectmgt", (req, res) => sendPage(res, "projects/projectmgt.html"));

app.post("/submit-form", generalPostLimiter, upload.array("file", 2), async (req, res) => {
  try {
    const { fullname, phone, email, service, message } = req.body;
    const files = req.files || [];

    if (
      !requireText(fullname, 120) ||
      !requireText(phone, 40) ||
      !validateEmail(email) ||
      !requireText(service, 200) ||
      !requireText(message, 5000)
    ) {
      res.status(400).json({ error: "Invalid form submission." });
      return;
    }

    const fileContent = await buildFileSummary(files);
    await transporter.sendMail({
      from: "enquiry@fiscocompanies.com",
      to: "enquiry@fiscocompanies.com",
      subject: "Form Submission",
      html: `
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Phone Number:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service Description:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>File Content:</strong> ${fileContent}</p>
      `,
    });

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/submit-contact-form", generalPostLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      !requireText(name, 120) ||
      !validateEmail(email) ||
      !requireText(subject, 200) ||
      !requireText(message, 5000)
    ) {
      res.status(400).json({ error: "Invalid contact form submission." });
      return;
    }

    await transporter.sendMail({
      from: "enquiry@fiscocompanies.com",
      to: "enquiry@fiscocompanies.com",
      subject: `New Contact Form Submission - ${subject}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const mailchimpApiKey = "d3cda6fc92e51b731212add030844019-us21";
const mailchimpListId = "45f3c6b592";
const mailchimpServerPrefix = "us21";

app.post("/subscribe", subscribeLimiter, async (req, res) => {
  const { email } = req.body;

  if (!validateEmail(email)) {
    res.status(400).json({ message: "Email not set" });
    return;
  }

  try {
    const response = await fetch(
      `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`apikey:${mailchimpApiKey}`).toString("base64")}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          tags: ["Fans"],
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      res.json({ success: true, message: "Subscription successful!" });
      return;
    }

    res.json({
      success: false,
      message: responseData.title || "Subscription failed.",
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ error: error.message });
    return;
  }

  if (error && error.message === "Unsupported file type") {
    res.status(400).json({ error: error.message });
    return;
  }

  next(error);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
