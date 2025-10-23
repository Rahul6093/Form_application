import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // your XAMPP MySQL username
  password: "",         // your password (default empty)
  database: "application_db"
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

export default db;
