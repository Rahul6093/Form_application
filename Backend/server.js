import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🧾 Fetch all records
app.get("/api/applications", (req, res) => {
  const sql = "SELECT * FROM applications ORDER BY number ASC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to fetch records" });
    res.json(result);
  });
});

// 🔍 Fetch a record by number
app.get("/api/applications/:number", (req, res) => {
  const { number } = req.params;
  const sql = "SELECT * FROM applications WHERE number = ?";
  db.query(sql, [number], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to fetch record" });
    res.json(result[0] || null);
  });
});

// ➕ Add new record
app.post("/api/applicationsadd", (req, res) => {
  const { name, date, time, address, status } = req.body;

  if (!name || !date || !time || !address || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sqlInsert = `
    INSERT INTO applications (name, date, time, address, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sqlInsert, [name, date, time, address, status], (err) => {
    if (err) return res.status(500).json({ error: "Failed to add record" });
    res.json({ message: "Record added successfully" });
  });
});

// ✏️ Update existing record (number in DB is immutable)
app.put("/api/applicationsedit/:originalNumber", (req, res) => {
  const { originalNumber } = req.params; // original DB number
  const { name, date, time, address, status } = req.body;

  if (!originalNumber || !name || !date || !time || !address || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sqlUpdate = `
    UPDATE applications
    SET name = ?, date = ?, time = ?, address = ?, status = ?
    WHERE number = ?
  `;

  db.query(sqlUpdate, [name, date, time, address, status, originalNumber], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to update record" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record updated successfully" });
  });
});


// ❌ Delete record
app.delete("/api/applications/:number", (req, res) => {
  const { number } = req.params;
  const sql = "DELETE FROM applications WHERE number = ?";
  db.query(sql, [number], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete record" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  });
});

// 🚀 Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
