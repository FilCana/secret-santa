import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://filippocanavesi.site",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

let namesList = ["Filippo", "Larissa", "Noemi", "Romana"];

app.post("/send-email", async (req, res) => {
  const { to, chooser } = req.body;

  const possibleNames = namesList.filter(name => name !== chooser);

  if (possibleNames.length === 0) {
    return res.status(400).json({
      success: false,
    });
  }

  // Pick a random name
  const randomIndex = Math.floor(Math.random() * possibleNames.length);
  const chosenName = possibleNames[randomIndex];

  // Remove the chosen name from the list
  namesList = namesList.filter(name => name !== chosenName);

  try {
      await transporter.sendMail({
        from: "canavesi.secret.santa@gmail.com",
        to,
        subject: "🎅 Scopri il nome!",
        text: `Dovrai fare un pensiero a ${chosenName}!`
      });
      res.json({ success: true });
  } catch (error) {
    console.error("Errore nell'invio:", error);
    res.status(500).json({ success: false, message: "❌ La lista e vuota, pirla" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
