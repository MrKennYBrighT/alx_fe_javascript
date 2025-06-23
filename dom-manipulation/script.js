// Initialize or load saved quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Tech" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");
const newQuoteBtn = document.getElementById("newQuote");

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category filter
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const previous = categoryFilter.value;
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  const stored = localStorage.getItem("lastSelectedCategory");
  categoryFilter.value = stored || previous || "all";
}

// Filter quotes and display first match
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastSelectedCategory", selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available in this category.";
    return;
  }
  const quote = filtered[0];
  quoteDisplay.innerHTML = `"${quote.text}" — ${quote.category}`;
}

// Show a random quote from filtered selection
function showRandomQuote() {
  const selected = categoryFilter.value;
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `"${random.text}" — ${random.category}`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(random));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    postQuoteToServer(newQuote);
  }
}

// Export quotes to file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        quotes.push(...data);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON.");
      }
    } catch {
      alert("Import error.");
    }
  };
  reader.readAsText(file);
}

// Notification handler
function showSyncNotification(message) {
  syncStatus.innerText = message;
  setTimeout(() => (syncStatus.innerText = ""), 3000);
}

// ✅ REQUIRED FUNCTION: Async fetch from mock server
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "Synced"
  }));
}

// ✅ REQUIRED FUNCTION: Async post to mock server
async function postQuoteToServer(quote) {
  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: { "Content-Type": "application/json" }
  });
  showSyncNotification("Quote posted to server.");
}

// ✅ REQUIRED FUNCTION: Sync local + server quotes (server wins)
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const stored = JSON.parse(localStorage.getItem("quotes")) || [];
    const merged = [
      ...serverQuotes,
      ...stored.filter(
        local =>
          !serverQuotes.some(
            server => server.text === local.text && server.category === local.category
          )
      )
    ];
    quotes = merged;
    saveQuotes();
    populateCategories();
    filterQuotes();
    showSyncNotification("Synced with server.");
  } catch {
    showSyncNotification("Sync failed.");
  }
}

// Initialize app
newQuoteBtn.addEventListener("click", showRandomQuote);
populateCategories();
filterQuotes();
syncQuotes(); // initial fetch
setInterval(syncQuotes, 15000); // periodic sync
