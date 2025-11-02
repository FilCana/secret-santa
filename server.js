app.post("/send-email", async (req, res) => {
  const { to, chooser } = req.body;

  console.log("Incoming request:", req.body);
  console.log("Current namesList:", namesList);

  const possibleNames = namesList.filter(name => name !== chooser);
  console.log("possibleNames after filter:", possibleNames);

  if (possibleNames.length === 0) {
    return res.status(400).json({ success: false });
  }

  // declare variables
  let chosenName;
  let suggestedGifts = '';

  // Pick a random name, but force Larissa if chooser is Noemi (only if Larissa is available)
  if (chooser === "Noemi" && namesList.includes("Larissa") && "Larissa" !== chooser) {
    chosenName = "Larissa";
  } else {
    const randomIndex = Math.floor(Math.random() * possibleNames.length);
    chosenName = possibleNames[randomIndex];
  }

  // Build suggestedGifts based on chosenName
  if (chosenName === "Larissa") {
    suggestedGifts = 'Gioiello Pandora, preferibilmente braccialetti semplici, orecchini o anelli (misura 56)\n"L\'ultimo segreto" di Dan Brown';
  } else if (chosenName === "Romana") {
    suggestedGifts = 'RevitaLash Advanced Eyelash Conditioner\nGioiello Swarowksi o Pandora.\nReggiseno sportivo taglia S meno sintetico possibile';
  } else if (chosenName === "Noemi") {
    suggestedGifts = 'Un foulard dai colori autunnali (non viola)';
  } else if (chosenName === "Filippo") {
    suggestedGifts = 'Carta regalo Amazon\nCarta regalo Lidl';
  }

  // Remove the chosen name from the list (if present)
  namesList = namesList.filter(name => name !== chosenName);

  try {
    const msg = {
      to,
      from: "canavesi.secret.santa@gmail.com", // Verified sender
      subject: "🎅 Scopri il nome!",
      text: `Dovrai fare un pensiero a ${chosenName}!\n\nEcco la sua lista dei desideri:\n${suggestedGifts}\n\nBuon Natale e tanti salutoni.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background: #fff3e6; padding: 20px; border-radius: 10px;">
          <h2 style="color: #b30000;">🎅 Secret Santa 2025! </h2>
          <p>Ciao! 🎄</p>
          <p>Dovrai fare un pensiero a <strong style="color: #800000;">${chosenName}</strong>!</p>
          <p>Ecco la sua <strong>lista dei desideri</strong>:</p>
          <ul>
            ${suggestedGifts.split('\n').map(gift => `<li>${gift}</li>`).join('')}
          </ul>
          <p>Buon Natale e tanti salutoni! 🎁</p>
          <div style="text-align:center; margin-top: 20px;">
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aWE5YnozOXpweXliMXN3YXdjY2N6MW02b2JmcXBxYWtuMzZmZGZzdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DQiEpKtt4ytM8tFd5H/giphy.gif" 
              alt="" 
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
    if (error.response) console.error(error.response.body);
    res.status(500).json({ success: false, message: "❌ Impossibile inviare l'email" });
  }
});
