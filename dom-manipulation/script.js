// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Tech" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const formContainer = document.getElementById("formContainer");

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Session storage: store last displayed quote
function storeLastViewed(quote) {
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Populate category dropdown
function updateCategoryOptions() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Show a random quote from selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filtered = quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes in this category.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
  storeLastViewed(randomQuote);
}

// Create form to add new quote
function createAddQuoteForm() {
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
    <br/><br/>
    <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    <button onclick="exportQuotes()">Export Quotes</button>
  `;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    updateCategoryOptions();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Export quotes as JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryOptions();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (e) {
      alert("Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event setup
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize on load
createAddQuoteForm();
updateCategoryOptions();
