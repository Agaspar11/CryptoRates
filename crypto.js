const page = 1;
const pageSize = 20;
let loading = false;
let endOfRecords = false;
const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${pageSize}&page=${page}`;
const listElement = document.getElementById('cryptocurrency-list');
const loadingIndicator = document.getElementById('loading-indicator');
const endNotification = document.getElementById('end-notification');

const fetchCryptocurrencyData = async () => {
  loading = true;
  loadingIndicator.innerText = 'Loading...';

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.length === 0) {
      endOfRecords = true;
      endNotification.innerText = 'No more records to show.';
    } else {
      data.forEach((crypto) => {
        const name = crypto.name;
        const symbol = crypto.symbol;
        const price = crypto.current_price;
        const iconUrl = crypto.image;
        const cryptoElement = document.createElement('div');
        cryptoElement.classList.add('cryptocurrency');
        cryptoElement.innerHTML = `
          <img src="${iconUrl}">
          <div class="details">
            <div class="name"><span class="label">Name:</span> ${name}</div>
            <div class="symbol"><span class="label">Symbol:</span> ${symbol}</div>
            <div class="price"><span class="label">Price:</span> ${price}</div>
          </div>`;
        listElement.appendChild(cryptoElement);
      });
    }

    loading = false;
    loadingIndicator.innerText = '';
  } catch (error) {
    console.log('Error:', error);
    loading = false;
    loadingIndicator.innerText = '';
  }
};

const lazyLoad = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if (!loading && !endOfRecords) {
      fetchCryptocurrencyData();
    }
  }
};

window.addEventListener('scroll', lazyLoad);

fetchCryptocurrencyData();

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', handleSearch);

function handleSearch() {
  const searchQuery = searchInput.value.trim().toLowerCase();

  if (searchQuery === '') {
    clearCryptocurrencies();
    fetchCryptocurrencyData();
  } else {
    filterCryptocurrencies(searchQuery);
  }
}

function filterCryptocurrencies(query) {
  clearCryptocurrencies();

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const filteredData = data.filter((crypto) =>
        crypto.name.toLowerCase().includes(query)
      );

      if (filteredData.length === 0) {
        endOfRecords = true;
        endNotification.innerText = 'No matching records found.';
      } else {
        filteredData.forEach((crypto) => {
          const name = crypto.name;
          const symbol = crypto.symbol;
          const price = crypto.current_price;
          const iconUrl = crypto.image;
          const cryptoElement = document.createElement('div');
          cryptoElement.classList.add('cryptocurrency');
          cryptoElement.innerHTML = `
            <img src="${iconUrl}">
            <div class="details">
              <div class="name"><span class="label">Name:</span> ${name}</div>
              <div class="symbol"><span class="label">Symbol:</span> ${symbol}</div>
              <div class="price"><span class="label">Price:</span> ${price}</div>
            </div>`;
          listElement.appendChild(cryptoElement);
        });
      }
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
