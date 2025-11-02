app.post("/send-email", async (req, res) => {
  const { to, chooser } = req.body;

  console.log("Incoming request:", req.body);
  console.log("Current namesList:", namesList);

  // Default random logic
  let possibleNames = namesList.filter(name => name !== chooser);
  let chosenName;

  // 👉 Force Larissa if Noemi is the chooser
  if (chooser === "Noemi") {
    chosenName = "Larissa";
  } else {
    const randomIndex = Math.floor(Math.random() * possibleNames.length);
    chosenName = possibleNames[randomIndex];
  }

  console.log("Chosen name:", chosenName);

  let suggestedGifts = "";
  if (chosenName === "Larissa") {
    suggestedGifts = `Gioiello Pandora, preferibilmente braccialetti semplici, orecchini o anelli (misura 56)
"L'ultimo segreto" di Dan Brown`;
  } else if (chosenName === "Romana") {
    suggestedGifts = `RevitaLash Advanced Eyelash Conditioner
Gioiello Swarowski o Pandora.
Reggiseno sportivo taglia S meno sintetico possibile`;
  } else if (chosenName === "Noemi") {
    suggestedGifts = `Un foulard dai colori autunnali (non viola)`;
  } else if (chosenName === "Filippo") {
    suggestedGifts = `Carta regalo Amazon
Carta regalo Lidl`;
  }

  // Remove chosen name from the list
  namesList = namesList.filter(name => name !== chosenName);

  try {
    const msg = {
      to,
      from: "canavesi.secret.santa@gmail.com",
      subject: "🎅 Scopri il nome!",
      text: `Dovrai fare un pensiero a ${chosenName}!\n\nEcco la sua lista dei desideri:\n${suggestedGifts}\n\nBuon Natale e tanti salutoni.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background: #fff3e6; padding: 20px; border-radius: 10px;">
          <h2 style="color: #b30000;">🎅 Secret Santa 2025!</h2>
          <p>Ciao! 🎄</p>
          <p>Dovrai fare un pensiero a <strong style="color: #800000;">${chosenName}</strong>!</p>
          <p>Ecco la sua <strong>lista dei desideri</strong>:</p>
          <ul>
            ${suggestedGifts.split('\n').map(g => `<li>${g}</li>`).join('')}
          </ul>
          <p>Buon Natale e tanti salutoni! 🎁</p>
          <div style="text-align:center; margin-top: 20px;">
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aWE5YnozOXpweXliMXN3YXdjY2N6MW02b2JmcXBxYWtuMzZmZGZzdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DQiEpKtt4ytM8tFd5H/giphy.gif" 
              alt="gift" 
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
