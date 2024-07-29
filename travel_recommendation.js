document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
  
    const btnSearch = document.getElementById('search-button');
    const btnClear = document.getElementById('clear-button');
    const resultsContainer = document.getElementById('result');
    const inputField = document.querySelector('.search-bar input');
  
    console.log('Elements:', btnSearch, btnClear, resultsContainer, inputField);
  
    // Function to check if the place matches any of the keyword variations
    function matchesKeyword(item, keyword) {
      const normalizedKeyword = keyword.toLowerCase();
      const keywordVariations = {
        beach: ["beach", "beaches"],
        temple: ["temple", "temples"],
        country: ["country", "countries"]
      };
  
      if (keywordVariations[normalizedKeyword]) {
        return keywordVariations[normalizedKeyword].some(variation => item.name.toLowerCase().includes(variation));
      }
  
      return item.name.toLowerCase().includes(normalizedKeyword);
    }
  
    // Function to fetch data and update the UI
    async function fetchDataAndUpdateUI() {
      const searchKeyword = inputField.value.toLowerCase();
      console.log('Search keyword:', searchKeyword);
  
      try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data fetched:', data);
  
        resultsContainer.innerHTML = ''; // Clear previous results
  
        const displayItem = (item) => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'place';
          itemDiv.innerHTML = `
            <div class="result-item">
              <img src="${item.imageUrl}" alt="${item.name}">
              <div class="result-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <button class="visit-button">Visit</button>
              </div>
            </div>
          `;
          resultsContainer.appendChild(itemDiv);
        };
  
        let found = false;
  
        // Search and display countries and their cities
        data.countries.forEach(country => {
          if (matchesKeyword(country, searchKeyword)) {
            country.cities.forEach(city => displayItem(city));
            found = true;
          } else {
            country.cities.forEach(city => {
              if (matchesKeyword(city, searchKeyword)) {
                displayItem(city);
                found = true;
              }
            });
          }
        });
  
        // Search and display temples
        data.temples.forEach(temple => {
          if (matchesKeyword(temple, searchKeyword)) {
            displayItem(temple);
            found = true;
          }
        });
  
        // Search and display beaches
        data.beaches.forEach(beach => {
          if (matchesKeyword(beach, searchKeyword)) {
            displayItem(beach);
            found = true;
          }
        });
  
        if (!found) {
          resultsContainer.innerHTML = '<p>No results found.</p>';
        }
      } catch (error) {
        console.error('Error fetching the data:', error);
        resultsContainer.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
      }
    }
  
    btnSearch.addEventListener('click', () => {
      console.log('Search button clicked');
      fetchDataAndUpdateUI();
    });
  
    btnClear.addEventListener('click', () => {
      inputField.value = '';
      resultsContainer.innerHTML = '';
      console.log('Clear button clicked');
    });
  });
  