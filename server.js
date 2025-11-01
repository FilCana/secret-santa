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
    user: "canavesi.secret.santa@gmail.com",   
    pass: "yiyqoovrscqhcgbh"    
  }
});

let namesList = ["Filippo", "Larissa", "Noemi", "Romana"];

app.post("/send-email", async (req, res) => {
  const { to, chooser } = req.body;

  console.log("Incoming request:", req.body);
  console.log("Current namesList:", namesList);


  const possibleNames = namesList.filter(name => name !== chooser);
  console.log("possibleNames after filter:", possibleNames);

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
