async function validateInputs() {
  const recipient = document.getElementById("recipient").value.trim();
  const sender = document.getElementById("sender").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const purpose = document.getElementById("purpose").value.trim();

  const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
  const subjectRegex = /^.{5,50}$/; // Between 5 and 50 characters
  const purposeRegex = /^.{5,50}$/; // Between 5 and 50 characters

  if (!nameRegex.test(recipient)) {
    alert("Recipient's name can only contain letters and spaces.");
    return false;
  }

  if (!nameRegex.test(sender)) {
    alert("Sender's name can only contain letters and spaces.");
    return false;
  }

  if (!subjectRegex.test(subject)) {
    alert("Subject must be between 5 and 50 characters.");
    return false;
  }

  if (!purposeRegex.test(purpose)) {
    alert("Purpose must be between 5 and 50 characters.");
    return false;
  }

  return true;
}

async function generateEmail(category, tone, recipient, sender, subject, purpose) {
  const prompt = `
Generate an email based on the following details:
- Category: ${category}
- Tone: ${tone}
- Recipient's Name: ${recipient}
- Sender's Name: ${sender}
- Subject: ${subject}
- Purpose: ${purpose}

The email should include:
- A proper greeting.
- Body content addressing the purpose.
- A closing and signature from the sender.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer  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`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || "Failed to generate email.");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error:", error);
    alert(`Error generating email: ${error.message}`);
    return "";
  }
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const category = document.getElementById("category").value;
  const tone = document.getElementById("tone").value;

  if (!(await validateInputs())) return;

  const recipient = document.getElementById("recipient").value.trim();
  const sender = document.getElementById("sender").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const purpose = document.getElementById("purpose").value.trim();

  const emailContent = await generateEmail(category, tone, recipient, sender, subject, purpose);
  document.getElementById("emailOutput").value = emailContent;
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const emailContent = document.getElementById("emailOutput");
  emailContent.select();
  emailContent.setSelectionRange(0, 99999); // For mobile compatibility
  navigator.clipboard.writeText(emailContent.value);
  alert("Email copied to clipboard!");
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const emailContent = document.getElementById("emailOutput").value;
  const blob = new Blob([emailContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "email_template.txt";
  a.click();
  URL.revokeObjectURL(url);
});
