import { dotenvVar } from "../config.js";
import nodemailer from "nodemailer"
import mongoose from 'mongoose';
import { generatePDF } from "./pdfgenerate.js";




 async function sendEmail(pdfBuffer) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: dotenvVar.USER_MAILER,
        pass: dotenvVar.PASS_MAILER
      }
    });
  
    const mailOptions = {
      from: dotenvVar.PASS_MAILER,
      to: 'anmol222006@gmail.com',
      subject: 'Daily Issue Report',
      text: 'Attached is the daily issue report.',
      attachments: [
        {
          filename: 'issues_report.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
  
    await transporter.sendMail(mailOptions);
  }
  
  async function runJob() {
    try {
        console.log("hello");
        try{
       await  mongoose.connect(dotenvVar.MONGODB_URI) // Use `process.env` for dotenv variables
        }catch(err){
            console.log(err);
            
        }
      const pdfBuffer = await generatePDF();
      await sendEmail(pdfBuffer);
      console.log('Email sent with PDF attachment.');
    } catch (err) {
      console.error('Job failed:', err);
    } finally {
      mongoose.connection.close();
    }
  }
  
  runJob();