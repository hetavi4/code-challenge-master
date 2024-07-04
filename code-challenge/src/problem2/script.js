document.addEventListener('DOMContentLoaded', () => {
    // Function to switch tabs
    function openTab(evt, tabName) {
        var i, tabcontent, tablinks;

        // Hide all tab content
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Remove active class from all tab links
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab and add active class to the clicked tab link
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    // Attach click event listeners to tab buttons
    const tabLinks = document.querySelectorAll(".tab button");
    tabLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            openTab(event, link.dataset.tab);
        });
    });

    // Automatically open the Swap tab on page load
    document.querySelector(".tab button[data-tab='Swap']").click();

    // Your existing code for token price retrieval, form submission, etc.
    // Ensure there are no syntax errors or missing functions related to form handling and token price retrieval.

    function displayTokenImage(imgId, token) {
        const imgElement = document.getElementById(imgId);
        imgElement.src = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.toUpperCase()}.svg`;
        imgElement.alt = `${token} Token Image`;
    }

    function getPriceByCurrency(currency) {
        const token = tokenPrices.find(token => token.currency === currency.toUpperCase());
        return token ? token.price : null;
    }

    const tokenPrices = [
        { "currency": "BLUR", "price": 0.208115254237288 },
        { "currency": "bNEO", "price": 7.1282679 },
        { "currency": "BUSD", "price": 0.999183113 },
        { "currency": "USD", "price": 1 },
        { "currency": "ETH", "price": 1645.93373737374 },
        { "currency": "GMX", "price": 36.3451143728814 },
        { "currency": "STEVMOS", "price": 0.0727670677966102 },
        { "currency": "LUNA", "price": 0.409556389830508 },
        { "currency": "RATOM", "price": 10.2509189152542 },
        { "currency": "STRD", "price": 0.738655338983051 },
        { "currency": "EVMOS", "price": 0.062461813559322 },
        { "currency": "IBCX", "price": 41.268113559322 },
        { "currency": "IRIS", "price": 0.0177095593220339 },
        { "currency": "ampLUNA", "price": 0.495485898305085 },
        { "currency": "KUJI", "price": 0.675 },
        { "currency": "STOSMO", "price": 0.431318 },
        { "currency": "USDC", "price": 0.989832 },
        { "currency": "axlUSDC", "price": 0.989832 },
        { "currency": "ATOM", "price": 7.18665733333333 },
        { "currency": "STATOM", "price": 8.51216205084746 },
        { "currency": "OSMO", "price": 0.377297433333333 },
        { "currency": "rSWTH", "price": 0.00408771 },
        { "currency": "STLUNA", "price": 0.442322101694915 },
        { "currency": "LSI", "price": 67.6966152542373 },
        { "currency": "OKB", "price": 42.9756205932203 },
        { "currency": "OKT", "price": 13.5615779661017 },
        { "currency": "SWTH", "price": 0.00403985045501208 },
        { "currency": "USC", "price": 0.994 },
        { "currency": "WBTC", "price": 26002.822020202 },
        { "currency": "wstETH", "price": 1872.25797423729 },
        { "currency": "YieldUSD", "price": 1.02908479661017 },
        { "currency": "ZIL", "price": 0.0165181355932203 }
    ];

    const swapForm = document.getElementById('swapForm');
    const fromValueInput = document.getElementById('fromValue');
    const fromTokenInput = document.getElementById('fromToken');
    const toTokenInput = document.getElementById('toToken');
    const toValueInput = document.getElementById('toValue');
    const reverseTokensBtn = document.getElementById('reverseTokens');
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    function updateExchangeRate() {
        const fromValue = parseFloat(fromValueInput.value) || 0;
        const fromToken = fromTokenInput.value.toUpperCase();
        const toToken = toTokenInput.value.toUpperCase();

        const fromPrice = getPriceByCurrency(fromToken);
        const toPrice = getPriceByCurrency(toToken);

        if (fromPrice && toPrice) {
            const exchangeRate = fromPrice / toPrice;
            toValueInput.value = (fromValue * exchangeRate).toFixed(6);
        } else {
            toValueInput.value = '';
        }

        displayTokenImage('fromTokenImg', fromToken);
        displayTokenImage('toTokenImg', toToken);
    }

    fromValueInput.addEventListener('input', updateExchangeRate);
    fromTokenInput.addEventListener('input', updateExchangeRate);
    toTokenInput.addEventListener('input', updateExchangeRate);

    reverseTokensBtn.addEventListener('click', () => {
        const tempValue = fromValueInput.value;
        fromValueInput.value = toValueInput.value;
        toValueInput.value = tempValue;

        const tempToken = fromTokenInput.value;
        fromTokenInput.value = toTokenInput.value;
        toTokenInput.value = tempToken;

        const tempImgSrc = document.getElementById('fromTokenImg').src;
        document.getElementById('fromTokenImg').src = document.getElementById('toTokenImg').src;
        document.getElementById('toTokenImg').src = tempImgSrc;

        const tempImgAlt = document.getElementById('fromTokenImg').alt;
        document.getElementById('fromTokenImg').alt = document.getElementById('toTokenImg').alt;
        document.getElementById('toTokenImg').alt = tempImgAlt;

        updateExchangeRate();
    });

    swapForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fromValue = parseFloat(fromValueInput.value);
        const fromToken = fromTokenInput.value.trim().toUpperCase();
        const toToken = toTokenInput.value.trim().toUpperCase();

        if (!fromValue || !fromToken || !toToken) {
            errorDiv.textContent = "Invalid input. Please enter a valid value and currency.";
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        } else {
            const fromPrice = getPriceByCurrency(fromToken);
            const toPrice = getPriceByCurrency(toToken);

            if (!fromPrice || !toPrice) {
                errorDiv.textContent = "Invalid currency input. Please check the currencies entered.";
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
            } else {
                const toValue = (fromValue * (fromPrice / toPrice)).toFixed(6);
                toValueInput.value = toValue;
                successDiv.textContent = `Successfully swapped ${fromValue} ${fromToken} to ${toValue} ${toToken}.`;
                successDiv.style.display = 'block';
                errorDiv.style.display = 'none';
            }
        }
    });
});
