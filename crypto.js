function initialize() {
  const page = 1;
  const pageSize = 20;
  let loading = false;
  let endOfRecords = false;
  const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${pageSize}&page=${page}`;
  const listElement = document.getElementById('cryptocurrency-list');
  const loadingIndicator = document.getElementById('loading-indicator');
  const endNotification = document.getElementById('end-notification');
  const searchInput = document.getElementById('search-input');

  // Fetch cryptocurrency data from the API
  const fetchCryptocurrencyData = async () => {
    loading = true;
    loadingIndicator.innerText = 'Loading...';

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length === 0 && searchInput.value.trim() === '') {
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
              <div class="name"><span class="label">Rate:</span> ${price}</div>
              <div class="symbol"><span class="label">Crypto name:</span> ${name}</div>
              <div class="price"><span class="label">Crypto unit:</span> ${symbol}</div>
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

  // Lazy load more data when scrolling
  const lazyLoad = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (!loading && !endOfRecords) {
        fetchCryptocurrencyData();
      }
    }
  };

  window.addEventListener('scroll', lazyLoad);

  fetchCryptocurrencyData();

  // Handle search input
  searchInput.addEventListener('input', handleSearch);

  // Handle search query and filter cryptocurrencies
  function handleSearch() {
    const searchQuery = searchInput.value.trim().toLowerCase();

    if (searchQuery === '') {
      clearCryptocurrencies();
      endOfRecords = false;
      fetchCryptocurrencyData();
      endNotification.innerText = '';
    } else {
      filterCryptocurrencies(searchQuery);
    }
  }

  // Filter cryptocurrencies based on the search query
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
          endNotification.style.display = 'block'; // Show the message
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
              <div class="name"><span class="label">Rate:</span> ${price}</div>
              <div class="symbol"><span class="label">Crypto name:</span> ${name}</div>
              <div class="price"><span class="label">Crypto unit:</span> ${symbol}</div>
            </div>`;
            listElement.appendChild(cryptoElement);
          });
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  // Clear the displayed cryptocurrencies
  function clearCryptocurrencies() {
    while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }
    endNotification.style.display = 'none'; // Hide the message
  }
}

// Call the initialize function when the page loads
window.addEventListener('load', initialize);
