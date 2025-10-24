import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import db from "./db.js";
import { sendApplicationEmail } from "./mailer.js";

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

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
app.post("/api/applicationsadd", upload.single("image"), (req, res) => {
  const { name, date, time, address, status, email, sendEmail } = req.body;
  const app_image = req.file ? req.file.filename : null;

  if (!name || !date || !time || !address || !status || !email)
    return res.status(400).json({ error: "All fields including email are required" });

  const sql = `
    INSERT INTO applications (name, date, time, address, status, email, app_image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, date, time, address, status, email, app_image], async (err) => {
    if (err) return res.status(500).json({ error: "Failed to add record" });

    // ✅ Send email only if checkbox was checked
    if (sendEmail) {
      try {
        const imgPath = app_image
          ? path.join("uploads", app_image)
          : null;
        await sendApplicationEmail({ name, date, time, address, status, email }, imgPath);
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    }

    res.json({ message: "Record added successfully" });
  });
});

/* ----------------------------- EDIT EXISTING ----------------------------- */
app.put("/api/applicationsedit/:originalNumber", upload.single("image"), (req, res) => {
  const { originalNumber } = req.params;
  const { name, date, time, address, status, email, sendEmail } = req.body;
  const app_image = req.file ? req.file.filename : null;

  console.log("originalNumber:", req.params.originalNumber);
  console.log("body:", req.body);
  console.log("file:", req.file);

  // if (!originalNumber || !name || !date || !time || !address || !status || !email)
  //   return res.status(400).json({ error: "All fields including email are required" });

    //update data
    const sqlUpdate = `
      UPDATE applications
      SET name = ?, date = ?, time = ?, address = ?, status = ?, email = ?, app_image=?
      WHERE number = ?
    `;

    const params = [name, date, time, address, status, email, app_image, originalNumber];

    db.query(sqlUpdate, params , async (err2,result) => {
      if (err2) {
        console.log(err2)
        return res.status(500).json({ error: "Failed to update record" });
      }

      // ✅ Step 3: send email only if checkbox checked
      if (sendEmail) {
        try {
          const imagePath = app_image? path.join("uploads", app_image): null;
          await sendApplicationEmail({ name, date, time, address, status, email }, imagePath);
        } catch (err) {
          console.error("Failed to send email:", err);
        }
      }

      res.json({ message: "Record updated successfully" });
    });
  });
// });

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
