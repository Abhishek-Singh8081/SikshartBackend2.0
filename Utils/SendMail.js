import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const sendEmail = async (to, subject, text) => {
  try {
    

    const transporter = nodemailer.createTransport({
      service: "Gmail", 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };


    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email send error:", error.message);
    throw error;
  }
};


export default sendEmail
