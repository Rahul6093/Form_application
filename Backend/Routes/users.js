import express from "express";
import db from "../db.js";

const router = express.Router();

/* --------------------- GET ALL USERS --------------------- */
router.get("/", (req, res) => {
  const sql = "SELECT * FROM auth";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

/* --------------------- ADD NEW USER --------------------- */
router.post("/", (req, res) => {
  const { username, password, permission } = req.body;

  if (!username || !password || !permission) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if username already exists
  db.query("SELECT * FROM auth WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) return res.status(409).json({ error: "Username already exists" });

    // Insert new user
    db.query(
      "INSERT INTO auth (username, password, permission) VALUES (?, ?, ?)",
      [username, password, permission],
      (err2) => {
        if (err2) return res.status(500).json({ error: "Failed to add user" });
        res.json({ message: "User added successfully" });
      }
    );
  });
});

// Update user
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { username, password, permission } = req.body;
  console.log( id, username, password, permission);
  db.query(
    "UPDATE auth SET username = ?, password = ?, permission = ? WHERE id = ?",
    [username, password, permission, id],
    (err,result) => {
      if (err) 
        return res.status(500).json({ error: "Failed to update user" });
        console.log("no error",result );
       return  res.json({ message: "User updated successfully" });
        // console.log("error:",err );

    }
  );
});

// Delete user
router.delete("api/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM auth WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete user" });
    res.json({ message: "User deleted successfully" });
  });
});

export default router;
