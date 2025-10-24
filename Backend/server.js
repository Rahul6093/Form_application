import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db.js";
import { sendApplicationEmail } from "./mailer.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* ------------------------------- FETCH ALL ------------------------------- */
app.get("/api/applications", (req, res) => {
  const sql = "SELECT * FROM applications ORDER BY number ASC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to fetch records" });
    res.json(result);
  });
});

/* ----------------------------- FETCH SINGLE RECORD ---------------------------- */
app.get("/api/applications/:number", (req, res) => {
  const { number } = req.params;
  const sql = "SELECT * FROM applications WHERE number = ?";
  db.query(sql, [number], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to fetch record" });
    if (!result.length) return res.status(404).json({ error: "Record not found" });
    res.json(result[0]);
  });
});

/* ----------------------------- ADD NEW RECORD ---------------------------- */
app.post("/api/applicationsadd", (req, res) => {
  const { name, date, time, address, status, email, sendEmail } = req.body;

  if (!name || !date || !time || !address || !status || !email)
    return res.status(400).json({ error: "All fields including email are required" });

  const sql = `
    INSERT INTO applications (name, date, time, address, status, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, date, time, address, status, email], async (err) => {
    if (err) return res.status(500).json({ error: "Failed to add record" });

    // ✅ Send email only if checkbox was checked
    if (sendEmail) {
      try {
        await sendApplicationEmail({ name, date, time, address, status, email });
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    }

    res.json({ message: "Record added successfully" });
  });
});

/* ----------------------------- EDIT EXISTING ----------------------------- */
app.put("/api/applicationsedit/:originalNumber", (req, res) => {
  const { originalNumber } = req.params;
  const { name, date, time, address, status, email, sendEmail } = req.body;

  if (!originalNumber || !name || !date || !time || !address || !status || !email)
    return res.status(400).json({ error: "All fields including email are required" });

  // ✅ Step 1: get old email
  db.query("SELECT email FROM applications WHERE number = ?", [originalNumber], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to fetch record" });
    if (!result.length) return res.status(404).json({ error: "Record not found" });

    const oldEmail = result[0].email;

    // ✅ Step 2: update data
    const sqlUpdate = `
      UPDATE applications
      SET name = ?, date = ?, time = ?, address = ?, status = ?, email = ?
      WHERE number = ?
    `;

    db.query(sqlUpdate, [name, date, time, address, status, email, originalNumber], async (err2) => {
      if (err2) return res.status(500).json({ error: "Failed to update record" });

      // ✅ Step 3: send email only if checkbox checked
      if (sendEmail) {
        try {
          await sendApplicationEmail(
            { name, date, time, address, status, email },
            oldEmail // optional parameter if your mailer supports notifying old/new address
          );
        } catch (err) {
          console.error("Failed to send email:", err);
        }
      }

      res.json({ message: "Record updated successfully" });
    });
  });
});

/* ------------------------------ DELETE RECORD ---------------------------- */
app.delete("/api/applications/:number", (req, res) => {
  const { number } = req.params;
  const sql = "DELETE FROM applications WHERE number = ?";
  db.query(sql, [number], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete record" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  });
});

/* ------------------------------- START SERVER ---------------------------- */
const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
