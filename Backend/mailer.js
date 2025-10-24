import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Testingdemonas@gmail.com",
    pass: "ndndpskknbvrqssd", // use env variable in production
  },
});

export const sendApplicationEmail = async (data,  imagePath = null, oldEmail = null) => {
  const { name, date, time, address, status, email } = data;

  const intro = oldEmail && oldEmail !== email ? "✅ Email changed successfully\n\n" : "";

  const mailOptions = {
    from: "Testingdemonas@gmail.com",
    to: email,
    subject: "Application Update",
    text: `${intro}Dear ${name},

    A new application has been successfully added/updated.

    📋 Details:
    - Name: ${name}
    - Date: ${date}
    - Time: ${time}
    - Address: ${address}
    - Status: ${status}

    Best regards,
    Form Application System`,
      };
  
  if (imagePath && fs.existsSync(imagePath)) {
    mailOptions.attachments = [
      {
        filename: path.basename(imagePath),
        path: imagePath,
      },
    ];
  }

  await transporter.sendMail(mailOptions);
};
