const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { Resend } = require("resend");

const router = express.Router();

const upload = multer({ dest: "/tmp" });

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    console.log("Sending email to:", process.env.TEST_EMAIL); // ✅ correct place

    const { name, email, phone, position, experience, message } = req.body;
    const file = req.file;

    await resend.emails.send({
      from: "onboarding@resend.dev",  // after domain use this  from: "careers@yourdomain.com",
      to: [process.env.TEST_EMAIL],
      subject: `New Career Application - ${position}`,
      html: `
        <h2>New Career Application</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Position:</b> ${position}</p>
        <p><b>Experience:</b> ${experience}</p>
        <p><b>Message:</b> ${message}</p>
      `,
      attachments: file
        ? [
            {
              filename: file.originalname,
              content: fs.readFileSync(file.path),
            },
          ]
        : [],
    });

    if (file) fs.unlinkSync(file.path);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;