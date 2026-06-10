function renderHeader(basePath) {
  document.write(`
    <header class="site-header">
      <a class="logo" href="${basePath}index.html">
        <img src="${basePath}images/logo1.png" alt="Home">
      </a>

      <nav class="nav">
        <div class="search-container">
          <input type="text" id="searchInput" class="search-input" placeholder="Search" autocomplete="off">
          <div id="searchResults" class="search-results"></div>
        </div>
        
        <a href="${basePath}index.html" aria-current="page">Home</a>

        <div class="dropdown">
          <a href="${basePath}index.html?z=4.69&x=0.223&y=0.417" class="dropbtn">Walk In Freezer</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/fries.html">Fries</a>
            <a href="${basePath}pages/chicken.html">Chicken</a>
            <a href="${basePath}pages/sides.html">Sides</a>
            <a href="${basePath}pages/freezertoppings.html">Freezer Toppings</a>
            <a href="${basePath}pages/freezerbread.html">Hotline Other</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="${basePath}index.html?z=5.0&x=.2&y=0.535" class="dropbtn">Walk In Cooler</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/steakburgers.html">Steakburgers</a>
            <a href="${basePath}pages/produce.html">Produce</a>
            <a href="${basePath}pages/pickles.html">Pickles</a>
            <a href="${basePath}pages/custardstorage.html">Custard</a>
            <a href="${basePath}pages/toppings.html">Toppings</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="${basePath}index.html?z=3.77&x=0.291&y=0.436" class="dropbtn">Dry Storage</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/frycups.html">Fry Cups</a>
            <a href="${basePath}pages/drinkcups.html">Drink Cups</a>
            <a href="${basePath}pages/dishes.html">Dishes & Lids</a>
            <a href="${basePath}pages/dishstorage.html">Dish Storage</a>
            <!-- <a href="${basePath}pages/pepsibibs.html">Pepsi BIBs</a> -->
            <a href="${basePath}pages/sauces.html">Sauces</a>
            <a href="${basePath}pages/otherdry.html">Other Dry</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="${basePath}index.html?z=5.63&x=0.366&y=0.557" class="dropbtn">Dish</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/spraysink.html">Spray Sink</a>
            <a href="${basePath}pages/dishwasher.html">Dishwasher</a>
            <a href="${basePath}pages/trisinks.html">Tri-Sinks</a>
            <a href="${basePath}pages/dishdrying.html">Dish Drying</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="${basePath}index.html?z=7.00&x=0.473&y=0.563" class="dropbtn">Custard</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/custardcooler.html">Custard Cooler</a>
            <a href="${basePath}pages/custardmake.html">Custard Toppings</a>
            <a href="${basePath}pages/custardmachine.html">4-Slot & Custard Machine</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="${basePath}index.html?z=7.00&x=0.323&y=0.709" class="dropbtn">Grill</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/grill0.html">Grill 0</a>
            <a href="${basePath}pages/grill1.html">Grill 1</a>
            <a href="${basePath}pages/grill2.html">Grill 2</a>
            <a href="${basePath}pages/grill2cooler.html">Grill 2 Cooler</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="${basePath}index.html?z=7.00&x=0.418&y=0.717" class="dropbtn">Make</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/bun.html">Bun</a>
            <a href="${basePath}pages/make.html">Make</a>
            <a href="${basePath}pages/bagging.html">Bagging</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="${basePath}index.html?z=7.00&x=0.415&y=0.653" class="dropbtn">Fry</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/prepsink.html">Prep Sink</a>
            <a href="${basePath}pages/fryfreezer.html">Fry Freezer</a>
            <a href="${basePath}pages/chickencooler.html">Chicken Cooler</a>
            <a href="${basePath}pages/fryer.html">Fryer</a>
            <a href="${basePath}pages/frywarmer.html">Fry Warmer</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="${basePath}index.html?z=7.00&x=0.189&y=0.693" class="dropbtn">Drive Thru</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/dtwindow1.html">DT Pepsi</a>
            <a href="${basePath}pages/dtwindow2.html">DT First window</a>
            <a href="${basePath}pages/dthandout.html">DT Second Window</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="${basePath}index.html?z=2.11&x=0.600&y=0.553" class="dropbtn">Front of House</a>
          <div class="dropdown-menu">
            <a href="${basePath}pages/register.html">Register</a>
            <a href="${basePath}expo.html">Expo</a>
            <a href="${basePath}pages/pepsi.html">Pepsi</a>
            <!-- <a href="${basePath}lobby.html">Lobby</a> -->
          </div>
        </div>

      </nav>
    </header>
  `);

  // Dynamic Page Title Injection
  const path = window.location.pathname;
  let pageName = path.substring(path.lastIndexOf('/') + 1);
  
  // Don't add titles to the root index/map pages, only the sub-pages
  if (pageName && pageName !== 'index.html' && pageName !== 'map.html' && pageName !== '' && pageName.endsWith('.html')) {
    const rawName = pageName.replace('.html', '');
    
    const titleMap = {
      'freezertoppings': 'FREEZER TOPPINGS',
      'freezerbread': 'HOTLINE OTHER',
      'custardstorage': 'CUSTARD STORAGE',
      'frycups': 'FRY CUPS',
      'drinkcups': 'DRINK CUPS',
      'dishstorage': 'DISH STORAGE',
      'pepsibibs': 'PEPSI BIBS',
      'otherdry': 'OTHER DRY STORAGE',
      'spraysink': 'SPRAY SINK',
      'trisinks': 'TRI-SINKS',
      'dishdrying': 'DISH DRYING',
      'custardcooler': 'CUSTARD COOLER',
      'custardmake': 'CUSTARD TOPPINGS',
      'custardmachine': '4-SLOT & CUSTARD MACHINE',
      'grill0': 'GRILL 0',
      'grill1': 'GRILL 1',
      'grill2': 'GRILL 2',
      'grill2cooler': 'GRILL 2 COOLER',
      'prepsink': 'PREP SINK',
      'fryfreezer': 'FRY FREEZER',
      'chickencooler': 'CHICKEN COOLER',
      'frywarmer': 'FRY WARMER',
      'dtwindow1': 'DT PEPSI MACHINE',
      'dtwindow2': 'DT FIRST WINDOW',
      'dthandout': 'DT SECOND WINDOW',
      'dishwasher': 'DISHWASHER',
      'steakburgers': 'STEAKBURGERS',
      'fries': 'FRIES',
      'chicken': 'CHICKEN',
      'sides': 'SIDES',
      'produce': 'PRODUCE',
      'pickles': 'PICKLES',
      'toppings': 'TOPPINGS',
      'dishes': 'DISHES & LIDS',
      'sauces': 'SAUCES',
      'bun': 'BUN',
      'make': 'MAKE',
      'bagging': 'BAGGING',
      'fryer': 'FRYER',
      'register': 'REGISTER',
      'expo': 'EXPO',
      'pepsi': 'PEPSI',
      'lobby': 'LOBBY'
    };

    let displayTitle = titleMap[rawName];
    if (!displayTitle) {
      displayTitle = rawName.toUpperCase();
    }
    
    // Update browser tab
    document.title = displayTitle + " - Clickable Training Map";
    
    // Inject visible heading on the page
    document.write(`<h1 class="page-title">${displayTitle}</h1>`);
  }
}
