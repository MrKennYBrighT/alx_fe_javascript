// Fallback quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Good code is its own best documentation.", category: "Tech" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");
const newQuoteBtn = document.getElementById("newQuote");

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate filter dropdown
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

// Filter quotes by selected category
function filterQuotes() {
  const category = categoryFilter.value;
  localStorage.setItem("lastSelectedCategory", category);
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available in this category.";
    return;
  }

  const quote = filtered[0];
  quoteDisplay.innerHTML = `"${quote.text}" — ${quote.category}`;
}

// Show random quote based on filter
function showRandomQuote() {
  const category = categoryFilter.value;
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const q = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `"${q.text}" — ${q.category}`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(q));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Export quotes as downloadable JSON
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from uploaded file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}

// Show sync message
function showSyncNotification(message) {
  syncStatus.textContent = message;
  setTimeout(() => (syncStatus.textContent = ""), 3000);
}

// Simulate server sync using JSONPlaceholder
function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(data => {
      // Convert JSONPlaceholder posts to our quote format
      const serverQuotes = data.slice(0, 5).map(post => ({
        text: post.title,
        category: "Synced"
      }));

      // Merge: server takes precedence
      const local = JSON.parse(localStorage.getItem("quotes")) || [];
      const merged = [
        ...serverQuotes,
        ...local.filter(
          lq => !serverQuotes.some(sq => sq.text === lq.text && sq.category === lq.category)
        )
      ];

      quotes = merged;
      saveQuotes();
      populateCategories();
      filterQuotes();
      showSyncNotification("Synced with server (JSONPlaceholder)");
    })
    .catch(() => showSyncNotification("Failed to sync with server"));
}

// Setup
newQuoteBtn.addEventListener("click", showRandomQuote);
populateCategories();
filterQuotes();
syncWithServer();
setInterval(syncWithServer, 15000); // Sync every 15 seconds
