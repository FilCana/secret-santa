import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(cors({
  origin: "http://filippocanavesi.site",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());


let namesList = ["Filippo", "Larissa", "Noemi", "Romana"];

app.post("/send-email", async (req, res) => {
  const { to, chooser } = req.body;

  console.log("Incoming request:", req.body);
  console.log("Current namesList:", namesList);

  const possibleNames = namesList.filter(name => name !== chooser);
  console.log("possibleNames after filter:", possibleNames);

  if (possibleNames.length === 0) {
    return res.status(400).json({ success: false });
  }

  // Pick a random name
  const randomIndex = Math.floor(Math.random() * possibleNames.length);
  const chosenName = possibleNames[randomIndex];

  // Remove the chosen name from the list
  namesList = namesList.filter(name => name !== chosenName);

  try {
    const msg = {
      to,
      from: "canavesi.secret.santa@gmail.com", // Verified sender in SendGrid
      subject: "🎅 Scopri il nome!",
      text: `Dovrai fare un pensiero a ${chosenName}!`,
    };

    await sgMail.send(msg);

    res.json({ success: true });
  } catch (error) {
    console.error("Errore nell'invio:", error);
    res.status(500).json({ success: false, message: "❌ Impossibile inviare l'email" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
