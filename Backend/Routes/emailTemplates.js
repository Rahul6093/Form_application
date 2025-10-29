import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Paths to template files
const templates = {
  Form: path.join(process.cwd(), "FormEmailFormat.js"),
  Reminder: path.join(process.cwd() ,"reminderScheduler.js"),
};

// Helper to extract editable content (e.g., string literals in template)
const extractEditableContent = (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  // Example: extract content inside backticks `...`
  const matches = [...fileContent.matchAll(/`([\s\S]*?)`/g)];
  return matches.map((m) => m[1]);
};

router.get("/", (req, res) => {
  try {
    const data = {};
    for (const key in templates) {
        console.log("Reading file:", templates[key]);
      data[key] = extractEditableContent(templates[key]);
    }
    res.json(data);
    console.log("Fetched email templates");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

router.put("/:templateName/:index", (req, res) => {
  const { templateName, index } = req.params;
  const { content } = req.body;

  if (!templates[templateName]) return res.status(404).json({ error: "Template not found" });

  try {
    let fileContent = fs.readFileSync(templates[templateName], "utf-8");
    const matches = [...fileContent.matchAll(/`([\s\S]*?)`/g)];

    if (!matches[index]) return res.status(400).json({ error: "Invalid index" });

    // Replace only the editable part
    const before = fileContent.slice(0, matches[index].index + 1);
    const after = fileContent.slice(matches[index].index + matches[index][0].length - 1);
    fileContent = before + content + after;

    fs.writeFileSync(templates[templateName], fileContent, "utf-8");

    res.json({ message: "Template updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update template" });
  }
});

export default router;
