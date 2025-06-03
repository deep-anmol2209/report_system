import { dotenvVar } from "../config.js";
import nodemailer from "nodemailer"
import mongoose from 'mongoose';
import Plaza from "../model/plazaModel.js";
import { generatePDF } from "./pdfgenerate.js";




 async function sendEmail(attachments) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: dotenvVar.USER_MAILER,
        pass: dotenvVar.PASS_MAILER
      }
    });
  
    const mailOptions = {
      from: dotenvVar.PASS_MAILER,
      to: ['sanjaykumargola@gmail.com', 'anmol222006@gmail.com'],
      subject: 'Daily Issue Report',
      text: 'Attached is the daily issue report.',
      attachments: attachments
    };
  
    await transporter.sendMail(mailOptions);
  }
  
  async function runJob() {
    try {
      console.log("hello");
      await mongoose.connect(dotenvVar.MONGODB_URI);
  
      const plazas = await Plaza.find();
      const attachments = [];
  
      for (const plaza of plazas) {
        const plazaMap = { id: plaza._id, name: plaza.plazaName };
  
        const pdfBuffer = await generatePDF({ plazaMap });
  
        attachments.push({
          filename: `${plaza.plazaName || 'plaza'}_report.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        });
      }
  
      if (attachments.length > 0) {
        await sendEmail(attachments);
        console.log('Email sent with PDF attachments.');
      } else {
        console.log('No attachments to send.');
      }
    } catch (err) {
      console.error('Job failed:', err);
    } finally {
      mongoose.connection.close();
    }
  }
  
  runJob();
  