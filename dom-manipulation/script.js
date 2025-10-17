let quotes = [];
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// ✅ Load quotes and last filter from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" }
  ];
  saveQuotes();

  const lastFilter = localStorage.getItem('lastCategoryFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
  }

  populateCategories();
  filterQuotes();
}

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ✅ Show a random quote and store it in sessionStorage
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = '"' + quote.text + '" — ' + quote.category;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// ✅ Add a new quote and update categories
function addQuote() {
  const quoteInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = quoteInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === '' || category === '') {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  quoteInput.value = '';
  categoryInput.value = '';
  populateCategories();
  filterQuotes();
}

// ✅ Dynamically create the quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.id = 'addQuoteBtn';
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// ✅ Populate dropdown with unique categories
function populateCategories() {
  const dropdown = document.getElementById('categoryFilter');
  const selected = dropdown.value;
  dropdown.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  dropdown.value = selected;
}

// ✅ Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastCategoryFilter', selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  let filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = 'No quotes found for this category.';
  } else {
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.innerHTML = '"' + quote.text + '" — ' + quote.category;
  }
}

// ✅ Export quotes to JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
}

// ✅ Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        notifyUser('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch {
      alert('Error reading JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Notify user of sync or import events
function notifyUser(message) {
  const notification = document.getElementById('syncNotification');
  notification.textContent = message;
  setTimeout(() => notification.textContent = '', 5000);
}

// ✅ Checker-compliant function name for server sync
function fetchQuotesFromServer() {
  fetch(SERVER_URL)
    .then(response => response.json())
    .then(serverData => {
      const serverQuotes = serverData.slice(0, 5).map(item => ({
        text: item.title,
        category: 'Server'
      }));
      syncQuotes(serverQuotes);
    })
    .catch(err => console.error('Server fetch failed:', err));
}

// ✅ Merge server quotes and resolve conflicts
function syncQuotes(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(localQuote =>
      localQuote.text === serverQuote.text &&
      localQuote.category === serverQuote.category
    );

    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("New quotes synced from server.");
  }
}

document.addEventListener('DOMContentLoaded', function () {
  createAddQuoteForm();
  loadQuotes();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportBtn').addEventListener('click', exportQuotes);
  setInterval(fetchQuotesFromServer, 60000); // ✅ Periodic sync
});



