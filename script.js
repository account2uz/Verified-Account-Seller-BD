document.addEventListener('DOMContentLoaded', () => {
    const sellButtons = document.querySelectorAll('.sell-btn');

    sellButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.account-card');
            const formContainer = card.querySelector('.sell-form-container');
            formContainer.classList.toggle('active');
        });
    });

    const paymentButtons = document.querySelectorAll('.payment-btn');
    paymentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const form = btn.closest('.sell-form');
            const accountNumberInput = form.querySelector('input[name="accountNumber"]');
            const parent = btn.closest('.payment-buttons');
            parent.querySelectorAll('.payment-btn').forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');

            const method = btn.dataset.method;
            if (method === 'bkash') {
                accountNumberInput.placeholder = "Enter your bkash account number";
            } else if (method === 'nagad') {
                accountNumberInput.placeholder = "Enter your nagad account number";
            } else if (method === 'binance') {
                accountNumberInput.placeholder = "Enter your binance pay ID";
            }
        });
    });

    const forms = document.querySelectorAll('.sell-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const statusDiv = form.querySelector('.submission-status');
            const submitBtn = form.querySelector('.submit-btn');
            statusDiv.classList.remove('hidden');
            submitBtn.disabled = true;

            const selectedMethod = form.querySelector('.payment-btn.selected');
            const paymentMethod = selectedMethod ? selectedMethod.dataset.method : "";

            const formData = {
                name: form.querySelector('input[name="name"]').value,
                email: form.querySelector('input[name="email"]').value,
                accountNumber: form.querySelector('input[name="accountNumber"]').value,
                paymentMethod: paymentMethod,
                productType: form.dataset.product
            };

            try {
                const response = await fetch("https://api.sheetson.com/v2/sheets/AccountSubmissions", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "X-Spreadsheet-Id": "1fh1Pce1KJXIf8Fjt5uP05e1HULwCnxi2T2AXAVhPMZk",
                        "Authorization": "Bearer sHD15hflFTPtodeh1o1zv9aFe6zznN8c_VFWDYDTdLlZb1-cNLe7qNKelHQ"
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert("✅ Submission successful!");
                    form.reset();
                    form.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('selected'));
                    form.closest('.sell-form-container').classList.remove('active');
                } else {
                    alert("❌ Submission failed. Please try again.");
                }
            } catch (error) {
                alert("⚠️ Network error. Check your internet or try again later.");
            } finally {
                statusDiv.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    });
});
