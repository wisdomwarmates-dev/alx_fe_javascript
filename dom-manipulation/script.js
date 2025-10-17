const quotes = [
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" }
];

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = '"' + quote.text + '" — ' + quote.category;
}

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
  quoteInput.value = '';
  categoryInput.value = '';
}

// ✅ New function to dynamically create the form
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

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  createAddQuoteForm(); // ✅ Call the form creation function
});
