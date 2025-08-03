document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="userName"]').value;
      const googleSheetLink = form.querySelector('[name="googleSheetLink"]').value;
      const paymentMethod = form.querySelector('[name="paymentMethod"]').value;
      const accountNumber = form.querySelector('[name="accountNumber"]').value;

      const data = {
        Name: name,
        "Google Sheet Link": googleSheetLink,
        "Payment Method": paymentMethod,
        "Account Number": accountNumber,
      };

      try {
        const response = await fetch("https://api.sheetson.com/v2/sheets/AccountSubmissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Spreadsheet-Id": "1fh1Pce1KJXIf8Fjt5uP05e1HULwCnxi2T2AXAVhPMZk",
            "Authorization": "Bearer sHD15hflFTPtodeh1o1zv9aFe6zznN8c_VFWDYDTdLlZb1-cNLe7qNKelHQ"
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert("✅ Submission successful!");
          form.reset();
        } else {
          const errorData = await response.json();
          alert("❌ Submission failed:\n" + errorData.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("❌ Error submitting form. Check your internet and try again.");
      }
    });
  });
});
