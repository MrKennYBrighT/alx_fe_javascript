// Array to store quote objects
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteObj = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quoteObj.text}" — ${quoteObj.category}`;
}

// Function to add a new quote from user input
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text: text, category: category });
    textInput.value = "";
    categoryInput.value = "";
    displayRandomQuote(); // Update DOM after adding
  }
}

// Attach event listener to display random quote button
newQuoteButton.addEventListener("click", displayRandomQuote);
