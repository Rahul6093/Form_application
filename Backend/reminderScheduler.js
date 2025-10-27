import cron from "node-cron";
import nodemailer from "nodemailer";
import db from "./db.js";  

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Testingdemonas@gmail.com",
    pass: "ndndpskknbvrqssd", // use env variable in production
  },
});

const sendReminderEmail = async (rowId) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM applications WHERE number = ?",
      [rowId]
    );

    if (!rows.length) {
      console.log("❌ No record found for that number");
      return;
    }

    const record = rows[0];

    const reminderMessage =

                    `
                    Hi ${record.name},

                    This is a friendly reminder about your application scheduled on ${record.date} at ${record.time}.

                    📍 Address: ${record.address}
                    📋 Status: ${record.status}

                    Please make sure to review your details and be prepared.

                    Best regards,  
                    Form Application System
                    `;

    const mailOptions = {
      from: "Testingdemonas@gmail.com",
      to: record.email,
      subject: "Application Reminder",
      text: reminderMessage,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${record.email}`);

  }catch (err) {
    console.error("❌ Error sending reminder:", err);
  }
};

cron.schedule("35 11 * * *", () => {
  console.log("⏰ Running daily reminder job...");
  sendReminderEmail(37); //
}, {
  scheduled: true,
  timezone: "Asia/Kolkata",
});

console.log("📅 Reminder cron scheduled for 9:00 AM daily");
