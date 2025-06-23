// Step 1: Create an array of quote objects (text + category)
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

// Step 2: Reference required DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Step 3: Function to display a random quote from the array
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `"${selectedQuote.text}" — ${selectedQuote.category}`;
}

// Step 4: Function to add new quote from input fields
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const newText = quoteTextInput.value.trim();
  const newCategory = quoteCategoryInput.value.trim();

  if (newText !== "" && newCategory !== "") {
    const newQuote = {
      text: newText,
      category: newCategory
    };

    quotes.push(newQuote);

    quoteTextInput.value = "";
    quoteCategoryInput.value = "";

    displayRandomQuote(); // Immediately show newly added quote
  }
}

// Step 5: Hook up the "Show New Quote" button to display function
newQuoteButton.addEventListener("click", displayRandomQuote);
