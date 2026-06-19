// nav-active.js
document.addEventListener("DOMContentLoaded", () => {
    // Determine the current page file name (normalized without .html)
    let path = '';
    try {
        path = decodeURIComponent(window.location.pathname || window.location.href);
    } catch (e) {
        path = window.location.pathname || window.location.href;
    }

    // Clean up query string and hash
    if (path.includes('?')) {
        path = path.split('?')[0];
    }
    if (path.includes('#')) {
        path = path.split('#')[0];
    }

    let currentPage = path.split(/[/\\]/).pop();
    currentPage = currentPage ? currentPage.replace(/\.html$/i, '').toLowerCase() : 'index';
    if (currentPage === '') {
        currentPage = 'index';
    }

    // Find all links in dropdown menus
    const links = document.querySelectorAll('.dropdown-menu a');
    
    links.forEach(link => {
        // Get the filename the link points to
        const hrefData = link.getAttribute('href');
        if (!hrefData) return;
        
        // Handle parameters matching and base filenames (normalized without .html)
        let linkPath = '';
        try {
            linkPath = decodeURIComponent(hrefData.split('?')[0].split('#')[0]);
        } catch (e) {
            linkPath = hrefData.split('?')[0].split('#')[0];
        }
        let linkBase = linkPath.split('/').pop();
        linkBase = linkBase ? linkBase.replace(/\.html$/i, '').toLowerCase() : '';
        
        // Only highlight if it explicitly matches the current page
        if (linkBase === currentPage) {
            link.classList.add('active-nav-link');
            
            // Highlight the parent dropdown button as well
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                const dropbtn = dropdown.querySelector('.dropbtn');
                if (dropbtn) {
                    dropbtn.classList.add('active-parent-link');
                }
            }
        }
    });

    // Mobile Menu Generation
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.nav');

    // Clean up if re-running
    const existingToggle = document.querySelector('.mobile-menu-toggle');
    if (existingToggle) existingToggle.remove();

    if (header && nav) {
        // Create hamburger toggle
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '☰';
        mobileToggle.setAttribute('aria-label', 'Toggle Navigation');
        
        // Insert before nav
        header.insertBefore(mobileToggle, nav);
        
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
        });
    }

    // Mobile Dropdown toggles
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        if (dropbtn) {
            // Remove old toggles
            const oldToggle = dropdown.querySelector('.mobile-dropdown-toggle');
            if (oldToggle) oldToggle.remove();
            
            // Re-assign the click event handler
            // Note: because we can't easily remove anonymous listeners, it's safer to clone the node or just add it.
            // Since this runs once on DOM "ready", adding it is fine.
            dropbtn.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Stop navigation on mobile
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) d.classList.remove('dropdown-open');
                    });
                    
                    dropdown.classList.toggle('dropdown-open');
                }
            });
        }
    });
});

