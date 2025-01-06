async function validateInputs() {
  const recipient = document.getElementById("recipient").value.trim();
  const sender = document.getElementById("sender").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const purpose = document.getElementById("purpose").value.trim();

  const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
  const subjectRegex = /^.{5,100}$/; // Subject: 5-100 characters
  const purposeRegex = /^.{10,500}$/; // Purpose: 10-500 characters

  if (!nameRegex.test(recipient)) {
    alert("Recipient's name can only contain letters and spaces.");
    return false;
  }

  if (!nameRegex.test(sender)) {
    alert("Sender's name can only contain letters and spaces.");
    return false;
  }

  if (!subjectRegex.test(subject)) {
    alert("Subject must be between 5 and 100 characters.");
    return false;
  }

  if (!purposeRegex.test(purpose)) {
    alert("Purpose must be between 10 and 500 characters.");
    return false;
  }

  return true;
}

async function generateEmail(category, tone, recipient, sender, subject, purpose) {
  const prompt = `
    Generate an email based on the following details:
    Category: ${category}
    Tone: ${tone}
    Recipient's Name: ${recipient}
    Sender's Name: ${sender}
    Subject: ${subject}
    Purpose: ${purpose}

    The email should include:
    - A greeting.
    - Body content addressing the purpose.
    - A closing and signature from the sender.
  `;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`, // Replace with your Hugging Face API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(`API Error: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data[0].generated_text.trim(); // Adjust based on model output format
  } catch (error) {
    console.error("Error generating email:", error);
    alert(`Failed to generate email: ${error.message}`);
    return "";
  }
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const category = document.getElementById("category").value;
  const tone = document.getElementById("tone").value;

  if (!await validateInputs()) return;

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
  emailContent.setSelectionRange(0, 99999);
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
