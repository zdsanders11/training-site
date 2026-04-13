const searchData = [
  // Walk In Freezer
  { name: "Fries", url: "pages/fries.html", category: "Walk In Freezer" },
  { name: "Chicken", url: "pages/chicken.html", category: "Walk In Freezer" },
  { name: "Sides", url: "pages/sides.html", category: "Walk In Freezer" },
  { name: "Custard Toppings", url: "pages/freezertoppings.html", category: "Walk In Freezer" },
  { name: "Hotline Other (Freezer)", url: "pages/freezerbread.html", category: "Walk In Freezer" },

  // Walk In Cooler
  { name: "Steakburgers", url: "pages/steakburgers.html", category: "Walk In Cooler" },
  { name: "Produce", url: "pages/produce.html", category: "Walk In Cooler" },
  { name: "Pickles", url: "pages/pickles.html", category: "Walk In Cooler" },
  { name: "Custard (Cooler)", url: "pages/custardstorage.html", category: "Walk In Cooler" },
  { name: "Toppings", url: "pages/toppings.html", category: "Walk In Cooler" },

  // Dry Storage
  { name: "Fry Cups", url: "pages/frycups.html", category: "Dry Storage" },
  { name: "Drink Cups & Lids", url: "pages/drinkcups.html", category: "Dry Storage" },
  { name: "Dishes & Lids", url: "pages/dishes.html", category: "Dry Storage" },
  { name: "Dish Storage", url: "pages/dishstorage.html", category: "Dry Storage" },
  { name: "Pepsi BIBs", url: "pages/pepsibibs.html", category: "Dry Storage" },
  { name: "Sauces", url: "pages/sauces.html", category: "Dry Storage" },
  { name: "Other Dry Storage", url: "pages/otherdry.html", category: "Dry Storage" },

  // Dish
  { name: "Spray Sink", url: "pages/spraysink.html", category: "Dish" },
  { name: "Dishwasher", url: "pages/dishwasher.html", category: "Dish" },
  { name: "Tri-Sinks", url: "pages/trisinks.html", category: "Dish" },
  { name: "Dish Drying", url: "pages/dishdrying.html", category: "Dish" },

  // Custard
  { name: "Custard Cooler", url: "pages/custardcooler.html", category: "Custard" },
  { name: "Custard Toppings (Make)", url: "pages/custardmake.html", category: "Custard" },
  { name: "4-Slot & Custard Machine", url: "pages/custardmachine.html", category: "Custard" },

  // Grill
  { name: "Grill 0", url: "pages/grill0.html", category: "Grill" },
  { name: "Grill 1", url: "pages/grill1.html", category: "Grill" },
  { name: "Grill 2", url: "pages/grill2.html", category: "Grill" },
  { name: "Grill 2 Cooler", url: "pages/grill2cooler.html", category: "Grill" },

  // Make
  { name: "Bun", url: "pages/bun.html", category: "Make" },
  { name: "Make", url: "pages/make.html", category: "Make" },
  { name: "Bagging", url: "pages/bagging.html", category: "Make" },

  // Fry
  { name: "Prep Sink", url: "pages/prepsink.html", category: "Fry" },
  { name: "Fry Freezer", url: "pages/fryfreezer.html", category: "Fry" },
  { name: "Chicken Cooler", url: "pages/chickencooler.html", category: "Fry" },
  { name: "Fryer", url: "pages/fryer.html", category: "Fry" },
  { name: "Fry Warmer", url: "pages/frywarmer.html", category: "Fry" },

  // Drive Thru
  { name: "DT Pepsi Machine", url: "pages/dtwindow1.html", category: "Drive Thru" },
  { name: "DT First Window", url: "pages/dtwindow2.html", category: "Drive Thru" },
  { name: "DT Second Window", url: "pages/dthandout.html", category: "Drive Thru" },

  // Front of House
  { name: "Register", url: "pages/register.html", category: "Front of House" },
  { name: "Expo", url: "expo.html", category: "Front of House" },
  { name: "Pepsi Machine (Lobby)", url: "pages/pepsi.html", category: "Front of House" },
  { name: "Lobby", url: "lobby.html", category: "Front of House" },

  // Main Map
  { name: "Home / Main Map", url: "index.html", category: "General" }
];

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (!searchInput || !searchResults) return;

  // Determine prefix path for URLs since the script runs on multiple nested levels
  // If we are currently in /pages/, we need to go up one directory
  const pathPrefix = window.location.pathname.includes('/pages/') || window.location.pathname.includes('\\pages\\') ? '../' : '';

  searchInput.addEventListener("input", function() {
    const query = this.value.toLowerCase().trim();
    
    // Clear results if query is empty
    if (query.length === 0) {
      searchResults.style.visibility = "hidden";
      searchResults.style.opacity = "0";
      searchResults.style.transform = "translateY(-8px)";
      searchResults.innerHTML = "";
      return;
    }

    // Filter data
    const matches = searchData.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    );

    // Limit to top 8 matches to avoid massive dropdowns
    const topMatches = matches.slice(0, 8);

    // Render HTML
    if (topMatches.length > 0) {
      searchResults.innerHTML = topMatches.map(item => `
        <a href="${pathPrefix}${item.url}">
          <span class="search-title">${item.name}</span>
          <span class="search-category">${item.category}</span>
        </a>
      `).join("");
    } else {
      searchResults.innerHTML = `<div class="no-results">No matches found...</div>`;
    }

    // Show dropdown
    searchResults.style.visibility = "visible";
    searchResults.style.opacity = "1";
    searchResults.style.transform = "translateY(0)";
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.visibility = "hidden";
      searchResults.style.opacity = "0";
      searchResults.style.transform = "translateY(-8px)";
    }
  });

  // Hotkey focus: pressing '/' focuses the search box
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });
});
