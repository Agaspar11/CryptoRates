let page = 1;
let loading = false;
let endOfRecords = false;
const apiUrl = 'https://api.coingecko.com/api/v3/exchange_rates';
const listElement = document.getElementById('cryptocurrency-list');
const loadingIndicator = document.getElementById('loading-indicator');
const endNotification = document.getElementById('end-notification');

const fetchCryptocurrencyRates = (page) => {
  loading = true;
  loadingIndicator.innerText = 'Loading...';

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const rates = data.rates;
      const cryptocurrencies = Object.keys(rates);

      if (cryptocurrencies.length === 0) {
        endOfRecords = true;
        endNotification.innerText = 'No more records to show.';
      } else {
        cryptocurrencies.forEach((crypto) => {
          const rate = rates[crypto].value;
          const unit = rates[crypto].unit;

          const cryptoElement = document.createElement('div');
          cryptoElement.classList.add('cryptocurrency');
          cryptoElement.innerHTML = `
            <div class="icon">
              <img src="#">
            </div>
            <div class="details">
              <div class="rate"><span class="label">Rate:</span> ${rate}</div>
              <div class="name"><span class="label">Crypto name:</span> ${rates[crypto].name}</div>
              <div class="unit"><span class="label">Crypto unit:</span> ${unit}</div>
            </div>`;
          listElement.appendChild(cryptoElement);
        });

        page++;
      }

      loading = false;
      loadingIndicator.innerText = '';
    })
    .catch((error) => {
      console.log('Error:', error);
      loading = false;
      loadingIndicator.innerText = '';
    });
};

const lazyLoad = () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    if (!loading && !endOfRecords) {
      fetchCryptocurrencyRates(page);
    }
  }
};

window.addEventListener('scroll', lazyLoad);

fetchCryptocurrencyRates(page);

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', handleSearch);

function handleSearch() {
  const searchQuery = searchInput.value.trim().toLowerCase();

  if (searchQuery === '') {
    clearCryptocurrencies();
    fetchCryptocurrencyRates(page);
  } else {
    filterCryptocurrencies(searchQuery);
  }
}

function filterCryptocurrencies(query) {
  clearCryptocurrencies();

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const rates = data.rates;
      const cryptocurrencies = Object.keys(rates);
      cryptocurrencies.forEach((crypto) => {
        const rate = rates[crypto].value;
        const unit = rates[crypto].unit;

        const cryptoElement = document.createElement('div');
        cryptoElement.classList.add('cryptocurrency');
        cryptoElement.innerHTML = `
          <div class="icon">
            <img src="#">
          </div>
          <div class="details">
            <div class="rate"><span class="label">Rate:</span> ${rate}</div>
            <div class="name"><span class="label">Crypto name:</span> ${rates[crypto].name}</div>
            <div class="unit"><span class="label">Crypto unit:</span> ${unit}</div>
          </div>`;
        listElement.appendChild(cryptoElement);
      });
    })
    .catch((error) => {
      console.log('Error:', error);
    });
}

function clearCryptocurrencies() {
  while (listElement.firstChild) {
    listElement.removeChild(listElement.firstChild);
  }
}
