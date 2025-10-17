// Step 1: Create the quotes array
const quotes = [
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" }
];

// Step 2: Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Step 3: Function to add a new quote
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

// Step 4: Set up event listeners after DOM loads
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
});
