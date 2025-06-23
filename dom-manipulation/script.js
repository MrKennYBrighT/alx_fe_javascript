// Array to hold quote objects with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

// Get references to necessary DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

// Function to display a random quote from the quotes array
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selected = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${selected.text}" — ${selected.category}`;
}

// Function to add a new quote from user input
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  // Only add the quote if both fields are filled
  if (newText && newCategory) {
    const newQuote = {
      text: newText,
      category: newCategory
    };

    quotes.push(newQuote); // Add new quote to the array
    textInput.value = '';  // Clear input field
    categoryInput.value = ''; // Clear category field

    displayRandomQuote(); // Optionally show the newly added quote
  }
}

// Event listener for the "Show New Quote" button
newQuoteButton.addEventListener('click', displayRandomQuote);
