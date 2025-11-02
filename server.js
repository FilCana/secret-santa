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
  let suggestedGifts;

  if (chosenName == "Larissa") {
    suggestedGifts = ' - Gioiello Pandora, preferibilmente braccialetti semplici, orecchini o anelli (misura 56). \n - "L\'ultimo segreto" di Dan Brown.';
  } else if (chosenName == "Romana") {
    suggestedGifts = ' - RevitaLash Advanced Eyelash Conditioner. \n - Gioiello Swarowksi o Pandora. \n - Reggiseno sportivo taglia S meno sintetico possibile.';
  } else if (chosenName == "Noemi") {
    suggestedGifts = ' - Un foulard dai colori autunalli (non viola).';
  } else if (chosenName == "Filippo") {
    suggestedGifts = ' - Sedia ergonomica.';
  }

  // Remove the chosen name from the list
  namesList = namesList.filter(name => name !== chosenName);

try {
  const msg = {
    to,
    from: "canavesi.secret.santa@gmail.com", // Verified sender
    subject: "🎅 Scopri il nome!",
    text: `Dovrai fare un pensiero a ${chosenName}!\n\nEcco la sua lista dei desideri:\n${suggestedGifts}\n\nBuon Natale e tanti salutoni.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; background: #fff3e6; padding: 20px; border-radius: 10px;">
        <h1 style="color: #b30000;">🎅 Secret Santa!</h1>
        <p>Ciao! 🎄</p>
        <p>Dovrai fare un pensiero a <strong style="color: #800000;">${chosenName}</strong>!</p>
        <p>Ecco la sua <strong>lista dei desideri</strong>:</p>
        <ul>
          ${suggestedGifts.split('\n').map(gift => `<li>${gift}</li>`).join('')}
        </ul>
        <p>Buon Natale e tanti salutoni! 🎁</p>
        <div style="text-align:center; margin-top: 20px;">
          <img 
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2E0dWNqZmxiN3Z1ajh2dGl3NHpydmIwazJ5c3I0NHFsbmF0Y245YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QpfqKHA1fUXDi/giphy.gif" 
            alt="Gift animation" 
            style="max-width:100%; border-radius:10px;"
          />
        </div>
      </div>
    `,
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
