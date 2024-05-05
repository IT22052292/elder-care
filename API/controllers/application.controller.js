import Application from "../models/application.model.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";

dotenv.config();

export const submitapplication = async (req, res, next) => {
  const newApp = new Application({
    ...req.body,
  });
  try {
    const savedApp = await newApp.save();
    res.status(201).json(savedApp);
  } catch (error) {
    next(error);
  }
};

export const getapplications = async (req, res, next) => {
  try {
    const start = parseInt(req.query.start);
    const sort = req.query.order === "asc" ? 1 : -1;

    const application = await Application.find({
      ...(req.query.appId && { _id: req.query.appId }),
      ...(req.query.vacancyReference && { _id: req.query.vacancyReference }),
    })
      .sort({ vacancyReference: sort })
      .skip(start);

    const totalApp = await Application.countDocuments();

    //get accepted application count
    const query = { status: "ACCEPTED" };
    const acceptedCount = await Application.countDocuments(query);

    //get pending application count
    const query2 = { status: "PENDING" };
    const pendingCount = await Application.countDocuments(query2);

    res.status(200).json({
      totalApp,
      application,
      acceptedCount,
      pendingCount,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteapp = async (req, res, next) => {
  try {
    const deletedApp = await Application.findByIdAndDelete(req.params.appId);

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

    const rejectionEmail = {
      body: {
        name: deletedApp.fullName,
        intro:
          "We regret to inform you that your application for the job vacancy has been rejected.",
        table: {
          data: [
            { key: "Applicant Name", value: deletedApp.fullName },
            { key: "Job Vacancy", value: deletedApp.vacancyReference },
           
          ],
        },
        outro:
          "Thank you for your interest in our company. We wish you the best in your job search.",
      },
    };

    const emailBody = mailGenerator.generate(rejectionEmail);

    const mail = {
      from: {
        name: "Seni Care HR Unit",
        address: process.env.Email,
      },
      to: deletedApp.email,
      subject: "Your job vacancy application status",
      html: emailBody,
    };

    transporter.sendMail(mail, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Email sent successfully");
      }
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).send("Error deleting application");
  }
};

export const updateStatus = async(req,res,next)=>{

  try {

    const updatedStatus = await Application.findByIdAndUpdate(
      req.params.appId,
      {
        $set:{
          status: "ACCEPTED"
        }
      },
       { new: true }
    )
    res.status(200).json(updatedStatus);
    
  } catch (error) {
    next(error)
    
  }
}
