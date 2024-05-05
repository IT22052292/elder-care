import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Mailgen from "mailgen";

dotenv.config();

export const sendEmail = async (email, name, date, time) => {
  // Configure the transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.Email,
      pass: process.env.appPass,
    },
  });

 
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Seni Care HR Unit",
      link: " ",
    },
  });

  
  const emailContent = {
    body: {
      name,
      intro:
        "We would like to inform you that your application for the job vacancy has been selected for interviews.",
      table: {
        data: [
          { key: "Applicant Name", value: name },
          { key: "Interview Date", value: date },
          { key: "Interview Time", value: time },
        ],
      },
      outro:
        "Thank you for your interest in our company. We wish you the best in your job interview.",
    },
  };

  const emailBody = mailGenerator.generate(emailContent);

 
  const mailOptions = {
    from: process.env.Email,
    to: email,
    subject: "Your job vacancy application status",
    html: emailBody,
  };

  try {
    
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    // Return a JSON response indicating success
    return {
      status: "success",
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
