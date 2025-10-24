   document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const swapBtn = document.getElementById('swap-currencies');
    const convertBtn = document.getElementById('convert-btn');
    const resultSection = document.getElementById('result-section');
    const convertedAmount = document.getElementById('converted-amount');
    const conversionRate = document.getElementById('conversion-rate');
    const loader = document.querySelector('.loader');
    const errorMessage = document.getElementById('error-message');

    // Event Listeners
    convertBtn.addEventListener('click', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    amountInput.addEventListener('input', convertCurrency);
    fromCurrency.addEventListener('change', convertCurrency);
    toCurrency.addEventListener('change', convertCurrency);

    // Initial conversion on page load
    convertCurrency();

    // Function to convert currency
    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        // Validate amount
        if (isNaN(amount) || amount < 0) {
            showError("Please enter a valid amount");
            return;
        }

        // Show loader and hide previous results
        loader.classList.add('active');
        resultSection.classList.remove('active');
        errorMessage.classList.remove('active');

        try {
            // Using ExchangeRate-API (free tier)
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);

            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }

            const data = await response.json();

            // Check if target currency is available
            if (!data.rates[to]) {
                throw new Error('Exchange rate not available for selected currency');
            }

            // Calculate converted amount
            const rate = data.rates[to];
            const convertedValue = (amount * rate).toFixed(2);

            // Update UI with results
            convertedAmount.textContent = `${convertedValue} ${to}`;
            conversionRate.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;

            // Show result section
            resultSection.classList.add('active');

        } catch (error) {
            console.error('Error:', error);
            showError("Failed to fetch exchange rates. Please try again.");
        } finally {
            // Hide loader
            loader.classList.remove('active');
        }
    }

    // Function to swap currencies
    function swapCurrencies() {
        const fromValue = fromCurrency.value;
        const toValue = toCurrency.value;

        fromCurrency.value = toValue;
        toCurrency.value = fromValue;

        // Trigger conversion after swap
        convertCurrency();
    }

    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('active');
    }
});
