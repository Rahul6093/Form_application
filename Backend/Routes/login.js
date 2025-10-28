  import express from "express";
  import db from "../db.js";

  const router = express.Router();

/* ------------------------------- LOGIN API ------------------------------- */

  router.post("/", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const sql = "SELECT * FROM auth WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // user found, send back role
      const user = result[0];
      res.json({
        message: "Login successful",
        username: user.username,
        permission: user.permission, // Admin or User
      });
    });
  });

  export default router;
