const express = require("express");
const nodemailer = require("nodemailer");
const Inquiry = require("../models/Inquiry.js");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// POST - Save inquiry & send emails
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  const newEnquiry = new Inquiry(req.body)
  await newEnquiry.save()
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
      subject: "Thanks for contacting Shodhavali",
      html: `
          <h2>Dear ${name},</h2>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Phone:</strong> ${phone}</p>
           <p>We have received your request. Our team will review it and get back to you soon. Thank you for your submission.</p>
          <br>
          <p>Regards,</p>
          <p><strong>Shodhavali</strong><br>
          An International Multidisciplinary Research Journal<br>
          <a href="https://www.shodhavali.com" target="_blank">www.shodhavali.com</a></p>`

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

module.exports = router;
