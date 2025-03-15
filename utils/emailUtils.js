const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send OTP Email
 * @param {string} email - Recipient's email
 * @param {string} otp - OTP Code
 */
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"MSV Restaurant" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your One-Time Password (OTP) is: <b>${otp}</b></p>
        <p>This OTP is valid for only <b>${process.env.OTP_EXPIRATION || 5} minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p>Best Regards,<br>MSV Restaurant</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email} and otp is ${otp}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending OTP email");
  }
};

module.exports = { sendOTPEmail };
