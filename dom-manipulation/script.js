// ✅ 1. Define and load quotes from localStorage or fallback
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Start where you are. Use what you have. Do what you can.", category: "Motivation" },
  { text: "First, solve the problem. Then, write the code.", category: "Tech" }
];

// ✅ 2. DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");
const newQuoteBtn = document.getElementById("newQuote");

// ✅ 3. Save to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ 4. Populate category filter dropdown
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
  const savedFilter = localStorage.getItem("lastSelectedCategory");
  categoryFilter.value = savedFilter || previous || "all";
}

// ✅ 5. Apply category filter
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

// ✅ 6. Show random quote in selected category
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

// ✅ 7. Add a new quote from the form
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
    postQuoteToServer(newQuote); // Post immediately
  }
}

// ✅ 8. Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ 9. Import quotes from uploaded JSON
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
        alert("Invalid file.");
      }
    } catch {
      alert("Error parsing file.");
    }
  };
  reader.readAsText(file);
}

// ✅ 10. NEW: Fetch quotes from mock server
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => {
      // Convert to quote format
      return data.slice(0, 5).map(post => ({
        text: post.title,
        category: "Synced"
      }));
    });
}

// ✅ 11. NEW: Post a single quote to server (simulated)
function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then(res => res.json())
    .then(() => {
      showSyncNotification("Quote synced to server.");
    })
    .catch(() => {
      showSyncNotification("Failed to sync with server.");
    });
}

// ✅ 12. NEW: Sync local and server quotes
function syncQuotes() {
  fetchQuotesFromServer()
    .then(serverQuotes => {
      const stored = JSON.parse(localStorage.getItem("quotes")) || [];
      const merged = [
        ...serverQuotes,
        ...stored.filter(local => !serverQuotes.some(server => server.text === local.text))
      ];
      quotes = merged;
      saveQuotes();
      populateCategories();
      filterQuotes();
      showSyncNotification("Quotes synced from server.");
    })
    .catch(() => {
      showSyncNotification("Failed to sync with server.");
    });
}

// ✅ 13. NEW: Visual sync feedback
function showSyncNotification(message) {
  syncStatus.textContent = message;
  setTimeout(() => (syncStatus.textContent = ""), 3000);
}

// ✅ 14. Initialize
newQuoteBtn.addEventListener("click", showRandomQuote);
populateCategories();
filterQuotes();
syncQuotes();
setInterval(syncQuotes, 15000); // ⏲️ Sync every 15 seconds
