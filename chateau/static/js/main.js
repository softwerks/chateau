import './components/password_meter.js';
import './components/password_toggle.js';

const navbarToggle = document.getElementById('navbar-toggle');
navbarToggle.addEventListener('click', (e) => {
    const navbarLinks = document.getElementById('navbar-links');
    if (navbarLinks.style.display === 'block')
        navbarLinks.style.display = 'none';
    else navbarLinks.style.display = 'block';
});
