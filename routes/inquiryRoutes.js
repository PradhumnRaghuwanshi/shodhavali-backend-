const express =   require("express");
const nodemailer =   require("nodemailer");
const Inquiry =   require("../models/Inquiry.js");
const dotenv =   require("dotenv");

dotenv.config();
const router = express.Router();

// POST - Save inquiry & send emails
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Name, email, and phone are required" });
  }

  try {
    // Nodemailer transporter for your official email
    const transporter = nodemailer.createTransport({
      service: "gmail", // can change to Outlook, Yahoo, etc.
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS
      }
    });

    // 1️⃣ Send email to admin
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Inquiry Received",
      html: `
        <h2>New Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `
    });

    // 2️⃣ Send confirmation email to user
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Thanks for contacting Shodavli",
      html: `
        <h2>Dear ${name},</h2>
        <p>We have received your inquiry. Our team will get back to you soon.</p>
        <p><strong>Your Details:</strong></p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
      `
    });

    res.status(200).json({ message: "Inquiry submitted and emails sent" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

// GET - List all inquiries (for Admin Panel)
router.get("/", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ date: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

module.exports =  router;
