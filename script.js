document.addEventListener('DOMContentLoaded', () => {
    // Select all "Sell Now" buttons
    const sellButtons = document.querySelectorAll('.sell-btn');

    sellButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the parent card of the clicked button
            const card = button.closest('.account-card');
            
            // Find the form container within that specific card
            const formContainer = card.querySelector('.sell-form-container');

            // Toggle the 'active' class to show or hide the form
            formContainer.classList.toggle('active');
        });
    });

    // Handle payment method button selection and placeholder change
    const paymentButtons = document.querySelectorAll('.payment-btn');
    paymentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find the parent form of the clicked payment button
            const form = btn.closest('.sell-form');
            const accountNumberInput = form.querySelector('input[name="accountNumber"]');

            // Remove 'selected' class from all buttons in the same group
            const parent = btn.closest('.payment-buttons');
            parent.querySelectorAll('.payment-btn').forEach(b => {
                b.classList.remove('selected');
            });

            // Add 'selected' class to the clicked button
            btn.classList.add('selected');

            // Change the placeholder text based on the selected method
            const method = btn.dataset.method;
            if (method === 'bkash') {
                accountNumberInput.placeholder = "Enter your bkash account number";
            } else if (method === 'nagad') {
                accountNumberInput.placeholder = "Enter your nagad account number";
            } else if (method === 'binance') {
                accountNumberInput.placeholder = "Enter your binance pay I'd"; // Updated text
            }
        });
    });

    // Handle form submission
    const forms = document.querySelectorAll('.sell-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            // === IMPORTANT: REPLACE THIS URL WITH YOUR GOOGLE SHEET WEB APP URL ===
            const googleSheetUrl = "https://script.google.com/macros/s/AKfycbyGc1myWW5DgezjqlQPYOIaO3rZNuqqSb1GLhW-bDHfEGaw01yZ2uZ6_4v5kIa6JQwN/exec";

            // Find the submission status div within the current form
            const statusDiv = form.querySelector('.submission-status');
            const submitBtn = form.querySelector('.submit-btn');

            // Show "Submitting..." message and disable the button
            statusDiv.classList.remove('hidden');
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const selectedMethod = form.querySelector('.payment-btn.selected');
            if (selectedMethod) {
                formData.append('paymentMethod', selectedMethod.dataset.method);
            }
            formData.append('productType', form.dataset.product);

            try {
                const response = await fetch(googleSheetUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    // Handle successful submission
                    alert("Submission successful!");
                    form.reset(); // Clear the form
                    form.closest('.sell-form-container').classList.remove('active'); // Hide the form
                } else {
                    // Handle submission error
                    alert("Submission failed. Please try again.");
                }
            } catch (error) {
                // Handle network or other errors
                alert("An error occurred. Please check your connection.");
            } finally {
                // Hide "Submitting..." and re-enable the button
                statusDiv.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    });
});
