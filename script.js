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
            parent.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const method = btn.dataset.method;
            if (method === 'bkash') {
                accountNumberInput.placeholder = "Enter your bkash account number";
            } else if (method === 'nagad') {
                accountNumberInput.placeholder = "Enter your nagad account number";
            } else if (method === 'binance') {
                accountNumberInput.placeholder = "Enter your binance pay I'd";
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

            const userName = form.querySelector('input[name="userName"]').value.trim();
            const googleSheetLink = form.querySelector('input[name="googleSheetLink"]').value.trim();
            const accountNumber = form.querySelector('input[name="accountNumber"]').value.trim();
            const selectedMethodBtn = form.querySelector('.payment-btn.selected');
            const paymentMethod = selectedMethodBtn ? selectedMethodBtn.dataset.method : '';
            const productType = form.dataset.product;

            const payload = {
                userName,
                googleSheetLink,
                accountNumber,
                paymentMethod,
                productType
            };

            try {
                const response = await fetch("https://api.sheetson.com/v2/sheets/Sheet1", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer sHD15hflFTPtodeh1o1zv9aFe6zznN8c_VFWDYDTdLlZb1-cNLe7qNKelHQ",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert("Submission successful!");
                    form.reset();
                    form.closest('.sell-form-container').classList.remove('active');
                } else {
                    alert("Submission failed. Please try again.");
                }
            } catch (error) {
                alert("Network error. Please check your connection.");
            } finally {
                statusDiv.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    });
});
