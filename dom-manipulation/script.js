// Quote list with initial entries
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selected = quotes[randomIndex];
  quoteDisplay.innerText = `"${selected.text}" — ${selected.category}`;
}

// Add a new quote from input
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    textInput.value = '';
    categoryInput.value = '';
  }
}

// Attach event to button
newQuoteButton.addEventListener('click', showRandomQuote);
